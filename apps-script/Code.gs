/**
 * Pelai Collective — Social Styles report store and mailer.
 *
 * 1. Save: receives each finished report from the assessment site and saves it
 *    to Google Drive in a folder named for the day (IST), e.g. 2026-09-25.
 *    One folder per day, created by that day's first report; every report of
 *    that day goes inside it as HH-mm-ss_Name_Style.pdf.
 * 2. Email: on the participant's request, emails a report this script has just
 *    saved to one address they choose, from ping@pelaicollective.com, at most
 *    MAX_EMAILS_PER_REPORT times.
 *
 * Deploy as a Web app from the admin@pelaicollective.com account:
 *   Execute as: Me    Who has access: Anyone
 * The files are then owned by the admin account. See README.md for setup.
 */

var ROOT_FOLDER_ID = '16mN8-eyhyVqLxNZy3OpXky1R2ueGYKNW';
var TIMEZONE = 'Asia/Kolkata';
var SAVE_TOKEN = 'pelai-social-styles-v1'; // must match saveToken in config.js
var MAX_PDF_BYTES = 5 * 1024 * 1024;
var STYLES = ['Driver', 'Expressive', 'Amiable', 'Analytical'];

var SENDER = 'ping@pelaicollective.com'; // must be a "Send mail as" address of the deploying account
var SENDER_NAME = 'Pelai Collective';
var EMAIL_SUBJECT = 'Your Pelai Collective Social Styles report';
var MAX_EMAILS_PER_REPORT = 3;
var EMAIL_WINDOW_SECONDS = 6 * 60 * 60; // a report can be emailed for 6 hours after it is saved
var EMAIL_PATTERN = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply_({ ok: false, error: 'Empty request' });
    if (e.postData.contents.length > MAX_PDF_BYTES * 1.4) return reply_({ ok: false, error: 'Report too large' });

    var data = JSON.parse(e.postData.contents);
    if (data.token !== SAVE_TOKEN) return reply_({ ok: false, error: 'Not allowed' });
    return reply_(data.action === 'email' ? emailReport_(data) : saveReport_(data));
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'Server error' });
  }
}

/** Visiting the Web app URL in a browser shows that it is running. */
function doGet() {
  return reply_({ ok: true, service: 'Pelai Social Styles report store' });
}

/* ---------------- Save ---------------- */

function saveReport_(data) {
  if (STYLES.indexOf(data.style) === -1) return { ok: false, error: 'Unknown style' };

  var bytes = Utilities.base64Decode(String(data.pdf || ''));
  if (bytes.length === 0 || bytes.length > MAX_PDF_BYTES) return { ok: false, error: 'Invalid report size' };
  // Every PDF starts with "%PDF"
  if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
    return { ok: false, error: 'Not a PDF' };
  }

  var now = new Date();
  var day = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd');
  var time = Utilities.formatDate(now, TIMEZONE, 'HH-mm-ss');
  var baseName = time + '_' + cleanName_(data.name) + '_' + data.style;

  // The lock stops two reports arriving at the same moment on a new day from
  // each creating their own folder for that day.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var file;
  try {
    var folder = dayFolder_(day);
    file = folder.createFile(Utilities.newBlob(bytes, 'application/pdf', uniqueName_(folder, baseName)));
  } finally {
    lock.releaseLock();
  }

  var facts = {
    name: String(data.name || '').slice(0, 80),
    style: data.style,
    subStyle: String(data.subStyle || '').slice(0, 40),
    assertiveness: Number(data.assertiveness),
    responsiveness: Number(data.responsiveness)
  };
  file.setDescription(
    'Name: ' + facts.name + '\n' +
    'Style: ' + facts.style + ' (' + facts.subStyle + ')\n' +
    'Assertiveness: ' + facts.assertiveness.toFixed(3) + '\n' +
    'Responsiveness: ' + facts.responsiveness.toFixed(3) + '\n' +
    'Saved: ' + Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss') + ' IST'
  );

  // Remember this report for the email option: a one-time key, the facts the
  // email summary needs, and how many times it has been emailed.
  facts.key = Utilities.getUuid();
  facts.sends = 0;
  CacheService.getScriptCache().put('report:' + file.getId(), JSON.stringify(facts), EMAIL_WINDOW_SECONDS);
  return { ok: true, reportId: file.getId(), key: facts.key, emailsLeft: MAX_EMAILS_PER_REPORT };
}

function dayFolder_(day) {
  var root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var existing = root.getFoldersByName(day);
  return existing.hasNext() ? existing.next() : root.createFolder(day);
}

function uniqueName_(folder, baseName) {
  var fileName = baseName + '.pdf';
  for (var n = 2; folder.getFilesByName(fileName).hasNext(); n++) {
    fileName = baseName + '_' + n + '.pdf';
  }
  return fileName;
}

function cleanName_(name) {
  var clean = String(name || '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
  return clean || 'Participant';
}

/* ---------------- Email ---------------- */

function emailReport_(data) {
  var to = String(data.email || '').trim();
  if (to.length > 254 || !EMAIL_PATTERN.test(to)) return { ok: false, error: 'invalid_email' };

  var cache = CacheService.getScriptCache();
  var cacheKey = 'report:' + String(data.reportId || '');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var facts;
  try {
    var stored = cache.get(cacheKey);
    if (!stored) return { ok: false, error: 'expired' };
    facts = JSON.parse(stored);
    if (facts.key !== data.key) return { ok: false, error: 'Not allowed' };
    if (facts.sends >= MAX_EMAILS_PER_REPORT) return { ok: false, error: 'limit', emailsLeft: 0 };
    facts.sends++;
    cache.put(cacheKey, JSON.stringify(facts), EMAIL_WINDOW_SECONDS);
  } finally {
    lock.releaseLock();
  }

  if (GmailApp.getAliases().indexOf(SENDER) === -1) {
    console.error(SENDER + ' is not a "Send mail as" address of this account');
    return { ok: false, error: 'sender_not_configured' };
  }
  if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: 'quota' };

  var file = DriveApp.getFileById(String(data.reportId));
  var mail = emailContent_(facts);
  GmailApp.sendEmail(to, EMAIL_SUBJECT, mail.text, {
    from: SENDER,
    name: SENDER_NAME,
    replyTo: SENDER,
    htmlBody: mail.html,
    attachments: [file.getBlob().setName('Pelai_Social_Style_' + cleanName_(facts.name) + '.pdf')]
  });
  return { ok: true, emailsLeft: MAX_EMAILS_PER_REPORT - facts.sends };
}

/* Short summaries for the email, drawn from the questionnaire's own descriptions. */
var STYLE_SUMMARY = {
  Driver: {
    temperament: 'Sensor',
    axes: 'high assertiveness and low responsiveness',
    summary: 'Drivers are task orientated and expect efficiency. They set clearly defined goals, are committed and determined, take risks and push things through. They are decisive in action and decision making, like control and dislike inaction.',
    need: 'To be in control',
    growth: 'Listen',
    strength: 'Good administrative skills'
  },
  Expressive: {
    temperament: 'Intuitive',
    axes: 'high assertiveness and high responsiveness',
    summary: 'Expressives are people orientated, positive, enthusiastic and talkative. They act and decide spontaneously, like involvement, work quickly and excitedly with others, and tend to get others caught up in their dreams.',
    need: 'Recognition',
    growth: 'Check',
    strength: 'Good persuasive skills'
  },
  Amiable: {
    temperament: 'Feeling',
    axes: 'low assertiveness and high responsiveness',
    summary: 'Amiables are loyal, personable and patient. They enjoy the company of others, are more listeners than talkers, like close, personal relationships and dislike interpersonal conflict. They support and actively listen to others.',
    need: 'Security',
    growth: 'Initiate',
    strength: 'Good counseling and listening skills'
  },
  Analytical: {
    temperament: 'Thinking',
    axes: 'low assertiveness and low responsiveness',
    summary: 'Analyticals are serious and persistent, with close attention to detail and facts. They like organization and structure, ask specific questions, and look at every angle before deciding. Once they have made a decision, they stick with it.',
    need: 'To be correct',
    growth: 'Decide',
    strength: 'Good problem-solving skills'
  }
};

function emailContent_(f) {
  var s = STYLE_SUMMARY[f.style];
  var first = String(f.name || '').trim().split(/\s+/)[0] || 'there';
  var a = f.assertiveness.toFixed(3), r = f.responsiveness.toFixed(3);
  var aLevel = f.assertiveness > 2.5 ? 'high, “telling”' : 'low, “asking”';
  var rLevel = f.responsiveness > 2.5 ? 'high, “emotional”' : 'low, “controlled”';
  var subLine = f.subStyle ? ' Within that style, your sub-style is ' + f.subStyle + '.' : '';

  var text =
    'Hello ' + first + ',\n\n' +
    'Thank you for completing the Pelai Collective Social Styles self-assessment. Your full report is attached as a PDF.\n\n' +
    'YOUR PROFILE: ' + f.style.toUpperCase() + ' (' + s.temperament + ')\n' +
    'Your answers show ' + s.axes + '.' + subLine + '\n\n' +
    'Assertiveness: ' + a + ' (' + aLevel + ')\n' +
    'Responsiveness: ' + r + ' (' + rLevel + ')\n\n' +
    s.summary + '\n\n' +
    'Basic need: ' + s.need + '\n' +
    'Key strength: ' + s.strength + '\n' +
    'For growth, ' + f.style + 's need to: ' + s.growth + '\n\n' +
    'The attached report shows where you sit on the Social Styles chart, describes the ' + f.style +
    ' style in detail, and explains how to work well with the other three styles.\n\n' +
    'Warm regards,\nPelai Collective\n';

  var esc = function (v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var row = function (k, v) {
    return '<tr><td style="padding:4px 16px 4px 0;color:#4A6070;">' + k + '</td><td style="padding:4px 0;color:#120700;font-weight:bold;">' + v + '</td></tr>';
  };
  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#120700;max-width:560px;">' +
    '<div style="background:#062030;background:linear-gradient(135deg,#120700 0%,#120700 45%,#062030 100%);padding:20px 24px;border-radius:10px 10px 0 0;">' +
    '<div style="color:#C8A060;letter-spacing:4px;font-size:13px;font-weight:bold;">PELAI COLLECTIVE</div>' +
    '<div style="color:#F0F8FC;font-size:22px;margin-top:6px;">Your Social Styles report</div></div>' +
    '<div style="border:1px solid #C8DCE5;border-top:0;padding:24px;border-radius:0 0 10px 10px;">' +
    '<p style="margin:0 0 14px;">Hello ' + esc(first) + ',</p>' +
    '<p style="margin:0 0 18px;">Thank you for completing the Pelai Collective Social Styles self-assessment. Your full report is attached as a PDF.</p>' +
    '<div style="border-left:4px solid #C8A060;padding:4px 0 4px 14px;margin:0 0 18px;">' +
    '<div style="font-size:12px;letter-spacing:2px;color:#1A8090;">YOUR PROFILE</div>' +
    '<div style="font-size:26px;">' + esc(f.style) + ' <span style="font-size:16px;color:#8A6224;font-style:italic;">(' + s.temperament + ')</span></div>' +
    '<div style="color:#4A6070;">Your answers show ' + s.axes + '.' + esc(subLine) + '</div></div>' +
    '<table style="border-collapse:collapse;margin:0 0 18px;">' +
    row('Assertiveness', a + ' <span style="font-weight:normal;color:#4A6070;">(' + aLevel + ')</span>') +
    row('Responsiveness', r + ' <span style="font-weight:normal;color:#4A6070;">(' + rLevel + ')</span>') +
    '</table>' +
    '<p style="margin:0 0 18px;">' + s.summary + '</p>' +
    '<table style="border-collapse:collapse;margin:0 0 18px;">' +
    row('Basic need', s.need) + row('Key strength', s.strength) + row('For growth, needs to', s.growth) +
    '</table>' +
    '<p style="margin:0 0 18px;">The attached report shows where you sit on the Social Styles chart, describes the ' + esc(f.style) +
    ' style in detail, and explains how to work well with the other three styles.</p>' +
    '<p style="margin:0;">Warm regards,<br>Pelai Collective</p></div></div>';

  return { text: text, html: html };
}

/* ---------------- Helpers ---------------- */

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant access and check the folder and sender. */
function testSetup() {
  var root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  console.log('Saving reports into: ' + root.getName() + ' (owner: ' + root.getOwner().getEmail() + ')');
  var aliases = GmailApp.getAliases();
  console.log(aliases.indexOf(SENDER) === -1
    ? 'NOT READY: ' + SENDER + ' is not a "Send mail as" address of this account. Aliases found: ' + (aliases.join(', ') || 'none')
    : 'Emails will be sent from ' + SENDER);
  console.log('Emails left today: ' + MailApp.getRemainingDailyQuota());
}

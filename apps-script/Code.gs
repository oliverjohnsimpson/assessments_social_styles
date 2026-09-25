/**
 * Pelai Collective — Social Styles report store.
 *
 * Receives each finished report from the assessment site and saves it to
 * Google Drive under a folder named for the day (IST), e.g. 2026-09-25.
 * A day's folder is created by the first report of that day, so days with
 * no assessments have no folder.
 *
 * Deploy as a Web app from the admin@pelaicollective.com account:
 *   Execute as: Me    Who has access: Anyone
 * The files are then owned by the admin account.
 */

var ROOT_FOLDER_ID = '16mN8-eyhyVqLxNZy3OpXky1R2ueGYKNW';
var TIMEZONE = 'Asia/Kolkata';
var SAVE_TOKEN = 'pelai-social-styles-v1'; // must match saveToken in config.js
var MAX_PDF_BYTES = 5 * 1024 * 1024;
var STYLES = ['Driver', 'Expressive', 'Amiable', 'Analytical'];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply_({ ok: false, error: 'Empty request' });
    if (e.postData.contents.length > MAX_PDF_BYTES * 1.4) return reply_({ ok: false, error: 'Report too large' });

    var data = JSON.parse(e.postData.contents);
    if (data.token !== SAVE_TOKEN) return reply_({ ok: false, error: 'Not allowed' });
    if (STYLES.indexOf(data.style) === -1) return reply_({ ok: false, error: 'Unknown style' });

    var bytes = Utilities.base64Decode(String(data.pdf || ''));
    if (bytes.length === 0 || bytes.length > MAX_PDF_BYTES) return reply_({ ok: false, error: 'Invalid report size' });
    // Every PDF starts with "%PDF"
    if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
      return reply_({ ok: false, error: 'Not a PDF' });
    }

    var now = new Date();
    var day = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd');
    var time = Utilities.formatDate(now, TIMEZONE, 'HH-mm-ss');
    var name = cleanName_(data.name);
    var baseName = time + '_' + name + '_' + data.style;

    // The lock stops two reports arriving at the same moment from each
    // creating their own folder for the same day.
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    var file;
    try {
      var folder = dayFolder_(day);
      var fileName = uniqueName_(folder, baseName);
      file = folder.createFile(Utilities.newBlob(bytes, 'application/pdf', fileName));
    } finally {
      lock.releaseLock();
    }

    file.setDescription(
      'Name: ' + String(data.name || '').slice(0, 80) + '\n' +
      'Style: ' + data.style + ' (' + String(data.subStyle || '').slice(0, 40) + ')\n' +
      'Assertiveness: ' + String(data.assertiveness || '').slice(0, 8) + '\n' +
      'Responsiveness: ' + String(data.responsiveness || '').slice(0, 8) + '\n' +
      'Saved: ' + Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss') + ' IST'
    );
    return reply_({ ok: true });
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'Server error' });
  }
}

/** Visiting the Web app URL in a browser shows that it is running. */
function doGet() {
  return reply_({ ok: true, service: 'Pelai Social Styles report store' });
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

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant Drive access and check the folder. */
function testSetup() {
  var root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  console.log('Saving reports into: ' + root.getName() + ' (owner: ' + root.getOwner().getEmail() + ')');
}

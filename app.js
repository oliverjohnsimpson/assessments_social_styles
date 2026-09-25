/* Pelai Collective — Social Styles Self-Assessment
 * Scoring follows docs/social-styles-questionnaire.pdf:
 *   Assertiveness: left word = 1 … right word = 4, total / 15
 *   Responsiveness: left word = 4 … right word = 1, total / 15
 * Chart: Assertiveness on x (1 Asking → 4 Telling), Responsiveness on y
 * (1 Controlled at top → 4 Emotional at bottom), quadrants split at 2.5,
 * sub-quadrants split at 1.75 and 3.25.
 */
(function () {
  "use strict";

  var C = window.SS_CONTENT;
  var N = 15;
  var MID = 2.5;
  var state = { name: "", a: null, r: null, result: null };

  var $ = function (id) { return document.getElementById(id); };

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Build the rating items ---------- */

  // section: "a" or "r"; scale: numbers in left-to-right order, as printed
  function buildItems(section, pairs, scale) {
    var host = $("items-" + section);
    var order = shuffle(pairs.map(function (p, i) { return i; }));
    host.innerHTML = order.map(function (idx, pos) {
      var p = pairs[idx];
      var name = section + "-" + idx;
      var radios = scale.map(function (n) {
        return '<label class="choice"><input type="radio" id="' + name + "-" + n + '" name="' + name +
          '" value="' + n + '" aria-label="' + n + '"><span>' + n + "</span></label>";
      }).join("");
      return '<fieldset class="item" data-name="' + name + '">' +
        "<legend>Item " + (pos + 1) + " of " + N + ": " + esc(p[0]) + " to " + esc(p[1]) + "</legend>" +
        '<span class="word word-left">' + esc(p[0]) + "</span>" +
        '<span class="choices">' + radios + "</span>" +
        '<span class="word word-right">' + esc(p[1]) + "</span>" +
        "</fieldset>";
    }).join("");

    host.addEventListener("change", function (e) {
      var fs = e.target.closest(".item");
      if (fs) { fs.classList.add("is-answered"); fs.classList.remove("is-missing"); }
      updateCount(section);
      var err = $("error-" + section);
      if (!err.hidden && missing(section).length === 0) err.hidden = true;
    });
    updateCount(section);
  }

  function missing(section) {
    return Array.prototype.filter.call(
      document.querySelectorAll("#items-" + section + " .item"),
      function (fs) { return !fs.querySelector("input:checked"); }
    );
  }

  function updateCount(section) {
    var done = N - missing(section).length;
    $("count-" + section).textContent = done + " of " + N + " answered";
  }

  function total(section) {
    var sum = 0;
    document.querySelectorAll("#items-" + section + " input:checked").forEach(function (i) {
      sum += Number(i.value);
    });
    return sum;
  }

  function validate(section) {
    var miss = missing(section);
    document.querySelectorAll("#items-" + section + " .item").forEach(function (fs) {
      fs.classList.toggle("is-missing", miss.indexOf(fs) !== -1);
    });
    var err = $("error-" + section);
    if (miss.length) {
      err.textContent = "Answer the " + (miss.length === 1 ? "remaining item" : miss.length + " remaining items") +
        " (outlined in red) to continue.";
      err.hidden = false;
      miss[0].scrollIntoView({ behavior: "smooth", block: "center" });
      miss[0].querySelector("input").focus({ preventScroll: true });
      return false;
    }
    err.hidden = true;
    return true;
  }

  /* ---------- Steps ---------- */

  function showStep(n) {
    for (var i = 0; i < 4; i++) $("step-" + i).hidden = i !== n;
    document.querySelectorAll("#steps li").forEach(function (li) {
      var s = Number(li.dataset.step);
      li.classList.toggle("is-current", s === n);
      li.classList.toggle("is-done", s < n);
      if (s === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    $("steps").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Classification ---------- */

  function styleOf(highA, highR) {
    if (highA) return highR ? "Expressive" : "Driver";
    return highR ? "Amiable" : "Analytical";
  }

  function classify(a, r) {
    var highA = a > MID, highR = r > MID;
    var main = styleOf(highA, highR);
    // Each quadrant is split again around its own centre (1.75 or 3.25)
    var ca = highA ? 3.25 : 1.75, cr = highR ? 3.25 : 1.75;
    var sub = styleOf(a > ca, r > cr);
    return { main: main, sub: sub, subName: C.styles[sub].adjective + " " + main };
  }

  function subStyleSentence(res) {
    if (res.sub === res.main) {
      return "You sit in the outer corner of the " + res.main + " quadrant, the most pronounced form of the " + res.main + " style.";
    }
    return "Within the " + res.main + " quadrant you sit in the section that leans toward the " + res.sub +
      " style: " + res.main + " behaviour with some " + res.sub + " tendencies.";
  }

  /* ---------- Chart ---------- */

  var LIGHT = {
    bg: "#FFFFFF", text: "#120700", muted: "#4A6070", line: "#9DB5C0", faint: "#C8DCE5",
    fill: "rgba(26,128,144,0.05)", hi: "rgba(200,160,96,0.22)", label: "#FFFFFF",
    point: "#C8A060", pointStroke: "#120700", gold: "#8A6224"
  };

  function screenColors() {
    var cs = getComputedStyle(document.documentElement);
    var v = function (n) { return cs.getPropertyValue(n).trim(); };
    var dark = cs.colorScheme === "dark" || v("color-scheme") === "dark";
    return {
      bg: v("--surface"), text: v("--text"), muted: v("--muted"),
      line: dark ? "#3E7486" : "#9DB5C0", faint: v("--line"),
      fill: dark ? "rgba(42,160,178,0.06)" : "rgba(26,128,144,0.05)",
      hi: dark ? "rgba(200,160,96,0.20)" : "rgba(200,160,96,0.22)",
      label: v("--surface"), point: "#C8A060", pointStroke: dark ? "#E8F4F8" : "#120700",
      gold: v("--gold-ink")
    };
  }

  function drawChart(canvas, a, r, col, px) {
    var S = 600;
    canvas.width = px; canvas.height = px;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(px / S, 0, 0, px / S, 0, 0);
    var P0 = 105, P1 = 495, W = P1 - P0;
    var X = function (v) { return P0 + (v - 1) / 3 * W; };
    var Y = function (v) { return P0 + (v - 1) / 3 * W; };
    var body = "Karla, 'Segoe UI', system-ui, sans-serif";
    var disp = "Marcellus, Palatino, Georgia, serif";

    ctx.fillStyle = col.bg; ctx.fillRect(0, 0, S, S);

    // Quadrant fills, the respondent's quadrant highlighted
    var res = classify(a, r);
    [["Analytical", 1, 1], ["Driver", MID, 1], ["Amiable", 1, MID], ["Expressive", MID, MID]].forEach(function (q) {
      ctx.fillStyle = q[0] === res.main ? col.hi : col.fill;
      ctx.fillRect(X(q[1]), Y(q[2]), W / 2, W / 2);
    });

    // Sub-quadrant lines at 1.75 and 3.25
    ctx.strokeStyle = col.faint; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    [1.75, 3.25].forEach(function (v) {
      ctx.beginPath(); ctx.moveTo(X(v), P0); ctx.lineTo(X(v), P1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(P0, Y(v)); ctx.lineTo(P1, Y(v)); ctx.stroke();
    });
    // Outer dashed frame, as on the printed chart
    ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]);
    ctx.strokeRect(P0, P0, W, W);
    ctx.setLineDash([]);

    // Main axes at 2.5
    ctx.strokeStyle = col.text; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(P0, Y(MID)); ctx.lineTo(P1, Y(MID)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(MID), P0); ctx.lineTo(X(MID), P1); ctx.stroke();

    // Tick labels
    ctx.font = "500 12px " + body; ctx.fillStyle = col.muted; ctx.textBaseline = "middle";
    [1, 1.75, 3.25, 4].forEach(function (v) {
      ctx.textAlign = "center";
      ctx.beginPath(); ctx.moveTo(X(v), Y(MID) - 5); ctx.lineTo(X(v), Y(MID) + 5); ctx.strokeStyle = col.text; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillText(String(v), X(v) + (v === 1 ? 10 : v === 4 ? -10 : 0), Y(MID) + 15);
      ctx.beginPath(); ctx.moveTo(X(MID) - 5, Y(v)); ctx.lineTo(X(MID) + 5, Y(v)); ctx.stroke();
      ctx.textAlign = "left";
      ctx.fillText(String(v), X(MID) + 9, Y(v) + (v === 1 ? 10 : v === 4 ? -10 : 0));
    });
    ctx.textAlign = "left"; ctx.fillText("2.5", X(MID) + 9, Y(MID) + 15);

    // Quadrant names
    [["ANALYTICAL", "(Thinking)", 1.75, 1.45], ["DRIVER", "(Sensor)", 3.25, 1.45],
     ["AMIABLE", "(Feeling)", 1.75, 3.55], ["EXPRESSIVE", "(Intuitive)", 3.25, 3.55]].forEach(function (q) {
      ctx.textAlign = "center";
      ctx.font = "16px " + disp; ctx.fillStyle = col.text;
      ctx.fillText(q[0], X(q[2]), Y(q[3]) - 9);
      ctx.font = "italic 12px " + body; ctx.fillStyle = col.muted;
      ctx.fillText(q[1], X(q[2]), Y(q[3]) + 10);
    });

    // Axis end labels
    ctx.fillStyle = col.text; ctx.textAlign = "center";
    ctx.font = "700 14px " + body; ctx.fillText("Low Responsive", S / 2, 44);
    ctx.font = "13px " + body; ctx.fillStyle = col.muted; ctx.fillText("“Controlled”", S / 2, 64);
    ctx.fillStyle = col.text; ctx.font = "700 14px " + body; ctx.fillText("High Responsive", S / 2, 536);
    ctx.font = "13px " + body; ctx.fillStyle = col.muted; ctx.fillText("“Emotional”", S / 2, 556);
    function side(x, rot, a1, a2) {
      ctx.save(); ctx.translate(x, S / 2); ctx.rotate(rot);
      ctx.fillStyle = col.text; ctx.font = "700 14px " + body; ctx.fillText(a1, 0, -10);
      ctx.fillStyle = col.muted; ctx.font = "13px " + body; ctx.fillText(a2, 0, 10);
      ctx.restore();
    }
    side(62, -Math.PI / 2, "Low Assertive", "“Asking”");
    side(538, Math.PI / 2, "High Assertive", "“Telling”");

    // The respondent's point
    var px0 = X(a), py0 = Y(r);
    ctx.strokeStyle = col.gold; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(px0, Y(MID)); ctx.lineTo(px0, py0); ctx.lineTo(X(MID), py0); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(px0, py0, 10, 0, Math.PI * 2);
    ctx.fillStyle = col.point; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = col.pointStroke; ctx.stroke();

    var tag = a.toFixed(3) + ", " + r.toFixed(3);
    ctx.font = "700 13px " + body;
    var tw = ctx.measureText(tag).width + 16;
    var tx = px0 + 16, ty = py0 - 30;
    if (tx + tw > P1) tx = px0 - 16 - tw;
    if (ty < P0 + 4) ty = py0 + 16;
    ctx.fillStyle = col.label; ctx.strokeStyle = col.gold; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.rect(tx, ty, tw, 24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col.text; ctx.textAlign = "left"; ctx.fillText(tag, tx + 8, ty + 12);
  }

  function redrawScreenChart() {
    var cv = $("chart");
    if (!cv || !state.result) return;
    var px = Math.round(Math.min(560, cv.getBoundingClientRect().width || 560) * (window.devicePixelRatio || 1));
    drawChart(cv, state.a, state.r, screenColors(), Math.max(px, 600));
  }

  /* ---------- Result content (shared by screen and PDF) ---------- */

  function scoreCards(cls) {
    return '<div class="score ' + cls + '"><span class="score-label">Assertiveness</span>' +
      '<span class="score-value">' + state.a.toFixed(3) + "</span>" +
      '<span class="score-detail">Total ' + state.totalA + " / 15 &middot; " + (state.a > MID ? "High, “Telling”" : "Low, “Asking”") + "</span></div>" +
      '<div class="score ' + cls + '"><span class="score-label">Responsiveness</span>' +
      '<span class="score-value">' + state.r.toFixed(3) + "</span>" +
      '<span class="score-detail">Total ' + state.totalR + " / 15 &middot; " + (state.r > MID ? "High, “Emotional”" : "Low, “Controlled”") + "</span></div>";
  }

  function aboutBlock(s) {
    return '<div class="block"><h3>About the ' + s.key + " style</h3>" +
      s.description.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
  }

  function summaryBlock(s) {
    return '<div class="block"><h3>Summary</h3><dl class="kv">' +
      "<dt>Characteristics</dt><dd>" + esc(s.characteristics) + "</dd>" +
      "<dt>In conflict</dt><dd>" + esc(s.inConflict) + "</dd>" +
      "<dt>Solutions</dt><dd>" + esc(s.solutions) + "</dd>" +
      "<dt>Basic need</dt><dd>" + esc(s.basicNeed) + "</dd></dl></div>";
  }

  function traitsBlock(s) {
    return '<div class="block"><h3>' + s.key + " at a glance</h3>" +
      '<p class="muted note">' + esc(s.axes) + ". " + esc(s.specialist) + "</p>" +
      '<ul class="traits">' + s.traits.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
  }

  function styleSummaryBlock(s) {
    var rows = C.summaryRows.map(function (row) {
      return "<dt>" + esc(row[1]) + "</dt><dd>" + esc(s.summary[row[0]]) + "</dd>";
    }).join("");
    return '<div class="block"><h3>Style summary</h3><dl class="kv">' + rows + "</dl>" +
      '<p class="note"><strong>Backup style: ' + esc(s.summary.backupStyle) + ".</strong> " + esc(C.glossary.backup) + " " + esc(s.backupExplained) + "</p></div>";
  }

  function interactionBlock(s) {
    var rows = C.interactions.filter(function (x) { return x.a === s.key || x.b === s.key; }).map(function (x) {
      var other = x.a === s.key ? x.b : x.a;
      return "<tr><td>" + s.key + " v " + other + "</td><td>" + (x.shared || "None") + "</td><td>" + x.conflict + "</td><td>" + (x.agreement || "None") + "</td></tr>";
    }).join("");
    return '<div class="block"><h3>Working with the other styles</h3>' +
      '<p class="note">' + esc(C.styleFlexing) + "</p>" +
      '<div class="table-wrap"><table><thead><tr><th>Styles</th><th>Shared dimension</th><th>Source of conflict</th><th>Area of agreement</th></tr></thead><tbody>' +
      rows + "</tbody></table></div>" +
      '<p class="note"><strong>Pace.</strong> ' + esc(C.glossary.pace) + "</p>" +
      '<p class="note"><strong>Priorities.</strong> ' + esc(C.glossary.priorities) + "</p></div>";
  }

  function dimensionsBlock() {
    var d = C.dimensions;
    return '<div class="block"><h3>The two scales</h3><dl class="kv">' +
      "<dt>" + d.assertiveness.name + " (" + d.assertiveness.alias + ")</dt><dd>" + esc(d.assertiveness.text) + "</dd>" +
      "<dt>" + d.responsiveness.name + " (" + d.responsiveness.alias + ")</dt><dd>" + esc(d.responsiveness.text) + "</dd></dl></div>";
  }

  function renderResult() {
    var res = state.result, s = C.styles[res.main];
    $("result").innerHTML =
      '<div class="result">' +
      '<div class="result-hero"><p class="eyebrow eyebrow-dark">' + esc(state.name) + ", your social style is</p>" +
      '<h2 class="result-style">' + s.key + "</h2>" +
      '<p class="result-temper">' + s.temperament + " &middot; " + esc(s.temperamentText) + "</p>" +
      '<p class="result-sub">Sub-style: <strong>' + res.subName + "</strong>. " + esc(subStyleSentence(res)) + "</p></div>" +
      '<div class="scores">' + scoreCards("") + "</div>" +
      '<div class="chart-wrap"><canvas id="chart" width="600" height="600" role="img" aria-label="Social Styles chart with your position: assertiveness ' +
      state.a.toFixed(3) + ", responsiveness " + state.r.toFixed(3) + ", in the " + s.key + ' quadrant"></canvas></div>' +
      aboutBlock(s) + summaryBlock(s) + traitsBlock(s) + styleSummaryBlock(s) + interactionBlock(s) + dimensionsBlock() +
      "</div>";
    redrawScreenChart();
  }

  /* ---------- PDF report ---------- */

  function fmtDate(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + ", " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  function isoDate(d) {
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function buildReport(when) {
    var res = state.result, s = C.styles[res.main];
    var cv = document.createElement("canvas");
    drawChart(cv, state.a, state.r, LIGHT, 1000);
    var chartImg = cv.toDataURL("image/png");
    var band = function (title) {
      return '<div class="rpt-band"><div class="brand"><span class="brand-mark">PELAI</span><span class="brand-sub">COLLECTIVE</span></div>' +
        "<h1>" + title + '</h1><p class="rpt-meta">' + esc(state.name) + " &middot; " + fmtDate(when) + "</p></div>";
    };
    var foot = function (n) {
      return '<div class="rpt-foot"><span>Pelai Collective &middot; Social Styles Self-Assessment</span><span>Page ' + n + " of 3</span></div>";
    };
    var p1 = '<div class="rpt">' + band("Social Styles Report") +
      '<div class="rpt-body">' +
      '<div class="rpt-style"><p class="eyebrow eyebrow-dark">Your social style</p><h2 class="result-style">' + s.key + "</h2>" +
      '<p class="result-temper">' + s.temperament + " &middot; " + esc(s.temperamentText) + "</p>" +
      '<p class="muted">Sub-style: <strong>' + res.subName + "</strong>. " + esc(subStyleSentence(res)) + "</p></div>" +
      '<div class="rpt-result">' + scoreCards("rpt-card") + "</div>" +
      '<div class="rpt-chart"><img src="' + chartImg + '" alt=""></div>' +
      "</div>" + foot(1) + "</div>";
    var p2 = '<div class="rpt">' + band("The " + s.key + " style") +
      '<div class="rpt-body">' + aboutBlock(s) + summaryBlock(s) + traitsBlock(s) + "</div>" + foot(2) + "</div>";
    var p3 = '<div class="rpt">' + band("Working with your style") +
      '<div class="rpt-body">' + styleSummaryBlock(s) + interactionBlock(s) + dimensionsBlock() + "</div>" + foot(3) + "</div>";
    var stage = $("report-stage");
    stage.innerHTML = p1 + p2 + p3;
    return Array.prototype.slice.call(stage.querySelectorAll(".rpt"));
  }

  async function downloadPdf() {
    var btn = $("download-pdf"), status = $("pdf-status");
    if (!window.html2canvas || !window.jspdf) {
      status.textContent = "The PDF tools did not load. Check your internet connection and refresh the page.";
      return;
    }
    btn.disabled = true;
    status.textContent = "Preparing your report…";
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      var when = new Date();
      var pages = buildReport(when);
      var pdf = new window.jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
      for (var i = 0; i < pages.length; i++) {
        // Each page becomes a flat image, so the PDF has no selectable text
        var canvas = await window.html2canvas(pages[i], { scale: 2, backgroundColor: "#FFFFFF", logging: false });
        var img = canvas.toDataURL("image/jpeg", 0.9);
        var w = 210, h = canvas.height * w / canvas.width;
        if (h > 297) { h = 297; w = canvas.width * h / canvas.height; }
        if (i > 0) pdf.addPage();
        pdf.addImage(img, "JPEG", (210 - w) / 2, 0, w, h);
      }
      pdf.setProperties({
        title: "Social Styles Report – " + state.name,
        subject: "Pelai Collective Social Styles Self-Assessment",
        creator: "Pelai Collective"
      });
      var safe = state.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "") || "Participant";
      pdf.save("Pelai_Social_Style_" + safe + "_" + isoDate(when) + ".pdf");
      status.textContent = "Report downloaded.";
    } catch (err) {
      console.error(err);
      status.textContent = "The report could not be created. Try again, or use a different browser.";
    } finally {
      $("report-stage").innerHTML = "";
      btn.disabled = false;
    }
  }

  /* ---------- Wire up ---------- */

  function init() {
    buildItems("a", C.assertiveness, [1, 2, 3, 4]);
    buildItems("r", C.responsiveness, [4, 3, 2, 1]);

    $("intro-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("participant-name").value.trim();
      $("name-error").hidden = !!name;
      if (!name) { $("participant-name").focus(); return; }
      state.name = name;
      showStep(1);
    });

    $("form-a").addEventListener("submit", function (e) {
      e.preventDefault();
      if (validate("a")) showStep(2);
    });

    $("back-to-a").addEventListener("click", function () { showStep(1); });

    $("form-r").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate("r")) return;
      if (missing("a").length) { showStep(1); validate("a"); return; }
      state.totalA = total("a");
      state.totalR = total("r");
      state.a = state.totalA / N;
      state.r = state.totalR / N;
      state.result = classify(state.a, state.r);
      showStep(3);
      renderResult();
    });

    $("download-pdf").addEventListener("click", downloadPdf);
    $("restart").addEventListener("click", function () { window.location.reload(); });

    var redraw = function () { redrawScreenChart(); };
    window.addEventListener("resize", redraw);
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", redraw);
    }
    new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

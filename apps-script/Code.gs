var SPREADSHEET_ID = "1IqKKZb8E7VR0x9rs0lzZ7yjm7P9ftJ7r1LbdrpOaOsE";
var RESULTS_SHEET_NAME = "Sonuclar";
var PASS_SCORE = 70;
var SENDER_EMAIL = "metin@metintiryaki.com";
var SENDER_NAME = "Newfound Creative Academy";

function doGet(e) {
  try {
    var action = getParam(e, "action", "");
    var callback = getParam(e, "callback", "");

    if (action === "history") {
      var email = normalizeEmail(getParam(e, "email", ""));
      var data = getHistoryByEmail(email);
      return jsonOut({ status: "ok", data: data }, callback);
    }

    if (action === "submit") {
      var raw = getParam(e, "data", "");
      if (!raw) {
        return jsonOut({ status: "error", message: "Veri bulunamadi" }, callback);
      }
      var payload = JSON.parse(raw);
      var result = processSubmission(payload);
      return jsonOut(result, callback);
    }

    return jsonOut({ status: "ok", message: "API calisiyor" }, callback);
  } catch (err) {
    return jsonOut({ status: "error", message: String(err) }, getParam(e, "callback", ""));
  }
}

function doPost(e) {
  try {
    var raw = "";
    if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    } else if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }

    if (!raw) {
      return jsonOut({ status: "error", message: "Veri bulunamadi" }, "");
    }

    var payload = JSON.parse(raw);
    return jsonOut(processSubmission(payload), "");
  } catch (err) {
    return jsonOut({ status: "error", message: String(err) }, "");
  }
}

function testManual() {
  var payload = {
    name: "Test Kullanici",
    email: "metin@metintiryaki.com",
    score: 75,
    correct: 15,
    wrong: 3,
    empty: 2,
    time: "5 dakika 30 saniye"
  };
  var result = processSubmission(payload);
  Logger.log(JSON.stringify(result));
}

function processSubmission(data) {
  var submissionId = String(data.submissionId || "").trim();
  var name = String(data.name || "Bilinmiyor").trim();
  var email = normalizeEmail(String(data.email || ""));
  var score = Number(data.score || 0);
  var correct = Number(data.correct || 0);
  var wrong = Number(data.wrong || 0);
  var empty = Number(data.empty || 0);
  var time = String(data.time || "-");
  var passed = score >= PASS_SCORE;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(RESULTS_SHEET_NAME) || ss.getSheets()[0];

  // Ayni sinav gonderimi tekrar edilirse (ag timeout vb.) ikinci kaydi engelle.
  if (submissionId) {
    var existing = findSubmissionRow(sheet, submissionId);
    if (existing > 0) {
      var emailState = getEmailStateFromRow(sheet, existing);
      return {
        status: "ok",
        score: score,
        passed: passed,
        duplicate: true,
        emailSent: emailState
      };
    }
  }

  var emailSent = null;
  var emailError = "";
  if (email) {
    try {
      var mailResult = sendResultEmail(name, email, score, correct, wrong, empty, time, passed);
      emailSent = !!mailResult.sent;
      if (mailResult.fallback) {
        emailError = "Alias gonderimi basarisiz, varsayilan hesap ile gonderildi: " + (mailResult.aliasError || "");
      }
    } catch (err) {
      emailSent = false;
      emailError = String(err);
      Logger.log("MAIL HATA: " + emailError);
    }
  }

  sheet.appendRow([
    new Date(),
    name,
    email,
    score,
    correct,
    wrong,
    empty,
    time,
    passed ? "Gecti" : "Kaldi",
    submissionId,
    emailSent === true ? "OK" : (emailSent === false ? "ERR: " + emailError : "")
  ]);

  return {
    status: "ok",
    score: score,
    passed: passed,
    duplicate: false,
    emailSent: emailSent,
    emailError: emailError
  };
}

function sendResultEmail(name, email, score, correct, wrong, empty, time, passed) {
  var subject = "Yapay Zekâ Sınav Sonucunuz - " + (passed ? "BAŞARILI" : "BAŞARISIZ");
  var statusText = passed ? "Geçti" : "Kaldı";
  var resultNote = passed
    ? "Tebrikler! Sınavı başarıyla tamamladınız."
    : "Maalesef sınavı geçemediniz. Konuları tekrar gözden geçirmenizi öneririz.";

  var body =
    "Sayın " + name + ",\n\n" +
    "Yapay Zekâ Eğitimi sınav sonucunuz aşağıdadır:\n\n" +
    "Puan: " + score + " / 100\n" +
    "Doğru: " + correct + "\n" +
    "Yanlış: " + wrong + "\n" +
    "Boş: " + empty + "\n" +
    "Süre: " + time + "\n" +
    "Durum: " + statusText + "\n\n" +
    resultNote + "\n\n" +
    "Eğitmen: Metin Tiryaki\n" +
    "NEWFOUND CREATIVE ACADEMY\n";

  var logoUrl = "https://sinav.metintiryaki.com/assets/newfoundlogo-1024x264.jpg";
  var htmlBody =
    '<div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;color:#1f2937">' +
      '<div style="margin-bottom:16px">' +
        '<img src="' + logoUrl + '" alt="Newfound Creative Academy" style="max-width:260px;height:auto;display:block" />' +
      '</div>' +
      "<p>Sayın " + escapeHtml(name) + ",</p>" +
      "<p>Yapay Zekâ Eğitimi sınav sonucunuz aşağıdadır:</p>" +
      '<table style="border-collapse:collapse;font-size:15px;margin:8px 0 14px 0">' +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Puan:</strong></td><td>" + score + " / 100</td></tr>" +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Doğru:</strong></td><td>" + correct + "</td></tr>" +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Yanlış:</strong></td><td>" + wrong + "</td></tr>" +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Boş:</strong></td><td>" + empty + "</td></tr>" +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Süre:</strong></td><td>" + escapeHtml(time) + "</td></tr>" +
        "<tr><td style='padding:2px 10px 2px 0'><strong>Durum:</strong></td><td>" + statusText + "</td></tr>" +
      "</table>" +
      "<p>" + resultNote + "</p>" +
      "<p style='margin-top:18px'>Eğitmen: Metin Tiryaki<br/>NEWFOUND CREATIVE ACADEMY</p>" +
    "</div>";

  try {
    GmailApp.sendEmail(email, subject, body, {
      name: SENDER_NAME,
      from: SENDER_EMAIL,
      replyTo: SENDER_EMAIL,
      htmlBody: htmlBody
    });
    return { sent: true, fallback: false };
  } catch (err) {
    // Alias gonderimi basarisizsa teslimati kaybetmemek icin varsayilan hesapla gonder.
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: body,
        name: SENDER_NAME,
        replyTo: SENDER_EMAIL,
        htmlBody: htmlBody
      });
      return { sent: true, fallback: true, aliasError: String(err) };
    } catch (fallbackErr) {
      throw new Error(
        "Mail gonderimi basarisiz. Alias hata: " +
        String(err) +
        " | Fallback hata: " +
        String(fallbackErr)
      );
    }
  }
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function findSubmissionRow(sheet, submissionId) {
  try {
    var cell = sheet.getRange("J:J")
      .createTextFinder(submissionId)
      .matchEntireCell(true)
      .findNext();
    return cell ? cell.getRow() : 0;
  } catch (err) {
    Logger.log("findSubmissionRow hatasi: " + String(err));
    return 0;
  }
}

function getEmailStateFromRow(sheet, row) {
  try {
    var val = String(sheet.getRange(row, 11).getValue() || "").trim();
    if (!val) return null;
    if (val === "OK") return true;
    if (val.indexOf("ERR:") === 0) return false;
  } catch (err) {
    Logger.log("getEmailStateFromRow hatasi: " + String(err));
  }
  return null;
}

function getHistoryByEmail(email) {
  if (!email) {
    return { attemptCount: 0, lastScore: 0, bestScore: 0 };
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(RESULTS_SHEET_NAME) || ss.getSheets()[0];
  var rows = sheet.getDataRange().getValues();
  var scores = [];

  for (var i = 0; i < rows.length; i++) {
    var rowEmail = normalizeEmail(String(rows[i][2] || ""));
    if (rowEmail === email) {
      scores.push(Number(rows[i][3] || 0));
    }
  }

  if (!scores.length) {
    return { attemptCount: 0, lastScore: 0, bestScore: 0 };
  }

  return {
    attemptCount: scores.length,
    lastScore: scores[scores.length - 1],
    bestScore: Math.max.apply(null, scores)
  };
}

function jsonOut(obj, callback) {
  var text = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + text + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeEmail(email) {
  return String(email || "").toLowerCase().trim();
}

function getParam(e, key, fallbackValue) {
  if (e && e.parameter && e.parameter[key] !== undefined) {
    return e.parameter[key];
  }
  return fallbackValue;
}

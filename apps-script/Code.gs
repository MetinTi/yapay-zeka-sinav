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
  var subject = "Yapay Zeka Sınav Sonucunuz - " + (passed ? "BAŞARILI" : "BAŞARISIZ");
  var statusText = passed ? "Geçti" : "Kaldı";
  var resultNote = passed
    ? "Tebrikler! Sınavı başarıyla tamamladınız."
    : "Maalesef sınavı geçemediniz. Konuları tekrar gözden geçirmenizi öneririz.";

  var body =
    "Sayın " + name + ",\n\n" +
    "Yapay Zeka Eğitimi sınav sonucunuz aşağıdadır:\n\n" +
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
  var statusBg = passed ? "#E8F8EF" : "#FDEDEC";
  var statusColor = passed ? "#1E8449" : "#C0392B";
  var statusBorder = passed ? "#A9DFBF" : "#F5B7B1";
  var scoreColor = passed ? "#1E8449" : "#C0392B";
  var htmlBody =
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f6fa;padding:24px 0">' +
      '<tr><td align="center">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:640px;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Segoe UI,Arial,sans-serif;color:#1f2937">' +
          '<tr><td style="padding:20px 24px 8px 24px">' +
            '<img src="' + logoUrl + '" alt="Newfound Creative Academy" style="max-width:260px;height:auto;display:block" />' +
          "</td></tr>" +
          '<tr><td style="padding:0 24px 8px 24px;font-size:18px;font-weight:700;color:#0f3f5f">Yapay Zeka Sınav Sonucu</td></tr>' +
          '<tr><td style="padding:0 24px 16px 24px;font-size:15px">Sayın ' + escapeHtml(name) + ',</td></tr>' +
          '<tr><td style="padding:0 24px 16px 24px;font-size:15px">Yapay Zeka Eğitimi sınav sonucunuz aşağıdadır:</td></tr>' +
          '<tr><td style="padding:0 24px 16px 24px">' +
            '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb;border-radius:10px;background:#fbfdff">' +
              '<tr><td style="padding:14px 16px">' +
                '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:15px">' +
                  '<tr><td style="padding:4px 0"><strong>Puan:</strong></td><td align="right" style="padding:4px 0;color:' + scoreColor + ';font-weight:700">' + score + ' / 100</td></tr>' +
                  '<tr><td style="padding:4px 0"><strong>Doğru:</strong></td><td align="right" style="padding:4px 0">' + correct + '</td></tr>' +
                  '<tr><td style="padding:4px 0"><strong>Yanlış:</strong></td><td align="right" style="padding:4px 0">' + wrong + '</td></tr>' +
                  '<tr><td style="padding:4px 0"><strong>Boş:</strong></td><td align="right" style="padding:4px 0">' + empty + '</td></tr>' +
                  '<tr><td style="padding:4px 0"><strong>Süre:</strong></td><td align="right" style="padding:4px 0">' + escapeHtml(time) + '</td></tr>' +
                "</table>" +
              "</td></tr>" +
            "</table>" +
          "</td></tr>" +
          '<tr><td style="padding:0 24px 8px 24px">' +
            '<span style="display:inline-block;padding:8px 12px;border-radius:999px;background:' + statusBg + ';color:' + statusColor + ';border:1px solid ' + statusBorder + ';font-size:13px;font-weight:700">Durum: ' + statusText + "</span>" +
          "</td></tr>" +
          '<tr><td style="padding:0 24px 20px 24px;font-size:15px">' + resultNote + "</td></tr>" +
          '<tr><td style="padding:16px 24px 24px 24px;border-top:1px solid #e5e7eb;color:#4b5563;font-size:14px">' +
            "Eğitmen: Metin Tiryaki<br/>NEWFOUND CREATIVE ACADEMY" +
          "</td></tr>" +
        "</table>" +
      "</td></tr>" +
    "</table>";

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

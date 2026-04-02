var SPREADSHEET_ID = "1IqKKZb8E7VR0x9rs0lzZ7yjm7P9ftJ7r1LbdrpOaOsE";
var RESULTS_SHEET_NAME = "Sonuclar";
var PASS_SCORE = 70;

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
  sheet.appendRow([
    new Date(),
    name,
    email,
    score,
    correct,
    wrong,
    empty,
    time,
    passed ? "Gecti" : "Kaldi"
  ]);

  if (email) {
    sendResultEmail(name, email, score, correct, wrong, empty, time, passed);
  }

  return { status: "ok", score: score, passed: passed };
}

function sendResultEmail(name, email, score, correct, wrong, empty, time, passed) {
  var subject = "Yapay Zeka Sinav Sonucunuz - " + (passed ? "BASARILI" : "BASARISIZ");
  var body =
    "Sayin " + name + ",\n\n" +
    "Yapay Zeka Egitimi sinav sonucunuz asagidadir:\n\n" +
    "Puan: " + score + " / 100\n" +
    "Dogru: " + correct + "\n" +
    "Yanlis: " + wrong + "\n" +
    "Bos: " + empty + "\n" +
    "Sure: " + time + "\n" +
    "Durum: " + (passed ? "Gecti" : "Kaldi") + "\n\n" +
    (passed
      ? "Tebrikler! Sinavi basariyla tamamladiniz.\n\n"
      : "Maalesef sinavi gecemediniz. Konulari tekrar gozden gecirmenizi oneririz.\n\n") +
    "Egitmen: Metin Tiryaki\n" +
    "www.metintiryaki.com\n" +
    "NEWFOUND CREATIVE ACADEMY\n";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "Newfound Creative Academy"
  });
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

// Institution assessments for the existing Özak Apps Script project.
// Configure this private instructor spreadsheet ID locally; never commit the real ID.
// This project must not replace or be added to the existing generic exam project.
var OZAK_SPREADSHEET_ID = 'YOUR_PRIVATE_INSTRUCTOR_SPREADSHEET_ID';
var OZAK_VERSION = 'ozak-ai-awareness-202612-v2';
var BLANCHARD_VERSION = 'blanchard-ai-awareness-202612-v1';
// Keep this order aligned with the approved 10-item Özak question bank.
var BLANCHARD_ANSWER_KEY = [1, 3, 0, 2, 1, 0, 3, 2, 0, 1];
var BLANCHARD_CLASS_LIMIT = 120;
var BLANCHARD_ATTEMPTS_LIMIT = 10;
var BLANCHARD_ACCESS_ERROR = 'Blanchard sınıf bağlantısı geçersiz veya süresi dolmuş.';
var ASSESSMENT_TENANTS = {
  ozak: {
    title: 'Özak Global Holding',
    trainingTitle: 'Aralık 2026 Yapay Zekâ Farkındalık Eğitimi',
    versions: ['ozak-ai-awareness-202612-v1', OZAK_VERSION],
    groups: ['1','2','3'],
    participantsSheet: 'Özak katılımcılar',
    attemptsSheet: 'Özak sınav kayıtları'
  },
  blanchard: {
    title: 'Blanchard Türkiye',
    trainingTitle: 'Aralık 2026 Yapay Zeka Temelleri ve Uygulamaları',
    versions: [BLANCHARD_VERSION],
    groups: ['1'],
    participantsSheet: 'Blanchard katılımcılar',
    attemptsSheet: 'Blanchard sınav kayıtları'
  }
};

function doGet(e) {
  var callback = getParam(e, 'callback', '');
  if (callback && !/^v2_[A-Za-z0-9_]+$/.test(callback)) return jsonOut({status:'error',saved:false,message:'Geçersiz istek.'}, '');
  try {
    var action = getParam(e, 'action', '');
    if (!action || action === 'health') {
      if (getParam(e, 'organization', '') === 'blanchard') {
        return jsonOut({status:'ok',service:'blanchard-exam',version:BLANCHARD_VERSION}, callback);
      }
      return jsonOut({status:'ok',service:'ozak-exam',version:OZAK_VERSION}, callback);
    }
    if (action !== 'register-v2' && action !== 'result-v2') throw new Error('Bu değerlendirmede işlem desteklenmiyor.');
    var raw = getParam(e, 'data', '');
    if (typeof raw !== 'string' || !raw || raw.length > 3000) throw new Error('Geçersiz veri.');
    var data;
    try { data = JSON.parse(raw); } catch (err) { throw new Error('Geçersiz veri.'); }
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Geçersiz veri.');
    if (getParam(e, 'organization', '') === 'blanchard' || data.version === BLANCHARD_VERSION ||
        (data.context && data.context.organization === 'blanchard')) throw new Error(BLANCHARD_ACCESS_ERROR);
    return ozakResponse(data, action, callback);
  } catch (err) {
    return jsonOut({status:'error',saved:false,message:String(err.message || 'Kayıt yapılamadı.').slice(0,160)}, callback);
  }
}

function doPost(e) {
  try {
    var post = e && e.postData;
    if (!post || typeof post.type !== 'string' || !/^text\/plain(?:\s*;.*)?$/i.test(post.type) ||
        typeof post.contents !== 'string' || post.contents.length > 3000) throw blanchardError(BLANCHARD_ACCESS_ERROR);
    var request;
    try { request = JSON.parse(post.contents); } catch (err) { throw blanchardError(BLANCHARD_ACCESS_ERROR); }
    if (!request || Object.keys(request).sort().join(',') !== 'action,data' ||
        (request.action !== 'register-v2' && request.action !== 'result-v2') ||
        !request.data || typeof request.data.name !== 'string' ||
        !request.data.context || request.data.context.organization !== 'blanchard' ||
        !blanchardHasAccess(request.data)) throw blanchardError(BLANCHARD_ACCESS_ERROR);
    return ozakResponse(request.data, request.action, '');
  } catch (err) {
    return jsonOut({status:'error',saved:false,message:(err && err.blanchardMessage) || 'Kayıt yapılamadı. Tekrar dene veya eğitmenine haber ver.'}, '');
  }
}

function blanchardError(message) {
  var error = new Error(message);
  error.blanchardMessage = message;
  return error;
}

function sha256Hex(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function(byte){return ('0'+(byte & 255).toString(16)).slice(-2);}).join('');
}

function blanchardHasAccess(data) {
  var secretFormat = /^[a-f0-9]{64}$/;
  if (typeof data.invite !== 'string' || !secretFormat.test(data.invite) ||
      typeof data.deviceSecret !== 'string' || !secretFormat.test(data.deviceSecret) ||
      typeof data.code !== 'string' || !/^AI-[A-F0-9]{20}$/.test(data.code)) return false;
  var properties = PropertiesService.getScriptProperties().getProperties();
  var expected = properties.BLANCHARD_CLASS_SHA256;
  var expiresAt = properties.BLANCHARD_CLASS_EXPIRES_AT;
  if (!secretFormat.test(expected || '') || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(expiresAt || '')) return false;
  var expiry = Date.parse(expiresAt);
  var canonical = expiresAt.length === 20 ? expiresAt.slice(0,-1)+'.000Z' : expiresAt;
  if (!isFinite(expiry) || new Date(expiry).toISOString() !== canonical || expiry <= Date.now()) return false;
  var actual = sha256Hex(data.invite), difference = 0;
  for (var index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ actual.charCodeAt(index);
  return difference === 0 && data.code === 'AI-'+sha256Hex(data.deviceSecret).slice(0,20).toUpperCase();
}

function getParam(e, name, fallback) {
  return e && e.parameter && e.parameter[name] !== undefined ? e.parameter[name] : fallback;
}
function jsonOut(value, callback) {
  var json = JSON.stringify(value);
  return ContentService.createTextOutput(callback ? callback+'('+json+');' : json)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function v2Result(data) {
  var r = {id:String(data.id || data.submissionId || ''),phase:data.phase,score:Number(data.score),correct:Number(data.correct),wrong:Number(data.wrong),empty:Number(data.empty),elapsed:Number(data.elapsed)};
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(r.id) || !/^(pre|post)$/.test(r.phase)) throw new Error('Geçersiz sınav kaydı.');
  if (![r.score,r.correct,r.wrong,r.empty,r.elapsed].every(function(n){return Number.isInteger(n)&&n>=0;}) || r.correct+r.wrong+r.empty!==10 || r.score!==r.correct*10 || r.elapsed>600) throw new Error('Geçersiz sınav sonucu.');
  return r;
}
function v2Cell(value) { return /^[=+@-]/.test(value) ? "'"+value : value; }
function v2Find(sheet, column, value) {
  if (sheet.getLastRow()<2) return 0;
  var hit=sheet.getRange(2,column,sheet.getLastRow()-1,1).createTextFinder(value).matchEntireCell(true).useRegularExpression(false).findNext();
  return hit ? hit.getRow() : 0;
}
function v2Sheet(ss, name, headers) {
  var sheet=ss.getSheetByName(name);
  if (sheet) return sheet;
  sheet=ss.insertSheet(name);
  sheet.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#173e51').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1,headers.length,150);
  sheet.setColumnWidth(2,230);
  sheet.getRange(1,1,sheet.getMaxRows(),headers.length).createFilter();
  return sheet;
}
function ozakPerson(data) {
  var context = data.context;
  var organization = context && context.organization;
  var tenant = typeof organization === 'string' && Object.prototype.hasOwnProperty.call(ASSESSMENT_TENANTS, organization)
    ? ASSESSMENT_TENANTS[organization] : null;
  if (!tenant || !context || Array.isArray(context) || typeof context !== 'object' ||
      Object.keys(context).sort().join(',') !== 'group,organization,training' ||
      context.training !== '2026-12' || tenant.groups.indexOf(context.group) === -1 ||
      tenant.versions.indexOf(data.version) === -1) {
    throw new Error(organization === 'blanchard' ? 'Blanchard eğitim veya grup bağlantısını kontrol et.' : 'Özak eğitim veya grup bağlantısını kontrol et.');
  }
  var name = String(data.name || '').replace(/\s+/g,' ').trim();
  var code = String(data.code || '').trim().toUpperCase();
  if (name.length < 2 || name.length > 80 || /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/.test(name) || !/^[A-Z0-9-]{4,24}$/.test(code)) {
    throw new Error('Adını ve katılımcı kodunu kontrol et.');
  }
  return {name:name, code:code, group:context.group, version:data.version, tenant:tenant,
    key:[organization,context.training,context.group,data.version,code].join(':')};
}

function ozakResult(data) {
  if (!['score','correct','wrong','empty','elapsed'].every(function(key){return typeof data[key] === 'number';}) ||
      (data.timedOut !== undefined && typeof data.timedOut !== 'boolean')) throw new Error('Geçersiz sınav sonucu.');
  var result = v2Result(data);
  result.clientCompletedAt = '';
  if (data.clientCompletedAt !== undefined) {
    if (typeof data.clientCompletedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.clientCompletedAt) ||
        !isFinite(Date.parse(data.clientCompletedAt)) || new Date(data.clientCompletedAt).toISOString() !== data.clientCompletedAt) {
      throw new Error('Geçersiz cihaz tamamlanma zamanı.');
    }
    result.clientCompletedAt = data.clientCompletedAt;
  }
  return result;
}

function blanchardResult(data) {
  var answers = data.answers;
  if (!Array.isArray(answers) || answers.length !== BLANCHARD_ANSWER_KEY.length ||
      !answers.every(function(answer){return answer === null || Number.isInteger(answer) && answer >= 0 && answer <= 3;}) ||
      typeof data.id !== 'string' || (data.phase !== 'pre' && data.phase !== 'post') ||
      typeof data.timedOut !== 'boolean') throw blanchardError('Geçersiz sınav sonucu.');
  var correct = 0, empty = 0;
  answers.forEach(function(answer, index){
    if (answer === null) empty++;
    else if (answer === BLANCHARD_ANSWER_KEY[index]) correct++;
  });
  return ozakResult({
    id:data.id, phase:data.phase, elapsed:data.elapsed, timedOut:data.timedOut, clientCompletedAt:data.clientCompletedAt,
    score:correct*10, correct:correct, wrong:answers.length-correct-empty, empty:empty
  });
}

function blanchardEnrollmentCount(people, person) {
  if (people.getLastRow() < 2) return 0;
  // The secure code format distinguishes current registrations from historical records.
  var prefix = person.key.slice(0,-person.code.length);
  return people.getRange(2,1,people.getLastRow()-1,1).getValues().filter(function(row){
    return typeof row[0] === 'string' && row[0].indexOf(prefix) === 0 && /^AI-[A-F0-9]{20}$/.test(row[0].slice(prefix.length));
  }).length;
}

function blanchardAttemptCount(attempts, key) {
  if (attempts.getLastRow() < 2) return 0;
  return attempts.getRange(2,1,attempts.getLastRow()-1,1).createTextFinder(key)
    .matchEntireCell(true).useRegularExpression(false).findAll().length;
}

function assessmentSaved(result, duplicate, blanchard, callback) {
  var response = {status:'ok',saved:true};
  if (duplicate) response.duplicate = true;
  if (blanchard && result) {
    response.score = result.score;
    response.correct = result.correct;
    response.wrong = result.wrong;
    response.empty = result.empty;
  }
  return jsonOut(response, callback);
}

function ozakResponse(data, action, callback) {
  if (action !== 'register-v2' && action !== 'result-v2') throw new Error('Bu değerlendirmede işlem desteklenmiyor.');
  var person = ozakPerson(data);
  var blanchard = person.tenant === ASSESSMENT_TENANTS.blanchard;
  var result = action !== 'result-v2' ? null : (blanchard ? blanchardResult(data) : ozakResult(data));
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) throw new Error('Kayıt meşgul; yeniden dene.');
  try {
    var ss = SpreadsheetApp.openById(OZAK_SPREADSHEET_ID);
    var people = blanchard && result ? ss.getSheetByName(person.tenant.participantsSheet) :
      v2Sheet(ss, person.tenant.participantsSheet, ['Kapsam anahtarı','Kurum','Eğitim','Grup','Soru seti sürümü','Katılımcı kodu','Ad soyad','Kayıt zamanı','Ön test puanı','Son test puanı','Fark','Ön test sunucu zamanı','Son test sunucu zamanı','Ön test cihaz zamanı','Son test cihaz zamanı','Son işlem']);
    var row = people ? v2Find(people,1,person.key) : 0;
    if (!row && blanchard && result) throw blanchardError('Sonucu kaydetmeden önce katılımcı kaydını tamamla.');
    if (row) {
      var oldName = String(people.getRange(row,7).getValue()).replace(/^'/,'');
      if (oldName.toLocaleLowerCase('tr') !== person.name.toLocaleLowerCase('tr')) throw new Error('Bu kod başka bir adla kayıtlı. Eğitmeninden kodunu kontrol etmesini iste.');
    } else {
      if (blanchard && blanchardEnrollmentCount(people, person) >= BLANCHARD_CLASS_LIMIT) {
        throw blanchardError('Sınıfın katılımcı sınırına ulaşıldı. Eğitmenine haber ver.');
      }
      if (people.getLastRow() >= 3000) throw new Error('Katılımcı sınırına ulaşıldı.');
      people.appendRow([person.key,person.tenant.title,person.tenant.trainingTitle,'Grup '+person.group,person.version,v2Cell(person.code),v2Cell(person.name),new Date().toISOString(),'','','','','','','',new Date().toISOString()]);
      row = people.getLastRow();
    }
    if (!result) return jsonOut({status:'ok',saved:true}, callback);
    var attempts = v2Sheet(ss, person.tenant.attemptsSheet, ['Kapsam anahtarı','Kurum','Eğitim','Grup','Soru seti sürümü','Katılımcı kodu','Ad soyad','Sunucu zamanı','Cihaz tamamlanma zamanı','Aşama','Puan','Doğru','Yanlış','Boş','Süre (sn)','Süre doldu','Kayıt ID','Tekil gönderim anahtarı']);
    var submissionKey = person.key+':'+result.id;
    var duplicate = v2Find(attempts,18,submissionKey);
    if (duplicate) {
      var stored = attempts.getRange(duplicate,9,1,8).getValues()[0];
      var expected = [result.clientCompletedAt,result.phase,result.score,result.correct,result.wrong,result.empty,result.elapsed,!!data.timedOut];
      if (JSON.stringify(stored) !== JSON.stringify(expected)) throw new Error('Aynı kayıt kimliği farklı sonuçla kullanılamaz.');
      ozakReconcile(people,row,attempts,person.key);
      return assessmentSaved(result, true, blanchard, callback);
    }
    if (blanchard && blanchardAttemptCount(attempts, person.key) >= BLANCHARD_ATTEMPTS_LIMIT) {
      throw blanchardError('Katılımcının sınav denemesi sınırına ulaşıldı.');
    }
    if (attempts.getLastRow() >= 10000) throw new Error('Eğitim kayıt sınırına ulaşıldı.');
    attempts.appendRow([person.key,person.tenant.title,person.tenant.trainingTitle,'Grup '+person.group,person.version,v2Cell(person.code),v2Cell(person.name),new Date().toISOString(),result.clientCompletedAt,result.phase,result.score,result.correct,result.wrong,result.empty,result.elapsed,!!data.timedOut,result.id,submissionKey]);
    ozakReconcile(people,row,attempts,person.key);
    return assessmentSaved(result, false, blanchard, callback);
  } finally { lock.releaseLock(); }
}

function ozakReconcile(people, row, attempts, key) {
  var pre = null, post = null;
  // Official attempts are the first valid submissions received by the server.
  // Server timestamps are UTC ISO text; copying them never round-trips a Sheet Date.
  // The client clock is informative only; all later attempts remain in the log.
  if (attempts.getLastRow() > 1) attempts.getRange(2,1,attempts.getLastRow()-1,18).getValues().forEach(function(attempt){
    if (attempt[0] !== key) return;
    if (attempt[9] === 'pre' && !pre) pre = attempt;
    if (attempt[9] === 'post' && !post) post = attempt;
  });
  people.getRange(row,9,1,8).setValues([[pre ? pre[10] : '',post ? post[10] : '',pre && post ? post[10]-pre[10] : '',pre ? pre[7] : '',post ? post[7] : '',pre ? pre[8] : '',post ? post[8] : '',new Date().toISOString()]]);
}

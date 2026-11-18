// Standalone Özak assessment backend. Deploy in a separate Apps Script project.
// Configure this private instructor spreadsheet ID locally; never commit the real ID.
// This project must not replace or be added to the existing generic exam project.
var OZAK_SPREADSHEET_ID = 'YOUR_PRIVATE_INSTRUCTOR_SPREADSHEET_ID';
var OZAK_VERSION = 'ozak-ai-awareness-202612-v2';

function doGet(e) {
  var callback = getParam(e, 'callback', '');
  if (callback && !/^v2_[A-Za-z0-9_]+$/.test(callback)) return jsonOut({status:'error',saved:false,message:'Geçersiz istek.'}, '');
  try {
    var action = getParam(e, 'action', '');
    if (!action || action === 'health') return jsonOut({status:'ok',service:'ozak-exam',version:OZAK_VERSION}, callback);
    if (action !== 'register-v2' && action !== 'result-v2') throw new Error('Bu değerlendirmede işlem desteklenmiyor.');
    var raw = getParam(e, 'data', '');
    if (typeof raw !== 'string' || !raw || raw.length > 3000) throw new Error('Geçersiz veri.');
    var data;
    try { data = JSON.parse(raw); } catch (err) { throw new Error('Geçersiz veri.'); }
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Geçersiz veri.');
    return ozakResponse(data, action, callback);
  } catch (err) {
    return jsonOut({status:'error',saved:false,message:String(err.message || 'Kayıt yapılamadı.').slice(0,160)}, callback);
  }
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
  if (['ozak-ai-awareness-202612-v1','ozak-ai-awareness-202612-v2'].indexOf(data.version) === -1 || !context || Array.isArray(context) || typeof context !== 'object' ||
      Object.keys(context).sort().join(',') !== 'group,organization,training' ||
      context.organization !== 'ozak' || context.training !== '2026-12' || !/^[123]$/.test(context.group) || typeof context.group !== 'string') {
    throw new Error('Özak eğitim veya grup bağlantısını kontrol et.');
  }
  var name = String(data.name || '').replace(/\s+/g,' ').trim();
  var code = String(data.code || '').trim().toUpperCase();
  if (name.length < 2 || name.length > 80 || /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/.test(name) || !/^[A-Z0-9-]{4,24}$/.test(code)) {
    throw new Error('Adını ve katılımcı kodunu kontrol et.');
  }
  return {name:name, code:code, group:context.group, version:data.version,
    key:['ozak','2026-12',context.group,data.version,code].join(':')};
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

function ozakResponse(data, action, callback) {
  if (action !== 'register-v2' && action !== 'result-v2') throw new Error('Bu değerlendirmede işlem desteklenmiyor.');
  var person = ozakPerson(data);
  var result = action === 'result-v2' ? ozakResult(data) : null;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) throw new Error('Kayıt meşgul; yeniden dene.');
  try {
    var ss = SpreadsheetApp.openById(OZAK_SPREADSHEET_ID);
    var people = v2Sheet(ss, 'Özak katılımcılar', ['Kapsam anahtarı','Kurum','Eğitim','Grup','Soru seti sürümü','Katılımcı kodu','Ad soyad','Kayıt zamanı','Ön test puanı','Son test puanı','Fark','Ön test sunucu zamanı','Son test sunucu zamanı','Ön test cihaz zamanı','Son test cihaz zamanı','Son işlem']);
    var row = v2Find(people,1,person.key);
    if (row) {
      var oldName = String(people.getRange(row,7).getValue()).replace(/^'/,'');
      if (oldName.toLocaleLowerCase('tr') !== person.name.toLocaleLowerCase('tr')) throw new Error('Bu kod başka bir adla kayıtlı. Eğitmeninden kodunu kontrol etmesini iste.');
    } else {
      if (people.getLastRow() >= 3000) throw new Error('Katılımcı sınırına ulaşıldı.');
      people.appendRow([person.key,'Özak Global Holding','Aralık 2026 Yapay Zekâ Farkındalık Eğitimi','Grup '+person.group,person.version,v2Cell(person.code),v2Cell(person.name),new Date().toISOString(),'','','','','','','',new Date().toISOString()]);
      row = people.getLastRow();
    }
    if (!result) return jsonOut({status:'ok',saved:true}, callback);
    var attempts = v2Sheet(ss, 'Özak sınav kayıtları', ['Kapsam anahtarı','Kurum','Eğitim','Grup','Soru seti sürümü','Katılımcı kodu','Ad soyad','Sunucu zamanı','Cihaz tamamlanma zamanı','Aşama','Puan','Doğru','Yanlış','Boş','Süre (sn)','Süre doldu','Kayıt ID','Tekil gönderim anahtarı']);
    var submissionKey = person.key+':'+result.id;
    var duplicate = v2Find(attempts,18,submissionKey);
    if (duplicate) {
      var stored = attempts.getRange(duplicate,9,1,8).getValues()[0];
      var expected = [result.clientCompletedAt,result.phase,result.score,result.correct,result.wrong,result.empty,result.elapsed,!!data.timedOut];
      if (JSON.stringify(stored) !== JSON.stringify(expected)) throw new Error('Aynı kayıt kimliği farklı sonuçla kullanılamaz.');
      ozakReconcile(people,row,attempts,person.key);
      return jsonOut({status:'ok',saved:true,duplicate:true}, callback);
    }
    if (attempts.getLastRow() >= 10000) throw new Error('Eğitim kayıt sınırına ulaşıldı.');
    attempts.appendRow([person.key,'Özak Global Holding','Aralık 2026 Yapay Zekâ Farkındalık Eğitimi','Grup '+person.group,person.version,v2Cell(person.code),v2Cell(person.name),new Date().toISOString(),result.clientCompletedAt,result.phase,result.score,result.correct,result.wrong,result.empty,result.elapsed,!!data.timedOut,result.id,submissionKey]);
    ozakReconcile(people,row,attempts,person.key);
    return jsonOut({status:'ok',saved:true}, callback);
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

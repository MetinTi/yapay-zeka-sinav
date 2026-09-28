// V2 writes to a private instructor spreadsheet. There is intentionally no public read/list route.
// Copy this template to V2.gs and configure the private instructor spreadsheet locally.
var V2_SPREADSHEET_ID = 'YOUR_PRIVATE_INSTRUCTOR_SPREADSHEET_ID';
var V2_VERSION = 'ai-training-v2-20260928';

function v2Response(e, action, callback) {
  if (callback && !/^v2_[A-Za-z0-9_]+$/.test(callback)) return jsonOut({status:'error',message:'Geçersiz istek.'}, '');
  try {
    var raw = getParam(e, 'data', '');
    if (!raw || raw.length > 3000) throw new Error('Geçersiz veri.');
    var data = JSON.parse(raw);
    var person = v2Person(data);
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(8000)) throw new Error('Kayıt meşgul; yeniden dene.');
    try {
      var ss = SpreadsheetApp.openById(V2_SPREADSHEET_ID);
      var people = v2Sheet(ss, 'Katılımcılar', ['Kayıt zamanı','Ad soyad','Katılımcı kodu','Başlangıç puanı','Bitiş puanı','Fark','Son işlem']);
      var row = v2PersonRow(people, person);
      if (action === 'register-v2') return jsonOut({status:'ok',saved:true}, callback);
      var result = v2Result(data);
      if (action === 'email-v2') return jsonOut(v2Email(ss, person, result, data), callback);
      var attempts = v2Sheet(ss, 'Sınav kayıtları', ['Sunucu zamanı','Ad soyad','Katılımcı kodu','Aşama','Puan','Doğru','Yanlış','Boş','Süre (sn)','Süre doldu','Kayıt ID']);
      if (v2Find(attempts,11,result.id)) {
        v2Reconcile(people,row,attempts,person.code);
        return jsonOut({status:'ok',saved:true,duplicate:true}, callback);
      }
      if (attempts.getLastRow() >= 10000) throw new Error('Eğitim kayıt sınırına ulaşıldı.');
      attempts.appendRow([new Date(),v2Cell(person.name),person.code,result.phase==='pre'?'Başlangıç':'Bitiş',result.score,result.correct,result.wrong,result.empty,result.elapsed,!!data.timedOut,result.id]);
      v2Reconcile(people,row,attempts,person.code);
      return jsonOut({status:'ok',saved:true}, callback);
    } finally { lock.releaseLock(); }
  } catch (err) {
    return jsonOut({status:'error',saved:false,message:String(err.message || 'Kayıt yapılamadı.').slice(0,160)}, callback);
  }
}

function v2Person(data) {
  var name = String(data.name || '').replace(/\s+/g,' ').trim();
  var code = String(data.code || '').trim().toUpperCase();
  if (data.version !== V2_VERSION || name.length < 2 || name.length > 80 || /[\u0000-\u001f]/.test(name) || !/^[A-Z0-9-]{4,24}$/.test(code)) throw new Error('Adını ve katılımcı kodunu kontrol et.');
  return {name:name,code:code};
}
function v2Result(data) {
  var r = {id:String(data.id || data.submissionId || ''),phase:data.phase,score:Number(data.score),correct:Number(data.correct),wrong:Number(data.wrong),empty:Number(data.empty),elapsed:Number(data.elapsed)};
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(r.id) || !/^(pre|post)$/.test(r.phase)) throw new Error('Geçersiz sınav kaydı.');
  if (![r.score,r.correct,r.wrong,r.empty,r.elapsed].every(function(n){return Number.isInteger(n)&&n>=0;}) || r.correct+r.wrong+r.empty!==10 || r.score!==r.correct*10 || r.elapsed>600) throw new Error('Geçersiz sınav sonucu.');
  return r;
}
function v2Cell(value) { return /^[=+@-]/.test(value) ? "'"+value : value; }
function v2Reconcile(people,row,attempts,code) {
  var scores=['',''];
  attempts.getRange(2,3,attempts.getLastRow()-1,3).getValues().forEach(function(r){
    if (r[0]!==code) return;
    if (r[1]==='Başlangıç' && scores[0]==='') scores[0]=r[2];
    if (r[1]==='Bitiş') scores[1]=r[2];
  });
  people.getRange(row,4,1,4).setValues([[scores[0],scores[1],scores[0]!==''&&scores[1]!==''?scores[1]-scores[0]:'',new Date()]]);
}
function v2Find(sheet, column, value) {
  if (sheet.getLastRow()<2) return 0;
  var hit=sheet.getRange(2,column,sheet.getLastRow()-1,1).createTextFinder(value).matchEntireCell(true).useRegularExpression(false).findNext();
  return hit ? hit.getRow() : 0;
}
function v2PersonRow(sheet, person) {
  var row=v2Find(sheet,3,person.code);
  if (row) {
    var old=String(sheet.getRange(row,2).getValue()).replace(/^'/,'');
    if (old.toLocaleLowerCase('tr') !== person.name.toLocaleLowerCase('tr')) throw new Error('Bu kod başka bir adla kayıtlı. Eğitmeninden kodunu kontrol etmesini iste.');
    return row;
  }
  if (sheet.getLastRow()>=3000) throw new Error('Katılımcı sınırına ulaşıldı.');
  sheet.appendRow([new Date(),v2Cell(person.name),person.code,'','','',new Date()]);
  return sheet.getLastRow();
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
function v2Email(ss, person, result, data) {
  var email=normalizeEmail(String(data.email||''));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) throw new Error('E-posta adresini kontrol et.');
  var sheet=v2Sheet(ss,'E-posta gönderimleri',['Zaman','Ad soyad','Kod','İşlem ID','Durum']);
  var row=v2Find(sheet,4,result.id);
  if (row && sheet.getRange(row,5).getValue()==='OK') return {status:'ok',emailSent:true,duplicate:true};
  var sent=sendResultEmail(person.name,email,result.score,result.correct,result.wrong,result.empty,String(Math.floor(result.elapsed/60))+' dk '+(result.elapsed%60)+' sn',result.score>=PASS_SCORE);
  var values=[new Date(),v2Cell(person.name),person.code,result.id,sent.sent?'OK':'ERR'];
  if (row) sheet.getRange(row,1,1,5).setValues([values]);
  else sheet.appendRow(values);
  return {status:'ok',emailSent:!!sent.sent};
}

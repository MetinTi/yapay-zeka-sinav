const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');

// Test the public candidate template, never the private production V2.gs.
const source = readFileSync('apps-script/Ozak.template.gs','utf8');
function backend() {
  const sheets = {};
  let emails = 0, opens = 0, locked = false;
  function range(sheet,r,c,n=1,w=1) {
    return {
      getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:w},(_,j)=>sheet.rows[r+i-1]?.[c+j-1]??'')),
      getValue:()=>sheet.rows[r-1]?.[c-1]??'',
      setValues(values){values.forEach((row,i)=>row.forEach((value,j)=>{sheet.rows[r+i-1]??=[];sheet.rows[r+i-1][c+j-1]=value;}));return this;},
      setFontWeight(){return this;},setBackground(){return this;},setFontColor(){return this;},createFilter(){return this;},
      createTextFinder(value){return {matchEntireCell(){return this;},useRegularExpression(){return this;},findNext(){
        const index=sheet.rows.findIndex((row,i)=>i>=r-1&&i<r-1+n&&row[c-1]===value);
        return index<0?null:{getRow:()=>index+1};
      }};}
    };
  }
  function sheet(){return {rows:[],getRange(...args){return range(this,...args);},getLastRow(){return this.rows.length;},appendRow(row){this.rows.push(row);},setFrozenRows(){},setColumnWidths(){},setColumnWidth(){},getMaxRows:()=>1000};}
  const ctx = {
    SpreadsheetApp:{openById(){assert.equal(locked,true);opens++;return {getSheetByName:name=>sheets[name],insertSheet:name=>sheets[name]=sheet()};}},
    LockService:{getScriptLock:()=>({tryLock(){assert.equal(locked,false);locked=true;return true;},releaseLock(){locked=false;}})},
    ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'javascript'},createTextOutput:text=>({text,setMimeType(mime){this.mime=mime;return this;}})}
  };
  vm.createContext(ctx);vm.runInContext(source,ctx);
  const rawRequest=(parameter={})=>ctx.doGet({parameter});
  const request=(action,data,callback='v2_ozak_test')=>{const out=rawRequest({action,data:JSON.stringify(data),callback});return JSON.parse(out.mime==='javascript'?out.text.slice(out.text.indexOf('(')+1,-2):out.text);};
  return {sheets,request,rawRequest,emails:()=>emails,opens:()=>opens,locked:()=>locked};
}
const base={version:'ozak-ai-awareness-202612-v2',context:{organization:'ozak',training:'2026-12',group:'1'},name:'İpek Işık',code:'AI-123456'};
const attempt=(overrides={})=>({...base,id:'ozak_attempt_0001',phase:'pre',score:40,correct:4,wrong:5,empty:1,elapsed:120,timedOut:false,clientCompletedAt:'2026-12-01T06:10:00.000Z',...overrides});
const people=backend=>backend.sheets['Özak katılımcılar'].rows;
const attempts=backend=>backend.sheets['Özak sınav kayıtları'].rows;

test('registration is scoped and idempotent; names cannot replace a scoped code owner',()=>{
  const b=backend();
  assert.equal(b.request('register-v2',base).saved,true);
  assert.equal(b.request('register-v2',base).saved,true);
  assert.equal(people(b).length,2);
  assert.equal(b.request('register-v2',{...base,name:'Başka Kişi'}).saved,false);
  assert.equal(b.request('register-v2',{...base,name:'İPEK IŞIK'}).saved,true);
  assert.equal(b.request('register-v2',{...base,code:'AI-654321'}).saved,true);
  assert.equal(b.request('register-v2',{...base,name:'Başka Kişi',context:{...base.context,group:'2'}}).saved,true);
  assert.equal(people(b).length,4);
  assert.equal(b.locked(),false);
});

test('same attempt retry is idempotent; IDs can repeat across groups without mixing',()=>{
  const b=backend();
  assert.equal(b.request('result-v2',attempt()).saved,true);
  assert.equal(b.request('result-v2',attempt()).duplicate,true);
  assert.equal(attempts(b).length,2);
  assert.equal(b.request('result-v2',attempt({context:{...base.context,group:'2'},score:70,correct:7,wrong:2})).saved,true);
  assert.equal(attempts(b).length,3);
  assert.equal(people(b)[1][8],40);
  assert.equal(people(b)[2][8],70);
  assert.equal(b.request('result-v2',attempt({score:100,correct:10,wrong:0,empty:0})).saved,false);
  assert.equal(attempts(b).length,3);
});

test('first received pre and post are official, zero is valid, later attempts remain logged',()=>{
  const b=backend();
  assert.equal(b.request('result-v2',attempt({score:0,correct:0,wrong:9})).saved,true);
  assert.equal(b.request('result-v2',attempt({id:'ozak_attempt_0002',score:100,correct:10,wrong:0,empty:0})).saved,true);
  assert.equal(b.request('result-v2',attempt({id:'ozak_attempt_0003',phase:'post',score:60,correct:6,wrong:3})).saved,true);
  assert.equal(b.request('result-v2',attempt({id:'ozak_attempt_0004',phase:'post',score:100,correct:10,wrong:0,empty:0})).saved,true);
  assert.deepEqual(Array.from(people(b)[1].slice(8,11)),[0,60,60]);
  assert.equal(attempts(b).length,5);
  // A retry also repairs a summary if an earlier write stopped after logging.
  people(b)[1][8]='';people(b)[1][9]='';
  assert.equal(b.request('result-v2',attempt({score:0,correct:0,wrong:9})).duplicate,true);
  assert.deepEqual(Array.from(people(b)[1].slice(8,11)),[0,60,60]);
});

test('post without pre keeps missing baseline/delta blank; a later pre reconciles',()=>{
  const b=backend();
  assert.equal(b.request('result-v2',attempt({phase:'post',score:80,correct:8,wrong:1})).saved,true);
  assert.deepEqual(Array.from(people(b)[1].slice(8,11)),['',80,'']);
  assert.equal(b.request('result-v2',attempt({id:'ozak_attempt_0002'})).saved,true);
  assert.deepEqual(Array.from(people(b)[1].slice(8,11)),[40,80,40]);
});

test('unknown contexts, versions, operations and malformed results cannot write',()=>{
  const b=backend();
  for (const change of [
    {context:null},{context:[]},{context:{}},{context:{...base.context,organization:'other'}},
    {context:{...base.context,training:'2027-01'}},{context:{...base.context,group:'4'}},
    {context:{...base.context,group:1}},{context:{...base.context,extra:'x'}},
    {version:'ozak-ai-awareness-202612-draft2'},{version:'ai-training-v2-20260928'},
    {score:'40'},{score:41},{correct:11},{elapsed:601},{elapsed:1.5},{phase:'other'},
    {id:'short'},{timedOut:'false'},{clientCompletedAt:'2026-02-30T06:10:00.000Z'},
    {clientCompletedAt:'not-a-time'},{name:'İpek\u200b Işık'},{code:'<script>'}
  ]) assert.equal(b.request('result-v2',attempt(change)).saved,false,JSON.stringify(change));
  for (const action of ['email-v2','read-v2','unknown']) assert.equal(b.request(action,attempt()).saved,false);
  assert.equal(b.request('result-v2',attempt(),'evil()').status,'error');
  assert.equal(b.opens(),0);assert.equal(b.emails(),0);
});

test('device completion and server receipt are distinct; no per-question answers retained',()=>{
  const b=backend();
  const data=attempt({answers:{example:2}});
  assert.equal(b.request('result-v2',data).saved,true);
  const row=attempts(b)[1];
  assert.equal(typeof row[7],'string');
  assert.match(row[7],/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.equal(new Date(row[7]).toISOString(),row[7]);
  assert.ok(Math.abs(Date.now()-Date.parse(row[7]))<5000);
  assert.equal(row[8],data.clientCompletedAt);
  assert.notEqual(row[7],row[8]);
  assert.equal(people(b)[1][11],row[7]);
  assert.equal(people(b)[1][13],data.clientCompletedAt);
  assert.equal(attempts(b)[0].some(header=>/yanıt|cevap/i.test(header)),false);
  assert.equal(JSON.stringify(row).includes('example'),false);
  const noClock=attempt({id:'ozak_attempt_0002',phase:'post'});delete noClock.clientCompletedAt;
  assert.equal(b.request('result-v2',noClock).saved,true);
  assert.equal(people(b)[1][14],'');
});

test('health is public metadata only; unsupported and malformed routes do not touch any spreadsheet',()=>{
  const b=backend();
  const expected={status:'ok',service:'ozak-exam',version:'ozak-ai-awareness-202612-v2'};
  assert.deepEqual(JSON.parse(b.rawRequest().text),expected);
  assert.deepEqual(JSON.parse(b.rawRequest({action:'health'}).text),expected);
  assert.equal(b.rawRequest({action:'health',callback:'v2_health'}).mime,'javascript');
  for(const data of ['null','[]','"string"','{','x'.repeat(3001)]){
    assert.equal(JSON.parse(b.rawRequest({action:'result-v2',data}).text).saved,false);
  }
  assert.equal(b.request('result-v2',{...attempt(),version:'ai-training-v2-20260928'}).saved,false);
  assert.equal(b.opens(),0);assert.deepEqual(Object.keys(b.sheets),[]);
  assert.equal(JSON.stringify(expected).includes('SPREADSHEET'),false);
});

test('standalone manifest requests only Sheets scope and main exam project is not a dependency',()=>{
  const manifest=JSON.parse(readFileSync('apps-script/ozak-appsscript.json','utf8'));
  assert.deepEqual(manifest.oauthScopes,['https://www.googleapis.com/auth/spreadsheets']);
  assert.equal(manifest.timeZone,'Europe/Istanbul');
  assert.equal(typeof backend().rawRequest,'function');
  assert.doesNotMatch(source,/sendResultEmail|GmailApp|MailApp|V2_SPREADSHEET_ID|function doPost/);
});

test('server time cells are UTC ISO text and pre/post summary copies log timestamps byte-identically',()=>{
  const b=backend();
  assert.equal(b.request('register-v2',base).saved,true);
  assert.equal(b.request('result-v2',attempt()).saved,true);
  assert.equal(b.request('result-v2',attempt({id:'utc_post_attempt_01',phase:'post'})).saved,true);
  const person=people(b)[1],pre=attempts(b)[1],post=attempts(b)[2];
  for(const value of [person[7],person[11],person[12],person[15],pre[7],post[7]]){
    assert.equal(typeof value,'string');
    assert.match(value,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    assert.equal(new Date(value).toISOString(),value);
    assert.ok(Math.abs(Date.now()-Date.parse(value))<5000);
  }
  assert.equal(person[11],pre[7]);assert.equal(person[12],post[7]);
  assert.equal(b.request('result-v2',attempt()).duplicate,true);
  assert.equal(people(b)[1][11],pre[7]);assert.equal(people(b)[1][12],post[7]);
  assert.doesNotMatch(source,/new Date\(\)(?!\.toISOString\(\))/);
  assert.equal(JSON.stringify(person).includes('Etc/GMT'),false);
});


test('new question version isolates first scores while open legacy exams remain accepted',()=>{
  const b=backend();
  const old=attempt({version:'ozak-ai-awareness-202612-v1'});
  const current=attempt();
  assert.equal(b.request('result-v2',old).saved,true);
  assert.equal(b.request('result-v2',current).saved,true);
  assert.equal(people(b).length,3);
  assert.equal(attempts(b).length,3);
  assert.notEqual(people(b)[1][0],people(b)[2][0]);
  assert.equal(people(b)[1][4],'ozak-ai-awareness-202612-v1');
  assert.equal(people(b)[2][4],'ozak-ai-awareness-202612-v2');
  assert.equal(b.request('result-v2',attempt({version:'ozak-ai-awareness-202612-v3'})).saved,false);
});

const blanchard = {
  ...base,
  version: 'blanchard-ai-awareness-202612-v1',
  context: { organization:'blanchard', training:'2026-12', group:'1' }
};
const blanchardScore = (overrides={}) => attempt({ ...blanchard, ...overrides });
const blanchardPeople = backend => backend.sheets['Blanchard katılımcılar'].rows;
const blanchardAttempts = backend => backend.sheets['Blanchard sınav kayıtları'].rows;

test('Blanchard and both Özak versions use independent keys and worksheet rows', () => {
  const b = backend();
  assert.equal(b.request('register-v2', base).saved, true);
  assert.equal(b.request('register-v2', { ...blanchard, name:'Farklı Örnek' }).saved, true);
  assert.equal(b.request('result-v2', attempt({version:'ozak-ai-awareness-202612-v1'})).saved, true);
  assert.equal(b.request('result-v2', attempt()).saved, true);
  assert.equal(b.request('result-v2', blanchardScore({name:'Farklı Örnek',score:70,correct:7,wrong:2})).saved,true);
  assert.deepEqual(Object.keys(b.sheets).sort(), [
    'Blanchard katılımcılar','Blanchard sınav kayıtları','Özak katılımcılar','Özak sınav kayıtları'
  ]);
  assert.equal(blanchardPeople(b).length, 2);
  assert.equal(people(b).length, 3);
  assert.match(blanchardAttempts(b)[1][0], /^blanchard:2026-12:1:blanchard-ai-awareness-202612-v1:/);
  assert.match(attempts(b)[2][0], /^ozak:2026-12:1:ozak-ai-awareness-202612-v2:/);
  assert.equal(blanchardPeople(b)[1][1], 'Blanchard Türkiye');
  assert.equal(blanchardPeople(b)[1][8], 70);
  assert.equal(people(b)[1][8], 40);
});

test('Blanchard saves first scores and rejects inconsistent retries without touching Özak', () => {
  const b = backend();
  const before = blanchardScore();
  const after = blanchardScore({id:'blanchard_post_01',phase:'post',score:90,correct:9,wrong:0});
  assert.equal(b.request('result-v2', before).saved, true);
  assert.equal(b.request('result-v2', before).duplicate, true);
  assert.equal(b.request('result-v2', after).saved, true);
  assert.equal(b.request('result-v2', {...after,score:100,correct:10,wrong:0,empty:0}).saved, false);
  assert.deepEqual(Array.from(blanchardPeople(b)[1].slice(8,11)),[40,90,50]);
  assert.equal(blanchardAttempts(b).length, 3);
  assert.deepEqual(Object.keys(b.sheets).sort(), ['Blanchard katılımcılar','Blanchard sınav kayıtları']);
});

test('Blanchard rejects mismatched org/version, invalid group and malformed result before opening Sheets', () => {
  const b = backend();
  for (const change of [
    {version:base.version},
    {context:base.context},
    {context:{...blanchard.context,group:'2'}},
    {context:{...blanchard.context,group:1}},
    {context:{...blanchard.context,training:'2026-11'}},
    {context:{...blanchard.context,organization:'__proto__'}},
    {context:{...blanchard.context,extra:true}},
    {score:41},{correct:11},{elapsed:601}
  ]) assert.equal(b.request('result-v2', blanchardScore(change)).saved, false);
  assert.equal(b.request('read-v2',blanchard).saved,false);
  assert.equal(b.opens(),0);
});

test('Blanchard health discloses service and version only and opens no sheet', () => {
  const b = backend();
  assert.deepEqual(JSON.parse(b.rawRequest({action:'health',organization:'blanchard'}).text),{
    status:'ok',service:'blanchard-exam',version:'blanchard-ai-awareness-202612-v1'
  });
  assert.equal(b.opens(),0);
});

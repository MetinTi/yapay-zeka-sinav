const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const {createHash} = require('node:crypto');
const sha256 = value => createHash('sha256').update(value,'utf8').digest('hex');
const fixtureInvite = '12'.repeat(32);
const accessError = 'Blanchard sınıf bağlantısı geçersiz veya süresi dolmuş.';

// Test the public candidate template, never the private production V2.gs.
const source = readFileSync('apps-script/Ozak.template.gs','utf8');
function backend(propertyOverrides={}) {
  const properties = {
    BLANCHARD_CLASS_SHA256: sha256(fixtureInvite),
    BLANCHARD_CLASS_EXPIRES_AT: new Date(Date.now()+86400000).toISOString(),
    ...propertyOverrides
  };
  const sheets = {};
  let emails = 0, opens = 0, locked = false;
  function range(sheet,r,c,n=1,w=1) {
    return {
      getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:w},(_,j)=>sheet.rows[r+i-1]?.[c+j-1]??'')),
      getValue:()=>sheet.rows[r-1]?.[c-1]??'',
      setValues(values){values.forEach((row,i)=>row.forEach((value,j)=>{sheet.rows[r+i-1]??=[];sheet.rows[r+i-1][c+j-1]=value;}));return this;},
      setFontWeight(){return this;},setBackground(){return this;},setFontColor(){return this;},createFilter(){return this;},
      createTextFinder(value){
        const matches = () => sheet.rows.flatMap((row,i)=>
          i>=r-1&&i<r-1+n&&row[c-1]===value?[{getRow:()=>i+1}]:[]);
        return {matchEntireCell(){return this;},useRegularExpression(){return this;},findNext(){return matches()[0]??null;},findAll:matches};
      }
    };
  }
  function sheet(){return {rows:[],getRange(...args){return range(this,...args);},getLastRow(){return this.rows.length;},appendRow(row){this.rows.push(row);},setFrozenRows(){},setColumnWidths(){},setColumnWidth(){},getMaxRows:()=>1000};}
  const ctx = {
    SpreadsheetApp:{openById(){assert.equal(locked,true);opens++;return {getSheetByName:name=>sheets[name],insertSheet:name=>sheets[name]=sheet()};}},
    LockService:{getScriptLock:()=>({tryLock(){assert.equal(locked,false);locked=true;return true;},releaseLock(){locked=false;}})},
    PropertiesService:{getScriptProperties:()=>({getProperties:()=>({...properties})})},
    Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest(algorithm,value,encoding){
      return Array.from(createHash(algorithm).update(value,encoding).digest(),byte=>byte>127?byte-256:byte);
    }},
    ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'javascript'},createTextOutput:text=>({text,setMimeType(mime){this.mime=mime;return this;}})}
  };
  vm.createContext(ctx);vm.runInContext(source,ctx);
  const rawRequest=(parameter={})=>ctx.doGet({parameter});
  const request=(action,data,callback='v2_ozak_test')=>{const out=rawRequest({action,data:JSON.stringify(data),callback});return JSON.parse(out.mime==='javascript'?out.text.slice(out.text.indexOf('(')+1,-2):out.text);};
  const rawPost=(contents,type='text/plain;charset=UTF-8')=>ctx.doPost({postData:{contents,type}});
  const post=(action,data)=>JSON.parse(rawPost(JSON.stringify({action,data})).text);
  return {sheets,request,rawRequest,post,rawPost,emails:()=>emails,opens:()=>opens,locked:()=>locked};
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
  assert.doesNotMatch(source,/sendResultEmail|GmailApp|MailApp|V2_SPREADSHEET_ID/);
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
  name:'Örnek Katılımcı', version:'blanchard-ai-awareness-202612-v1',
  context:{organization:'blanchard',training:'2026-12',group:'1'}, invite:fixtureInvite,
  ...blanchardDevice('34'.repeat(32))
};
function blanchardDevice(deviceSecret) {
  return {deviceSecret,code:'AI-'+sha256(deviceSecret).slice(0,20).toUpperCase()};
}
const blanchardAttempt = (overrides={}) => ({
  ...blanchard,id:'blanchard_attempt_01',phase:'pre',
  answers:[1,3,0,2,2,1,0,3,1,null],elapsed:120,timedOut:false,clientCompletedAt:'2026-12-01T06:10:00.000Z',...overrides
});
const blanchardPeople = backend => backend.sheets['Blanchard katılımcılar'].rows;
const blanchardAttempts = backend => backend.sheets['Blanchard sınav kayıtları'].rows;

test('Blanchard mutations require POST and no Özak data are accepted through POST', () => {
  const b = backend();
  for (const action of ['register-v2','result-v2']) {
    assert.deepEqual(b.request(action,blanchardAttempt()),{status:'error',saved:false,message:accessError});
    assert.equal(b.post(action,attempt()).saved,false);
  }
  for (const contents of ['', 'null', '[]', 'x'.repeat(3001), JSON.stringify({action:'read-v2',data:blanchard})]) {
    assert.equal(JSON.parse(b.rawPost(contents).text).saved,false);
  }
  assert.equal(JSON.parse(b.rawPost(JSON.stringify({action:'register-v2',data:blanchard}),'application/json').text).saved,false);
  assert.equal(b.opens(),0);
  assert.deepEqual(Object.keys(b.sheets),[]);
});

test('missing, invalid, expired or mismatched Blanchard classroom and device credentials fail closed', () => {
  for (const propertyOverrides of [
    {BLANCHARD_CLASS_SHA256:undefined}, {BLANCHARD_CLASS_SHA256:'invalid'},
    {BLANCHARD_CLASS_SHA256:sha256('56'.repeat(32))}, {BLANCHARD_CLASS_EXPIRES_AT:undefined},
    {BLANCHARD_CLASS_EXPIRES_AT:'2026-02-31T06:10:00Z'},
    {BLANCHARD_CLASS_EXPIRES_AT:'2027-01-02T06:10:00+03:00'},
    {BLANCHARD_CLASS_EXPIRES_AT:new Date(Date.now()-1000).toISOString()}
  ]) {
    const b=backend(propertyOverrides);
    assert.deepEqual(b.post('register-v2',blanchard),{status:'error',saved:false,message:accessError});
    assert.equal(b.opens(),0);
  }
  const b=backend();
  for (const change of [
    {invite:undefined},{invite:'56'.repeat(32)},{invite:'A'.repeat(64)},{invite:'12'.repeat(31)},
    {deviceSecret:undefined},{deviceSecret:'56'.repeat(32)},{deviceSecret:'A'.repeat(64)},
    {code:'AI-123456'},{code:blanchard.code.toLowerCase()},{code:blanchardDevice('56'.repeat(32)).code}
  ]) {
    assert.deepEqual(b.post('result-v2',blanchardAttempt(change)),{status:'error',saved:false,message:accessError});
  }
  assert.equal(b.opens(),0);
});

test('Blanchard and both Özak versions use independent keys and worksheet rows', () => {
  const b = backend();
  const post = blanchardAttempt({phase:'post',name:'Farklı Örnek'});
  assert.equal(b.request('register-v2',base).saved,true);
  assert.equal(b.post('register-v2',{...blanchard,name:'Farklı Örnek'}).saved,true);
  assert.equal(b.request('result-v2',attempt({version:'ozak-ai-awareness-202612-v1'})).saved,true);
  assert.equal(b.request('result-v2',attempt()).saved,true);
  assert.deepEqual(b.post('result-v2',post),{status:'ok',saved:true,score:40,correct:4,wrong:5,empty:1});
  assert.deepEqual(Object.keys(b.sheets).sort(),[
    'Blanchard katılımcılar','Blanchard sınav kayıtları','Özak katılımcılar','Özak sınav kayıtları'
  ]);
  assert.equal(blanchardPeople(b).length,2);
  assert.equal(people(b).length,3);
  assert.match(blanchardAttempts(b)[1][0],/^blanchard:2026-12:1:blanchard-ai-awareness-202612-v1:AI-[0-9A-F]{20}$/);
  assert.match(attempts(b)[2][0],/^ozak:2026-12:1:ozak-ai-awareness-202612-v2:/);
  assert.equal(blanchardPeople(b)[1][1],'Blanchard Türkiye');
  assert.equal(blanchardPeople(b)[1][9],40);
  assert.equal(people(b)[1][8],40);
});

test('Blanchard scores canonical answers server-side and retries the registered result without sensitive Sheet fields', async () => {
  const b = backend();
  const {questions}=await import('../v2/ozak/questions.mjs');
  const correct=questions.map(({correct})=>correct);
  const before=blanchardAttempt({score:100,correct:10,wrong:0,empty:0});
  assert.equal(b.post('result-v2',before).saved,false);
  assert.deepEqual(Object.keys(b.sheets),[]);
  assert.equal(b.post('register-v2',blanchard).saved,true);
  assert.equal(b.post('register-v2',blanchard).saved,true);
  assert.equal(b.post('register-v2',{...blanchard,name:'Farkli Kisi'}).saved,false);
  assert.equal(blanchardPeople(b).length,2);
  assert.deepEqual(b.post('result-v2',before),{status:'ok',saved:true,score:40,correct:4,wrong:5,empty:1});
  assert.deepEqual(b.post('result-v2',before),{status:'ok',saved:true,duplicate:true,score:40,correct:4,wrong:5,empty:1});
  assert.equal(b.post('result-v2',{...before,answers:correct}).saved,false);
  const after=blanchardAttempt({id:'blanchard_post_01',phase:'post',answers:[...correct.slice(0,9),null]});
  assert.deepEqual(b.post('result-v2',after),{status:'ok',saved:true,score:90,correct:9,wrong:0,empty:1});
  const perfect=blanchardAttempt({id:'blanchard_post_02',phase:'post',answers:correct});
  assert.equal(b.post('result-v2',perfect).score,100); // Every canonical answer must match the backend key in order.
  assert.deepEqual(Array.from(blanchardPeople(b)[1].slice(8,11)),[40,90,50]);
  assert.equal(blanchardAttempts(b).length,4);
  assert.deepEqual(Object.keys(b.sheets).sort(),['Blanchard katılımcılar','Blanchard sınav kayıtları']);
  assert.ok(blanchardPeople(b).every(row=>row.length===16));
  assert.ok(blanchardAttempts(b).every(row=>row.length===18));
  const sheetData=JSON.stringify(b.sheets);
  for (const secret of [blanchard.invite,blanchard.deviceSecret,sha256(blanchard.invite),JSON.stringify(before.answers)]) {
    assert.equal(sheetData.includes(secret),false);
  }
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
    {answers:undefined},{answers:{}},{answers:[0]},{answers:Array(10).fill('0')},{answers:Array(10).fill(4)},
    {answers:Array(10).fill(-1)},{answers:Array(10).fill(1.5)},{elapsed:601},{elapsed:'120'},
    {phase:['pre']},{timedOut:1},{id:['long_attempt_id']},{name:{}},{clientCompletedAt:'2026-02-31T06:10:00.000Z'}
  ]) assert.equal(b.post('result-v2',blanchardAttempt(change)).saved,false,JSON.stringify(change));
  assert.equal(b.post('read-v2',blanchard).saved,false);
  assert.equal(b.opens(),0);
});

test('Blanchard caps secure enrollment and attempts while preserving existing rows and retry acknowledgements', () => {
  const expiry = new Date(Date.now()+86400000).toISOString().replace(/\.\d{3}Z$/,'Z');
  const b = backend({BLANCHARD_CLASS_EXPIRES_AT:expiry});
  assert.equal(b.post('register-v2',blanchard).saved,true);
  const legacyRow=Array.from(blanchardPeople(b)[1]);
  legacyRow[0]=legacyRow[0].replace(/AI-[0-9A-F]{20}$/,'AI-123456');
  legacyRow[5]='AI-123456';
  legacyRow[6]='Historical Fixture';
  blanchardPeople(b).push(legacyRow);
  for(let index=1;index<120;index++){
    const participant={...blanchard,...blanchardDevice(index.toString(16).padStart(64,'0'))};
    assert.equal(b.post('register-v2',participant).saved,true);
  }
  assert.equal(b.post('register-v2',{...blanchard,...blanchardDevice('ab'.repeat(32))}).saved,false);
  assert.equal(b.post('register-v2',blanchard).saved,true);
  assert.equal(blanchardPeople(b).length,122); // Header, retained legacy data and 120 secure registrations.
  assert.equal(blanchardPeople(b)[2][6],'Historical Fixture');
  for(let index=0;index<10;index++){
    assert.equal(b.post('result-v2',blanchardAttempt({id:'attempt_limit_'+index})).saved,true);
  }
  assert.equal(b.post('result-v2',blanchardAttempt({id:'attempt_limit_10'})).saved,false);
  assert.equal(b.post('result-v2',blanchardAttempt({id:'attempt_limit_0'})).duplicate,true);
  assert.equal(blanchardAttempts(b).length,11);
  assert.equal(b.locked(),false);
});

test('Blanchard health discloses service and version only and opens no sheet', () => {
  const b = backend();
  assert.deepEqual(JSON.parse(b.rawRequest({action:'health',organization:'blanchard'}).text),{
    status:'ok',service:'blanchard-exam',version:'blanchard-ai-awareness-202612-v1'
  });
  assert.equal(b.opens(),0);
});

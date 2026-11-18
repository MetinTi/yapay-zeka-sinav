import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {resolveExamContext,loadExam} from '../v2/ozak/exam-context.mjs';
import {restoreDraft,secondsRemaining,rememberParticipant} from '../v2/participant-state.mjs';

test('Ozak engine rejects the general route; original general entry has no Ozak dependency',async()=>{
  await assert.rejects(loadExam('/','?asama=bitis'),/Özak/);
  const app=readFileSync(new URL('../v2/app.mjs',import.meta.url),'utf8');
  const persistence=readFileSync(new URL('../v2/persistence.mjs',import.meta.url),'utf8');
  assert.match(app,/from '\.\/questions\.mjs'/);
  assert.doesNotMatch(app,/ozak|exam-context|loadExam/);
  assert.match(persistence,/from '\.\/questions\.mjs'/);
  assert.doesNotMatch(persistence,/ozak|backend-config|resolveExamContext/);
});

test('three groups have isolated context/state; stage stays inside the same participant scope',async()=>{
  const exams=await Promise.all(['1','2','3'].map(group=>loadExam('/ozak/',`?grup=${group}&asama=baslangic`)));
  assert.equal(new Set(exams.map(e=>e.storagePrefix)).size,3);
  const generalPrefix='ai-training-v2-20260928:';
  for(const exam of exams){
    assert.notEqual(exam.storagePrefix,generalPrefix);
    assert.match(exam.storagePrefix,/ozak:2026-12:[123]:ozak-ai-awareness-202612-v2:/);
    assert.equal(exam.remoteEnabled,true);assert.equal(exam.allowEmail,false);
    assert.deepEqual(exam.context,{organization:'ozak',training:'2026-12',group:exam.group});
    assert.equal(resolveExamContext('/ozak/index.html',`?grup=${exam.group}&asama=bitis`).storagePrefix,exam.storagePrefix);
  }
});

test('invalid or ambiguous links fail instead of silently falling back to the general exam',()=>{
  for(const query of ['','?grup=0','?grup=4','?grup=01','?grup=1&grup=2','?grup=1&asama=post','?grup=1&asama=','?grup=1&asama=bitis&asama=baslangic']) assert.throws(()=>resolveExamContext('/ozak/',query));
});

test('live set has 10 four-option questions, one outcome each, balanced key and exact scoring',async()=>{
  const exam=await loadExam('/ozak/','?grup=1');
  assert.equal(exam.questions.length,10);assert.equal(exam.durationSeconds,600);
  assert.equal(new Set(exam.questions.map(q=>q.id)).size,10);
  const distribution=[0,0,0,0];
  for(const q of exam.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.text&&q.explanation&&q.outcome);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);distribution[q.correct]++;}
  assert.ok(distribution.every(n=>n>=2&&n<=3));
  assert.deepEqual(exam.scoreAnswers({}),{score:0,correct:0,wrong:0,empty:10});
  assert.equal(exam.scoreAnswers(Object.fromEntries(exam.questions.map(q=>[q.id,q.correct]))).score,100);
  assert.deepEqual(exam.scoreAnswers(Object.fromEntries(exam.questions.map(q=>[q.id,(q.correct+1)%4]))),{score:0,correct:0,wrong:10,empty:0});
});

test('approved selection preserves the ten retained source items and their correct option texts',async()=>{
  const exam=await loadExam('/ozak/','?grup=1');
  const source=JSON.parse(readFileSync(new URL('../mobile/assets/data/exam_pool.json',import.meta.url),'utf8')).questions;
  const approved=['web-009','web-025','web-006','web-028','web-043','web-008','web-016','web-010','web-059','web-058'];
  const removed=['web-030','web-031','web-037','web-048','web-056'];
  assert.deepEqual(exam.questions.map(q=>q.sourceId),approved);
  assert.deepEqual(exam.questions.map(q=>q.id),approved);
  assert.equal(exam.version,'ozak-ai-awareness-202612-v2');
  for(const item of exam.questions){
    const original=source.find(q=>q.id===item.sourceId);
    assert.ok(original);assert.equal(item.text,original.question);
    assert.deepEqual([...item.options].sort(),[...original.options].sort());
    assert.equal(item.options[item.correct],original.options[original.correctIndex]);
    assert.ok(!removed.includes(item.sourceId));
  }
});

test('Ozak answers and absolute deadline survive refresh; old/general version cannot resume',async()=>{
  const exam=await loadExam('/ozak/','?grup=1');
  const draft={version:exam.version,id:'qa_attempt_123',phase:'pre',code:'AI-123456',name:'İpek Işık',index:3,answers:{[exam.questions[0].id]:1},started:100000,deadline:700000};
  const options={version:exam.version,questions:exam.questions,maxSeconds:600};
  const restored=restoreDraft(draft,options);
  assert.equal(restored.answers[exam.questions[0].id],1);assert.equal(secondsRemaining(restored,220000),480);
  assert.equal(restoreDraft({...draft,version:'ai-training-v2-20260928'},options),null);
  assert.equal(restoreDraft({...draft,version:'ozak-ai-awareness-202612-draft0'},options),null);
  assert.equal(restoreDraft({...draft,version:'ozak-ai-awareness-202612-draft1'},options),null);
  assert.equal(restoreDraft({...draft,version:'ozak-ai-awareness-202612-v1'},options),null);
  const first=rememberParticipant([],{name:'İpek Işık',code:'AI-123456'});
  assert.equal(rememberParticipant(first,{name:'İpek Işık',code:'AI-654321'}).length,2);
  assert.throws(()=>rememberParticipant(first,{name:'Başka Kişi',code:'AI-123456'}));
});

test('Ozak persistence sends live context and device time only through mocked transport',async()=>{
  const prior={location:globalThis.location,document:globalThis.document,window:globalThis.window};
  const captured=[];
  globalThis.location={pathname:'/ozak/',search:'?grup=2&asama=bitis'};globalThis.window={};
  globalThis.document={createElement:()=>({remove(){}}),head:{append(script){
    const url=new URL(script.src);captured.push({action:url.searchParams.get('action'),payload:JSON.parse(url.searchParams.get('data'))});
    globalThis.window[url.searchParams.get('callback')]({status:'ok',saved:true});
  }}};
  try{
    const {createPersistence}=await import('../v2/ozak/persistence.mjs');
    const api=createPersistence('https://script.google.com/macros/s/qa_ozak_only/exec');
    const identity={code:'AI-123456',name:'QA Deneme'};
    assert.deepEqual(await api.registerParticipant(identity),{saved:true});
    assert.deepEqual(await api.saveResult({...identity,id:'qa_attempt_123',phase:'post',score:40,correct:4,wrong:6,empty:0,elapsed:120,timedOut:false,completed:'2026-11-17T12:00:00.000Z'}),{saved:true});
    assert.deepEqual(captured.map(c=>c.action),['register-v2','result-v2']);
    for(const {payload} of captured){
      assert.equal(payload.version,'ozak-ai-awareness-202612-v2');
      assert.deepEqual(payload.context,{organization:'ozak',training:'2026-12',group:'2'});
      assert.equal(payload.code,identity.code);assert.equal(payload.name,identity.name);
    }
    assert.equal(captured[1].payload.clientCompletedAt,'2026-11-17T12:00:00.000Z');
    assert.equal(captured[1].payload.id,'qa_attempt_123');
    assert.equal('answers' in captured[1].payload,false);
  }finally{Object.assign(globalThis,prior);}
});

test('unconfirmed or failed saves reject; retry preserves the same attempt identity',async()=>{
  const prior={location:globalThis.location,document:globalThis.document,window:globalThis.window};
  const responses=[{status:'ok'},{status:'error',saved:false,message:'Kayıt yapılamadı.'},{status:'ok',saved:true}],captured=[];
  globalThis.location={pathname:'/ozak/',search:'?grup=1'};globalThis.window={};
  globalThis.document={createElement:()=>({remove(){}}),head:{append(script){
    const url=new URL(script.src);captured.push(JSON.parse(url.searchParams.get('data')));
    globalThis.window[url.searchParams.get('callback')](responses.shift());
  }}};
  try{
    const {createPersistence}=await import('../v2/ozak/persistence.mjs');
    const api=createPersistence('https://script.google.com/macros/s/qa_ozak_only/exec');
    const attempt={id:'qa_retry_123',code:'AI-123456',name:'QA Deneme',phase:'pre',score:40,correct:4,wrong:6,empty:0,elapsed:120,timedOut:false,completed:'2026-11-17T12:00:00.000Z'};
    await assert.rejects(api.saveResult(attempt),/Kayıt yapılamadı/);
    await assert.rejects(api.saveResult(attempt),/Kayıt yapılamadı/);
    assert.deepEqual(await api.saveResult(attempt),{saved:true});
    assert.deepEqual(captured[0],captured[1]);assert.deepEqual(captured[1],captured[2]);
  }finally{Object.assign(globalThis,prior);}
});

test('missing or invalid dedicated endpoint fails before any script creation, without fallback',async()=>{
  const prior={location:globalThis.location,document:globalThis.document};
  globalThis.location={pathname:'/ozak/',search:'?grup=1'};
  globalThis.document={createElement(){throw new Error('Unexpected request');}};
  try{
    const {createPersistence}=await import('../v2/ozak/persistence.mjs');
    for(const endpoint of ['',undefined,'https://example.invalid/exec']) {
      const api=createPersistence(endpoint);
      await assert.rejects(api.registerParticipant({code:'QA-OZAK',name:'QA Deneme'}),/Özak kayıt servisi henüz yapılandırılmadı/);
    }
  }finally{Object.assign(globalThis,prior);}
});

test('result UI stays pending until acknowledgment and supports failure then retry',async()=>{
  const app=readFileSync(new URL('../v2/ozak/app.mjs',import.meta.url),'utf8');
  const fn=app.match(/async function syncResult\(current\)\{[\s\S]*?\n\}\n(?=\$\('retry-result-sync'\))/)[0];
  const current={id:'qa_result_123',code:'AI-123456',name:'QA Deneme',phase:'pre',score:40,correct:4,wrong:6,empty:0,elapsed:120,timedOut:false,completed:'2026-11-17T12:00:00.000Z'};
  const elements={'result-sync':{dataset:{},textContent:''},'retry-result-sync':{hidden:false}};
  let finish,markReady;
  let ready=new Promise(resolve=>{markReady=resolve;});
  const ctx={copy:(tr,en)=>tr,profile:{remoteEnabled:true},result:current,$:key=>elements[key],persistence:async()=>({saveResult:()=>new Promise(resolve=>{finish=resolve;markReady();})})};
  createContext(ctx);runInContext(fn+';globalThis.runSync=syncResult;',ctx);
  let pending=ctx.runSync(current);await ready;
  assert.equal(elements['result-sync'].dataset.state,'pending');assert.equal(current.remoteSaved,false);
  assert.doesNotMatch(elements['result-sync'].textContent,/kaydedildi/);
  finish({status:'ok',saved:false});await pending;
  assert.equal(elements['result-sync'].dataset.state,'error');assert.equal(elements['retry-result-sync'].hidden,false);assert.equal(current.remoteSaved,false);
  ready=new Promise(resolve=>{markReady=resolve;});pending=ctx.runSync(current);await ready;finish({saved:true});await pending;
  assert.equal(elements['result-sync'].dataset.state,'saved');assert.match(elements['result-sync'].textContent,/kaydedildi/);assert.equal(elements['retry-result-sync'].hidden,true);assert.equal(current.remoteSaved,true);
  // English failures remain actionable without leaking Turkish backend wording.
  ctx.copy=(tr,en)=>en;
  ctx.persistence=async()=>({saveResult:async()=>{throw new Error('Kayıt yapılamadı.');}});
  await ctx.runSync(current);
  assert.equal(elements['result-sync'].dataset.state,'error');
  assert.match(elements['result-sync'].textContent,/Download your result/);
  assert.doesNotMatch(elements['result-sync'].textContent,/Kayıt yapılamadı/);
  assert.equal(elements['retry-result-sync'].hidden,false);
});

test('general persistence keeps its legacy payload and still requires saved:true',async()=>{
  const prior={location:globalThis.location,document:globalThis.document,window:globalThis.window};
  const captured=[];
  globalThis.location={pathname:'/',search:''};globalThis.window={};
  globalThis.document={createElement:()=>({remove(){}}),head:{append(script){
    const url=new URL(script.src);captured.push(JSON.parse(url.searchParams.get('data')));
    globalThis.window[url.searchParams.get('callback')]({status:'ok',saved:true});
  }}};
  try{
    const api=await import('../v2/persistence.mjs');
    await api.saveResult({id:'qa_legacy_123',code:'AI-123456',name:'QA Deneme',phase:'pre',score:40,correct:4,wrong:6,empty:0,elapsed:120,timedOut:false,completed:'2026-11-17T12:00:00.000Z'});
    assert.deepEqual(Object.keys(captured[0]).sort(),['id','code','name','phase','score','correct','wrong','empty','elapsed','timedOut','version'].sort());
    assert.equal(captured[0].version,'ai-training-v2-20260928');
  }finally{Object.assign(globalThis,prior);}
});

test('institution entry uses local official logo and first-post policy is explicit for repeat attempts',()=>{
  const html=readFileSync(new URL('../v2/ozak/index.html',import.meta.url),'utf8');
  const app=readFileSync(new URL('../v2/ozak/app.mjs',import.meta.url),'utf8');
  assert.match(html,/src="assets\/ozak-global-logo.png"/);
  assert.match(html,/Özak Global/);assert.match(html,/Değerlendirme Testi/);
  assert.match(html,/id="start-form"[^>]*hidden/);
  assert.match(html,/eğitmenin özel Google tablosuna kayıt için gönderilir/);
  assert.doesNotMatch(html,/Önizleme|yalnız kullandığın tarayıcıda tutulur/);
  assert.match(app,/result\.retake/);assert.match(app,/Bu bir tekrar denemesi/);
  assert.match(app,/downloadResultPdf\(current, profile, language\)/);
});

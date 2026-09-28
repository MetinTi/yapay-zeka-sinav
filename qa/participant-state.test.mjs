import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeName,validName,rememberParticipant,findParticipants,restoreDraft,secondsRemaining,elapsedSeconds} from '../v2/participant-state.mjs';
import {questions,scoreAnswers,EXAM_VERSION,DURATION_SECONDS} from '../v2/questions.mjs';
const config={version:EXAM_VERSION,questions,maxSeconds:DURATION_SECONDS};
const draft={version:EXAM_VERSION,id:'attempt-1',phase:'pre',code:'AI-123456',name:'İpek Işık',index:0,answers:{},started:100000,deadline:700000,durationSeconds:600};
test('10 questions and 10 minutes; scoring unchanged',()=>{
 assert.equal(questions.length,10);assert.equal(DURATION_SECONDS,600);
 assert.equal(scoreAnswers(Object.fromEntries(questions.map(q=>[q.id,q.correct]))).score,100);
});
test('required Unicode name; whitespace normalized, invalid input rejected',()=>{
 assert.equal(normalizeName('  İpek   Işık  '),'İpek Işık');
 for(const value of ['',null,' ','1','A','A'.repeat(81),'İpek\u200b'])assert.equal(validName(value),false);
 for(const value of ['İpek Işık','Çağrı Öztürk',"Jean D’Arcy",'李明'])assert.equal(validName(value),true);
});
test('same name has explicit separate codes; Turkish name matching',()=>{
 let records=rememberParticipant([],{code:'AI-111111',name:'İpek Işık'});
 records=rememberParticipant(records,{code:'AI-222222',name:'İpek Işık'});
 assert.equal(findParticipants(records,'  ipek ışık ').length,2);
 assert.equal(findParticipants(records,'Başka Kişi').length,0);
 assert.throws(()=>rememberParticipant(records,{code:'AI-111111',name:'Ayşe Yılmaz'}),/başka bir ad/);
 assert.equal(rememberParticipant(records,{code:'AI-111111',name:'İPEK IŞIK'}).length,2);
});
test('refresh uses existing absolute deadline; expiry is zero; elapsed capped',()=>{
 const restored=restoreDraft(draft,config);assert.equal(restored.deadline,700000);
 assert.equal(secondsRemaining(restored,100000),600);
 assert.equal(secondsRemaining(restored,699001),1);
 assert.equal(secondsRemaining(restored,700000),0);
 assert.equal(secondsRemaining(restored,999999),0);
 assert.equal(elapsedSeconds(restored,999999),600);
});
test('legacy nameless 8-minute draft retains answers and deadline',()=>{
 const old={...draft,deadline:580000,answers:{[questions[0].id]:2}};delete old.name;delete old.durationSeconds;
 const restored=restoreDraft(old,config);
 assert.equal(restored.name,'');assert.equal(restored.durationSeconds,480);assert.equal(restored.deadline,580000);
 assert.equal(restored.answers[questions[0].id],2);assert.equal(elapsedSeconds(restored,999999),480);
});
test('malformed legacy drafts do not crash or resume invalid state',()=>{
 for(const change of [{index:0.5},{index:10},{answers:[]},{answers:{bad:1}},{answers:{[questions[0].id]:99}},{deadline:Infinity},{started:-1},{deadline:900000},{name:'X'},{code:'<script>'},{phase:'other'},{id:''}])assert.equal(restoreDraft({...draft,...change},config),null);
 assert.equal(restoreDraft(null,config),null);
});
test('integration keeps mandatory name, local recovery, no automatic email, explicit remote confirmation',()=>{
 const app=readFileSync(new URL('../v2/app.mjs',import.meta.url),'utf8');const html=readFileSync(new URL('../v2/index.html',import.meta.url),'utf8');
 assert.match(html,/id="participant-name"[^>]*required/);assert.match(html,/>10:00</);assert.doesNotMatch(html,/>08:00</);
 assert.match(app,/api\.registerParticipant\(\{code:current\.code,name:current\.name\}\)/);
 assert.match(app,/api\.saveResult\(/);assert.match(app,/response\?\.saved!==true/);
 assert.match(app,/action=email-v2/);assert.match(app,/v2_email_\$\{result\.id\}/);
 assert.match(app,/adSoyad:result\.name/);assert.match(app,/\$\('email-name'\)\.value=result\.name/);
 assert.match(app,/pendingDraft \? \{\.\.\.pendingDraft,name\}/);
 assert.match(app,/\$\('confirm-dialog'\)\.returnValue='cancel'/);
 assert.match(app,/if\(result\?\.id!==submittedResultId\)return/);
});
test('email failure can retry and a stale email response cannot mark a new result saved',async()=>{
 const {createContext,runInContext}=await import('node:vm');
 const app=readFileSync(new URL('../v2/app.mjs',import.meta.url),'utf8');
 const finish=app.match(/  function finish\(message,confirmed=false\)\{[^\n]+/)[0];
 const response=app.match(/  window\[callback\]=response=>\{[\s\S]*?\n  \};/)[0];
 for(const [id,emailSent] of [['current',false],['current',true],['new-result',true]]){
   const status={textContent:'Yeni sonuç'},button={disabled:false,textContent:'Sonucumu gönder'};
   const sandbox={result:{id},submittedResultId:'current',ended:false,timeout:1,callback:'cb',window:{},script:{remove(){}},clearTimeout(){},$:key=>key==='email-status'?status:button};
   createContext(sandbox);runInContext(finish+';'+response,sandbox);sandbox.window.cb({status:'ok',emailSent});
   if(id==='new-result'){assert.equal(status.textContent,'Yeni sonuç');assert.equal(button.disabled,false);}
   else{assert.equal(button.disabled,emailSent);assert.doesNotMatch(status.textContent,/kaydedildi/);}
 }
});

import {questions, scoreAnswers, EXAM_VERSION, DURATION_SECONDS} from './questions.mjs';
import {normalizeName, normalizeCode, validName, participantIndex, rememberParticipant, findParticipants, restoreDraft, secondsRemaining, elapsedSeconds} from './participant-state.mjs';

const $ = id => document.getElementById(id);
const storePrefix = `${EXAM_VERSION}:`;
const scriptUrl = 'https://script.google.com/macros/s/AKfycbwMu1jzZcUOJzvbvyCeJNIlTJHHFCqQZSSzN6S5cryZIsj6jDFyCqq31c8_D9NpbWyf/exec';
let state = null, result = null, timer = null, pendingDraft = null;
let persistenceModule;
const persistence = () => persistenceModule ||= import('./persistence.mjs');
function read(key, fallback = null) { try { return JSON.parse(localStorage.getItem(storePrefix + key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(storePrefix + key, JSON.stringify(value)); return true; } catch { $('storage-warning').hidden = false; return false; } }
function draftRead() { try { return JSON.parse(sessionStorage.getItem(storePrefix + 'draft')); } catch { return null; } }
function draftWrite() { try { sessionStorage.setItem(storePrefix + 'draft', JSON.stringify(state)); } catch {} }
function clearDraft() { try { sessionStorage.removeItem(storePrefix + 'draft'); } catch {} }
function newCode() { return `AI-${crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase()}`; }
function phaseName(phase) { return phase === 'pre' ? 'Başlangıç' : 'Bitiş'; }
function show(id) { for (const name of ['welcome','exam','result']) $(name).hidden = name !== id; }
function countAnswered() { return questions.filter(q => Number.isInteger(state.answers[q.id])).length; }
function selectedPhase() { return document.querySelector('[name=phase]:checked').value; }
function baselineHint() {
  const code = normalizeCode($('participant').value);
  const baseline = read(`baseline:${code}`);
  $('baseline-hint').textContent = baseline ? `Bu tarayıcıda ${code} için başlangıç kaydı var: ${baseline.score}/100. İlk başlangıç puanı karşılaştırma için korunur.` : selectedPhase() === 'post' ? 'Bu kod için bu tarayıcıda başlangıç kaydı yok. Bitiş sınavını yine çözebilirsin; otomatik fark hesaplanamaz.' : '';
}

$('participant').value = read('last-code') || newCode();
const knownParticipant = participantIndex(read('participants',[])).find(person=>person.code===$('participant').value);
$('participant-name').value = knownParticipant?.name || '';
$('participant-name').addEventListener('input',()=>{$('participant-name').setCustomValidity('');$('start-error').hidden=true;$('recovery').hidden=true;});
$('recover-code').addEventListener('click',()=>{
  const name=normalizeName($('participant-name').value), matches=findParticipants(read('participants',[]),name);
  $('recovery').hidden=false; $('recovery-options').replaceChildren();
  $('recovery-message').textContent=!validName(name)?'Önce adını ve soyadını yaz.':!matches.length?'Bu tarayıcıda bu adla kayıt bulunamadı. Daha önce sınava girdiysen eğitmenin özel listesinden kodunu bulabilir.':matches.length>1?'Bu adla birden fazla kod var. Kendi kodunu seç; emin değilsen eğitmenine sor.':'Bu tarayıcıdaki kaydını seç:';
  for(const person of matches){
    const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=`${person.name} · ${person.code}`;
    button.addEventListener('click',()=>{$('participant').value=person.code;$('participant-name').value=person.name;$('recovery').hidden=true;$('start-error').hidden=true;baselineHint();});
    $('recovery-options').append(button);
  }
});
const requestedPhase = new URLSearchParams(location.search).get('asama');
if (requestedPhase === 'bitis') document.querySelector('[name=phase][value=post]').checked = true;
const savedTheme = read('theme');
if (['light','dark'].includes(savedTheme)) document.documentElement.dataset.theme = savedTheme;
$('theme').addEventListener('click', () => {
  const now = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  const next = now === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next; write('theme',next);
});
$('participant').addEventListener('input',baselineHint);
for (const el of document.querySelectorAll('[name=phase]')) el.addEventListener('change',baselineHint);
$('new-code').addEventListener('click',() => { $('participant').value = newCode(); $('start-error').hidden=true; baselineHint(); });
baselineHint();

$('start-form').addEventListener('submit', event => {
  event.preventDefault();
  const code = normalizeCode($('participant').value), name = normalizeName($('participant-name').value);
  if(!validName(name)){$('participant-name').setCustomValidity('Adını ve soyadını yaz (2–80 karakter).');$('participant-name').reportValidity();return;}
  if (!/^[A-Z0-9-]{4,24}$/.test(code)) { $('participant').reportValidity(); return; }
  let records;
  try { records=rememberParticipant(read('participants',[]),{code,name}); }
  catch(error){$('start-error').textContent=error.message;$('start-error').hidden=false;return;}
  write('participants',records); write('last-code', code);
  const now=Date.now();
  state = pendingDraft ? {...pendingDraft,name} : {version:EXAM_VERSION,code,name,phase:selectedPhase(),answers:{},index:0,started:now,deadline:now+DURATION_SECONDS*1000,durationSeconds:DURATION_SECONDS,id:crypto.randomUUID()};
  pendingDraft=null; $('participant').readOnly=false; $('new-code').disabled=false; $('recover-code').disabled=false;
  for(const el of document.querySelectorAll('[name=phase]'))el.disabled=false;
  $('resume-message').hidden=true; result = null; begin();
});
async function registerCurrentParticipant(current){
  $('exam-sync').dataset.state='pending';$('exam-sync').textContent='Katılımcı kaydı kontrol ediliyor…';
  try{
    const api=await persistence();const response=await api.registerParticipant({code:current.code,name:current.name});
    if(!state || state.id!==current.id)return;
    $('exam-sync').dataset.state=response?.saved===true?'saved':'pending';
    $('exam-sync').textContent=response?.saved===true?'Katılımcı kaydı eğitmen listesinde.':'Sonucun tamamlandığında eğitmen listesine kayıt denenecek.';
  }catch(error){
    if(!state || state.id!==current.id)return;
    $('exam-sync').dataset.state='error';$('exam-sync').textContent=`Katılımcı kaydı doğrulanamadı: ${String(error?.message||'Bağlantı kurulamadı.').slice(0,160)} Sınava devam edebilirsin; sonuçta kayıt yeniden denenecek.`;
  }
}
async function syncResult(current){
  if(result?.id!==current.id)return;
  $('result-sync').dataset.state='pending';$('result-sync').textContent='Sonucun eğitmen listesine kaydediliyor…';$('retry-result-sync').hidden=true;
  try{
    const api=await persistence();const response=await api.saveResult({id:current.id,version:current.version,code:current.code,name:current.name,phase:current.phase,score:current.score,correct:current.correct,wrong:current.wrong,empty:current.empty,completed:current.completed,elapsed:current.elapsed,timedOut:current.timedOut});
    if(response?.saved!==true)throw new Error('unconfirmed');
    if(result?.id!==current.id)return;
    $('result-sync').dataset.state='saved';$('result-sync').textContent='Sonucun eğitmenin özel listesine kaydedildi.';
  }catch(error){
    if(result?.id!==current.id)return;
    $('result-sync').dataset.state='error';$('result-sync').textContent=`Eğitmen listesine kayıt doğrulanamadı: ${String(error?.message||'Bağlantı kurulamadı.').slice(0,160)} Sonucunu indirerek sakla; kaydı tekrar deneyebilirsin.`;$('retry-result-sync').hidden=false;
  }
}
$('retry-result-sync').addEventListener('click',()=>{if(result)syncResult(result);});

function begin() {
  show('exam');
  $('phase-label').textContent = `${phaseName(state.phase).toLocaleUpperCase('tr')} DEĞERLENDİRMESİ`;
  $('participant-label').textContent = `${state.name} · ${state.code} · 10 soru · Her doğru 10 puan`;
  registerCurrentParticipant({...state});
  $('question-nav').replaceChildren();
  questions.forEach((q,i) => {
    const button = document.createElement('button'); button.textContent = i+1; button.type='button';
    button.addEventListener('click', () => { if(!state)return; state.index=i; renderQuestion(true); }); $('question-nav').append(button);
  });
  renderQuestion(true); clearInterval(timer); tick();
  if (state) timer = setInterval(tick,1000);
}

function renderQuestion(focus=false) {
  const q = questions[state.index];
  $('question-count').textContent = `SORU ${String(state.index+1).padStart(2,'0')} / 10`;
  $('question-topic').textContent = q.topic;
  $('question-title').textContent = q.text;
  const legend = document.createElement('legend'); legend.className='sr-only'; legend.textContent='Yanıt seçenekleri';
  $('options').replaceChildren(legend);
  q.options.forEach((option,i) => {
    const label=document.createElement('label'); label.className='option';
    const radio=document.createElement('input'); radio.type='radio'; radio.name=q.id; radio.value=i; radio.checked=state.answers[q.id]===i;
    const wrapper=document.createElement('span'), letter=document.createElement('b'), text=document.createElement('span');
    letter.textContent=String.fromCharCode(65+i); letter.setAttribute('aria-hidden','true'); text.textContent=option;
    wrapper.append(letter,text); label.append(radio,wrapper); $('options').append(label);
    radio.addEventListener('change',()=>{ if(!state)return;if(secondsRemaining(state)===0){tick();return;}state.answers[q.id]=i; updateProgress(); draftWrite(); });
  });
  $('previous').disabled = state.index===0;
  $('next').textContent = state.index===questions.length-1 ? 'Sonucu gör →' : 'Sonraki →';
  updateProgress(); draftWrite();
  if(focus) $('question-title').focus({preventScroll:true});
}
function updateProgress() {
  const answered=countAnswered();
  $('answered-count').textContent=`${answered}/10 yanıtlandı`;
  $('progress-fill').style.width=`${answered*10}%`;
  document.querySelector('.progress').setAttribute('aria-valuenow',answered);
  Array.from($('question-nav').children).forEach((button,i)=>{
    const answered=Number.isInteger(state.answers[questions[i].id]);
    button.classList.toggle('answered',answered);
    button.setAttribute('aria-current',i===state.index?'true':'false');
    button.setAttribute('aria-label',`Soru ${i+1}${answered?', yanıtlandı':', boş'}`);
  });
}
function tick() {
  if(!state) return;
  const remaining=secondsRemaining(state);
  $('timer').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
  document.querySelector('.timer').classList.toggle('urgent',remaining<=60);
  if(remaining===0) complete(true);
}
$('previous').addEventListener('click',()=>{if(state && state.index>0){state.index--;renderQuestion(true);}});
$('next').addEventListener('click',()=>{if(!state)return;if(state.index<questions.length-1){state.index++;renderQuestion(true);}else askFinish();});
$('finish').addEventListener('click',askFinish);
function askFinish() {
  if(!state) return;
  const empty=questions.length-countAnswered();
  $('confirm-text').textContent=empty ? `${empty} soru boş. Boş sorular puan getirmez. İstersen geri dönüp tamamlayabilirsin.` : '10 soruyu da yanıtladın. Değerlendirmeyi tamamlayıp sonucunu görebilirsin.';
  $('confirm-dialog').returnValue='cancel';
  $('confirm-dialog').showModal();
}
$('confirm-dialog').addEventListener('close',()=>{ if($('confirm-dialog').returnValue==='finish' && state) complete(false); });
function complete(timedOut) {
  if(!state) return;
  clearInterval(timer);
  if($('confirm-dialog').open) { $('confirm-dialog').returnValue='cancel'; $('confirm-dialog').close(); }
  result={...state,...scoreAnswers(state.answers),completed:new Date().toISOString(),elapsed:elapsedSeconds(state),timedOut};
  const existing=read(`baseline:${state.code}`);
  result.baseline=existing?.score ?? null;
  let stored=true;
  if(state.phase==='pre' && !existing) stored=write(`baseline:${state.code}`,{score:result.score,completed:result.completed,id:result.id});
  if(state.phase==='post') stored=write(`final:${state.code}`,{score:result.score,completed:result.completed,id:result.id});
  result.stored=stored; clearDraft(); state=null; showResult(); syncResult(result);
}
function showResult() {
  show('result');
  $('result-phase').textContent=`${phaseName(result.phase).toLocaleUpperCase('tr')} · ${result.name} · ${result.code}`;
  $('result-title').textContent=result.phase==='pre'?'Başlangıç noktan hazır.':'Bilgini işe dönüştür.';
  $('result-message').textContent=result.phase==='pre'?'Bu bir yarış değil. Eğitim sonunda aynı sorularla gelişimini göreceksin.':'Şimdi sıra öğrendiklerini kendi işinde uygulamakta.';
  for(const key of ['score','correct','wrong','empty']) $(key).textContent=result[key];
  $('score-ring').style.setProperty('--score',`${result.score}%`);
  $('elapsed').textContent=`${Math.floor(result.elapsed/60)} dk ${result.elapsed%60} sn${result.timedOut?' · Süre dolduğu için otomatik tamamlandı.':''}`;
  $('result-storage').textContent=result.stored ? `${result.code} · ${result.phase==='pre'?'Bitişte aynı kodu ve tarayıcıyı kullan. İlk başlangıç kaydı korunur.':'Sonucun bu tarayıcıda saklandı.'}` : 'Bu tarayıcı kayıt yapamadı. Sonucunu indirerek sakla; otomatik karşılaştırma kullanılamayabilir.';
  $('comparison').replaceChildren(); $('comparison').hidden=result.phase==='pre';
  if(result.phase==='post') {
    const strong=document.createElement('strong'), detail=document.createElement('p');
    if(result.baseline!==null) {
      const delta=result.score-result.baseline;
      strong.textContent=delta>0?`+${delta} puan ilerleme`:delta===0?'Aynı puan, yeni bakış açısı':`${delta} puan fark`;
      detail.textContent=`Başlangıç ${result.baseline}/100 → Bitiş ${result.score}/100. Bu kısa karşılaştırma, öğrenmenin tek ölçütü değildir.`;
    } else { strong.textContent='Başlangıç kaydı bulunamadı'; detail.textContent='Aynı kod ve tarayıcıdaki başlangıç sonucu gerekir. İndirdiğin başlangıç belgesi varsa iki puanı onunla karşılaştır.'; }
    $('comparison').append(strong,detail);
  }
  $('review-toggle').hidden=result.phase==='pre'; $('review-toggle').textContent='Yanıtları ve açıklamaları gör';
  $('review').hidden=true; $('review').replaceChildren();
  $('email-form').reset(); $('email-name').value=result.name; $('email-status').textContent=''; $('send-email').disabled=false; $('send-email').textContent='Sonucumu gönder';
  document.querySelector('.email-section').open=false;
  $('result-title').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'});
}
$('review-toggle').addEventListener('click',()=>{
  $('review').hidden=!$('review').hidden;
  $('review-toggle').textContent=$('review').hidden?'Yanıtları ve açıklamaları gör':'Açıklamaları gizle';
  if(!$('review').childElementCount) questions.forEach((q,i)=>{
    const article=document.createElement('article'), label=document.createElement('span'), title=document.createElement('h2'), chosen=document.createElement('p'), correct=document.createElement('p'), explanation=document.createElement('p');
    const answer=result.answers[q.id]; label.className='review-status';
    label.textContent=`SORU ${i+1} · ${answer===undefined?'BOŞ':answer===q.correct?'DOĞRU':'TEKRAR BAK'}`;
    title.textContent=q.text; chosen.textContent=`Yanıtın: ${answer===undefined?'Boş':q.options[answer]}`;
    correct.textContent=`Doğru yanıt: ${q.options[q.correct]}`; explanation.className='explanation'; explanation.textContent=q.explanation;
    article.append(label,title,chosen,correct,explanation); $('review').append(article);
  });
});
$('download').addEventListener('click',()=>{
  const data={egitim:'Metin Tiryaki · Yapay Zeka Eğitimi',surum:EXAM_VERSION,katilimciKodu:result.code,adSoyad:result.name,asama:phaseName(result.phase),puan:result.score,dogru:result.correct,yanlis:result.wrong,bos:result.empty,baslangicPuani:result.phase==='pre'?result.score:result.baseline,fark:result.phase==='post'&&result.baseline!==null?result.score-result.baseline:null,tarih:result.completed,sureSaniye:result.elapsed};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));
  const a=document.createElement('a'); a.href=url;a.download=`AI-${result.code}-${result.phase}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('home').addEventListener('click',()=>{show('welcome'); $('participant').value=result.code;$('participant-name').value=result.name;baselineHint();window.scrollTo({top:0,behavior:'instant'});});

// Retains the existing V1 email/Sheets service, only after an explicit opt-in.
// No history lookup: V1 scores must not contaminate this fixed-question pre/post comparison.
$('email-form').addEventListener('submit', event=>{
  event.preventDefault(); if(!result || !$('consent').checked) return;
  const submittedResultId=result.id;
  $('send-email').disabled=true; $('email-status').textContent='Sonucun gönderiliyor…';
  const data={submissionId:`v2_email_${result.id}`,code:result.code,phase:result.phase,version:result.version,elapsed:result.elapsed,name:result.name,email:$('email-address').value.trim(),score:result.score,correct:result.correct,wrong:result.wrong,empty:result.empty,time:`V2 ${phaseName(result.phase)} · ${Math.floor(result.elapsed/60)} dakika ${result.elapsed%60} saniye`};
  const callback=`v2_${crypto.randomUUID().replaceAll('-','')}`, script=document.createElement('script');
  let ended=false, timeout;
  function finish(message,confirmed=false){ if(ended)return;ended=true;clearTimeout(timeout);delete window[callback];script.remove();if(result?.id!==submittedResultId)return;$('email-status').textContent=message;$('send-email').disabled=confirmed;$('send-email').textContent=confirmed?'E-posta gönderildi':'Tekrar dene'; }
  window[callback]=response=>{
    if(response?.status!=='ok') return finish('Gönderim doğrulanamadı. Sonucunu indirebilir veya tekrar deneyebilirsin.');
    finish(response.emailSent===true?'E-posta gönderimi servis tarafından onaylandı.':response.emailSent===false?'E-posta gönderilemedi. Tekrar deneyebilir veya sonucunu indirebilirsin.':'E-posta gönderimi doğrulanamadı. Sonucunu indirerek sakla.',response.emailSent===true);
  };
  script.onerror=()=>finish('Bağlantı kurulamadı. Sonucun ekranda duruyor; indirebilir veya tekrar deneyebilirsin.');
  script.src=`${scriptUrl}?action=email-v2&data=${encodeURIComponent(JSON.stringify(data))}&callback=${callback}`;
  timeout=setTimeout(()=>finish('Servis yanıtı zamanında gelmedi. Gönderim doğrulanamadı; tekrar deneme aynı kaydı çoğaltmaz.'),15000);
  document.body.append(script);
});

const draft=restoreDraft(draftRead(),{version:EXAM_VERSION,questions,maxSeconds:DURATION_SECONDS});
if(draft){
  if(validName(draft.name)){
    state=draft;begin();
  }else{
    pendingDraft=draft;
    $('participant').value=draft.code;$('participant').readOnly=true;
    $('participant-name').value=participantIndex(read('participants',[])).find(person=>person.code===draft.code)?.name||'';
    document.querySelector(`[name=phase][value=${draft.phase}]`).checked=true;
    for(const el of document.querySelectorAll('[name=phase]'))el.disabled=true;
    $('new-code').disabled=true;$('recover-code').disabled=true;
    $('resume-message').textContent='Yarım kalan sınavın bulundu. Adını yazıp devam et; cevapların ve önceki bitiş saatin korunur.';$('resume-message').hidden=false;baselineHint();
  }
}else if(draftRead()){
  clearDraft();$('resume-message').textContent='Önceki sınav taslağı okunamadı. Yeni bir değerlendirme başlatabilirsin.';$('resume-message').hidden=false;
}

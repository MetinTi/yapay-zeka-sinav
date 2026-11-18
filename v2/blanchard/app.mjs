import {loadExam} from './exam-context.mjs';
import {normalizeName, normalizeCode, validName, participantIndex, rememberParticipant, findParticipants, restoreDraft, secondsRemaining, elapsedSeconds} from '../participant-state.mjs';

const profile = await loadExam(location.pathname, location.search);
const {questions, scoreAnswers, version:EXAM_VERSION, durationSeconds:DURATION_SECONDS} = profile;
const language = profile.language === 'en' ? 'en' : 'tr';
const copy = (tr, en) => language === 'en' ? en : tr;
const $ = id => document.getElementById(id);
const storePrefix = profile.storagePrefix;
const pendingPrefix = storePrefix + 'pending-result:';
const pendingLifetime = 24 * 60 * 60 * 1000;
const inFlight = new Set();
let state = null, result = null, timer = null, pendingDraft = null;
let persistenceModule;
const persistence = () => persistenceModule ||= import('./persistence.mjs');
function read(key, fallback = null) { try { return JSON.parse(localStorage.getItem(storePrefix + key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(storePrefix + key, JSON.stringify(value)); return true; } catch { $('storage-warning').hidden = false; return false; } }
function draftRead() { try { return JSON.parse(sessionStorage.getItem(storePrefix + 'draft')); } catch { return null; } }
function draftWrite() { try { sessionStorage.setItem(storePrefix + 'draft', JSON.stringify(state)); } catch {} }
function clearDraft() { try { sessionStorage.removeItem(storePrefix + 'draft'); } catch {} }
function submission(current) {
  const {id,version,code,name,phase,score,correct,wrong,empty,completed,elapsed,timedOut} = current;
  return {id,version,code,name,phase,score,correct,wrong,empty,completed,elapsed,timedOut};
}
function rememberPending(current) {
  try { sessionStorage.setItem(pendingPrefix + current.id, JSON.stringify(submission(current))); } catch {}
}
function forgetPending(id) {
  try { sessionStorage.removeItem(pendingPrefix + id); } catch {}
}
function validPending(saved, id, now) {
  const timestamp = saved?.completed;
  if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(timestamp)) return false;
  const completed = Date.parse(timestamp);
  return saved?.id === id && saved.version === EXAM_VERSION && /^[a-f0-9-]{36}$/.test(id) &&
    ['pre','post'].includes(saved.phase) && validName(saved.name) && typeof saved.code === 'string' && /^[A-Z0-9-]{4,24}$/.test(saved.code) &&
    [saved.correct,saved.wrong,saved.empty,saved.elapsed].every(n => Number.isInteger(n) && n >= 0) &&
    saved.correct + saved.wrong + saved.empty === questions.length && saved.score === saved.correct * 10 &&
    saved.elapsed <= DURATION_SECONDS && typeof saved.timedOut === 'boolean' &&
    completed <= now && completed > now - pendingLifetime && new Date(completed).toISOString() === timestamp;
}
function readPending() {
  let keys;
  try { keys = Object.keys(sessionStorage).filter(key => key.startsWith(pendingPrefix)); } catch { return []; }
  const now = Date.now(), pending = [];
  for (const key of keys) {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(key)); } catch {}
    const id = key.slice(pendingPrefix.length);
    if (validPending(saved, id, now)) pending.push(submission(saved));
    else forgetPending(id);
  }
  return pending.sort((a,b) => a.completed.localeCompare(b.completed));
}
function newCode() { return `AI-${crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase()}`; }
function phaseName(phase) { return phase === 'pre' ? copy('Ön test', 'Pre-test') : copy('Son test', 'Post-test'); }
function show(id) { for (const name of ['welcome','exam','result']) $(name).hidden = name !== id; }
function countAnswered() { return questions.filter(q => Number.isInteger(state.answers[q.id])).length; }
function selectedPhase() { return document.querySelector('[name=phase]:checked').value; }
function baselineHint() {
  const code = normalizeCode($('participant').value);
  const baseline = read(`baseline:${code}`);
  $('baseline-hint').textContent = baseline ? copy(`Bu tarayıcıda ${code} için başlangıç kaydı var: ${baseline.score}/100. İlk başlangıç puanı karşılaştırma için korunur.`, `This browser has a pre-test result for ${code}: ${baseline.score}/100. The first pre-test score is kept for comparison.`) : selectedPhase() === 'post' ? copy('Bu kod için bu tarayıcıda başlangıç kaydı yok. Bitiş sınavını yine çözebilirsin; otomatik fark hesaplanamaz.', 'This browser has no pre-test result for this code. You can still take the post-test, but a score difference cannot be calculated automatically.') : '';
}

$('participant').value = read('last-code') || newCode();
const knownParticipant = participantIndex(read('participants',[])).find(person=>person.code===$('participant').value);
$('participant-name').value = knownParticipant?.name || '';
$('participant-name').addEventListener('input',()=>{$('participant-name').setCustomValidity('');$('start-error').hidden=true;$('recovery').hidden=true;});
$('recover-code').addEventListener('click',()=>{
  const name=normalizeName($('participant-name').value), matches=findParticipants(read('participants',[]),name);
  $('recovery').hidden=false; $('recovery-options').replaceChildren();
  $('recovery-message').textContent=!validName(name)?copy('Önce adını ve soyadını yaz.', 'Enter your full name first.'):!matches.length?copy('Bu tarayıcıda bu adla kayıt bulunamadı. Daha önce sınava girdiysen eğitmenin özel listesinden kodunu bulabilir.', 'No record with this name was found in this browser. If you have taken the test before, your trainer can find your code in the private list.'):matches.length>1?copy('Bu adla birden fazla kod var. Kendi kodunu seç; emin değilsen eğitmenine sor.', 'There is more than one code for this name. Select your own code; ask your trainer if you are unsure.'):copy('Bu tarayıcıdaki kaydını seç:', 'Select your record from this browser:');
  for(const person of matches){
    const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=`${person.name} · ${person.code}`;
    button.addEventListener('click',()=>{$('participant').value=person.code;$('participant-name').value=person.name;$('recovery').hidden=true;$('start-error').hidden=true;baselineHint();});
    $('recovery-options').append(button);
  }
});
const requestedPhase = new URLSearchParams(location.search).get('asama');
if (requestedPhase === 'bitis') document.querySelector('[name=phase][value=post]').checked = true;
$('participant').addEventListener('input',baselineHint);
for (const el of document.querySelectorAll('[name=phase]')) el.addEventListener('change',baselineHint);
$('new-code').addEventListener('click',() => { $('participant').value = newCode(); $('start-error').hidden=true; baselineHint(); });
baselineHint();

$('start-form').addEventListener('submit', event => {
  event.preventDefault();
  const code = normalizeCode($('participant').value), name = normalizeName($('participant-name').value);
  if(!validName(name)){$('participant-name').setCustomValidity(copy('Adını ve soyadını yaz (2–80 karakter).', 'Enter your full name (2–80 characters).'));$('participant-name').reportValidity();return;}
  if (!/^[A-Z0-9-]{4,24}$/.test(code)) { $('participant').reportValidity(); return; }
  let records;
  try { records=rememberParticipant(read('participants',[]),{code,name}); }
  catch(error){$('start-error').textContent=copy(error.message, 'This code is saved under a different name in this browser. Select your own code or create a new one.');$('start-error').hidden=false;return;}
  write('participants',records); write('last-code', code);
  const now=Date.now();
  state = pendingDraft ? {...pendingDraft,name} : {version:EXAM_VERSION,code,name,phase:selectedPhase(),answers:{},index:0,started:now,deadline:now+DURATION_SECONDS*1000,durationSeconds:DURATION_SECONDS,id:crypto.randomUUID()};
  pendingDraft=null; $('participant').readOnly=false; $('new-code').disabled=false; $('recover-code').disabled=false;
  for(const el of document.querySelectorAll('[name=phase]'))el.disabled=false;
  $('resume-message').hidden=true; result = null; begin();
});
async function registerCurrentParticipant(current){
  if (!profile.remoteEnabled) {
    $('exam-sync').textContent=copy('Bu değerlendirmede eğitmen listesine kayıt kapalı.', 'Saving to the trainer’s list is disabled for this assessment.');
    return;
  }
  $('exam-sync').dataset.state='pending';$('exam-sync').textContent=copy('Katılımcı kaydı kontrol ediliyor…', 'Checking your participant record…');
  try{
    const api=await persistence();const response=await api.registerParticipant({code:current.code,name:current.name});
    if(!state || state.id!==current.id)return;
    $('exam-sync').dataset.state=response?.saved===true?'saved':'pending';
    $('exam-sync').textContent=response?.saved===true?copy('Katılımcı kaydı eğitmen listesinde.', 'Your participant record is in the trainer’s list.'):copy('Sonucun tamamlandığında eğitmen listesine kayıt denenecek.', 'We will try saving to the trainer’s list when you finish.');
  }catch(error){
    if(!state || state.id!==current.id)return;
    $('exam-sync').dataset.state='error';$('exam-sync').textContent=copy(`Katılımcı kaydı doğrulanamadı: ${String(error?.message||'Bağlantı kurulamadı.').slice(0,160)} Sınava devam edebilirsin; sonuçta kayıt yeniden denenecek.`, 'Your participant record could not be confirmed. You can continue the test; saving will be retried with your result.');
  }
}
async function syncResult(current){
  const isVisible = () => result?.id === current.id;
  if (!profile.remoteEnabled) {
    if (!isVisible()) return;
    $('result-sync').dataset.state='disabled';
    $('result-sync').textContent=copy('Sonucun eğitmen listesine gönderilmedi. İstersen cihazına indirebilirsin.', 'Your result was not sent to the trainer’s list. You can download it to your device.');
    $('retry-result-sync').hidden=true;
    return;
  }
  if (inFlight.has(current.id)) return;
  inFlight.add(current.id);
  current.remoteSaved=false;
  if (isVisible()) {
    $('result-sync').dataset.state='pending';$('result-sync').textContent=copy('Sonucun eğitmen listesine kaydediliyor…', 'Saving your result to the trainer’s list…');$('retry-result-sync').hidden=true;
  }
  try{
    const api=await persistence();const response=await api.saveResult(submission(current));
    if(response?.saved!==true)throw new Error('unconfirmed');
    forgetPending(current.id);
    current.remoteSaved=true;
    if(!isVisible())return;
    $('result-sync').dataset.state='saved';$('result-sync').textContent=copy('Sonucun eğitmenin özel listesine kaydedildi.', 'Your result has been saved to the trainer’s private list.');
  }catch(error){
    if(!isVisible())return;
    $('result-sync').dataset.state='error';$('result-sync').textContent=copy(`Eğitmen listesine kayıt doğrulanamadı: ${String(error?.message||'Bağlantı kurulamadı.').slice(0,160)} Sonucunu indirerek sakla; kaydı tekrar deneyebilirsin.`, 'Saving to the trainer’s list could not be confirmed. Download your result to keep a copy, then try saving again.');$('retry-result-sync').hidden=false;
  }finally{inFlight.delete(current.id);}
}
$('retry-result-sync').addEventListener('click',()=>{if(result)syncResult(result);});

function begin() {
  show('exam');
  $('phase-label').textContent = copy(`${phaseName(state.phase).toLocaleUpperCase(language)} DEĞERLENDİRMESİ`, `${phaseName(state.phase).toUpperCase()} ASSESSMENT`);
  $('participant-label').textContent = copy(`${state.name} · ${state.code} · 10 soru · Her doğru 10 puan`, `${state.name} · ${state.code} · 10 questions · 10 points per correct answer`);
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
  $('question-count').textContent = `${copy('SORU', 'QUESTION')} ${String(state.index+1).padStart(2,'0')} / 10`;
  $('question-topic').textContent = q.topic;
  $('question-title').textContent = q.text;
  const legend = document.createElement('legend'); legend.className='sr-only'; legend.textContent=copy('Yanıt seçenekleri', 'Answer options');
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
  $('next').textContent = state.index===questions.length-1 ? copy('Sonucu gör →', 'View result →') : copy('Sonraki →', 'Next →');
  updateProgress(); draftWrite();
  if(focus) $('question-title').focus({preventScroll:true});
}
function updateProgress() {
  const answered=countAnswered();
  $('answered-count').textContent=copy(`${answered}/10 yanıtlandı`, `${answered}/10 answered`);
  $('progress-fill').style.width=`${answered*10}%`;
  document.querySelector('.progress').setAttribute('aria-valuenow',answered);
  Array.from($('question-nav').children).forEach((button,i)=>{
    const answered=Number.isInteger(state.answers[questions[i].id]);
    button.classList.toggle('answered',answered);
    button.setAttribute('aria-current',i===state.index?'true':'false');
    button.setAttribute('aria-label',copy(`Soru ${i+1}${answered?', yanıtlandı':', boş'}`, `Question ${i+1}${answered?', answered':', unanswered'}`));
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
  $('confirm-text').textContent=empty ? copy(`${empty} soru boş. Boş sorular puan getirmez. İstersen geri dönüp tamamlayabilirsin.`, `${empty} ${empty === 1 ? 'question is' : 'questions are'} unanswered. Unanswered questions earn no points. You can go back and complete them.`) : copy('10 soruyu da yanıtladın. Değerlendirmeyi tamamlayıp sonucunu görebilirsin.', 'You have answered all 10 questions. Finish the assessment to view your result.');
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
  const firstFinal=profile.kind==='blanchard'?read(`final:${state.code}`):null;
  if(profile.kind==='blanchard') {
    const first=state.phase==='pre'?existing:firstFinal;
    result.retake=!!first && first.id!==result.id;
    result.firstScore=first?.score ?? result.score;
  }
  result.baseline=existing?.score ?? null;
  let stored=true;
  if(state.phase==='pre' && !existing) stored=write(`baseline:${state.code}`,{score:result.score,completed:result.completed,id:result.id});
  if(state.phase==='post' && (profile.kind!=='blanchard' || !firstFinal)) stored=write(`final:${state.code}`,{score:result.score,completed:result.completed,id:result.id});
  if (profile.remoteEnabled) rememberPending(result);
  result.stored=stored; clearDraft(); state=null; showResult(); syncResult(result);
}
function showResult() {
  show('result');
  $('download-status').textContent = '';
  $('result-phase').textContent=`${phaseName(result.phase).toLocaleUpperCase(language)} · ${result.name} · ${result.code}`;
  $('result-title').textContent=result.phase==='pre'?copy('Başlangıç noktan hazır.', 'Your starting point is ready.'):copy('Bilgini işe dönüştür.', 'Put your knowledge to work.');
  $('result-message').textContent=result.phase==='pre'?copy('Bu bir yarış değil. Eğitim sonunda aynı sorularla gelişimini göreceksin.', 'This is not a competition. At the end of the training, the same questions will help you see your progress.'):copy('Şimdi sıra öğrendiklerini kendi işinde uygulamakta.', 'Now it is time to apply what you have learned in your own work.');
  for(const key of ['score','correct','wrong','empty']) $(key).textContent=result[key];
  $('score-ring').style.setProperty('--score',`${result.score}%`);
  $('elapsed').textContent=copy(`${Math.floor(result.elapsed/60)} dk ${result.elapsed%60} sn${result.timedOut?' · Süre dolduğu için otomatik tamamlandı.':''}`, `${Math.floor(result.elapsed/60)} min ${result.elapsed%60} sec${result.timedOut?' · Automatically completed because time ran out.':''}`);
  $('result-storage').textContent=result.stored ? copy(`${result.code} · ${result.phase==='pre'?'Bitişte aynı kodu ve tarayıcıyı kullan. İlk başlangıç kaydı korunur.':'Sonucun bu tarayıcıda saklandı.'}`, `${result.code} · ${result.phase==='pre'?'Use the same code and browser for the post-test. The first pre-test result is kept.':'Your result is stored in this browser.'}`) : copy('Bu tarayıcı kayıt yapamadı. Sonucunu indirerek sakla; otomatik karşılaştırma kullanılamayabilir.', 'This browser could not save your result. Download it to keep a copy; automatic comparison may be unavailable.');
  if(profile.kind==='blanchard' && result.retake) $('result-storage').textContent=copy(`Bu bir tekrar denemesi. Bu tarayıcıdaki ilk ${phaseName(result.phase).toLocaleLowerCase(language)} puanın ${result.firstScore}/100 olarak korunuyor. Bu denemenin puanı onun yerine geçmez; ayrıca indirebilirsin.`, `This is a repeat attempt. Your first ${phaseName(result.phase).toLowerCase()} score in this browser remains ${result.firstScore}/100. This attempt does not replace it; you can download this result separately.`);
  $('comparison').replaceChildren(); $('comparison').hidden=result.phase==='pre';
  if(result.phase==='post') {
    const strong=document.createElement('strong'), detail=document.createElement('p');
    if(result.baseline!==null) {
      const delta=result.score-result.baseline;
      strong.textContent=delta>0?copy(`+${delta} puan ilerleme`, `+${delta} points of progress`):delta===0?copy('Aynı puan, yeni bakış açısı', 'Same score, a new perspective'):copy(`${delta} puan fark`, `${delta} points difference`);
      detail.textContent=copy(`${phaseName('pre')} ${result.baseline}/100 → ${phaseName('post')} ${result.score}/100. Bu kısa karşılaştırma, öğrenmenin tek ölçütü değildir. Karşılaştırma bu tarayıcıdaki kayda dayanır.`, `${phaseName('pre')} ${result.baseline}/100 → ${phaseName('post')} ${result.score}/100. This brief comparison is not the only measure of learning. It is based on the record in this browser.`);
    } else { strong.textContent=copy('Başlangıç kaydı bulunamadı', 'No pre-test record found'); detail.textContent=copy('Aynı kod ve tarayıcıdaki başlangıç sonucu gerekir. İndirdiğin başlangıç belgesi varsa iki puanı onunla karşılaştır.', 'A pre-test result with the same code in this browser is required. If you downloaded your pre-test result, use it to compare the two scores.'); }
    $('comparison').append(strong,detail);
  }
  $('review-toggle').hidden=result.phase==='pre'||!result.answers; $('review-toggle').textContent=copy('Yanıtları ve açıklamaları gör', 'View answers and explanations');
  $('review').hidden=true; $('review').replaceChildren();
  $('result-title').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'});
}
$('review-toggle').addEventListener('click',()=>{
  if (!result?.answers || result.phase!=='post') return;
  $('review').hidden=!$('review').hidden;
  $('review-toggle').textContent=$('review').hidden?copy('Yanıtları ve açıklamaları gör', 'View answers and explanations'):copy('Açıklamaları gizle', 'Hide explanations');
  if(!$('review').childElementCount) questions.forEach((q,i)=>{
    const article=document.createElement('article'), label=document.createElement('span'), title=document.createElement('h2'), chosen=document.createElement('p'), correct=document.createElement('p'), explanation=document.createElement('p');
    const answer=result.answers[q.id]; label.className='review-status';
    label.textContent=`${copy('SORU', 'QUESTION')} ${i+1} · ${answer===undefined?copy('BOŞ','UNANSWERED'):answer===q.correct?copy('DOĞRU','CORRECT'):copy('TEKRAR BAK','REVIEW')}`;
    title.textContent=q.text; chosen.textContent=`${copy('Yanıtın:', 'Your answer:')} ${answer===undefined?copy('Boş','Unanswered'):q.options[answer]}`;
    correct.textContent=`${copy('Doğru yanıt:', 'Correct answer:')} ${q.options[q.correct]}`; explanation.className='explanation'; explanation.textContent=q.explanation;
    article.append(label,title,chosen,correct,explanation); $('review').append(article);
  });
});
let reportModuleAttempt = 0;
async function loadReportModule() {
  const path = reportModuleAttempt ? `./result-pdf.mjs?retry=${reportModuleAttempt}` : './result-pdf.mjs';
  try { return await import(path); }
  catch (error) { reportModuleAttempt++; throw error; }
}
$('download').addEventListener('click', async () => {
  if (!result || $('download').disabled) return;
  const current = {...result};
  const button = $('download'), status = $('download-status');
  const idleLabel = copy('Sonuç PDF’sini indir ↓', 'Download result PDF ↓');
  button.disabled = true; button.textContent = copy('PDF hazırlanıyor…', 'Preparing PDF…');
  status.textContent = '';
  try {
    const {downloadResultPdf} = await loadReportModule();
    await downloadResultPdf(current, profile, language);
    if (result?.id === current.id) status.textContent = copy('Sonuç PDF’n hazır. İndirilenler klasöründen açabilirsin.', 'Your result PDF is ready. Open it from your downloads folder.');
  } catch {
    if (result?.id === current.id) status.textContent = copy('PDF hazırlanamadı. İnternet bağlantını kontrol edip tekrar dene.', 'The PDF could not be prepared. Check your connection and try again.');
  } finally {
    button.disabled = false; button.textContent = idleLabel;
  }
});
$('home').addEventListener('click',()=>{show('welcome'); $('participant').value=result.code;$('participant-name').value=result.name;baselineHint();window.scrollTo({top:0,behavior:'instant'});});

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
    $('resume-message').textContent=copy('Yarım kalan sınavın bulundu. Adını yazıp devam et; cevapların ve önceki bitiş saatin korunur.', 'An unfinished test was found. Enter your name to continue; your answers and original deadline are kept.');$('resume-message').hidden=false;baselineHint();
  }
}else if(draftRead()){
  clearDraft();$('resume-message').textContent=copy('Önceki sınav taslağı okunamadı. Yeni bir değerlendirme başlatabilirsin.', 'The previous test draft could not be read. You can start a new assessment.');$('resume-message').hidden=false;
}

async function recoverPending() {
  const pending = readPending();
  if (!draft && pending.length) {
    const saved = pending[0];
    const baseline = read(`baseline:${saved.code}`);
    const first = saved.phase === 'pre' ? baseline : read(`final:${saved.code}`);
    result = {...saved, baseline:baseline?.score ?? null, stored:!!first,
      retake:!!first && first.id !== saved.id, firstScore:first?.score ?? saved.score};
    showResult();
  }
  for (const saved of pending) await syncResult(result?.id === saved.id ? result : saved);
}
if (profile.remoteEnabled) void recoverPending();

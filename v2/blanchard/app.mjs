import {loadExam} from './exam-context.mjs';
import {deviceIdentity, savedClassroom} from './classroom.mjs';
import {normalizeName, validName, restoreDraft, secondsRemaining, elapsedSeconds} from '../participant-state.mjs';

const profile = await loadExam(location.pathname, location.search);
const invite = savedClassroom();
if (!invite) throw new Error('Classroom access required');
const {code, deviceSecret} = await deviceIdentity();
const {questions, scoreAnswers, version:EXAM_VERSION, durationSeconds:DURATION_SECONDS} = profile;
const language = profile.language === 'en' ? 'en' : 'tr';
const copy = (tr, en) => language === 'en' ? en : tr;
const $ = id => document.getElementById(id);
const storePrefix = profile.storagePrefix;
const pendingPrefix = storePrefix + 'pending-result:';
const pendingLifetime = 24 * 60 * 60 * 1000;
const inFlight = new Set();
let state = null, result = null, timer = null, pendingDraft = null, starting = false;
let persistenceModule;
const persistence = () => persistenceModule ||= import('./persistence.mjs')
  .then(({openPersistence}) => openPersistence({invite, deviceSecret}));
function read(key, fallback = null) { try { return JSON.parse(localStorage.getItem(storePrefix + key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(storePrefix + key, JSON.stringify(value)); return true; } catch { $('storage-warning').hidden = false; return false; } }
function draftRead() { try { return JSON.parse(sessionStorage.getItem(storePrefix + 'draft')); } catch { return null; } }
function draftWrite() { try { sessionStorage.setItem(storePrefix + 'draft', JSON.stringify(state)); } catch {} }
function clearDraft() { try { sessionStorage.removeItem(storePrefix + 'draft'); } catch {} }
function submission(current) {
  const {id,version,code,name,phase,completed,elapsed,timedOut} = current;
  const answers = Array.isArray(current.answers)
    ? current.answers
    : questions.map(question => current.answers[question.id] ?? null);
  return {id,version,code,name,phase,answers,completed,elapsed,timedOut};
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
    ['pre','post'].includes(saved.phase) && validName(saved.name) && saved.code === code &&
    Array.isArray(saved.answers) && saved.answers.length === questions.length &&
    saved.answers.every((answer,index) => answer === null || (Number.isInteger(answer) && answer >= 0 && answer < questions[index].options.length)) &&
    Number.isInteger(saved.elapsed) && saved.elapsed >= 0 && saved.elapsed <= DURATION_SECONDS && typeof saved.timedOut === 'boolean' &&
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
function phaseName(phase) { return phase === 'pre' ? copy('Ön test', 'Pre-test') : copy('Son test', 'Post-test'); }
function show(id) { for (const name of ['welcome','exam','result']) $(name).hidden = name !== id; }
function countAnswered() { return questions.filter(q => Number.isInteger(state.answers[q.id])).length; }
function selectedPhase() { return document.querySelector('[name=phase]:checked').value; }
function baselineHint() {
  const baseline = read(`baseline:${code}`);
  $('baseline-hint').textContent = baseline ? copy(`Bu tarayıcıda ${code} için başlangıç kaydı var: ${baseline.score}/100. İlk başlangıç puanı karşılaştırma için korunur.`, `This browser has a pre-test result for ${code}: ${baseline.score}/100. The first pre-test score is kept for comparison.`) : selectedPhase() === 'post' ? copy('Bu kod için bu tarayıcıda başlangıç kaydı yok. Bitiş sınavını yine çözebilirsin; otomatik fark hesaplanamaz.', 'This browser has no pre-test result for this code. You can still take the post-test, but a score difference cannot be calculated automatically.') : '';
}

$('participant').value = code;
$('participant-name').value = read('name','');
$('participant-name').addEventListener('input',()=>{$('participant-name').setCustomValidity('');$('start-error').hidden=true;});
const requestedPhase = new URLSearchParams(location.search).get('asama');
if (requestedPhase === 'bitis') document.querySelector('[name=phase][value=post]').checked = true;
for (const el of document.querySelectorAll('[name=phase]')) el.addEventListener('change',baselineHint);
baselineHint();

$('start-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = normalizeName($('participant-name').value);
  if(!validName(name)){$('participant-name').setCustomValidity(copy('Adını ve soyadını yaz (2–80 karakter).', 'Enter your full name (2–80 characters).'));$('participant-name').reportValidity();return;}
  void startAssessment(name, selectedPhase());
});
async function startAssessment(name, phase) {
  if (starting || state) return;
  starting = true;
  $('start-test').disabled = true;
  $('start-error').hidden = true;
  $('start-status').textContent = copy('Sınıf erişimi ve katılımcı kaydı doğrulanıyor…', 'Checking classroom access and your registration…');
  try {
    const api = await persistence();
    const response = await api.registerParticipant({code,name});
    if (response?.saved !== true) throw new Error('Registration not confirmed');
    write('name',name);
    const now = Date.now();
    state = pendingDraft ? {...pendingDraft,name} :
      {version:EXAM_VERSION,code,name,phase,answers:{},index:0,started:now,deadline:now+DURATION_SECONDS*1000,durationSeconds:DURATION_SECONDS,id:crypto.randomUUID()};
    pendingDraft = null;
    for (const el of document.querySelectorAll('[name=phase]')) el.disabled = false;
    $('resume-message').hidden = true;
    result = null;
    begin();
  } catch {
    $('start-error').textContent = copy(
      'Katılımcı kaydı doğrulanamadı. Eğitmeninin sınıf bağlantısını ve adını kontrol edip tekrar dene.',
      'Your registration could not be confirmed. Check your classroom link and name, then try again.',
    );
    $('start-error').hidden = false;
  } finally {
    $('start-status').textContent = '';
    $('start-test').disabled = false;
    starting = false;
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
  }catch{
    if(!isVisible())return;
    $('result-sync').dataset.state='error';$('result-sync').textContent=copy('Eğitmen listesine kayıt doğrulanamadı. Sonucunu indirerek sakla; kaydı tekrar deneyebilirsin.', 'Saving to the trainer’s list could not be confirmed. Download your result to keep a copy, then try saving again.');$('retry-result-sync').hidden=false;
  }finally{inFlight.delete(current.id);}
}
$('retry-result-sync').addEventListener('click',()=>{if(result)syncResult(result);});

function begin() {
  show('exam');
  $('phase-label').textContent = copy(`${phaseName(state.phase).toLocaleUpperCase(language)} DEĞERLENDİRMESİ`, `${phaseName(state.phase).toUpperCase()} ASSESSMENT`);
  $('participant-label').textContent = copy(`${state.name} · ${state.code} · 10 soru · Her doğru 10 puan`, `${state.name} · ${state.code} · 10 questions · 10 points per correct answer`);
  $('exam-sync').textContent = copy('Katılımcı kaydın doğrulandı.', 'Your participant registration was confirmed.');
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
  $('result-storage').textContent=result.stored ? copy(`${result.code} · ${result.phase==='pre'?'Son testte bu tarayıcıyı kullan. Kodun ve ilk ön test puanın korunur.':'Sonucun bu tarayıcıda saklandı.'}`, `${result.code} · ${result.phase==='pre'?'Use this browser for the post-test. Your code and first pre-test score are kept.':'Your result is stored in this browser.'}`) : copy('Bu tarayıcı kayıt yapamadı. Sonucunu indirerek sakla; otomatik karşılaştırma kullanılamayabilir.', 'This browser could not save your result. Download it to keep a copy; automatic comparison may be unavailable.');
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

const storedDraft = draftRead();
const candidate = restoreDraft(storedDraft,{version:EXAM_VERSION,questions,maxSeconds:DURATION_SECONDS});
const draft = candidate?.code === code ? candidate : null;
if (draft) {
  pendingDraft = draft;
  if (draft.name) $('participant-name').value = draft.name;
  document.querySelector(`[name=phase][value=${draft.phase}]`).checked = true;
  for (const el of document.querySelectorAll('[name=phase]')) el.disabled = true;
  $('resume-message').textContent = copy(
    'Yarım kalan sınavın bulundu. Cevapların ve önceki bitiş saatin korunur.',
    'An unfinished test was found. Your answers and original deadline are kept.',
  );
  $('resume-message').hidden = false;
  baselineHint();
  if (validName(draft.name)) void startAssessment(draft.name, draft.phase);
} else if (storedDraft) {
  clearDraft();
  $('resume-message').textContent = copy('Önceki sınav taslağı okunamadı. Yeni bir değerlendirme başlatabilirsin.', 'The previous test draft could not be read. You can start a new assessment.');
  $('resume-message').hidden = false;
}

async function recoverPending() {
  const pending = readPending();
  if (!draft && pending.length) {
    const saved = pending[0];
    const answers = Object.fromEntries(questions.flatMap((question,index) =>
      saved.answers[index] === null ? [] : [[question.id,saved.answers[index]]]));
    const scores = scoreAnswers(answers);
    const baseline = read(`baseline:${saved.code}`);
    const first = saved.phase === 'pre' ? baseline : read(`final:${saved.code}`);
    result = {...saved, answers, ...scores, baseline:baseline?.score ?? null, stored:!!first,
      retake:!!first && first.id !== saved.id, firstScore:first?.score ?? scores.score};
    showResult();
  }
  for (const saved of pending) await syncResult(result?.id === saved.id ? result : saved);
}
if (profile.remoteEnabled) void recoverPending();

import {resolveExamContext} from './exam-context.mjs';
import {applyPageLanguage} from './ui-copy.mjs';
import {enterClassroom} from './classroom.mjs';

const params = new URLSearchParams(location.search);
const language = params.getAll('lang').length === 1 && params.get('lang') === 'en' ? 'en' : 'tr';
const invite = enterClassroom();
const languagePicker = document.querySelector('.language-picker');
const resultView = document.getElementById('result');
applyPageLanguage(language);
for (const locale of ['tr', 'en']) {
  const link = document.getElementById(`language-${locale}`);
  const target = new URL(location.href);
  target.searchParams.delete('lang');
  if (locale === 'en') target.searchParams.set('lang', 'en');
  link.href = target.pathname + target.search;
  if (locale === language) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
  link.addEventListener('click', event => {
    if (resultView.hidden) return;
    event.preventDefault();
    languagePicker.open = false;
    document.getElementById('download-status').textContent = language === 'en'
      ? 'Download your result PDF and return to the start before switching languages.'
      : 'Dili değiştirmeden önce sonuç PDF’sini indir ve başlangıca dön.';
    document.getElementById('download').focus();
  });
}
document.addEventListener('click', event => {
  if (!languagePicker.contains(event.target)) languagePicker.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && languagePicker.open) {
    languagePicker.open = false;
    document.getElementById('language-current').focus();
  }
});
// Language changes on the welcome and exam views keep the active draft.
const themeButton = document.getElementById('theme');
try {
  const saved = JSON.parse(localStorage.getItem('blanchard:theme'));
  if (['light', 'dark'].includes(saved)) document.documentElement.dataset.theme = saved;
} catch {}
function renderThemeControl() {
  const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  themeButton.textContent = current === 'dark' ? (language === 'en' ? '☀ Light theme' : '☀ Açık tema') : (language === 'en' ? '☾ Dark theme' : '☾ Koyu tema');
}
renderThemeControl();
matchMedia('(prefers-color-scheme:light)').addEventListener('change', renderThemeControl);
themeButton.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('blanchard:theme', JSON.stringify(next)); } catch {}
  renderThemeControl();
});
const linkStatus = document.getElementById('link-status');
const error = document.getElementById('link-error');
async function openAssessment() {
  linkStatus.hidden = true;
  try {
    resolveExamContext(location.pathname, location.search);
    document.getElementById('group-label').textContent = language === 'en' ? 'BLANCHARD TÜRKİYE · GROUP 1' : 'BLANCHARD TÜRKİYE · GRUP 1';
    await import('./app.mjs');
    // A restored exam may already be visible. Do not change its view.
    document.getElementById('start-form').hidden = false;
  } catch {
    linkStatus.hidden = false;
    error.textContent = language === 'en'
      ? 'The assessment could not be opened. Check that browser storage is enabled and reopen your classroom link.'
      : 'Değerlendirme açılamadı. Tarayıcı depolamasına izin ver ve sınıf bağlantını yeniden aç.';
  }
}
async function openFromFragment() {
  if (!enterClassroom()) return;
  window.removeEventListener('hashchange', openFromFragment);
  await openAssessment();
}
if (invite) {
  await openAssessment();
} else {
  linkStatus.hidden = false;
  error.textContent = language === 'en'
    ? 'Open the private classroom link your trainer shared in this browser.'
    : 'Eğitmeninin paylaştığı özel sınıf bağlantısını bu tarayıcıda aç.';
  window.addEventListener('hashchange', openFromFragment);
}
document.documentElement.dataset.ready = 'true';

import {resolveExamContext} from './exam-context.mjs';
import {applyPageLanguage} from './ui-copy.mjs';

const params = new URLSearchParams(location.search);
const language = params.getAll('lang').length === 1 && params.get('lang') === 'en' ? 'en' : 'tr';
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
const openDefault = document.getElementById('default-link');
if (language === 'en') openDefault.href = './?lang=en';
try {
  resolveExamContext(location.pathname, location.search);
  document.getElementById('group-label').textContent = language === 'en' ? 'BLANCHARD TÜRKİYE · GROUP 1' : 'BLANCHARD TÜRKİYE · GRUP 1';
  await import('./app.mjs');
  // A restored exam may already be visible. Do not change its view.
  document.getElementById('start-form').hidden = false;
} catch (reason) {
  linkStatus.hidden = false;
  error.textContent = language === 'en'
    ? 'The assessment could not be loaded. Open the default link to try again.'
    : 'Değerlendirme açılamadı. Bağlantını kontrol et veya aşağıdaki düğmeden tekrar aç.';
}
document.documentElement.dataset.ready = 'true';

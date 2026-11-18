import {resolveExamContext} from './exam-context.mjs';
import {applyPageLanguage, groupDate} from './ui-copy.mjs';

const params = new URLSearchParams(location.search);
const language = params.getAll('lang').length === 1 && params.get('lang') === 'en' ? 'en' : 'tr';
applyPageLanguage(language);
const languagePicker = document.querySelector('.language-picker');
for (const locale of ['tr', 'en']) {
  const link = document.getElementById(`language-${locale}`);
  const target = new URL(location.href);
  target.searchParams.delete('lang');
  if (locale === 'en') target.searchParams.set('lang', 'en');
  link.href = target.pathname + target.search;
  if (locale === language) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
  link.addEventListener('click', event => {
    if (document.getElementById('result').hidden) return;
    event.preventDefault();
    languagePicker.open = false;
    const status = document.getElementById('download-status');
    status.textContent = language === 'en'
      ? 'To keep this result, download your PDF and check that it has been saved. Then return to the start to change the language.'
      : 'Sonucunu korumak için PDF’yi indir ve kaydın tamamlandığını kontrol et. Dili değiştirmek için ardından başlangıca dön.';
    status.tabIndex = -1;
    status.focus();
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
// One control for both landing and exam views; language links keep the active draft.
const themeButton = document.getElementById('theme');
try {
  const saved = JSON.parse(localStorage.getItem('ozak:theme'));
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
  try { localStorage.setItem('ozak:theme', JSON.stringify(next)); } catch {}
  renderThemeControl();
});
const groupPicker = document.getElementById('group-picker');
const error = document.getElementById('link-error');
let profile;
try {
  if (params.has('grup') || params.has('asama')) profile = resolveExamContext(location.pathname, location.search);
} catch (reason) {
  error.hidden = false;
  error.textContent = language === 'en' ? 'This group or assessment link is invalid. Open your trainer’s link or choose your group below.' : reason.message;
}
if (profile) {
  groupPicker.hidden = true;
  document.getElementById('group-label').textContent = `${language === 'en' ? 'GROUP' : 'GRUP'} ${profile.group} · ${groupDate(profile.group, language)}`;
  try {
    await import('./app.mjs');
    // A restored exam may already be visible. Do not change its view.
    document.getElementById('start-form').hidden = false;
  } catch {
    groupPicker.hidden = false;
    error.hidden = false;
    error.textContent = language === 'en' ? 'The assessment could not be loaded. Refresh the page to try again.' : 'Değerlendirme yüklenemedi. Sayfayı yenileyerek tekrar dene.';
  }
}
document.documentElement.dataset.ready = 'true';

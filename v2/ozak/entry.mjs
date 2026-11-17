import {resolveExamContext} from './exam-context.mjs';

const params = new URLSearchParams(location.search);
const groupPicker = document.getElementById('group-picker');
const error = document.getElementById('link-error');
let profile;
try {
  if (params.has('grup') || params.has('asama')) profile = resolveExamContext(location.pathname, location.search);
} catch (reason) {
  error.hidden = false;
  error.textContent = reason.message;
}

if (profile) {
  groupPicker.hidden = true;
  document.getElementById('group-label').textContent = `ARALIK 2026 · GRUP ${profile.group}`;
  // Keep the form hidden until all handlers and the question set are ready.
  try {
    await import('./app.mjs');
    document.getElementById('start-form').hidden = false;
  } catch {
    groupPicker.hidden = false;
    error.hidden = false;
    error.textContent = 'Değerlendirme yüklenemedi. Sayfayı yenileyerek tekrar dene.';
  }
} else {
  const button = document.getElementById('theme');
  button.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme:dark)').matches);
    document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  });
}

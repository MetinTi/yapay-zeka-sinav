// Participant-facing report data only. Scoring, answer keys and backend payloads stay separate.
export function createReportModel(result, profile, language = 'tr') {
  const english = language === 'en';
  const locale = english ? 'en-GB' : 'tr-TR';
  const copy = (tr, en) => english ? en : tr;
  const post = result.phase === 'post';
  const phase = post ? copy('Son test', 'Post-test') : copy('Ön test', 'Pre-test');
  const date = typeof result.completed === 'string' ? new Date(result.completed) : new Date(NaN);
  const completed = Number.isFinite(date.getTime()) ? date.toISOString() : null;
  const dateLabel = completed ? `${new Intl.DateTimeFormat(locale, {
    timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).format(date)} (${copy('Türkiye saati', 'Türkiye time')})` : copy('Tamamlanma tarihi bulunamadı', 'Completion date unavailable');
  const elapsed = Number.isFinite(result.elapsed) && result.elapsed >= 0 ? Math.floor(result.elapsed) : null;
  const elapsedLabel = elapsed === null ? copy('Süre bilgisi bulunamadı', 'Duration unavailable') : copy(`${Math.floor(elapsed / 60)} dk ${elapsed % 60} sn`, `${Math.floor(elapsed / 60)} min ${elapsed % 60} sec`);
  const hasBaseline = typeof result.baseline === 'number' && Number.isFinite(result.baseline) && result.baseline >= 0 && result.baseline <= 100;
  const comparison = post && hasBaseline ? {baseline: result.baseline, current: result.score, delta: result.score - result.baseline} : null;
  const notices = [];
  if (result.remoteSaved === true) notices.push(copy('Sonucun eğitmenin özel listesine kaydedildi.', 'Your result has been saved to your trainer’s private list.'));
  else notices.push(copy('Eğitmen listesine kayıt henüz doğrulanmadı. Bu dosyayı sonuç kopyan olarak sakla.', 'Saving to your trainer’s list has not yet been confirmed. Keep this file as your result copy.'));
  if (!post) notices.push(copy('Son testte aynı katılımcı kodunu ve tarayıcıyı kullan.', 'Use the same participant code and browser for the post-test.'));
  else if (comparison) notices.push(copy('Puan karşılaştırması bu tarayıcıdaki ön test kaydına dayanır.', 'The score comparison is based on the pre-test record in this browser.'));
  else notices.push(copy('Bu tarayıcıda ön test kaydı bulunamadı; puan farkı hesaplanmadı.', 'No pre-test record was found in this browser; a score difference was not calculated.'));
  if (result.retake === true) {
    const first = typeof result.firstScore === 'number' && Number.isFinite(result.firstScore) ? `${result.firstScore}/100` : copy('ilk kayıtlı değer', 'the first recorded value');
    notices.push(copy(`Bu bir tekrar denemesidir. Bu tarayıcıdaki ilk ${phase.toLocaleLowerCase('tr-TR')} puanın ${first} olarak korunur. Bu dosya mevcut denemeni gösterir; ilk kaydın yerine geçmez.`, `This is a repeat attempt. Your first ${phase.toLowerCase()} score in this browser remains ${first}. This file shows the current attempt and does not replace the first record.`));
  }
  if (result.timedOut === true) notices.push(copy('Test, süre dolduğu için otomatik tamamlandı.', 'The test was completed automatically when time ran out.'));
  return {
    locale,
    title: copy('Yapay Zekâ Eğitimi Değerlendirme Sonucu', 'AI Training Assessment Result'),
    phase,
    name: String(result.name ?? ''), code: String(result.code ?? ''),
    group: String(profile.group ?? profile.context?.group ?? ''),
    completed, dateLabel, elapsedLabel,
    score: result.score, correct: result.correct, wrong: result.wrong, empty: result.empty,
    comparison, notices
  };
}

export function reportFilename(result, profile) {
  const safe = (value, maxLength, fallback) => String(value ?? '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, maxLength).replace(/^-+|-+$/g, '') || fallback;
  const group = safe(profile.group ?? profile.context?.group, 12, 'GRUP');
  const code = safe(result.code, 24, 'KATILIMCI');
  return `OZAK-${group}-${code}-${result.phase === 'post' ? 'post' : 'pre'}.pdf`;
}

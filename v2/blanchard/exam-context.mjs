// A shareable context identifies an exam; it is not an authentication mechanism.
export function resolveExamContext(pathname, search = '') {
  if (!/\/blanchard(?:\/(?:index\.html)?)?$/.test(pathname)) throw new Error('Blanchard değerlendirmesi için kurum bağlantısını aç.');
  const params = new URLSearchParams(search);
  const group = '1';
  const groups = params.getAll('grup');
  if (groups.length > 1 || (groups.length && groups[0] !== group)) {
    throw new Error('Eğitmeninin paylaştığı Blanchard bağlantısını aç.');
  }
  const phases = params.getAll('asama');
  if (phases.length > 1 || (phases.length && !['baslangic', 'bitis'].includes(phases[0]))) {
    throw new Error('Değerlendirme aşaması geçersiz. Grubunun başlangıç veya bitiş bağlantısını aç.');
  }
  const language = params.getAll('lang').length === 1 && params.get('lang') === 'en' ? 'en' : 'tr';
  const version = 'blanchard-ai-awareness-202612-v1';
  return {
    kind: 'blanchard', version, group, language,
    storagePrefix: `blanchard:2026-12:${group}:${version}:`,
    remoteEnabled: true, allowEmail: false,
    title: language === 'en' ? 'Blanchard Türkiye · AI Training' : 'Blanchard Türkiye · Yapay Zeka Eğitimi',
    trainingTitle: language === 'en' ? 'December 2026 · AI Awareness Training' : 'Aralık 2026 · Yapay Zeka Farkındalık Eğitimi',
    context: {organization: 'blanchard', training: '2026-12', group}
  };
}

export async function loadExam(pathname, search = '') {
  const profile = resolveExamContext(pathname, search);
  const content = await import(profile.language === 'en' ? '../ozak/questions.en.mjs' : '../ozak/questions.mjs');
  if (content.EXAM_VERSION !== 'ozak-ai-awareness-202612-v2') throw new Error('Soru seti sürümü uyuşmuyor.');
  return {...profile, questions: content.questions, scoreAnswers: content.scoreAnswers, durationSeconds: content.DURATION_SECONDS};
}

// A shareable context identifies an exam; it is not an authentication mechanism.
export function resolveExamContext(pathname, search = '') {
  if (!/\/ozak\/(?:index\.html)?$/.test(pathname)) throw new Error('Özak değerlendirmesi için kurum bağlantısını aç.');
  const params = new URLSearchParams(search);
  const group = params.get('grup');
  if (params.getAll('grup').length !== 1 || !['1', '2', '3'].includes(group)) {
    throw new Error('Eğitmeninin paylaştığı grup bağlantısını aç veya grubunu aşağıdan seç.');
  }
  const phases = params.getAll('asama');
  if (phases.length > 1 || (phases.length && !['baslangic', 'bitis'].includes(phases[0]))) {
    throw new Error('Değerlendirme aşaması geçersiz. Grubunun başlangıç veya bitiş bağlantısını aç.');
  }
  const language = params.getAll('lang').length === 1 && params.get('lang') === 'en' ? 'en' : 'tr';
  const version = 'ozak-ai-awareness-202612-v2';
  return {
    kind: 'ozak', version, group, language,
    storagePrefix: `ozak:2026-12:${group}:${version}:`,
    remoteEnabled: true, allowEmail: false,
    title: language === 'en' ? 'Özak Global Holding · AI Training' : 'Özak Global Holding · Yapay Zekâ Eğitimi',
    trainingTitle: language === 'en' ? 'December 2026 · AI Awareness Training' : 'Aralık 2026 · Yapay Zekâ Farkındalık Eğitimi',
    context: {organization: 'ozak', training: '2026-12', group}
  };
}

export async function loadExam(pathname, search = '') {
  const profile = resolveExamContext(pathname, search);
  const content = await import(profile.language === 'en' ? './questions.en.mjs' : './questions.mjs');
  if (content.EXAM_VERSION !== profile.version) throw new Error('Soru seti sürümü uyuşmuyor.');
  return {...profile, questions: content.questions, scoreAnswers: content.scoreAnswers, durationSeconds: content.DURATION_SECONDS};
}

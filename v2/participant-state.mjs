// Local participant identity and resumable timer helpers. No network access.
export const normalizeName = value => typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ') : '';
export const nameKey = value => normalizeName(value).toLocaleLowerCase('tr-TR');
export const normalizeCode = value => typeof value === 'string' ? value.trim().toUpperCase() : '';
export const validCode = value => /^[A-Z0-9-]{4,24}$/.test(value);
export const validName = value => {
  const name = normalizeName(value);
  return name.length >= 2 && name.length <= 80 && !/[\p{Cc}\p{Cf}]/u.test(name) && (name.match(/\p{L}/gu) || []).length >= 2;
};
export function participantIndex(value) {
  if (!Array.isArray(value)) return [];
  const records = new Map();
  for (const record of value) {
    if (record && validCode(record.code) && validName(record.name)) {
      records.set(record.code, {code: record.code, name: normalizeName(record.name), updated: typeof record.updated === 'string' ? record.updated : ''});
    }
  }
  return [...records.values()];
}
export function rememberParticipant(value, person, updated = new Date().toISOString()) {
  const records = participantIndex(value);
  const code = normalizeCode(person.code), name = normalizeName(person.name);
  if (!validCode(code) || !validName(name)) throw new Error('Ad ve katılımcı kodunu kontrol et.');
  const previous = records.find(record => record.code === code);
  if (previous && nameKey(previous.name) !== nameKey(name)) throw new Error('Bu kod bu tarayıcıda başka bir adla kayıtlı. Kendi kodunu seç veya yeni kod oluştur.');
  return [...records.filter(record => record.code !== code), {code, name, updated}];
}
export function findParticipants(value, name) {
  const key = nameKey(name);
  return validName(name) ? participantIndex(value).filter(record => nameKey(record.name) === key) : [];
}
export function restoreDraft(value, {version, questions, maxSeconds}) {
  if (!value || value.version !== version || !['pre','post'].includes(value.phase) || !validCode(value.code)) return null;
  if (!Number.isInteger(value.index) || value.index < 0 || value.index >= questions.length || typeof value.id !== 'string' || !value.id) return null;
  if (!Number.isFinite(value.started) || value.started < 0 || !Number.isFinite(value.deadline) || value.deadline <= value.started || value.deadline-value.started > maxSeconds*1000+1000) return null;
  if (!value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)) return null;
  for (const [id, answer] of Object.entries(value.answers)) {
    const question = questions.find(q => q.id === id);
    if (!question || !Number.isInteger(answer) || answer < 0 || answer >= question.options.length) return null;
  }
  if (value.name !== undefined && value.name !== '' && !validName(value.name)) return null;
  // Legacy 8-minute drafts keep their original deadline; refresh never adds time.
  const durationSeconds = Math.min(maxSeconds, Math.round((value.deadline-value.started)/1000));
  if (durationSeconds <= 0) return null;
  return {...value, name: normalizeName(value.name), answers:{...value.answers}, durationSeconds};
}
export const secondsRemaining = (draft, now = Date.now()) => Math.max(0, Math.ceil((draft.deadline-now)/1000));
export const elapsedSeconds = (draft, now = Date.now()) => Math.min(draft.durationSeconds, Math.max(0, Math.floor((now-draft.started)/1000)));

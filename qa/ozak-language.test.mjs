import test from 'node:test';
import assert from 'node:assert/strict';
import * as turkish from '../v2/ozak/questions.mjs';
import * as english from '../v2/ozak/questions.en.mjs';
import {loadExam, resolveExamContext} from '../v2/ozak/exam-context.mjs';
import {restoreDraft, secondsRemaining} from '../v2/participant-state.mjs';

test('English renders the same ten assessment items and answer identities', () => {
  assert.equal(english.EXAM_VERSION, turkish.EXAM_VERSION);
  assert.equal(english.DURATION_SECONDS, 600);
  assert.equal(english.questions.length, 10);
  assert.deepEqual(english.questions.map(q => q.id), turkish.questions.map(q => q.id));
  assert.deepEqual(english.questions.map(q => q.correct), turkish.questions.map(q => q.correct));
  assert.deepEqual(english.questions.map(q => q.sourceId), turkish.questions.map(q => q.sourceId));
  english.questions.forEach((question, index) => {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    for (const field of ['topic', 'text', 'explanation', 'outcome']) {
      assert.ok(question[field]?.trim());
      assert.notEqual(question[field], turkish.questions[index][field]);
    }
    const languageNeutralOptions = new Set(['Vision, Value, Verify, Volume, Velocity', 'Video, Voice, Visual, Virtual, Verified']);
    question.options.forEach((option, i) => {
      assert.ok(option.trim());
      if (question.sourceId === 'web-010' && languageNeutralOptions.has(option)) assert.equal(option, turkish.questions[index].options[i]);
      else assert.notEqual(option, turkish.questions[index].options[i]);
    });
  });
  const allCorrect = Object.fromEntries(english.questions.map(q => [q.id, q.correct]));
  assert.deepEqual(english.scoreAnswers(allCorrect), {score: 100, correct: 10, wrong: 0, empty: 0});
  const mixed = {...allCorrect, [english.questions[0].id]: (english.questions[0].correct + 1) % 4, [english.questions[1].id]: undefined};
  assert.deepEqual(english.scoreAnswers(mixed), {score: 80, correct: 8, wrong: 1, empty: 1});
  assert.deepEqual(english.scoreAnswers(mixed), turkish.scoreAnswers(mixed));
});

test('Turkish is default; English changes presentation without splitting participant identity', async () => {
  for (const group of ['1', '2', '3']) {
    for (const phase of ['baslangic', 'bitis']) {
      const query = `?grup=${group}&asama=${phase}`;
      const tr = await loadExam('/ozak/', query);
      const en = await loadExam('/ozak/', `${query}&lang=en`);
      assert.equal(tr.language, 'tr');
      assert.equal(en.language, 'en');
      assert.equal(en.questions[0].text, english.questions[0].text);
      assert.equal(tr.questions[0].text, turkish.questions[0].text);
      assert.equal(en.storagePrefix, tr.storagePrefix);
      assert.equal(en.version, tr.version);
      assert.equal(en.durationSeconds, tr.durationSeconds);
      assert.deepEqual(en.context, tr.context);
      assert.equal(en.remoteEnabled, true);
      assert.equal(en.allowEmail, false);
    }
  }
  for (const lang of ['', 'fr', 'EN', '<script>']) {
    assert.equal(resolveExamContext('/ozak/', `?grup=1&lang=${encodeURIComponent(lang)}`).language, 'tr');
  }
});

test('switching language preserves an active attempt, answer selection and absolute deadline', async () => {
  const tr = await loadExam('/ozak/', '?grup=1');
  const en = await loadExam('/ozak/', '?grup=1&lang=en');
  const original = {version: tr.version, id: 'qa_language_123', phase: 'pre', code: 'AI-123456', name: 'İpek Işık', answers: {'web-009': 1}, index: 1, started: 100000, deadline: 700000};
  const restored = restoreDraft(original, {version: en.version, questions: en.questions, maxSeconds: en.durationSeconds});
  assert.ok(restored);
  assert.equal(restored.id, original.id);
  assert.equal(restored.phase, original.phase);
  assert.equal(restored.answers['web-009'], 1);
  assert.equal(restored.index, 1);
  assert.equal(secondsRemaining(restored, 220000), 480);
});

test('English uses the same dedicated backend payload, with no new language or schedule data', async () => {
  const prior = {location: globalThis.location, document: globalThis.document, window: globalThis.window};
  const captured = [];
  globalThis.window = {};
  globalThis.document = {createElement: () => ({remove() {}}), head: {append(script) {
    const url = new URL(script.src);
    captured.push({action: url.searchParams.get('action'), payload: JSON.parse(url.searchParams.get('data'))});
    globalThis.window[url.searchParams.get('callback')]({status: 'ok', saved: true});
  }}};
  try {
    const {createPersistence} = await import('../v2/ozak/persistence.mjs');
    const api = createPersistence('https://script.google.com/macros/s/qa_language_only/exec');
    const identity = {name: 'QA Language', code: 'QA-LANGUAGE'};
    const attempt = {...identity, id: 'qa_language_123', phase: 'post', score: 80, correct: 8, wrong: 1, empty: 1, elapsed: 120, timedOut: false, completed: '2026-11-17T12:00:00.000Z'};
    for (const search of ['?grup=2&asama=bitis', '?grup=2&asama=bitis&lang=en']) {
      globalThis.location = {pathname: '/ozak/', search};
      await api.registerParticipant(identity);
      await api.saveResult(attempt);
    }
    assert.deepEqual(captured.slice(0, 2), captured.slice(2));
    assert.deepEqual(captured[3].payload.context, {organization: 'ozak', training: '2026-12', group: '2'});
    assert.equal('language' in captured[3].payload, false);
    assert.equal('date' in captured[3].payload.context, false);
    assert.equal('answers' in captured[3].payload, false);
  } finally {
    Object.assign(globalThis, prior);
  }
});

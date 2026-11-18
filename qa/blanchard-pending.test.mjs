import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import * as participant from '../v2/participant-state.mjs';
import { loadExam } from '../v2/blanchard/exam-context.mjs';

const source = await readFile(new URL('../v2/blanchard/app.mjs', import.meta.url), 'utf8');
const appSource = source.replace(/^import .+;$/gm, '')
  .replace('let persistenceModule;', 'let persistenceModule = Promise.resolve(mockPersistence);');
const run = new vm.Script(`(async () => {
  ${appSource}
  return {finish(attempt) { state = attempt; complete(false); }};
})()`);
const prefix = 'blanchard:2026-12:1:blanchard-ai-awareness-202612-v1:';
const otherKey = 'ozak:2026-12:1:ozak-ai-awareness-202612-v2:pending-result:other';
const read = (storage, key) => JSON.parse(storage.getItem(key));
const flush = () => new Promise(resolve => setImmediate(resolve));

function storage(initial = {}) {
  return Object.assign(Object.create({
    getItem(key) { return this[key] ?? null; },
    setItem(key, value) { this[key] = value; },
    removeItem(key) { delete this[key]; }
  }), initial);
}

async function start({ localStorage, sessionStorage, mockPersistence }) {
  const elements = new Map();
  const node = (id) => {
    if (!elements.has(id)) elements.set(id, {
      hidden: true, value: '', dataset: {}, style: { setProperty() {} },
      addEventListener() {}, replaceChildren() {}, focus() {},
    });
    return elements.get(id);
  };
  const app = await run.runInNewContext({
    ...participant, loadExam, mockPersistence, localStorage, sessionStorage,
    URLSearchParams, location: { pathname: '/blanchard/', search: '' },
    crypto: webcrypto, window: { scrollTo() {} }, clearInterval,
    document: { getElementById: node, querySelectorAll: () => [], querySelector: () => ({ value: 'pre' }) },
  });
  return { app, node };
}

test('Blanchard preserves an unacknowledged attempt across reload and clears it only after the same submission is accepted', async () => {
  const localStorage = storage();
  const sessionStorage = storage({ [otherKey]: 'separate scope' });
  const sent = [];
  let acknowledge;
  const saveResult = (result) => {
    sent.push(JSON.parse(JSON.stringify(result)));
    return new Promise(resolve => { acknowledge = resolve; });
  };
  const settings = { localStorage, sessionStorage, mockPersistence: { saveResult } };
  const id = webcrypto.randomUUID();
  const pendingKey = prefix + 'pending-result:' + id;
  const { app, node } = await start(settings);
  app.finish({
    id, version: 'blanchard-ai-awareness-202612-v1', code: 'QA-ABC123', name: 'Örnek Katılımcı',
    phase: 'pre', answers: { 'web-009': 1 }, index: 0, started: Date.now() - 10_000, durationSeconds: 600,
  });
  await flush();
  const queued = read(sessionStorage, pendingKey);
  assert.deepEqual(sent, [queued]);
  assert.equal(queued.id, id);
  assert.equal('answers' in queued, false);
  acknowledge({ saved: false });
  await flush();
  assert.equal(node('retry-result-sync').hidden, false);
  assert.deepEqual(read(sessionStorage, pendingKey), queued);

  const reopened = await start(settings);
  await flush();
  assert.deepEqual(sent, [queued, queued]);
  assert.equal(reopened.node('result').hidden, false);
  assert.equal(reopened.node('result-sync').dataset.state, 'pending');
  assert.deepEqual(read(sessionStorage, pendingKey), queued);
  acknowledge({ saved: true });
  await flush();
  assert.equal(reopened.node('result-sync').dataset.state, 'saved');
  assert.equal(sessionStorage.getItem(pendingKey), null);
  assert.equal(sessionStorage.getItem(otherKey), 'separate scope');
});

test('Blanchard rejects expired or malformed snapshots and leaves foreign namespaces untouched', async () => {
  const validTime = new Date(Date.now() - 60_000).toISOString();
  const invalid = [
    { completed: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
    { completed: validTime.replace(/\.\d+Z$/, 'Z') },
    { completed: validTime.replace(/Z$/, '+00:00') },
    { score: 41 }, { correct: '4' }, { wrong: -1 }, { empty: 1 }, { elapsed: 601 },
  ];
  const sessionStorage = storage({ [otherKey]: 'separate scope' });
  for (const change of invalid) {
    const id = webcrypto.randomUUID();
    sessionStorage.setItem(prefix + 'pending-result:' + id, JSON.stringify({
      id, version: 'blanchard-ai-awareness-202612-v1', name: 'Örnek Katılımcı', code: 'QA-ABC123', phase: 'pre',
      score: 40, correct: 4, wrong: 6, empty: 0, elapsed: 100, timedOut: false, completed: validTime, ...change,
    }));
  }
  let submissions = 0;
  await start({ localStorage: storage(), sessionStorage, mockPersistence: { saveResult: () => { submissions++; } } });
  await flush();
  assert.equal(submissions, 0);
  assert.deepEqual(Object.keys(sessionStorage), [otherKey]);
  assert.equal(sessionStorage.getItem(otherKey), 'separate scope');
});

test('Blanchard allows switching language until a result is visible and then protects the PDF', async () => {
  const entry = await readFile(new URL('../v2/blanchard/entry.mjs', import.meta.url), 'utf8');
  const cleanEntry = entry.replace(/^import .+;$/gm, '').replace("await import('./app.mjs');", '');
  const entryRun = new vm.Script(`(async () => { ${cleanEntry} })()`);
  for (const [locale, guidance] of [
    ['tr', 'Dili değiştirmeden önce sonuç PDF’sini indir ve başlangıca dön.'],
    ['en', 'Download your result PDF and return to the start before switching languages.'],
  ]) {
    const elements = new Map();
    const node = (id) => {
      if (!elements.has(id)) elements.set(id, {
        hidden: true, open: true, focused: false, handlers: {},
        setAttribute() {}, removeAttribute() {},
        addEventListener(name, handler) { this.handlers[name] = handler; },
        focus() { this.focused = true; },
      });
      return elements.get(id);
    };
    await entryRun.runInNewContext({
      URL, URLSearchParams, applyPageLanguage() {}, resolveExamContext() {},
      matchMedia: () => ({ matches: true, addEventListener() {} }),
      localStorage: storage(), location: new URL(`https://example.test/blanchard/?lang=${locale}`),
      document: { getElementById: node, querySelector: node, addEventListener() {}, documentElement: { dataset: {} } },
    });
    const link = node(locale === 'en' ? 'language-tr' : 'language-en');
    let prevented = false;
    const event = { preventDefault() { prevented = true; } };
    link.handlers.click(event);
    assert.equal(prevented, false);
    node('result').hidden = false;
    link.handlers.click(event);
    assert.equal(prevented, true);
    assert.equal(node('download-status').textContent, guidance);
    assert.equal(node('download').focused, true);
    assert.equal(node('.language-picker').open, false);
  }
});

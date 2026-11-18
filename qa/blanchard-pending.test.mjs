import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import * as participant from '../v2/participant-state.mjs';
import { loadExam } from '../v2/blanchard/exam-context.mjs';
import { deviceIdentity, enterClassroom, savedClassroom } from '../v2/blanchard/classroom.mjs';
import { createPersistence } from '../v2/blanchard/persistence.mjs';

const source = await readFile(new URL('../v2/blanchard/app.mjs', import.meta.url), 'utf8');
const appSource = source.replace(/^import .+;$/gm, '')
  .replace('let persistenceModule;', 'let persistenceModule = Promise.resolve(mockPersistence);');
const run = new vm.Script(`(async () => {
  ${appSource}
  return {finish(attempt) { state = attempt; complete(false); }, startAssessment};
})()`);
const prefix = 'blanchard:2026-12:1:blanchard-ai-awareness-202612-v1:';
const otherKey = 'ozak:2026-12:1:ozak-ai-awareness-202612-v2:pending-result:other';
const invite = 'a'.repeat(64);
const deviceSecret = 'b'.repeat(64);
const code = 'AI-' + createHash('sha256').update(deviceSecret).digest('hex').slice(0,20).toUpperCase();
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
  const element = () => ({
    hidden: true, value: '', dataset: {}, children: [], style: { setProperty() {} }, classList: { toggle() {} },
    addEventListener() {}, setAttribute() {}, focus() {}, replaceChildren() { this.children = []; },
    append(...children) { this.children.push(...children); },
  });
  const node = (id) => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  const app = await run.runInNewContext({
    ...participant, loadExam, mockPersistence, localStorage, sessionStorage,
    savedClassroom: () => invite, deviceIdentity: async () => ({ code, deviceSecret }),
    URLSearchParams, location: { pathname: '/blanchard/', search: '' },
    crypto: webcrypto, window: { scrollTo() {} }, clearInterval, setInterval: () => 0,
    document: { getElementById: node, querySelectorAll: () => [], querySelector: selector => {
      const match = node(selector);
      match.value = 'pre';
      return match;
    }, createElement: element },
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
    id, version: 'blanchard-ai-awareness-202612-v1', code, name: 'Örnek Katılımcı',
    phase: 'pre', answers: { 'web-009': 1 }, index: 0, started: Date.now() - 10_000, durationSeconds: 600,
  });
  await flush();
  const queued = read(sessionStorage, pendingKey);
  assert.deepEqual(sent, [queued]);
  assert.equal(queued.id, id);
  assert.deepEqual(queued.answers, [1,...Array(9).fill(null)]);
  assert.deepEqual(Object.keys(queued).sort(), ['answers','code','completed','elapsed','id','name','phase','timedOut','version']);
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
    { answers: [0] }, { answers: Array(10).fill(4) }, { answers: Array(10).fill('0') }, { elapsed: 601 },
    { code:'AI-OTHER-DEVICE' },
  ];
  const sessionStorage = storage({ [otherKey]: 'separate scope' });
  for (const change of invalid) {
    const id = webcrypto.randomUUID();
    sessionStorage.setItem(prefix + 'pending-result:' + id, JSON.stringify({
      id, version: 'blanchard-ai-awareness-202612-v1', name: 'Örnek Katılımcı', code, phase: 'pre',
      answers: Array(10).fill(null), elapsed: 100, timedOut: false, completed: validTime, ...change,
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
      enterClassroom: () => invite,
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

test('classroom opens from the fragment, scrubs the credential and retains only the current tab session', () => {
  const session = storage();
  const replaced = [];
  const history = { state: {}, replaceState(_state,_unused,url) { replaced.push(url); } };
  const publicUrl = 'https://example.test/blanchard/?lang=en';
  assert.equal(enterClassroom(new URL(publicUrl),session,history),'');
  assert.equal(enterClassroom(new URL(publicUrl + '#sinif=' + invite + '&section=main'),session,history),invite);
  assert.deepEqual(replaced,['/blanchard/?lang=en#section=main']);
  assert.equal(savedClassroom(session),invite);
  assert.equal(enterClassroom(new URL(publicUrl),session,history),invite);
  assert.equal(enterClassroom(new URL(publicUrl + '#sinif=' + invite + '&sinif=' + invite),session,history),'');
  assert.equal(replaced.at(-1),'/blanchard/?lang=en');
});

test('the automatic code is derived from the stable private browser identity', async () => {
  const deviceStore = storage();
  const original = await deviceIdentity(deviceStore);
  assert.match(original.deviceSecret,/^[a-f0-9]{64}$/);
  assert.equal(original.code,'AI-' + createHash('sha256').update(original.deviceSecret).digest('hex').slice(0,20).toUpperCase());
  assert.deepEqual(await deviceIdentity(deviceStore),original);
  assert.deepEqual(Object.values(deviceStore),[original.deviceSecret]);
});

test('results and credentials go only in the POST body and client scores are never sent', async () => {
  const profile = await loadExam('/blanchard/','');
  const url = 'https://script.google.com/macros/s/mock-exam/exec';
  const api = createPersistence(url,{invite,deviceSecret},profile);
  const requests = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (target,options) => {
    requests.push({ target, options, body:JSON.parse(options.body) });
    return {ok:true,json:async()=>({status:'ok',saved:requests.length===2})};
  };
  try {
    const identity = {name:'Örnek Katılımcı',code};
    assert.deepEqual(await api.registerParticipant(identity),{saved:false});
    const answers = [0,1,2,3,...Array(6).fill(null)];
    const completed = new Date().toISOString();
    const id = webcrypto.randomUUID();
    assert.deepEqual(await api.saveResult({...identity,answers,id,phase:'pre',elapsed:6,timedOut:false,completed,score:70,correct:7}),{saved:true});
    const common = {...identity,context:profile.context,version:profile.version,invite,deviceSecret};
    assert.deepEqual(requests.map(request=>request.body),[
      {action:'register-v2',data:common},
      {action:'result-v2',data:{...common,id,phase:'pre',answers,elapsed:6,timedOut:false,clientCompletedAt:completed}},
    ]);
    for (const {target,options} of requests) {
      assert.equal(target,url);
      assert.deepEqual(options.headers,{'Content-Type':'text/plain;charset=UTF-8'});
      assert.equal(options.method,'POST');
      assert.equal(options.credentials,'omit');
      assert.equal(options.referrerPolicy,'no-referrer');
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Blanchard starts the timer only after classroom registration succeeds', async () => {
  const sent = [];
  let respond;
  const registerParticipant = (identity) => {
    sent.push(JSON.parse(JSON.stringify(identity)));
    return new Promise(resolve => { respond = resolve; });
  };
  const sessionStorage = storage(), localStorage = storage();
  const {app,node} = await start({sessionStorage,localStorage,mockPersistence:{registerParticipant}});
  assert.equal(node('participant').value,code);
  const first = app.startAssessment('Örnek Katılımcı','pre');
  await flush();
  assert.equal(node('exam').hidden,true);
  assert.equal(node('start-test').disabled,true);
  respond({saved:false});
  await first;
  assert.equal(node('exam').hidden,true);
  assert.equal(node('start-error').hidden,false);
  const second = app.startAssessment('Örnek Katılımcı','pre');
  await flush();
  respond({saved:true});
  await second;
  assert.equal(node('exam').hidden,false);
  assert.deepEqual(sent,[{name:'Örnek Katılımcı',code},{name:'Örnek Katılımcı',code}]);
  const draft = read(sessionStorage,prefix+'draft');
  assert.equal(draft.code,code);
  assert.equal('invite' in draft,false);
  assert.equal('deviceSecret' in draft,false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createReportModel, reportFilename} from '../v2/ozak/report-model.mjs';

const profile = {group: '2', context: {organization: 'ozak', training: '2026-12', group: '2'}};
const result = {phase: 'pre', name: 'İpek Işık Çığ Öztürk Şen', code: 'AI-123456', completed: '2026-11-17T12:08:00.000Z', elapsed: 185, score: 90, correct: 9, wrong: 1, empty: 0, baseline: null, remoteSaved: true, answers: {'ai-limits': 1}};

test('participant report preserves Turkish names, actual completion time and result totals', () => {
  const model = createReportModel(result, profile);
  assert.equal(model.locale, 'tr-TR');
  assert.equal(model.name, result.name);
  assert.equal(model.code, result.code);
  assert.equal(model.group, '2');
  assert.equal(model.phase, 'Ön test');
  assert.match(model.title, /Değerlendirme Sonucu/);
  assert.equal(model.completed, result.completed);
  assert.match(model.dateLabel, /17 Kasım 2026/);
  assert.match(model.dateLabel, /15:08/);
  assert.match(model.dateLabel, /Türkiye saati/);
  assert.equal(model.elapsedLabel, '3 dk 5 sn');
  assert.deepEqual([model.score, model.correct, model.wrong, model.empty], [90, 9, 1, 0]);
  assert.equal(model.comparison, null);
  assert.match(model.notices.join(' '), /aynı katılımcı kodunu/);
  for (const key of ['answers', 'questions', 'correctAnswer', 'version', 'context']) assert.equal(key in model, false);
});

test('English report uses the same Türkiye instant across a UTC calendar boundary', () => {
  const model = createReportModel({...result, completed: '2026-11-17T22:30:00Z'}, profile, 'en');
  assert.equal(model.locale, 'en-GB');
  assert.equal(model.phase, 'Pre-test');
  assert.match(model.dateLabel, /18 November 2026/);
  assert.match(model.dateLabel, /01:30/);
  assert.match(model.dateLabel, /Türkiye time/);
  assert.equal(model.elapsedLabel, '3 min 5 sec');
  assert.match(model.notices[0], /has been saved/);
});

test('zero baseline is a real score; absent or invalid baseline is never treated as zero', () => {
  for (const language of ['tr', 'en']) {
    const zero = createReportModel({...result, phase: 'post', baseline: 0}, profile, language);
    assert.deepEqual(zero.comparison, {baseline: 0, current: 90, delta: 90});
    for (const baseline of [null, undefined, '', '0', NaN]) {
      const absent = createReportModel({...result, phase: 'post', baseline}, profile, language);
      assert.equal(absent.comparison, null);
      assert.match(absent.notices.join(' '), language === 'tr' ? /ön test kaydı bulunamadı/ : /No pre-test record/);
    }
  }
  assert.deepEqual(createReportModel({...result, phase: 'post', score: 60, baseline: 90}, profile).comparison, {baseline: 90, current: 60, delta: -30});
});

test('save status requires a true acknowledgement and retakes describe the browser first score', () => {
  for (const remoteSaved of [false, null, undefined, 'true', 1]) {
    const model = createReportModel({...result, remoteSaved}, profile);
    assert.match(model.notices[0], /henüz doğrulanmadı/);
    assert.doesNotMatch(model.notices[0], /kaydedildi/);
  }
  const repeat = createReportModel({...result, phase: 'post', baseline: 40, retake: true, firstScore: 70, timedOut: true}, profile, 'en');
  assert.equal(repeat.score, 90);
  assert.match(repeat.notices.join(' '), /first post-test score in this browser remains 70\/100/);
  assert.match(repeat.notices.join(' '), /does not replace the first record/);
  assert.match(repeat.notices.join(' '), /automatically when time ran out/);
});

test('download filenames are PDF names and cannot contain paths or active characters', () => {
  assert.equal(reportFilename(result, profile), 'OZAK-2-AI-123456-pre.pdf');
  assert.equal(reportFilename({...result, phase: 'post'}, profile), 'OZAK-2-AI-123456-post.pdf');
  const hostile = reportFilename({...result, code: '../../<script>test</script>\n'}, {group: '../3'});
  assert.match(hostile, /^OZAK-3-[A-Z0-9-]+-pre\.pdf$/);
  assert.doesNotMatch(hostile, /[<>\r\n/\\]/);
  const invalidDate = createReportModel({...result, completed: 'bad-date'}, profile);
  assert.equal(invalidDate.completed, null);
  assert.match(invalidDate.dateLabel, /bulunamadı/);
});

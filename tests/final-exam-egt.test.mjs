import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../content/final-exam-egt.json', import.meta.url), 'utf8'));
test('final exam prep covers required areas with bilingual content', () => {
 assert.equal(data.schemaVersion, 1);
 assert.ok(data.modules.length >= 7);
 for (const m of data.modules) {
  assert.ok(m.title.de && m.title.fa && m.goal.de && m.goal.fa);
  assert.ok(m.points.length >= 4 && m.checks.length >= 2);
  for (const q of m.checks) {
   assert.ok(q.q.de && q.q.fa && q.why.de && q.why.fa);
   assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
  }
 }
 assert.ok(data.formulas.length >= 8);
 assert.ok(data.scenarios.length >= 3);
 assert.ok(data.oralQuestions.length >= 8);
 assert.ok(data.checklist.length >= 7);
 assert.ok(data.sources.some(s => s.url.includes('gesetze-im-internet.de/elekausbv_2021')));
});
test('final exam content has safe study disclaimers and valid source URLs', () => {
 assert.match(data.note.de, /keine offiziellen Originalprüfungsaufgaben/i);
 for (const source of data.sources) assert.equal(new URL(source.url).protocol, 'https:');
});

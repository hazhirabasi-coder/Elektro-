import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../content/deutsch-b2.json', import.meta.url), 'utf8'));
test('B2 curriculum is substantial, bilingual, and has six distinct skill modules', () => {
 assert.equal(data.schemaVersion, 1); assert.equal(data.level, 'B2'); assert.ok(data.modules.length >= 6);
 const ids = new Set(); for (const m of data.modules) { assert.ok(!ids.has(m.id)); ids.add(m.id); assert.ok(m.title.de && m.title.fa && m.goal.de && m.goal.fa && m.lesson.de && m.lesson.fa); assert.ok(m.example.de && m.example.fa); assert.ok(m.checks.length >= 2); for (const q of m.checks) { assert.ok(q.q.de && q.q.fa && q.why.de && q.why.fa); assert.ok(q.options.length >= 3); assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length); } }
});
test('B2 includes productive exam tasks with actionable assessment criteria', () => { assert.ok(data.examTasks.length >= 3); for (const task of data.examTasks) { assert.ok(task.title.de && task.title.fa && task.prompt.de && task.prompt.fa); assert.ok(task.criteria.length >= 3); assert.ok(task.criteria.every(c => c.de && c.fa)); } assert.ok(data.disclaimer.de && data.disclaimer.fa); });

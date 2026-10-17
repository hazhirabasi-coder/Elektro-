import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = [
  'lernfeld-01.json',
  'lernfeld-02.json',
  'lernfeld-03.json',
  'lernfeld-04.json',
  'lernfeld-05.json',
  'lernfeld-06.json',
  'lernfeld-07.json',
  'lernfeld-08.json',
  'lernfeld-09.json',
  'lernfeld-10.json',
  'lernfeld-11.json',
  'lernfeld-12.json',
  'lernfeld-13.json'
];
const readLF = name => JSON.parse(readFileSync(new URL('../content/' + name, import.meta.url), 'utf8'));

test('all structured learning fields have valid unique IDs and bilingual objectives', () => {
  const ids = new Set();
  for (const file of files) {
    const lf = readLF(file);
    assert.equal(lf.schemaVersion, 1, file + ': supported schema version');
    assert.match(lf.id, /^LF\d{2}$/);
    assert.ok(!ids.has(lf.id), 'duplicate learning field ID: ' + lf.id);
    ids.add(lf.id);
    assert.ok(lf.title?.de?.trim() && lf.title?.fa?.trim(), file + ': bilingual title');
    assert.ok(Array.isArray(lf.objectives) && lf.objectives.length >= 1, file + ': objectives exist');
    for (const objective of lf.objectives) {
      assert.ok(objective.de?.trim() && objective.fa?.trim(), file + ': bilingual objective');
    }
    assert.ok(lf.disclaimer?.de?.trim() && lf.disclaimer?.fa?.trim(), file + ': bilingual safety disclaimer');
  }
  assert.equal(ids.size, 13);
});

test('lessons and knowledge checks are complete and have valid answer indices', () => {
  let lessonCount = 0;
  let checkCount = 0;
  for (const file of files) {
    const lf = readLF(file);
    assert.ok(Array.isArray(lf.lessons) && lf.lessons.length > 0, file + ': lessons exist');
    for (const lesson of lf.lessons) {
      lessonCount++;
      assert.ok(lesson.id?.trim(), file + ': lesson ID');
      assert.ok(lesson.title?.de?.trim() && lesson.title?.fa?.trim(), lesson.id + ': bilingual title');
      assert.ok(lesson.explanation?.de?.trim() && lesson.explanation?.fa?.trim(), lesson.id + ': bilingual explanation');
      assert.ok(Array.isArray(lesson.checks) && lesson.checks.length > 0, lesson.id + ': knowledge checks exist');
      for (const [index, question] of lesson.checks.entries()) {
        checkCount++;
        const context = file + ' / ' + lesson.id + ' / check ' + index;
        assert.ok(question.q?.de?.trim() && question.q?.fa?.trim(), context + ': bilingual question');
        assert.ok(Array.isArray(question.options) && question.options.length >= 2, context + ': options exist');
        assert.ok(question.options.every(option => typeof option === 'string' && option.trim()), context + ': options are nonempty');
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, context + ': answer index is valid');
        assert.ok(question.why?.de?.trim() && question.why?.fa?.trim(), context + ': bilingual explanation');
      }
    }
  }
  assert.ok(lessonCount >= 45, 'expected at least 45 structured lessons');
  assert.ok(checkCount >= 90, 'expected at least 90 knowledge checks');
});

test('exam tasks, glossary entries, and source links are present and well formed', () => {
  for (const file of files) {
    const lf = readLF(file);
    assert.ok(Array.isArray(lf.examTasks) && lf.examTasks.length >= 3, file + ': exam practice tasks');
    for (const [index, task] of lf.examTasks.entries()) {
      const prompt = task.prompt || task.question;
      assert.ok(prompt?.de?.trim() && prompt?.fa?.trim(), file + ': task ' + index + ' has bilingual prompt');
      assert.ok(typeof task.solution === 'string' || (task.solution?.de?.trim() && task.solution?.fa?.trim()), file + ': task ' + index + ' has a solution');
    }
    assert.ok(Array.isArray(lf.glossary) && lf.glossary.length >= 8, file + ': glossary coverage');
    assert.ok(Array.isArray(lf.sources) && lf.sources.length >= 1, file + ': source list');
    for (const source of lf.sources) {
      assert.ok(source.title?.trim(), file + ': source title');
      assert.doesNotThrow(() => {
        const url = new URL(source.url);
        assert.ok(url.protocol === 'https:' || url.protocol === 'http:');
      }, file + ': valid source URL');
    }
    const serialized = JSON.stringify(lf);
    assert.match(serialized, /keine offizielle|keine Behauptung|Lernmaterial zur Prüfungsvorbereitung|Lernhilfe/i, file + ': learning-material context');
  }
});

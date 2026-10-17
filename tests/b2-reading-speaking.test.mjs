import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../content/b2-reading-speaking.json',import.meta.url),'utf8'));
test('B2 reading collection contains substantial bilingual texts and vocabulary',()=>{assert.equal(data.schemaVersion,1);assert.ok(data.readings.length>=4);for(const r of data.readings){assert.ok(r.title.de&&r.title.fa&&r.text.length>=650&&r.translation.length>=500);assert.ok(r.vocab.length>=5);assert.ok(r.prompts.length>=3&&r.promptsFa.length===r.prompts.length);}});
test('B2 speaking collection provides practical role plays and bilingual phrases',()=>{assert.ok(data.speaking.length>=6);for(const s of data.speaking){assert.ok(s.title.de&&s.title.fa&&s.situation.de&&s.situation.fa&&s.roles.de&&s.roles.fa);assert.ok(s.steps.length>=3&&s.stepsFa.length===s.steps.length);assert.ok(s.phrases.length>=3&&s.phrases.every(p=>p[0]&&p[1]));}});

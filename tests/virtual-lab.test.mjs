import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('interactive installation-tester lab is reachable from navigation', () => {
  assert.match(html, /data-page="lab">🔧 Messgerät-Labor/);
  assert.match(html, /<section id="lab" class="page hidden">/);
  for (const id of ['labFault','labMode','labMeasure','labDiagnose','labLog','labDiagnosis','labReset']) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
});

test('virtual lab covers core installation-tester learning functions and safety caveat', () => {
  for (const mode of ['voltage','lpe','npe','continuity','insulation','loop','rcd','polarity']) {
    assert.match(html, new RegExp('value="' + mode + '"'));
  }
  for (const fault of ['normal','mcb','rcd','pe','n','insulation','highz','polarity']) {
    assert.match(html, new RegExp('value="' + fault + '"'));
  }
  assert.match(html, /ausschließlich ein Lernsimulator ohne echte Spannung/i);
  assert.match(html, /Nie überbrücken/);
  assert.match(html, /initVirtualLab/);
});

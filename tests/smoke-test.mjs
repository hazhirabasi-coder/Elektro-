import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('document has core metadata and a responsive viewport', () => {
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<html lang="de">/i);
  assert.match(html, /<meta name="viewport"[^>]*width=device-width/i);
  assert.match(html, /<meta name="theme-color"/i);
  assert.match(html, /<meta name="description"/i);
  assert.match(html, /<link rel="manifest" href="\.\/manifest\.webmanifest"/i);
  assert.ok(html.includes("navigator.serviceWorker.register('./sw.js')"));
  assert.match(html, /prefers-reduced-motion/i);
});

test('inline CSS and JavaScript blocks are structurally present', () => {
  assert.equal((html.match(/<style\b/gi) || []).length, 1);
  assert.equal((html.match(/<\/style>/gi) || []).length, 1);
  assert.equal((html.match(/<script\b/gi) || []).length, 2);
  assert.equal((html.match(/<\/script>/gi) || []).length, 2);
  const script = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(script, 'inline application script should exist');
  assert.doesNotThrow(() => new vm.Script(script), 'inline JavaScript should parse');
});

test('main learning areas remain present', () => {
  for (const marker of [
    'renderLessons',
    'renderFormulas',
    'renderCard',
    'startQuiz',
    'adaptivePriority',
    'renderPlan',
    'localStorage'
  ]) {
    assert.ok(html.includes(marker), `expected learning feature marker: ${marker}`);
  }
});

test('mobile navigation and keyboard focus styles remain present', () => {
  assert.match(html, /@media\s*\(max-width:\s*650px\)/i);
  assert.match(html, /:focus-visible/i);
});

test('PWA shell and service worker are configured for offline use', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
  const worker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.doesNotThrow(() => new vm.Script(worker), 'service worker JavaScript should parse');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.ok(manifest.icons.some(icon => icon.src === './icon.svg'));
  assert.ok(worker.includes("addEventListener('install'"));
  assert.ok(worker.includes("addEventListener('fetch'"));
  assert.ok(worker.includes("caches.match('./index.html')"));
  assert.ok(worker.includes("caches.match(request).then(cached => cached || caches.match('./index.html'))"), "offline navigation should return the cached requested page first");
  assert.ok(worker.includes("caches.open(CACHE_NAME).then(cache => cache.put(request, copy))"), "online navigation should cache the page under its own request URL");
  assert.ok(!worker.includes("cache.put(" + "'./index.html'" + ", copy)"), "navigation must not overwrite the cached home page with another document");
  assert.match(worker, /const CACHE_NAME = 'elektro-lernen-v2'/);
  assert.match(worker, /APP_SHELL = \[[^\]]*'\.\/virtual-lab\.html'/, 'standalone circuit lab should be cached for offline use');
});

test('measurement lab prioritizes a clear interactive workflow over decorative mock hardware', () => {
  assert.match(html, /\.lab-pro-dashboard,\.lab-pro-scenarios\{display:none!important\}/);
  assert.match(html, /id="labQuickStart"/);
  assert.match(html, /id="labQuickStartStatus"/);
  assert.match(html, /state\.red='L';state\.black='N'/);
  assert.match(html, /noch kein vollständiger Stromkreis-Simulator/i);
});

test('B1 exam simulator is linked and its inline JavaScript parses', () => {\n  assert.ok(html.includes('b1-pruefung.html'));\n  const exam = readFileSync(new URL('../b1-pruefung.html', import.meta.url), 'utf8');\n  for (const section of ['Hören', 'Lesen', 'Sprachbausteine', 'Schreiben', 'Sprechen']) assert.ok(exam.includes(section));\n  assert.ok(exam.includes('startPartner'));\n  const start = exam.indexOf('<script>') + 8;\n  const end = exam.indexOf('</script>', start);\n  assert.ok(start >= 8 && end > start, 'B1 exam inline script should exist');\n  assert.doesNotThrow(() => new vm.Script(exam.slice(start, end)), 'B1 exam JavaScript should parse');\n});\n\ntest('HTML element IDs are unique to avoid broken controls and navigation', () => {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  assert.deepEqual([...duplicates], [], 'duplicate HTML IDs: ' + [...duplicates].join(', '));
});


test('standalone lab offers a manual distribution-board and installation-wall workshop', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  for (const marker of [
    'id="workshopBackdrop"',
    'data-type="main"',
    'data-type="breaker"',
    'data-type="rcd"',
    'data-type="switch"',
    'data-type="lamp"',
    'data-type="socket"',
    'id="measureTarget"',
    "function connected(a,b,blockedId=null)",
    "const src=addPart('supply',85,150),main=addPart('main'",
    "a:main.id,ap:1,b:rcd.id,bp:0",
    "a:rcd.id,ap:1,b:br.id,bp:0"
  ]) {
    assert.ok(lab.includes(marker), 'expected realistic workshop feature: ' + marker);
  }
});

test('component placement works over the DIN-rail and installation-wall backdrops', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  assert.match(lab, /const inParts=e\.target\.closest\?\.\('#parts'\),inWires=e\.target\.closest\?\.\('#wires'\),onPin=e\.target\.classList\?\.contains\('pin'\)/);
  assert.match(lab, /if\(!inParts&&!inWires&&!onPin\)/);
});


test('workshop provides selectable DIN-rail protection devices and guided building circuits', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  for (const marker of ['data-type="rcbo"','data-type="junction"','data-type="pebar"','data-type="neutralbar"','id="templateLamp"','id="templateSocket"','id="templateBoard"','id="newBoard"',"function loadWorkshop(kind)",'function isRailPart(type)']) {
    assert.ok(lab.includes(marker), 'missing workbench feature: ' + marker);
  }
  assert.match(lab, /p\.y=isRailPart\(p\.type\)\?Math\.max\(105,Math\.min\(190/);
  assert.ok(lab.includes("(p.type==='rcd'||p.type==='rcbo')&&p.on)links=[[0,1],[2,3]]"), 'RCBO must connect its poles only when switched on');
});

test('wire mode toggle disables terminal connections outside cable mode', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  assert.ok(lab.includes("if(!state.wireMode){state.selected=id;state.wireStart=null;render();"));
  assert.ok(lab.includes("state.wireMode=!state.wireMode;state.wireStart=null;draftLayer.replaceChildren();"));
});
test('standalone workshop provides selectable DIN components and interactive wiring', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  for (const marker of ['data-type="mcb3"','data-type="fuse"','data-type="contactor"','LS C16 3-polig','Schmelzsicherung gG','Schütz 3-polig','function connected','data-pin']) {
    assert.ok(lab.includes(marker), `expected workshop feature marker: ${marker}`);
  }
  assert.match(lab, /p\.type==='mcb3'&&p\.on\)links=\[\[0,1\],\[2,3\],\[4,5\]\]/);
});

test('standalone virtual lab JavaScript parses successfully', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  const script = lab.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(script, 'virtual lab inline script should exist');
  assert.doesNotThrow(() => new vm.Script(script), 'virtual lab JavaScript should parse');
});

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

test('HTML element IDs are unique to avoid broken controls and navigation', () => {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  assert.deepEqual([...duplicates], [], 'duplicate HTML IDs: ' + [...duplicates].join(', '));
});


test('standalone virtual lab JavaScript parses successfully', () => {
  const lab = readFileSync(new URL('../virtual-lab.html', import.meta.url), 'utf8');
  const script = lab.match(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/i)?.[1];
  assert.ok(script, 'virtual lab inline script should exist');
  assert.doesNotThrow(() => new vm.Script(script), 'virtual lab JavaScript should parse');
});

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
  assert.equal((html.match(/<script\b/gi) || []).length, 1);
  assert.equal((html.match(/<\/script>/gi) || []).length, 1);
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
});

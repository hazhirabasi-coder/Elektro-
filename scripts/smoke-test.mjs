import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../elektropilot.html", import.meta.url), "utf8");
const cases = JSON.parse(readFileSync(new URL("../data/demo-cases.json", import.meta.url), "utf8"));

assert.match(html, /<title>ElektroPilot AI/);
assert.match(html, /localStorage/);
assert.match(html, /window\.print/);
assert.match(html, /RCD/i);
assert.match(html, /Hypothesen|hypoth/i);
assert.match(html, /Sicherheit|sicher|qualified|Fachkraft/i);
assert.equal(cases.cases.length, 10);
assert.equal(new Set(cases.cases.map(c => c.id)).size, cases.cases.length);
for (const c of cases.cases) {
  assert.ok(c.id && c.title && c.reviewQuestion, `Case missing required fields: ${JSON.stringify(c)}`);
}

// Compile embedded JavaScript to catch syntax errors without executing browser-only code.
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
assert.ok(scripts.length > 0, "No inline JavaScript found");
for (const script of scripts) new Function(script);
console.log(`Smoke tests passed: HTML markers, ${cases.cases.length} demo cases, embedded JS syntax.`);

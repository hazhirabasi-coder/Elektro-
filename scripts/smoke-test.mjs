import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../elektropilot.html", import.meta.url), "utf8");
const cases = JSON.parse(readFileSync(new URL("../data/demo-cases.json", import.meta.url), "utf8"));
const firmware = readFileSync(new URL("../hardware/boxscan-b/boxscan_b.ino", import.meta.url), "utf8");
const api = readFileSync(new URL("../server/index.mjs", import.meta.url), "utf8");
const contract = readFileSync(new URL("../docs/boxscan-data-contract.md", import.meta.url), "utf8");

assert.match(html, /<title>ElektroPilot AI/);
assert.match(html, /localStorage/);
assert.match(html, /window\.print/);
assert.match(html, /RCD/i);
assert.match(html, /Hypothesen|hypoth/i);
assert.match(html, /Sicherheit|sicher|qualified|Fachkraft/i);
assert.match(html, /BoxScan B Daten importieren/);
assert.match(html, /Mit KI analysieren/);
assert.match(html, /API-Basisadresse/);
assert.equal(cases.cases.length, 10);
assert.equal(new Set(cases.cases.map(c => c.id)).size, cases.cases.length);
for (const c of cases.cases) {
  assert.ok(c.id && c.title && c.reviewQuestion, `Case missing required fields: ${JSON.stringify(c)}`);
}
assert.match(firmware, /METER_REGISTER_MAP_CONFIGURED 0/);
assert.match(firmware, /GALVANICALLY ISOLATED RS-485/);
assert.match(firmware, /setInsecure\(\)/);
assert.match(api, /AI_NOT_CONFIGURED/);
assert.match(api, /stored: false/);
assert.match(api, /store: false/);
assert.match(contract, /schemaVersion/);

// Compile embedded JavaScript to catch syntax errors without executing browser-only code.
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
assert.ok(scripts.length > 0, "No inline JavaScript found");
for (const script of scripts) new Function(script);
console.log(`Smoke tests passed: UI, ${cases.cases.length} demo cases, BoxScan safety defaults, API markers, embedded JS syntax.`);

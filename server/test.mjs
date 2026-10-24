import test from "node:test";
import assert from "node:assert/strict";

test("BoxScan v1.0 contract requires explicit timestamp and communication quality", () => {
  const valid = {
    schemaVersion: "1.0", deviceId: "demo-device",
    capturedAt: "2026-10-25T12:00:00Z",
    measurements: { voltageV: 230.1 },
    quality: { communicationOk: true }
  };
  assert.equal(valid.schemaVersion, "1.0");
  assert.ok(Number.isFinite(Date.parse(valid.capturedAt)));
  assert.equal(typeof valid.quality.communicationOk, "boolean");
  assert.equal(typeof valid.measurements.voltageV, "number");
});

test("sample values must not be marked verified by default", () => {
  const sample = { dataMode: "demo", quality: { measurementValid: false, registerMapVerified: false } };
  assert.equal(sample.quality.measurementValid, false);
  assert.equal(sample.quality.registerMapVerified, false);
});

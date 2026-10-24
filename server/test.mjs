import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

let child;
let baseUrl;

async function freePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => probe.once("error", reject).listen(0, "127.0.0.1", resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  return port;
}
async function waitForServer(url) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url + "/health");
      if (res.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("API server did not start in time");
}

before(async () => {
  const port = await freePort();
  baseUrl = "http://127.0.0.1:" + port;
  child = spawn(process.execPath, ["index.mjs"], {
    cwd: new URL(".", import.meta.url),
    env: {
      ...process.env,
      PORT: String(port),
      OPENAI_API_KEY: "",
      BOXSCAN_DEVICE_TOKEN: "device-test-token",
      BOXSCAN_VIEW_TOKEN: "view-test-token",
      APP_ORIGIN: baseUrl
    },
    stdio: "ignore"
  });
  await waitForServer(baseUrl);
});

after(() => {
  if (child && !child.killed) child.kill("SIGTERM");
});

test("health endpoint reports service and no configured AI key", async () => {
  const res = await fetch(baseUrl + "/health");
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.aiConfigured, false);
});

test("AI endpoint fails closed when server API key is absent", async () => {
  const res = await fetch(baseUrl + "/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ case: { title: "Testfall", symptoms: "Test" } })
  });
  const body = await res.json();
  assert.equal(res.status, 503);
  assert.equal(body.error, "AI_NOT_CONFIGURED");
});

test("BoxScan rejects missing device credentials", async () => {
  const res = await fetch(baseUrl + "/api/boxscan/measurements", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schemaVersion: "1.0" })
  });
  assert.equal(res.status, 401);
});

test("BoxScan reading is visible only with the read token and is memory-only", async () => {
  const payload = {
    schemaVersion: "1.0",
    deviceId: "test-device",
    panelId: "test-panel",
    capturedAt: "2026-10-25T12:00:00Z",
    source: "modbus_meter",
    dataMode: "live_meter",
    measurements: { voltageV: 230.2 },
    quality: { communicationOk: true, measurementValid: false, registerMapVerified: false }
  };
  const post = await fetch(baseUrl + "/api/boxscan/measurements", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer device-test-token" },
    body: JSON.stringify(payload)
  });
  assert.equal(post.status, 202);
  assert.equal((await post.json()).persistence, "memory-only");

  const denied = await fetch(baseUrl + "/api/boxscan/latest");
  assert.equal(denied.status, 401);

  const get = await fetch(baseUrl + "/api/boxscan/latest", {
    headers: { authorization: "Bearer view-test-token" }
  });
  const data = await get.json();
  assert.equal(get.status, 200);
  assert.equal(data.persistence, "memory-only");
  assert.equal(data.readings.length, 1);
  assert.equal(data.readings[0].measurements.voltageV, 230.2);
});

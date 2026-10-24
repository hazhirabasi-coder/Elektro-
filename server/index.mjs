import http from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT || 8787);
const API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const DEVICE_TOKEN = process.env.BOXSCAN_DEVICE_TOKEN || "";
const ALLOWED_ORIGIN = process.env.APP_ORIGIN || "http://localhost:8787";
const MAX_BODY = 24 * 1024;
const requestCounts = new Map();

function json(res, status, body, origin = "") {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...(origin ? { "access-control-allow-origin": origin, "vary": "Origin" } : {})
  });
  res.end(JSON.stringify(body));
}
function sameSecret(a, b) {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function rateLimited(ip) {
  const now = Date.now();
  const record = requestCounts.get(ip) || { start: now, count: 0 };
  if (now - record.start > 60000) { record.start = now; record.count = 0; }
  record.count++;
  requestCounts.set(ip, record);
  return record.count > 20;
}
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY) throw new Error("BODY_TOO_LARGE");
  }
  try { return JSON.parse(raw); } catch { throw new Error("INVALID_JSON"); }
}
function safeCase(c) {
  if (!c || typeof c !== "object" || Array.isArray(c)) return false;
  const allowed = ["title", "symptoms", "when", "scope", "measurements", "history", "confirmed", "scenario", "boxScan"];
  return allowed.some(k => typeof c[k] === "string" && c[k].length > 0) &&
    allowed.every(k => c[k] === undefined || (k === "boxScan" && c[k] === null) || (typeof c[k] === "string" && c[k].length <= 6000) || (k === "boxScan" && c[k] && typeof c[k] === "object"));
}
const instructions = `You are ElektroPilot, an evidence-organizing assistant for qualified electrical professionals in Germany.
Safety rules:
- Never instruct an unqualified person to open, probe, modify, or work inside an energized distribution board.
- Never recommend bypassing, defeating, or repeatedly resetting protective devices.
- Do not claim compliance with DIN/VDE or declare an installation safe.
- Distinguish reported observations, measured facts, hypotheses, contradictory evidence, and missing information.
- Treat measurements as unverified unless explicitly documented; even then, do not certify safety.
- Never invent values, instrument results, equipment models, standards clauses, or test outcomes.
- If damage, heat, smoke, burning smell, exposed live parts, or electric shock is mentioned, prioritize stopping use, keeping away, and contacting an appropriately qualified professional/emergency service as appropriate.
Return valid JSON with keys: summary (string), hypotheses (array of objects with title, supportingEvidence, counterEvidence, missingEvidence, confidenceLabel), missingInformation (array of strings), safeNextSteps (array of strings), limitations (array of strings). Confidence labels must be qualitative, not percentages. This is decision support, not diagnosis.`;

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const allowedOrigin = origin === ALLOWED_ORIGIN ? origin : "";
  if (req.method === "OPTIONS") {
    if (origin && !allowedOrigin) return json(res, 403, { error: "ORIGIN_NOT_ALLOWED" });
    res.writeHead(204, {
      "access-control-allow-methods": "POST, GET, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "600",
      ...(allowedOrigin ? { "access-control-allow-origin": allowedOrigin, "vary": "Origin" } : {})
    });
    return res.end();
  }
  const url = new URL(req.url || "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, service: "elektropilot-api", aiConfigured: Boolean(API_KEY), model: MODEL }, allowedOrigin);
  }
  if (origin && !allowedOrigin) return json(res, 403, { error: "ORIGIN_NOT_ALLOWED" });
  if (req.method !== "POST") return json(res, 404, { error: "NOT_FOUND" }, allowedOrigin);
  if (rateLimited(req.socket.remoteAddress || "unknown")) return json(res, 429, { error: "RATE_LIMITED" }, allowedOrigin);

  if (url.pathname === "/api/boxscan/measurements") {
    if (!DEVICE_TOKEN || !sameSecret((req.headers.authorization || "").replace(/^Bearer\s+/i, ""), DEVICE_TOKEN))
      return json(res, 401, { error: "DEVICE_AUTH_FAILED" }, allowedOrigin);
    try {
      const payload = await readJson(req);
      if (!payload || payload.schemaVersion !== "1.0" || typeof payload.deviceId !== "string" ||
          typeof payload.capturedAt !== "string" || !Number.isFinite(Date.parse(payload.capturedAt)) ||
          !payload.measurements || typeof payload.measurements !== "object" ||
          !payload.quality || typeof payload.quality.communicationOk !== "boolean") {
        return json(res, 400, { error: "INVALID_BOXSCAN_PAYLOAD" }, allowedOrigin);
      }
      const numericFields = ["voltageV", "currentA", "activePowerW", "energyKWh", "frequencyHz", "powerFactor"];
      for (const key of numericFields) {
        if (payload.measurements[key] !== undefined && payload.measurements[key] !== null &&
            (typeof payload.measurements[key] !== "number" || !Number.isFinite(payload.measurements[key]))) {
          return json(res, 400, { error: "INVALID_MEASUREMENT", field: key }, allowedOrigin);
        }
      }
      // Validates and acknowledges only; no persistence configured.
      return json(res, 202, { accepted: true, stored: false, requestId: randomUUID(), note: "Validated in memory only; persistence is not configured." }, allowedOrigin);
    } catch (err) {
      return json(res, err.message === "BODY_TOO_LARGE" ? 413 : 400, { error: err.message || "BAD_REQUEST" }, allowedOrigin);
    }
  }

  if (url.pathname === "/api/analyze") {
    if (!API_KEY) return json(res, 503, { error: "AI_NOT_CONFIGURED", message: "Set OPENAI_API_KEY on the server; never in browser code." }, allowedOrigin);
    try {
      const body = await readJson(req);
      if (!safeCase(body.case)) return json(res, 400, { error: "INVALID_CASE" }, allowedOrigin);
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { authorization: "Bearer " + API_KEY, "content-type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          instructions,
          input: JSON.stringify(body.case),
          text: { format: { type: "json_object" } },
          store: false
        }),
        signal: AbortSignal.timeout(45000)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return json(res, 502, { error: "MODEL_REQUEST_FAILED", status: response.status, requestId: data?.id || null }, allowedOrigin);
      const output = typeof data.output_text === "string" ? data.output_text : Array.isArray(data.output) ? data.output.flatMap(item => Array.isArray(item.content) ? item.content : []).filter(part => part.type === "output_text" && typeof part.text === "string").map(part => part.text).join("\\n") : "";
      if (!output) return json(res, 502, { error: "MODEL_EMPTY_RESPONSE" }, allowedOrigin);
      let analysis;
      try { analysis = JSON.parse(output); } catch { return json(res, 502, { error: "MODEL_INVALID_JSON" }, allowedOrigin); }
      return json(res, 200, { analysis, model: MODEL, responseId: data.id || null, disclaimer: "AI-generated hypotheses only; not a diagnosis or safety approval." }, allowedOrigin);
    } catch (err) {
      return json(res, err.message === "BODY_TOO_LARGE" ? 413 : 400, { error: err.message || "REQUEST_FAILED" }, allowedOrigin);
    }
  }
  return json(res, 404, { error: "NOT_FOUND" }, allowedOrigin);
});

server.listen(PORT, () => {
  console.log("ElektroPilot API listening on port " + PORT + "; AI configured: " + Boolean(API_KEY));
});

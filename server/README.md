# ElektroPilot API (optional backend)

The GitHub Pages app is static and cannot safely hold an OpenAI API key or accept device uploads. This Node.js service is a starter backend for a separately hosted pilot.

## Run locally
- Node.js 22+
- Enter the server directory and run npm start.
- Set environment variables in your shell (never commit them):
  - OPENAI_API_KEY (needed for live model analysis)
  - OPENAI_MODEL (optional; default gpt-5.5; use a model enabled for your API project)
  - APP_ORIGIN (exact browser origin, e.g. https://hazhirabasi-coder.github.io)
  - BOXSCAN_DEVICE_TOKEN (long random token for device endpoint)
  - BOXSCAN_VIEW_TOKEN (separate read-only token entered into the browser UI)
  - PORT (optional; default 8787)
- Health check: GET /health.
- AI analysis: POST /api/analyze with JSON body {"case":{"title":"...","symptoms":"...","measurements":"..."}}.
- Device ingestion: POST /api/boxscan/measurements with a v1.0 payload and Authorization: Bearer <device-token>.
- Latest reading: GET /api/boxscan/latest with Authorization: Bearer <BOXSCAN_VIEW_TOKEN>. The browser app has a field for this read token.

## Prototype limitations
- No database, user accounts, tenant isolation, persistent measurement storage, audit log, billing, or production-grade abuse prevention is configured.
- The BoxScan endpoint keeps the latest reading per device in process memory only and reports persistence: memory-only. A server restart/redeploy clears readings; no database is configured.
- The service uses a simple in-memory rate limit, not a production rate-limiting service.
- Before public deployment add TLS at the host, authentication for user sessions, per-device tokens, stronger rate limits, monitoring, retention/deletion controls, privacy notices and security review.
- Do not send identifiable customer/site data during the prototype. store:false is passed to the Responses API, but does not replace reviewing the provider's current data controls and terms.
- AI results are hypotheses only. They cannot authorize work, establish DIN/VDE compliance, or declare an installation safe.

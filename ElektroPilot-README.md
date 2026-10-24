# ElektroPilot AI — Evidence Engine

**Prototype status:** early, browser-only proof of concept. This is not a validated diagnostic product and does not contain a real AI model.

## Open the prototype

After the repository's static site is published, open:
`https://hazhirabasi-coder.github.io/Elektro-/elektropilot.html`

If that URL is not yet available, open the [HTML file in the repository](./elektropilot.html) and use **Raw** or download it, then open it in a browser.

## What it currently does

- Captures a fault case: symptoms, conditions, affected scope, measurements, history and confirmed facts.
- Applies transparent, fixed rules to rank possible explanations.
- Separates evidence supporting a hypothesis from counter-evidence and missing information.
- Suggests next investigative steps for a qualified electrician to review.
- Saves cases in the browser's local storage, and supports copy/print-to-PDF.
- Includes three demo scenarios: intermittent RCD trips, a circuit without function, and unusually high energy consumption.

## Important limitations

- The current logic is **rule-based**, not an AI model.
- Demo outputs are hypotheses, not confirmed diagnoses.
- It does not connect to test instruments, sensors, building-management systems or electrical installations.
- Never use it as a substitute for electrical training, risk assessment, applicable DIN/VDE requirements, lockout/isolation procedures, or approved measuring equipment. Work on electrical installations must be performed only by appropriately qualified persons.
- Do not enter personal data, customer names, addresses, access codes, or confidential installation details into this prototype. Saved cases remain in the browser profile unless manually cleared.

## Test it in 10 minutes

1. Open the app on a phone or computer.
2. Try each demo scenario.
3. Change one observation at a time and run the analysis again.
4. Check whether the app distinguishes evidence, counter-evidence and missing data.
5. Record confusing, unsupported or unsafe suggestions in an issue.
6. Ask an experienced electrician to review all proposed next steps before any field use.

## 30-day validation plan

**Days 1–7:** Run the included demo cases; fix obvious UI and wording problems.  
**Days 8–14:** Ask 3–5 qualified electricians to review anonymized, fictional cases.  
**Days 15–21:** Compare the tool with the electricians' normal reasoning process; record time, missing facts and incorrect hypotheses.  
**Days 22–30:** Decide whether a narrow use case is valuable enough for a controlled pilot.

Do not claim time savings, accuracy, safety or compliance until measured and independently reviewed.

## Roadmap

1. **Reliable baseline:** case format, repeatable demo cases, usability and safety review.
2. **Evidence engine:** traceable rule definitions, confidence calibration, explicit uncertainty and test coverage.
3. **Field evaluation:** supervised trials with qualified electricians and anonymized data.
4. **Integrations:** only after demand is demonstrated, investigate importing measurements from existing instruments or documentation systems.
5. **Commercialization in Germany:** review privacy, security, product liability, professional responsibilities and any applicable regulatory obligations with qualified advisers.

## Feedback

Use GitHub Issues to report a reproducible problem. Include the demo case, the input changed, the expected behavior and the observed behavior. Never attach customer-identifying data.

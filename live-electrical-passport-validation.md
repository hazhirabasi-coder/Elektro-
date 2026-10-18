# Live Electrical Passport — competitive review and validation plan (v0.2)

Review date: 18 October 2026

## Executive decision

**Do not build a generic circuit finder or a generic permanent circuit marker.** The first-pass search found direct commercial and patent overlap. The current HTML demo is only a user-interface simulation; it is not a functioning measurement system.

A potentially useful next step is to investigate a narrower workflow around **portable, auditable handover records across service visits**: a technician captures circuit identification evidence, uncertainty, test conditions, and before/after changes in a vendor-neutral report that can be reused by the next technician. This is only a customer-problem hypothesis—not a claim of novelty, patentability, or freedom to operate. Even this workflow may overlap with existing documentation systems and needs further validation.

## Closest product overlap

1. **Simplewire Flex+ and Core** — https://simplewire.io/en/
   - Flex+ is a portable tool for identifying branch circuits in existing installations.
   - Core is a fixed installation intended to keep circuit identification available for operation, changes, and documentation.
   - This is the closest direct competitor found in this initial search. A generic "identify the circuit and keep the ID in the panel" concept is not a credible differentiator by itself.

2. **Fluke 2052 Advanced Wire Tracer** — https://www.fluke.com/de-de/produkt/gebaeudeinfrastruktur/wire-tracers/2052
   - Locates energized and de-energized wires, supports finding opens/shorts, and identifies breakers/fuses.
   - A generic wire-tracing or breaker-identification tool is already a mature product category.

3. **DDScad Electrical** — https://www.graphisoft.com/en-de/plans-and-products/ddscad/electrical/
   - Electrical CAD/BIM planning and documentation, including circuit diagrams, installation plans, and parts lists.
   - This overlaps with the documentation side of the proposed idea.

4. **ELECTRIX AI / WSCAD** — https://www.wscad.com/en/electrix/
   - Offers traceable, revision-proof electrical documentation and change tracking.
   - A claim based only on maintaining revision history would not be sufficiently differentiated.

5. **ETAP Digital Twin** — https://etap.com/software/etap-digital-twin
   - Provides lifecycle-oriented electrical-system models and operational analytics, especially for larger power systems.
   - Relevant adjacent prior art, though not necessarily a direct residential electrician competitor.

## Patent references found

These are search leads, not legal conclusions. Google Patents' displayed legal-status information is not a substitute for checking official registers.

1. **Simplewire — EP4001940A1**, “A method and system for branch circuit marking”: https://patents.google.com/patent/EP4001940A1/en
   - Priority date shown: 19 November 2020.
   - Concerns electronically marking branch circuits.

2. **Simplewire — EP4248229A1**, “A method and system for branch circuit marking”: https://patents.google.com/patent/EP4248229A1/en
   - Related branch-circuit marking patent family.

3. **Simplewire — EP4579262A2**: https://patents.google.com/patent/EP4579262A2/en
   - A later publication in the same general family; check official register for current status and claim scope.

4. **Rockwell Automation — EP3968479A1**, “System and method for automatic power topology discovery”: https://patents.google.com/patent/EP3968479A1/en
   - Relevant to topology-change detection and power topology identification.

5. **US20180336292A1**, “Mapping circuits”: https://patents.google.com/patent/US20180336292A1/en
   - Additional mapping-related prior-art lead.

6. **Fluke 2052 product documentation**: https://www.fluke.com/en-ie/product/building-infrastructure/wire-tracers/2052

This is a preliminary keyword-based scan, not a comprehensive patent landscape, patentability opinion, or freedom-to-operate analysis. Before filing, selling, or investing heavily, search Espacenet, DPMAregister, WIPO PATENTSCOPE, Google Patents, classifications, citations, patent families, official legal status, and the actual independent claims with a qualified patent professional.

## Candidate differentiator to validate—not assume

Investigate whether electricians need a **vendor-neutral service-visit evidence record** that joins:
- circuit ID and location,
- what measurement or identification method was actually used,
- date, tool/method, and test conditions,
- raw observations or references to evidence,
- confidence and explicit “unknown / insufficient evidence” state,
- before/after changes and who recorded them,
- portable PDF/JSON export that can be read without the vendor's proprietary device.

Why test it: products already exist for circuit identification and professional electrical documentation, but there may be a workflow gap between a field identification session and a durable, reusable maintenance record. This gap is unproven. The first validation task is customer interviews, not hardware.

## Customer validation — do this before building electronics

Interview at least five electricians or facility technicians. Ask them to describe a recent real case:
1. When did circuit labels or drawings fail to match reality?
2. How long did identification and documentation take?
3. What evidence did they record, and where did it get lost?
4. What did the next technician need but not have?
5. What tool or process do they use now, and what does it cost?
6. Would they pay to improve this workflow? If yes, who controls the budget?
7. What would make them distrust an automated identification result?

Do not lead with the proposed solution. Record actual incidents, current workarounds, time/cost, and willingness to change. If the problem is rare or existing tools solve it well, stop or pivot.

## Low-voltage experiment only

**Never connect a homemade prototype to mains voltage, a real distribution board, protective devices, or building wiring.**

### Equipment
- Battery-powered 5 V supply or AA battery pack
- 3–6 LED/resistor branches on a breadboard
- Optional low-cost microcontroller or manual switch matrix
- Notebook/CSV log; multimeter used only on the isolated low-voltage circuit

### Protocol
1. Create a known map of six branches and record ground truth.
2. Run 30 repeatable trials: unchanged branches, one branch moved, one disconnected, two swapped, and deliberately insufficient observations.
3. Log ground truth, observation, decision, confidence, false positives/negatives, and time taken.
4. Keep a held-out test set that is not used to tune the logic.
5. Compare against a simple manual checklist baseline.
6. Report a confusion matrix and failure cases, not just one accuracy number.

The current HTML demo does not perform this experiment; it only simulates the user interface.

## Go/no-go gates

Proceed only if:
- Interviews demonstrate a frequent, costly, unresolved workflow problem.
- The proposed workflow is materially different from existing products in a way customers value.
- The prototype beats a defined baseline on a repeatable test.
- It can return “unknown” instead of guessing.
- No safety claim is inferred from the low-voltage model.
- Further patent review does not reveal a blocking claim for the chosen implementation.

## Immediate next actions

1. Use the updated HTML demo only to show the concept and collect feedback—not as proof of technical capability.
2. Conduct five problem interviews with electricians/facility technicians.
3. Refine the concept from evidence gathered.
4. Only then choose a sensing approach and build a low-voltage bench prototype.

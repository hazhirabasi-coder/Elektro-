# ElektroPilot — Validation and safety plan

## Objective

Test whether evidence-linked troubleshooting notes can help qualified electricians organize fault information faster without increasing diagnostic errors or encouraging unsafe work.

## Hypothesis (not yet proven)

For a narrow, well-defined class of faults, structured evidence and missing-information prompts may reduce time spent organizing case notes. No accuracy, time-saving or safety benefit is established yet.

## First test set

Use fictional or fully anonymized cases only.

1. Intermittent RCD trip.
2. Circuit without function.
3. Unusually high energy consumption.
4. A symptom that conflicts with the initial hypothesis.
5. Incomplete measurement information.
6. Multiple plausible causes with similar evidence.
7. Historical fault that no longer reproduces.
8. A case where the safe answer is to stop and escalate.
9. A case with an unreliable or unverified measurement.
10. A case where evidence is insufficient to rank causes.

## Review protocol

- Have an experienced, appropriately qualified electrician independently review every hypothesis and suggested next step.
- For each case, record: missing facts, plausible causes, unsafe or misleading wording, unsupported certainty, and whether the tool omits a critical alternative.
- Compare the tool-assisted process with the electrician's normal process on equivalent cases.
- Measure time and quality separately. Faster is not better if important evidence or safety checks are lost.
- Record failures and revise the test set before repeating the evaluation.

## Stop conditions

Do not use the prototype to guide live electrical work if a reviewer finds any suggestion that could reasonably encourage unsafe testing, bypass a protective device, work on energized equipment without appropriate controls, or treat a hypothesis as a confirmed diagnosis.

## Data protection

- Use fictional or anonymized case data.
- Do not collect names, addresses, photos that identify customers, access credentials, or detailed site information.
- Current case storage is local browser storage and is not encrypted by this prototype. Do not use it for confidential field records.

## Success criteria to decide in advance

A possible pilot gate (targets, not achieved results):
- 10/10 cases reviewed by a qualified electrician.
- Zero unresolved critical safety issues.
- Every displayed hypothesis includes a reason, counter-evidence or a clear statement that none was supplied, and missing information.
- Any time-saving claim is supported by a documented comparison with a baseline.
- At least three professionals independently state that the workflow solves a real problem they encounter.

## Decision after 30 days

- **Proceed:** users show repeated value, no critical safety issues remain, and the test results are documented.
- **Narrow scope:** value appears only in one fault category.
- **Stop or redesign:** reviewers find unsafe advice, no meaningful workflow benefit, or insufficient willingness to use/pay.

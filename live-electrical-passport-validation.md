# Live Electrical Passport — validation plan (v0.1)

## Current status
- The HTML page is a browser-only simulation with synthetic data.
- It is not connected to electrical equipment and does not detect real faults.
- No patentability, novelty, safety, or commercial viability conclusion has been established.

## Product hypothesis to test
A useful differentiator may be a **persistent, evidence-linked circuit record**: preserve what was observed, when it was observed, how reliable the observation was, and what changed later. This is a hypothesis, not a novelty claim. Circuit tracing, energy monitoring, and electrical topology detection already have existing products and patent literature.

## Prior-art starting points (not an exhaustive search)
1. Fluke wire tracers: https://www.fluke.com/en-ie/product/building-infrastructure/wire-tracers/2052
2. EP4111571A1 — topology/phase detection: https://patents.google.com/patent/EP4111571A1/en
3. EP3571706B1 — energy management in existing electrical installations: https://patents.google.com/patent/EP3571706B1/en

These references are reasons to investigate carefully, not proof that the specific product hypothesis is or is not patentable. A proper search should include Espacenet, Google Patents, DPMAregister, CPC classifications, citations, family members, legal status, and claim-by-claim review with a patent professional before spending money or making novelty claims.

## First bench experiment — low voltage only
**Do not connect a homemade prototype to mains, a real distribution board, protective devices, or building wiring.**

### Equipment
- Battery-powered 5 V USB supply or AA battery pack
- 3–6 low-voltage LED/resistor branches on a breadboard
- Low-cost microcontroller or a manual switch matrix (optional for the first run)
- Notebook/CSV log; multimeter only for the low-voltage circuit

### Protocol
1. Create a known reference map for six branches and record the ground truth.
2. Run 30 trials: unchanged branches, one branch moved, one branch disconnected, two branches swapped, and intentionally insufficient observations.
3. Record for every trial: ground truth, observed signal, system decision, confidence, false positive/negative, and time taken.
4. Keep a held-out set of trials that is not used while tuning the algorithm.
5. Compare the result against a simple baseline (manual checklist / direct continuity check on the disconnected low-voltage board).
6. Report the confusion matrix and failure cases; do not report only overall accuracy.

### Go / no-go gates
- Every test has a known ground truth and repeatable setup.
- The system can output **unknown / insufficient evidence** rather than guessing.
- No safety claim is made from the low-voltage model.
- Continue only if it improves on the baseline in a measurable way, such as reducing mapping time or detecting deliberate changes with fewer errors.

## Next decisions
- Identify one real electrician workflow where circuit records are often lost or become stale.
- Interview at least five electricians and ask them to describe their last circuit-identification / documentation problem; do not pitch the solution first.
- Search products and patent claims around the exact measured signal and proposed workflow before designing hardware.
- Only then select a sensor method. Keep any first electronics prototype isolated and low-voltage.

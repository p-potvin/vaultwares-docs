# Verification Policy Notes

Welcome to the VaultWares verification policy! This guide explains our absolute requirement that all work must be proven correct before it is considered complete.

## The Philosophy of Verification

At VaultWares, "I think it works" is not acceptable. We operate on the principle of verifiable evidence. If you claim a bug is fixed, a feature is built, or a server is deployed, you must provide the proof.

## Guidelines for Verification

### 1. Find the Smallest Proof
Prefer the smallest, most isolated verification that proves the change.
- If you change a single function, a unit test is better than a full end-to-end browser test.
- The smaller the proof, the faster and more reliable it is.

### 2. Record the Evidence
You must explicitly record what was run and what the result was. This could be:
- The exact bash commands executed and their output.
- The URLs of the pages visited.
- Automated Playwright screenshots for UI changes.
- The state of the database before and after.

### 3. Avoid False Positives
**Do not claim something is "working" based on a single 200 OK network response.** A server can return a 200 OK while rendering a completely blank page or a stack trace in the HTML body. Verify the *content* and the *behavior*, not just the HTTP status code.

### 4. Handling Environment Limits
Sometimes, you cannot fully verify a change because you lack access to the production environment, hardware, or specific network conditions.
- **Do not guess or fake verification.**
- State explicitly in your PR or ledger that you could not fully verify it due to environment limits.
- Provide a minimal verification script or clear instructions for the human user to run on their end to complete the verification.

## When is it "Done"?
A task is done when the verification evidence is recorded, repeatable, and conclusively proves that the change behaves exactly as intended.

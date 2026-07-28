# PR Policy Notes

Welcome to the VaultWares PR (Pull Request) policy! This guide explains our expectations for code review, ensuring that every change merged into our main branches is safe, verified, and well-understood.

## The Purpose of a PR

A Pull Request is not just a mechanism to merge code; it is a request for a conversation. It is where you explain to your peers *what* you did, *why* you did it, and *how* you know it works.

## Guidelines for Pull Requests

### 1. Keep the Scope Tight
A PR should do exactly one thing. If you find yourself writing a PR title with the word "and" (e.g., "Added login feature and refactored the database schema"), your PR is too large. Break it down. Small PRs are easier to review, faster to merge, and safer to revert if something goes wrong.

### 2. Include Verification Evidence
You must prove your code works. A PR description should always include:
- What changed.
- How you verified it (e.g., "Ran unit tests," "Tested manually on staging").
- Evidence of the verification (e.g., screenshots for UI changes, terminal output for CLI changes).

### 3. Handle CI Failures Responsibly
If the Continuous Integration (CI) pipeline fails on your PR, **you must fix it or explain why it is unrelated.**
- If the failure is genuinely unrelated to your changes (e.g., a flaky network test), state this explicitly in the PR comments and propose a follow-up issue to fix the flaky test. Do not just ignore the red X.

### 4. Never Merge Directly to Main
All changes must go through the PR process and be approved by the required reviewers. Merging directly to `main` without review is strictly prohibited unless explicitly instructed during an active incident.

## When is it "Done"?
A PR is ready for review when the scope is focused, all CI checks pass (or are explicitly accounted for), required reviewers are tagged, and clear verification evidence is provided in the description.

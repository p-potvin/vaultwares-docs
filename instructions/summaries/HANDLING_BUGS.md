# HANDLING_BUGS
Applies when: a bug/defect is reported or discovered.
Do:
- Diagnose the root cause before changing the environment (read the logs; no blind reinstalls).
- Reproduce the defect, then add a regression test that fails before the patch and passes after.
- Decide fix-now vs defer using token budget: fix now only if the full loop (diagnose+patch+verify+reply) is expected to fit within <=6000 tokens.
- If deferring: record the diagnosis, reproduction, and remaining work in the ledger (and the repo's CHANGES/roadmap .md) so the next agent can resume without re-deriving it.
- Audit for the same pattern elsewhere before calling it done.
Do not:
- Ship a fix with no reproduction and no regression coverage.
Done when:
- Root cause is understood, the patch is verified locally, and regression coverage exists — or the defer is recorded with clear ownership.

Changed Sun, 02 Aug 2026: dropped the "create a GitHub issue first" requirement. GitHub issues are no longer tracked; continuity lives in the agent-ledger and repo CHANGES/roadmap files.

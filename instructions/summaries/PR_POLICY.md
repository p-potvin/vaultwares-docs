# PR_POLICY
Applies when: creating or updating PRs, requesting review, CI enforcement.

## PRs are the delivery mechanism, not an optional step

Every change reaches `main` through a PR reviewed by the user. See
GIT_BRANCH_POLICY for the branching rule; `agent-ledger` is the sole exception.

Do:
- Open a PR for the work rather than pushing to `main`.
- Keep PR scope tight; one concern per PR.
- State in the PR body: what changed, how it was verified (with actual output,
  not claims), and what remains unverified or risky.
- Add the required reviewers specified by repo policy.
- Say plainly if a check was skipped or a test failed. A PR that hides a failure
  is worse than one that reports it.

Do not:
- Merge to `main` yourself, including your own PR, unless explicitly instructed.
- Bundle unrelated fixes into one PR to save round-trips.
- Claim verification you did not run.

Done when:
- PR is published, scoped, and includes what changed, how verified, and
  remaining risks — and the user is the one who merges it.

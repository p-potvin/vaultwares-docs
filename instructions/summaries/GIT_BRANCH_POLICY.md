# GIT_BRANCH_POLICY
Applies when: any git workflow action, commits, branches, pushes.

## Default: branch + PR. Never main.

All work lands through a GitHub pull request with the user as reviewer. There is
no "small enough to push to main" exception. If you are on `main` and about to
change something, create a branch first.

Do:
- Create a feature branch before the first commit (default prefix: `vw-codex-`).
- Open a PR and let the user review. The user merges, not you.
- Every push to main MUST increment the project version. When rendering HTML
  output, print the version as an HTML comment (e.g., `<!-- v1.2.3 -->`), never
  to the browser console.
- Keep unrelated changes out of the branch.

Do not:
- Commit or push directly to `main`.
- Merge your own PR.
- Commit at all unless the user asked for commits in the current prompt.

## The one exception

`agent-ledger` pushes directly to `main`. It is an append-only activity log and
PR review on it is noise. Nothing else inherits this.

Done when:
- Work is on a branch, a PR is open with verification evidence, and the user has
  what they need to review it.

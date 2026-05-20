# GIT_BRANCH_POLICY
Applies when: any git workflow action, commits, branches, pushes.
Do:
- If on branch main: do not commit unless the user explicitly requested commits in the current prompt.
- Prefer a feature branch (default prefix: vw-codex-).
- Keep unrelated changes out of the branch.
Do not:
- Commit/push on main without explicit instruction.
Done when:
- Branch state is clean, isolated, and ready for review.

# CLEANUP_REFACTOR
Applies when: refactoring, decluttering, reorganizing, large edits without new user-facing functionality.
Do:
- Write a cleanup plan before editing.
- Lock behavior with tests or concrete verification steps first.
- Prefer deletion over addition; keep diffs small and reversible.
Do not:
- Mix refactor with unrelated feature work.
Done when:
- Behavior is unchanged (or explicitly declared) and verification evidence exists.

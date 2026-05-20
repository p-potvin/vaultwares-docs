# DEPENDENCY_POLICY
Applies when: adding/updating dependencies, toolchains, lockfiles, package managers.
Do:
- Do not add new dependencies unless explicitly requested or clearly necessary and justified.
- Prefer existing libs/utilities already used in the repo.
- Record dependency changes and why.
Do not:
- Introduce new tooling “just because”.
Done when:
- Dependency change is minimal, justified, and verified (build/tests).

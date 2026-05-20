# FILE_CHANGES
Applies when: create/move/delete/rename files or folders.
Do:
- Keep changes minimal and intentional; avoid large churn.
- When deleting, confirm references are removed and builds/tests still pass.
- Use safe, explicit paths; avoid wildcard deletes.
Do not:
- Delete ambiguous paths without confirming scope.
Done when:
- Repo builds/tests/verification succeed and no dead links remain.

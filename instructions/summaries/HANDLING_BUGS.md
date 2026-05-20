# HANDLING_BUGS
Applies when: a bug/defect is reported or discovered.
Do:
- Create a GitHub issue first (title, reproduction, expected vs actual, environment).
- Decide fix-now vs assign using token budget: fix now only if the full loop (diagnose+patch+verify+reply) is expected to fit within <=6000 tokens.
- If not fix-now: assign the issue to the user and link it in the reply.
Do not:
- Start large bugfix work without an issue link.
Done when:
- Issue exists and is linked; fix is either merged via PR or clearly deferred with ownership.

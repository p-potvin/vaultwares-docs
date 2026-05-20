# DEPLOYMENT_POLICY
Applies when: deploying, VPS changes, release operations, production routing.
Do:
- Tailnet-first admin; minimize blast radius; keep rollback path.
- Verify deploy behavior with concrete probes and UI checks when relevant.
Do not:
- Deploy from assumptions; verify the actual environment state.
Done when:
- Deploy steps and verification evidence are recorded.

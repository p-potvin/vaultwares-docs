# DEPLOYMENT_POLICY
Applies when: deploying, VPS changes, release operations, production routing.
Do:
- Tailnet-first admin; minimize blast radius; keep rollback path.
- Verify deploy behavior with concrete probes and UI checks when relevant.
- For VaultWares deployments, always consult:
  - `docs-content/operations/deployment-flow.mdx`
  - `docs-content/operations/services-inventory.mdx`
  - `docs-content/operations/webhook-secret-rotation.mdx` (when rotating webhook secrets)
  - `docs-content/operations/deploy-alerts.mdx` (when touching the notify/deny-watch pipeline or rotating `GH_TOKEN`)
Do not:
- Deploy from assumptions; verify the actual environment state.
Done when:
- Deploy steps and verification evidence are recorded.

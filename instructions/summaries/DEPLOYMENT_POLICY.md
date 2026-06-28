# DEPLOYMENT_POLICY
Applies when: deploying, VPS changes, release operations, production routing, (greencloud|ovh|ovhcloud|tailnet) (service|server|website|site|app|project).


## New deployments policy

Before going further with your new deployment, plan for all of this:
- Your deployment has a hostname associated. This hostname is in the tailnet DNS config. It is also configured in dnsmasq on greencloud.
- Your deployment's environment is reachable by every other tailnet members on port 53, 80, 443 and other ports you may need.
- Your deployment is configured inside vault-monitor. It is shown in the health-ledger dashboard.
- Your deployment is being monitored by a Joker Probe
- Your deployment's CI is configured to follow: "push to main branch -> send signed tailscale webhook to server -> self-hosted runner pulls from github and deploys the new files"

## What to do when handling deployments

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

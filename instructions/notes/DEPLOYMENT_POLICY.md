# Deployment Policy Notes

Welcome to the VaultWares deployment policy! This document outlines our standard operating procedures for moving code from our repositories into live, running environments.

## The Goal of Deployments

Deployments should be boring, predictable, and reversible. We aim to eliminate manual steps, relying entirely on automated pipelines and clear runbooks to ensure that what we test is exactly what we deploy.

## Core Deployment Guidelines

### 1. Consult the Documentation First
If the task involves CI, webhooks, or deployments, you must read the relevant operational runbooks before acting. Key files include:
- `docs-content/operations/deployment-flow.mdx` (The overarching flow)
- `docs-content/operations/services-inventory.mdx` (What runs where)
- `docs-content/operations/deploy-alerts.mdx` (Our notification pipeline)

### 2. Versioning is Mandatory
Every push to the `main` branch that triggers a deployment **MUST increment the project version**.
- If you are generating HTML output, the version must be injected as an HTML comment (e.g., `<!-- v1.2.3 -->`).
- **Crucial Rule:** Never log version numbers or build details to the browser console where they can clutter output.

### 3. CI/CD Runners
We do not rely on outside, GitHub-hosted runners for VaultWares infrastructure. All deployments must use our self-hosted runners to ensure network security and tailnet access.

### 4. Troubleshooting on greencloud-vps
When tracking down a missing auto-deploy, check this order:
1. tail /var/log/vw-webhookd.log - look for a push: repo=... line for the SHA.
   - If absent, the signature was rejected (deny: bad_signature).
   - If present but no run: line follows, vw_jira_sync exited non-zero on an unpatched webhookd.
   - If run: is there but exit= is non-zero, the deploy script itself failed.
2. tail /var/log/vw-deploy-notify.log - confirms whether the alert hop fired.
3. Verify deploy script invariants (lock perms, rsync -rltD, wp-cli sudo wrapper, no git fetch origin SHA).

### 4. Secret Rotation and Access
Deployments often require secrets (like GitHub App private keys or webhook tokens).
- Prom-King deploy git authentication is based on a GitHub App. If deployments are failing due to auth, rotate the App private key and verify installation access. **Do not attempt to fix deploy access with a Personal Access Token (PAT).**
- Reference the `webhook-secret-rotation.mdx` runbook when dealing with webhook stamps.

## When is it "Done"?
A deployment setup or update is complete when the CI/CD pipeline runs cleanly on self-hosted runners, the version is properly incremented and stamped, and any relevant secrets are securely managed according to our rotation runbooks.

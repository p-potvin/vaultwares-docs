# SECRETS_HANDLING
Applies when: .env, tokens, credentials, SSH keys, API keys, VaultWarden, secrets systems.
Do:
- Do not log secrets into the agent ledger, docs, issues, or terminal transcripts.
- Prefer storing secrets in VaultWarden (`warden.vaultwares.ca`) now.
- Reference secret names/locations, not values.
- When writing secrets to a Linux env file from Windows, **strip CRLF** with
  `sed -i 's/\r//g' <file>` — Windows editors silently embed `\r` and
  every value becomes garbage. This bit `/etc/vw-webhookd/env`'s `GH_TOKEN`
  on 2026-05-30 (see `docs-content/operations/deploy-alerts.mdx` and the
  webhook-secret-rotation runbook).
- Fine-grained PATs are scoped per-org. When you rotate one, verify it
  resolves a repo in **every** org it needs to touch — a one-org scope
  silently 404s on the others.
Do not:
- Commit secrets or paste them into markdown.
Done when:
- No secret values appear in diffs, logs, or replies.

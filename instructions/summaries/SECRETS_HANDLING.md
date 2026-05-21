# SECRETS_HANDLING
Applies when: .env, tokens, credentials, SSH keys, API keys, VaultWarden, secrets systems.
Do:
- Do not log secrets into the agent ledger, docs, issues, or terminal transcripts.
- Prefer storing secrets in VaultWarden (`warden.vaultwares.ca`) now.
- Reference secret names/locations, not values.
Do not:
- Commit secrets or paste them into markdown.
Done when:
- No secret values appear in diffs, logs, or replies.

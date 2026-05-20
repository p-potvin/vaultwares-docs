# SECRETS_HANDLING
Applies when: .env, tokens, credentials, SSH keys, API keys, Vaultwarden, secrets systems.
Do:
- Do not log secrets into the agent ledger, docs, issues, or terminal transcripts.
- Prefer storing secrets in Vaultwarden now; plan for VaultWares Secrets as primary.
- Reference secret names/locations, not values.
Do not:
- Commit secrets or paste them into markdown.
Done when:
- No secret values appear in diffs, logs, or replies.

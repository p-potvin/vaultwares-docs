# Secrets Handling Policy Notes

Welcome to the VaultWares secrets handling policy! This guide outlines our absolute zero-tolerance rules for managing API keys, tokens, SSH keys, and passwords.

## The Golden Rule of Secrets

**Secrets belong in secure vaults, never in source code, logs, or chat transcripts.**

Once a secret is committed to a Git repository, it is compromised forever. Even if you delete the file in the next commit, the secret lives on in the git history.

## Guidelines for Handling Secrets

### 1. No Secrets in Plain Text
- **Never** log secrets into the agent ledger.
- **Never** paste them into markdown documentation or issue trackers.
- **Never** print them to terminal transcripts or browser consoles.
- When documenting systems, reference the secret's name or location (e.g., "Fetch `STRIPE_API_KEY` from VaultWarden"), not the value itself.

### 2. VaultWarden is the Source of Truth
We prefer storing secrets in VaultWarden (`warden.vaultwares.ca`). If you need a credential, it should be retrieved from the vault via secure environment variables or automated injection, not hardcoded into scripts.

### 3. The Windows/Linux Line-Ending Trap
When writing secrets to a Linux `.env` file from a Windows environment, Windows editors will silently embed `\r` (Carriage Return) characters at the end of the line. This turns valid tokens into garbage.
- **Always strip CRLF** using a command like `sed -i 's/\r//g' <file>`.

### 4. GitHub App Keys over PATs
For deployments (like Prom-King), we use GitHub App private keys (/etc/vw-github-app/private-key.pem), not Personal Access Tokens (PATs). If deployments fail, rotate the App private key; do not attempt to bypass it with a PAT.

Note that /etc/vw-webhookd/env on greencloud-vps is mode 0640, owner root:vwdeploy and holds both VW_GITHUB_WEBHOOK_SECRET and GH_TOKEN (used by legacy alert scripts). Also, vw-token-expiry-watch.timer is legacy; Token Joker owns active credential tracking.

### 5. Incident Response for Secrets
If you suspect a secret was accidentally committed or logged, **stop immediately.** Do not try to quietly remove it. Propose a mitigation plan (rotate the key, revoke access, and scrub the git history) before proceeding with any other work.

## When is it "Done"?
Secret handling is correct when no secret values appear in code diffs, logs, ledgers, or chat replies, and all services are configured to pull credentials from secure, centralized storage.

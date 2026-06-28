# SECRETS_HANDLING notes
If you suspect a secret was committed, stop and propose a mitigation plan (rotate, revoke, scrub history) before proceeding.

`/etc/vw-webhookd/env` on `greencloud-vps` is mode `0640`, owner `root:vwdeploy`.
It holds **both** `VW_GITHUB_WEBHOOK_SECRET` (the webhook stamp) and
`GH_TOKEN` (the fine-grained PAT used by `vw-deploy-notify.sh` and
`vw-deny-watch.sh` to open legacy alert issues). Prom-King deploy git auth uses
the GitHub App private key at `/etc/vw-github-app/private-key.pem`, not
`GH_TOKEN`. Rotation procedures:
- `VW_GITHUB_WEBHOOK_SECRET` → `docs-content/operations/webhook-secret-rotation.mdx`
- Prom-King deploy App key → `health-ledger/runbooks/rotate-github-deploy-app.md`

`vw-token-expiry-watch.timer` is legacy. Token Joker owns active credential
tracking.

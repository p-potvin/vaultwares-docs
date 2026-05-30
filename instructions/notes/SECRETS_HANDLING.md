# SECRETS_HANDLING notes
If you suspect a secret was committed, stop and propose a mitigation plan (rotate, revoke, scrub history) before proceeding.

`/etc/vw-webhookd/env` on `greencloud-vps` is mode `0640`, owner `root:vwdeploy`.
It holds **both** `VW_GITHUB_WEBHOOK_SECRET` (the webhook stamp) and
`GH_TOKEN` (the fine-grained PAT used by `vw-deploy-notify.sh` and
`vw-deny-watch.sh` to open alert issues). Rotation procedures:
- `VW_GITHUB_WEBHOOK_SECRET` → `docs-content/operations/webhook-secret-rotation.mdx`
- `GH_TOKEN` → `docs-content/operations/deploy-alerts.mdx#token-rotation-every-30-days`

`vw-token-expiry-watch.timer` files a rotation issue 7 days before expiry.

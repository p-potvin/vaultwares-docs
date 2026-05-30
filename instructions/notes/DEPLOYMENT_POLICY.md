# DEPLOYMENT_POLICY notes
If deployment touches nginx, record the exact vhost paths and any TLS assumptions.

When tracking down a missing auto-deploy, check this order on `greencloud-vps`:
1. `tail /var/log/vw-webhookd.log` — look for a `push: repo=…` line for the SHA.
   - If absent, the signature was rejected (`deny: bad_signature`).
   - If present but no `run:` line follows, `vw_jira_sync` exited non-zero
     on an unpatched webhookd (see `deployment-flow.mdx#vw_jira_sync-non-blocking`).
   - If `run:` is there but `exit=` is non-zero, the deploy script itself failed.
2. `tail /var/log/vw-deploy-notify.log` — confirms whether the alert hop fired
   and whether the issue was filed.
3. The deploy script invariants listed in `deployment-flow.mdx#deploy-script-invariants`
   are the recurring gotchas (lock perms, rsync -rltD, wp-cli sudo wrapper,
   no `git fetch origin <SHA>`).

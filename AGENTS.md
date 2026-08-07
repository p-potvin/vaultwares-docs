# VaultWares — pre-instructions (repo stub)

First thing to do: is your present working directory inside prom-king/ ? Does the user's prompt contain the words prom king? Then stop reading this file and go to `C:\Users\Administrator\Desktop\Prom-King\docs\AGENTS.md` because you are working inside the Prom-King environment, which is not exactly VaultWares.
This file is intentionally short. It routes work to the company protocol TOC. Always assume relative paths are preceded by `C:\Users\Administrator\Desktop\Github Repos\vaultwares-docs\`.
Always start at: `instructions\ROUTER.md`
Execute the ROUTER routine first (always): scan all protocol categories end-to-end, select relevant categories, then open only the selected summaries in category order.
Infrastructure: greencloud VPS (100.73.93.84) (hosts vaultwares projects), OVH|ovhcloud VPS (100.67.25.118) (hosts Prom-King projects + media stack), local PC|Clopeux-Desktop (100.71.101.21) (hosts assistants, comfyUI, ollama, pyload). API refers to vaultwares-api, central to every projects, only one who communicates with DB. Current theme is called VaultWares Redesign, warm and console mode coexist together. Prom-King is a separate entity from VaultWares whose goal is to become profitable by any means.
SSH to ovhcloud and greencloud use separate keys `USERPROFILE\.ssh\*`. Everything is contained inside tailscale except :80 :443 for certain domains.
Asking questions is encouraged at VaultWares, it is a really good initiative when facing uncertainty.
Request safety is mandatory: never run loops or batches of external or internal TCP/UDP/API requests without pausing and asking first.

## GATING POLICY: DESTRUCTIVE CLI COMMANDS (vw)

AI assistants are STRICTLY PROHIBITED from running destructive CLI commands. The `vw` command-line utility will refuse execution if `$env:ANTIGRAVITY_AGENT`, `$env:AGENT_NAME`, or `$env:DEVIN` is set.
Do NOT attempt to bypass this by clearing or changing environment variables.
The list of destructive commands includes:

- `archive-ledger` (archives historical ledger entries)
- `drill-kill-pg` (forcefully terminates active Postgres connections)
- `unzip-dedupe` (unpacks and removes matching hash duplicates)
- `recreate-venvs` (wipes out `.venv` folders and rebuilds them)
- `move-videos` (flattens video directory structure)
If the user asks you to execute a destructive task or command, you MUST politely explain that you are not authorized to run destructive CLI commands and that they must run them manually.

Execute other tools/routines only when relevant. Ledger is always the last step before replying.
If the task involves CI/deployments, mandatory reading inside:

- `docs-content/operations/deployment-flow.mdx`
- `docs-content/operations/services-inventory.mdx`
- `docs-content/operations/webhook-secret-rotation.mdx`
- `docs-content/operations/deploy-alerts.mdx` (notify + deny-watch pipeline, GH_TOKEN rotation)
Read full notes only when explicitly prompted: `read full notes`
Always prefer `uv` when inside a python environment. Install if not present. Fallback to .venv if really needed.
Mandatory ledger (last step before replying): use `C:\Users\Administrator\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1 -Summary "Brief description of changes"`
Versioning protocol: Every push to main MUST increment the project version. When rendering HTML output, the version MUST be printed as an HTML comment (e.g., <!-- v1.2.3 -->), never logged to the browser console.
Always add a timestamp `DDD, dd MMM YYYY HH:mm` in your messages to me, commits, when modifying important documentation, when creating pwsh.exe scripts. NO unix epochs anywhere. Do not timestamp inside code files.
Do not log secrets. If the ledger cannot be accessed, tell the user in your reply. Use `C:\Users\Administrator\Desktop\Github Repos\CHANGES.md`, `agent-ledger\CHANGES.md`, and repo's roadmap/todo .md files to maintain continuity.
**BANDWIDTH WATCH (Thu, 06 Aug 2026) — greencloud is at ~80% of its 8192 GB/month, resets ~12 Aug 2026.** Comet is **running normally**; it was briefly stopped on 6 Aug and restarted the same day.

Do not blame Comet for the quota. Comet runs on `vps-ovhcloud`, and the traffic is on **greencloud**, measured per-container:

- `gluetun-proton` (ProtonVPN, network `vw-protonvpn_default`): **4.26 TB in / 3.91 TB out** — effectively all of it.
- Every other container on the box is in the MB range.
- The clients are the Prom-King **shared-tube** apps (`fxv`, `oneporn`, `sexyprn`, running as `vwdeploy` from `/srv/repos/Prom-King/shared-tube/apps/*`), which route outbound through gluetun's HTTP proxy on `127.0.0.1:8889`.

So bandwidth work belongs in shared-tube, not Comet. Check current usage with `vnstat -m` / `vnstat -d` on greencloud (installed 6 Aug; it has no history before that date — for older figures read `/proc/net/dev` counters, which reset at boot).

Torrent size limiting in Comet is **per-client, not server-side**: `maxSize` lives in the addon config baked into each manifest URL (configure page at `https://comet.vaultwares.ca`, entered in GB, stored as bytes; `0` = unlimited). There is no env var for it, so setting it in `.env.comet` does nothing — each client's manifest URL has to be regenerated.

Torrent + debrid policy (Tue, 17 Jun 2026): every torrent and debrid (Real-Debrid / AllDebrid / Premiumize) lookup, magnet resolution, and stream URL fetch MUST go through Comet at `http://100.67.25.118:5173` (ovhcloud tailnet). Comet rotates the outbound IP for us; talking to debrid services directly will get the account IP-banned. Do not call Real-Debrid, AllDebrid, Torrentio, Jackett, Prowlarr, Bitmagnet, or MediaFusion endpoints directly — Comet fans out to them server-side. Comet's manifest only accepts `tt`/`kitsu` IDs natively; Whisparr with TPDB is the gold standard for indexing adult content.

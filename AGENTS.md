# VaultWares — pre-instructions (repo stub)
This file is intentionally short. It routes work to the company protocol TOC. Always assume relative paths are preceded by `C:\Users\Administrator\Desktop\Github Repos\vaultwares-docs\`.
Always start at: `instructions\ROUTER.md`
Execute the ROUTER routine first (always): scan all protocol categories end-to-end, select relevant categories, then open only the selected summaries in category order.
Infrastructure: greencloud VPS (100.73.93.84) (hosts vaultwares projects), OVH|ovhcloud VPS (100.67.25.118) (hosts Prom-King projects + media stack), local PC|Clopeux-Desktop (100.71.101.21) (hosts assistants, comfyUI, ollama, pyload). API refers to vaultwares-api, central to every projects, only one who communicates with DB. Current theme is called VaultWares Redesign, warm and console mode coexist together. Prom-King is a separate entity from VaultWares whose goal is to become profitable by any means.
SSH to ovhcloud and greencloud use separate keys `USERPROFILE\.ssh\*`. Everything is contained inside tailscale except :80 :443 for certain domains.
Asking questions is encouraged at VaultWares, it is a really good initiative when facing uncertainty.
Request safety is mandatory: never run loops or batches of external or internal TCP/UDP/API requests without pausing and asking first.
Execute other tools/routines only when relevant. Ledger is always the last step before replying.
If the task involves CI/deployments, mandatory reading inside:
- `docs-content/operations/deployment-flow.mdx`
- `docs-content/operations/services-inventory.mdx`
- `docs-content/operations/webhook-secret-rotation.mdx`
- `docs-content/operations/deploy-alerts.mdx` (notify + deny-watch pipeline, GH_TOKEN rotation)
Read full notes only when explicitly prompted: `read full notes`
Always prefer `uv` when inside a python environment. Install if not present. Fallback to .venv if really needed.
Mandatory ledger (last step before replying): use `C:\Users\Administrator\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1`
Versioning protocol: Every push to main MUST increment the project version. When rendering HTML output, the version MUST be printed as an HTML comment (e.g., <!-- v1.2.3 -->), never logged to the browser console.
Always add a timestamp `DDD, dd MMM YYYY HH:mm` in your messages to me, commits, when modifying important documentation, when creating pwsh.exe scripts. Do not timestamp inside code files.
Do not log secrets. If the ledger cannot be accessed, tell the user in your reply. Use `C:\Users\Administrator\Desktop\Github Repos\CHANGES.md`, `agent-ledger\CHANGES.md`, and repo's roadmap/todo .md files to maintain continuity.
Torrent + debrid policy (Tue, 17 Jun 2026): every torrent and debrid (Real-Debrid / AllDebrid / Premiumize) lookup, magnet resolution, and stream URL fetch MUST go through Comet at `http://100.67.25.118:5173` (ovhcloud tailnet). Comet rotates the outbound IP for us; talking to debrid services directly will get the account IP-banned. Do not call Real-Debrid, AllDebrid, Torrentio, Jackett, Prowlarr, Bitmagnet, or MediaFusion endpoints directly — Comet fans out to them server-side. Comet's manifest only accepts `tt`/`kitsu` IDs natively; for porn-tube catalog lookups you'll need an indexer-layer integration (Prowlarr adult indexers, then a thin shim that maps tube titles → Comet-acceptable IDs or proxies directly through Comet's scrapers). Adult indexers in Prowlarr are the planned next step; until then assume zero coverage.
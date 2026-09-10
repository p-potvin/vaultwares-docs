# VaultWares — pre-instructions (repo stub)

If user prompt or current working directory contains "prom king", STOP and switch to `%USERPROFILE%\Desktop\Prom-King\docs\AGENTS.md`.
All relative repo paths are relative to `%USERPROFILE%\Desktop\Github Repos\vaultwares-docs\`.

## Mandatory Entry Protocol

1. **ROUTER routine (always first):** Open `instructions/ROUTER.md`, scan protocol categories end-to-end, select relevant categories, then read summaries in category order.
2. **Path Variables:** Use `%USERPROFILE%` in docs, `$env:USERPROFILE` in PowerShell, and `$USERPROFILE` in Bash.
3. **Infrastructure:** `greencloud` (`100.73.93.84`: dnsmasq, tube sites, vw-secrets), `vps-ovhcloud` (`100.67.25.118`: vaultwares-api, Databases, Comet/media stack), `Clopeux-Desktop` (`100.71.101.21`: local AI models, ComfyUI, Ollama). SSH keys in `%USERPROFILE%\.ssh\*`.
4. **API Gateway:** `vaultwares-api` is the single central entrypoint and gateway to all databases.
5. **Safety:** Never run unapproved batch/loop TCP, UDP, or API requests.
6. **Ask Questions:** Whenever uncertain about something,stop to ask yourself if you really know where you're going and if you don't know for sure, pause and ask me.

## Rules & Operations

- **GATING POLICY (DESTRUCTIVE COMMANDS):** DO NOT run destructive `vw` CLI commands. The `vw` tool will refuse execution if tried. Do NOT attempt to bypass this. If requested, provide the command string for the user to execute manually.
- **CI / Deployments:** SSH into target hosts for real-time state. Mandatory reading: `docs-content/operations/` (`deployment-flow.mdx`, `services-inventory.mdx`, `webhook-secret-rotation.mdx`, `deploy-alerts.mdx`). Read full notes only when requested.
- **PowerShell: never mix `Remove-Item` with a `C:\Program Files` path in one command.** The permission guard scans the whole command string, sees the two together, and refuses with `Remove-Item on system path '"C:\Program' is blocked. This path is protected from removal.` — even when the `Remove-Item` targets a scratch directory and the `C:\Program Files` text is only part of a `$env:PATH` assignment (setting up CUDA, for example). Nothing is deleted and nothing is protected; the whole command is simply refused, which wastes the first call of almost every session. Avoid it by: doing deletions with `rm -rf` through the Bash tool instead, or writing to fresh unique directories so no delete is needed, or splitting the PATH setup and the deletion into two separate calls. Do NOT try to defeat the guard — treat it as a signal to restructure the command.
- **Python:** Prefer `uv venv --python 3.12`. Consolidate venvs. **DO NOT install CUDA libraries without verifying existing local installations (multi-GB breaking changes).**
- **Torrent & Debrid Policy:** Three separate torrenting/streaming entities. Each has its own Real-Debrid token and its own **Prowlarr tag** — the tag selects the provider set, so it must be correct per entity.
  1. **vault-streaming + vault-tv** — MUST route through Comet at `http://100.67.25.118:5173`, so their shared Real-Debrid token is only ever seen from a single IP. Comet manifest accepts `tt`/`kitsu` IDs. Prowlarr tag: `flaresolverr` (adult content).
  2. **Media stack** — its own Real-Debrid token. Reaches Prowlarr, decypharr, qBittorrent and SABnzbd directly. Not subject to the Comet rule.
  3. **vault-zipper** — Prowlarr tag `vault-zipper`. Shares the media stack's Real-Debrid key and tunnel.

  Comet is mandatory for entity 1 only. Direct Prowlarr/decypharr/qBittorrent/SABnzbd calls are correct and expected for entities 2 and 3. (The previous blanket "never call these directly" wording was overbroad: the multi-IP concern proved overstated and only ever applied to entity 1's shared token.)
- **Versioning & Timestamps:** Increment project version on `main` push (render version as HTML comment `<!-- v1.2.3 -->` in `<head>`). Use timestamp format `DDD, dd MMM YYYY HH:mm` in chat responses to humans, commits, docs, and pwsh scripts (NO Unix epochs). Do not timestamp inside code files.
- **Continuity & Secrets:** Do not log secrets. Maintain continuity via `%USERPROFILE%\Desktop\Github Repos\CHANGES.md` and `%USERPROFILE%\Desktop\Github Repos\agent-ledger\CHANGES.md`.

## Mandatory Agent Ledger (Last step before replying)

Execute:
`%USERPROFILE%\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1 -Summary "<what you changed>" -Kind "code-change|documentation|commands|verification|general" -Model "<your-model-name>" -AgentRole "main"`
*(PowerShell execution syntax: `powershell.exe -ExecutionPolicy Bypass -File "$env:USERPROFILE\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1" -Summary "<summary>" -Kind "..." -Model "..." -AgentRole "main"`)*
*(Agent Self-Metadata: `-Summary` mandatory brief description; `-Kind` type of change; `-Model` your AI model name e.g. "Gemini 3.6 Flash" / "Claude 3.7 Sonnet"; `-AgentRole` "main" or "subagent".)*
If agent-ledger is unreachable, state it in your reply and save it locally.

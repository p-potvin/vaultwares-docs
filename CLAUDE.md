# VaultWares — pre-instructions (repo stub)

If user prompt or $CWD contains "prom king", STOP and switch to `%USERPROFILE%\Desktop\Prom-King\docs\AGENTS.md`.
All relative repo paths are relative to `%USERPROFILE%\Desktop\Github Repos\vaultwares-docs\`.

## Mandatory Entry Protocol
1. **ROUTER routine (always first):** Open `instructions/ROUTER.md`, scan protocol categories end-to-end, select relevant categories, then read summaries in category order.
2. **Path Variables:** Use `%USERPROFILE%` in docs, `$env:USERPROFILE` in PowerShell, and `$USERPROFILE` in Bash.
3. **Infrastructure:** `greencloud` (`100.73.93.84`: dnsmasq, tube sites, vw-secrets), `vps-ovhcloud` (`100.67.25.118`: vaultwares-api, Databases, Comet/media stack), `Clopeux-Desktop` (`100.71.101.21`: local AI models, ComfyUI, Ollama). SSH keys in `%USERPROFILE%\.ssh\*`.
4. **API Gateway:** `vaultwares-api` is the single central entrypoint and gateway to all databases.
5. **Safety:** Never run unapproved batch/loop TCP, UDP, or API requests. Ask questions when facing ambiguity.

## Rules & Operations
- **GATING POLICY (DESTRUCTIVE COMMANDS):** DO NOT run destructive `vw` CLI commands. The `vw` tool will refuse execution if tried. Do NOT attempt to bypass this. If requested, provide the command string for the user to execute manually.
- **CI / Deployments:** SSH into target hosts for real-time state. Mandatory reading: `docs-content/operations/` (`deployment-flow.mdx`, `services-inventory.mdx`, `webhook-secret-rotation.mdx`, `deploy-alerts.mdx`). Read full notes only when requested.
- **Python:** Prefer `uv venv --python 3.12`. Consolidate venvs. **DO NOT install CUDA libraries without verifying existing local installations (multi-GB breaking changes).**
- **Torrent & Debrid Policy:** ALL torrent/debrid lookups, magnet resolutions, and stream URL fetches MUST go through Comet at `http://100.67.25.118:5173`. Never call Real-Debrid, AllDebrid, Torbox, Torrentio, Jackett, Prowlarr, Bitmagnet, or MediaFusion directly. Comet manifest accepts `tt`/`kitsu` IDs.
- **Versioning & Timestamps:** Increment project version on `main` push (render version as HTML comment `<!-- v1.2.3 -->` in `<head>`). Use timestamp format `DDD, dd MMM YYYY HH:mm` in chat responses to humans, commits, docs, and pwsh scripts (NO Unix epochs). Do not timestamp inside code files.
- **Continuity & Secrets:** Do not log secrets. Maintain continuity via `%USERPROFILE%\Desktop\Github Repos\CHANGES.md` and `agent-ledger\CHANGES.md`.

## Mandatory Agent Ledger (Last step before replying)
Execute:
`%USERPROFILE%\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1 -Summary "<what you changed>" -Kind "code-change|documentation|commands|verification|general" -Model "<your-model-name>" -AgentRole "main"`
*(Agent Self-Metadata: `-Summary` mandatory brief description; `-Kind` type of change; `-Model` your AI model name e.g. "Gemini 3.6 Flash" / "Claude 3.7 Sonnet"; `-AgentRole` "main" or "subagent".)*
If agent-ledger is unreachable, state it in your reply.

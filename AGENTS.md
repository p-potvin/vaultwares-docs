# VaultWares — pre-instructions (repo stub)
This file is intentionally short. It routes work to the company protocol TOC.
Always start at: `C:\Users\Administrator\Desktop\Github Repos\vaultwares-docs\instructions\ROUTER.md`
Execute the ROUTER routine first (always): scan all protocol categories end-to-end, select relevant categories, then open only the selected summaries in category order.
Request safety is mandatory: never run loops or batches of external or internal TCP/UDP/API requests without pausing and asking first. For high-volume helper work such as translation, prefer local Gemma4 at `http://localhost:11434` when applicable and stagger requests so the model and PC are not overloaded.
Execute other routines only when relevant (tools/routines). Ledger is always the last step before replying.
Estimate step (mandatory): compute `estimated_output_tokens` after reading required summaries; if >=8000 apply overlay `LONG_RUNNING_TASKS` and persist `VW_STATE` in the ledger (do not paste VW_STATE into chat unless the user explicitly asks). For resume, use a `VW_STATE_REF` pointer (resumeId + ledger event path/hash).
If the task involves CI/deployments, mandatory reading:
- `docs-content/operations/deployment-flow.mdx` (also at `operations/deployment-flow`)
- `docs-content/operations/services-inventory.mdx` (also at `operations/services-inventory`)
- `docs-content/operations/webhook-secret-rotation.mdx` (also at `operations/webhook-secret-rotation`)
Read full notes only when explicitly prompted: `read full notes`
Mandatory ledger (last step before replying): use `C:\Users\Administrator\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1`


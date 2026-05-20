# VaultWares Knowledge Scout Report

This file is a shared, high-value intelligence ledger for AI Assistants. It contains hard-to-find information, project-specific quirks, and solutions to "expensive" problems (those requiring excessive tool calls or research).

## Consulting Parameters (Mandatory)

Assistants MUST consult this file ONLY under these conditions:
1. **Session Initialization**: Once per Conversation ID, during the first substantive research step.
2. **Canonical Failure**: If a search for a Source of Truth (SoT) file fails.
3. **High-Value Context**: Tasks involving `VPS`, `SSH`, `HSM`, `deployment`, `credential`, or `submodule`.

## Intelligence Ledger

| Date | Project / Context | Finding / Solution | Cost Saved |
|------|-------------------|-------------------|------------|
| 2026-05-11 | vaultwares-docs | **Tailwind 4 Build Fix**: Tailwind 4 requires `@plugin` syntax instead of old CSS imports for custom extensions. Use `npm run build` to verify Vite integration. | High (Deep debugging) |
| 2026-05-11 | vaultwares-themes | **Theme Reorganization**: All language-specific managers (Python, TS, C#, TW) are consolidated in `theme-manager/exports/`. Do not modify `VaultWares.Brand.xaml` or `sync_submodule_rules.py`. | Medium (Path discovery) |
| 2026-05-11 | Shared | **Bilingual Priority**: All user-facing strings MUST be EN (English) and QC (Quebec French). QC strings are typically 15-20% longer; design layouts accordingly. | Low (Compliance) |
| 2026-05-20 | vw-jira-sync | **GitHub repo rename → Jira sync**: Renaming a GitHub repo without updating vw-jira-sync creates duplicate Jira issues. Full 6-step procedure in `vaultwares-docs/docs-content/operations/jira-sync.mdx` and RENAMING protocol. Must: (1) update `repo_project_keys` + `repos` in `config.yaml`, (2) `Copy-Item mapping\old.json mapping\new.json` + `Remove-Item mapping\old.json`, (3) `python scripts/backfill.py --repo new-name`, (4) re-deploy caller workflow. Tested on `i-dub-thee → vaultwares-asttro`. | High (duplicate issues, data cleanup) |

## Scout Entry Protocol
When you solve an "expensive" problem (>3 tool calls or >5 min research), append a new row to the table above. Keep descriptions concise but technical.

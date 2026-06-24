# SKILL_SYNC
Applies when: authoring, editing, or disseminating an agent skill across hosts (Claude Code, Codex, Gemini, OpenCode, Windsurf, VS Code).
Do:
- Source of truth = `vaultwares-docs/skills/<name>/SKILL.md` (folder per skill, YAML frontmatter `name` + `description` + optional `metadata`).
- Author new skills via the `create-skill` skill — it runs the interrogation, drafts, confirms, then triggers sync.
- After any source change, disseminate with: `vaultwares-docs/scripts/sync-global-skills.ps1 [-SkillName <name>] [-DryRun]`.
- Per-host adapters: Claude Code / Codex / Gemini / OpenCode = verbatim folder copy; Windsurf = flattened markdown (no frontmatter); VS Code = `<name>.prompt.md` with `mode: agent` + `description`.
- Verify the 8 on-disk targets before claiming done.
Do not:
- Hand-edit per-host skill files. Source is authoritative; targets are overwritten.
- Push to disk before the user has confirmed the draft.
- Add new host targets without also updating the registry inside `sync-global-skills.ps1`.
Done when:
- `vaultwares-docs/skills/<name>/SKILL.md` exists, sync ran without warnings, 8 targets are present on disk, ledger event recorded.

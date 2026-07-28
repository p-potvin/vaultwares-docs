# Skill Sync Policy Notes

Welcome to the VaultWares skill sync policy! This guide explains how we author, edit, and disseminate agent skills across multiple AI hosts and IDEs.

## The Challenge of Multiple Hosts

We use several different AI assistants (Claude Code, Codex, Gemini, OpenCode, Windsurf, VS Code). Each has its own preferred format and location for storing "skills" or "custom instructions." Managing these manually is impossible.

## Guidelines for Synchronizing Skills

### 1. The Source of Truth
The definitive source for any skill is always `vaultwares-docs/skills/<name>/SKILL.md`.
- Each skill gets its own folder (e.g., `<kebab-name>`) so that future assets like images or child reference files can live next to it.
- The file must contain specific YAML frontmatter (name, description, metadata) that the sync scripts rely on.

### 2. Authoring via the Agent
Do not author new skills by manually typing out markdown files if possible.
- Use the `create-skill` agent skill. It runs an interrogation flow, drafts the skill, asks for user confirmation, and then automatically triggers the sync.
- Never push a draft skill to disk before the user has explicitly confirmed it (`ship`, `go`, `yes`).

### 3. Dissemination (The Sync Script)
After *any* change to the source file, you must disseminate it using the sync script:
`vaultwares-docs/scripts/sync-global-skills.ps1 [-SkillName <name>] [-DryRun]`

The script handles the translation to different host adapters:
- **Verbatim Copy:** Claude Code, Codex, Gemini, OpenCode.
- **Flattened (No Frontmatter):** Windsurf (description hoisted to a leading italic line).
- **VS Code Prompt:** Rewrites frontmatter to `mode: agent` + description.

### 4. Do Not Hand-Edit Targets
**Never hand-edit the per-host skill files** (e.g., `~/.claude/skills/`). The source in `vaultwares-docs` is authoritative; any manual edits in the target directories will be aggressively overwritten the next time the sync script runs.

### 5. Verification
After running the sync, you must verify that the target files (usually 8 different locations on disk) were successfully created or updated.

## When is it "Done"?
A skill update is complete when the source file exists in `vaultwares-docs`, the sync script runs without warnings, all required targets are present on disk, and a ledger event is recorded detailing the sync.

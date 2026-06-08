# SKILL_SYNC notes

## Source layout
`vaultwares-docs/skills/<kebab-name>/SKILL.md`. Each skill is a folder so future assets (images, child reference files) can live next to it without breaking the sync's verbatim copy.

## Frontmatter contract (v1)
```yaml
---
name: <kebab-name>            # required, kebab-case, matches folder name
description: >                # required, multi-line scalar; enumerate verbatim trigger phrases
  <one paragraph...>
metadata:                     # optional
  author: vaultwares
  version: "1.0.0"
---
```
The script's parser handles `>`-folded multi-line `description` and flat `key: value` pairs. It does not handle nested arrays in frontmatter; if you add complex frontmatter (e.g. `allowed-tools: [a, b]`), extend `Parse-SkillFile` in `sync-global-skills.ps1` first.

## Host registry (kept inside the sync script)

| Host | Adapter | Target |
|---|---|---|
| Claude Code | verbatim | `~/.claude/skills/<name>/SKILL.md` |
| Codex | verbatim | `~/.codex/skills/<name>/SKILL.md` |
| Gemini | verbatim | `~/.gemini/skills/<name>/SKILL.md` |
| OpenCode | verbatim | `~/.config/opencode/skills/<name>/SKILL.md` |
| Windsurf | flatten | `~/.codeium/windsurf/memories/skills/<name>.md` (no frontmatter; description hoisted to a leading italic line) |
| VS Code | prompt.md | `$APPDATA/Code/User/prompts/<name>.prompt.md` (frontmatter rewritten to `mode: agent` + `description`) |

Claude Desktop is intentionally skipped — no per-skill primitive.

## Authoring flow (use the create-skill skill)
1. User asks for a new skill → `create-skill` triggers and runs an interrogation (7–12 questions, each with ≥3 choices + free-text).
2. Draft is written to `vaultwares-docs/skills/<name>/SKILL.md` and shown back.
3. User confirms with `ship` / `go` / `yes`.
4. Agent runs `sync-global-skills.ps1 -SkillName <name>`.
5. Agent verifies six on-disk targets exist.
6. Ledger event recorded with `-Kind "code-change,verification"` and `-Project "vaultwares-docs"`.

## Useful invocations
```powershell
# Disseminate every skill in the source folder
./scripts/sync-global-skills.ps1

# Disseminate one skill
./scripts/sync-global-skills.ps1 -SkillName grill-me

# Dry run — print intended paths only
./scripts/sync-global-skills.ps1 -DryRun
```

## Out of scope (v1)
- Per-repo Cursor (`.cursor/rules/*.mdc`) and Copilot (`.github/prompts/*.prompt.md`) sync — would require repo enumeration.
- Two-way sync. Source is authoritative; per-host edits are overwritten.
- Scheduled / cron invocation. Manual only, matching `sync-global-instructions.ps1`.

## Related
- `GLOBAL_INSTRUCTION_SYNC` — sibling protocol for Tier-1 instructions (one file, marker-based).
- `KNOWLEDGE_SYNC` — durable knowledge in summaries/notes.
- `BRAND_TOKENS_UI` — relevant when a skill references VaultWares theme tokens (always the Redesign).

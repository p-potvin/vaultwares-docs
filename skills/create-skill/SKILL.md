---
name: create-skill
description: >
  Author a new VaultWares agent skill via a short, structured interrogation, then disseminate it to every connected host (Claude Code, Codex, Gemini, OpenCode, Windsurf, VS Code) as the final step. Trigger on ANY request to create/make/build/author/write a skill — "create a skill", "make a skill that...", "I want a skill for...", "build me a skill", "this should be a skill", "turn this into a skill", "improve this skill draft", "package this prompt as a skill", "let's write a skill". Also trigger when the user pastes a partial skill (a markdown blob, a SKILL.md fragment, or a frontmatter snippet) and asks to finish or polish it. Hard requirement: no skill is written to disk until the interrogation is closed AND the design contract is acknowledged; sync runs only after the SKILL.md is committed to the source folder.
metadata:
  author: vaultwares
  version: "1.0.0"
---

# create-skill

You are about to author a new agent skill. Do not write `SKILL.md` yet. Run the interrogation below, then write, then sync.

## Stages

1. **Interrogate** — resolve every field via 7–12 one-at-a-time questions, each with 3+ choices + free-text.
2. **Draft** — write the source file at `vaultwares-docs/skills/<name>/SKILL.md`. Show it back to the user inline.
3. **Confirm** — get a one-word "ship" / "go" / "yes" from the user.
4. **Disseminate** — run the sync script. Disk write happens **only** after confirmation.
5. **Ledger** — record the change.

## Hard rules

- One question at a time. Use AskUserQuestion when available.
- Each question has **≥3 concrete recommended choices + 1 free-text option**.
- If a question can be answered by reading the codebase (existing skills, related protocols, the user's prior drafts), **read instead of asking**. Scan `vaultwares-docs/skills/` and `~/.claude/skills/` for naming and tone conventions before Q1.
- Do not invent triggering phrases — pull them from the user's own words during the interview.
- Do not write to `~/.claude/skills/`, `~/.codex/skills/`, `~/.gemini/skills/`, `~/.config/opencode/skills/`, `~/.codeium/windsurf/memories/skills/`, or `$APPDATA/Code/User/prompts/` directly. Those are written **only** by the sync script.

## Question bank — cover every applicable item, in order

1. **Name** (kebab-case, lowercase). Suggest 3 options derived from the user's request. Free-text for custom.
2. **One-line purpose**. What does this skill make the agent do, in 12 words or less?
3. **Triggers — the description field**. This is the most important field; the skill won't fire without it. Collect:
   - Verbatim phrases the user expects to say to fire it (at least 5).
   - Adjacent task shapes (e.g. "anytime a user asks me to design a frontend" → `grill-me`).
   - Anti-triggers — phrasings that look similar but should NOT fire (note these explicitly so the agent learns the boundary).
4. **Behavioral mode** — pick one:
   - **Interrogation** (like `grill-me` / `create-skill`): forced Q&A before any output.
   - **Workflow** (like `firecrawl-*` / `deploy-to-vercel`): runs steps autonomously.
   - **Reference** (like `claude-api` / `web-design-guidelines`): the agent reads it for context, no forced steps.
   - **Hybrid** — describe in free-text.
5. **Hard rules** the agent must obey (3–7 bullets). Examples: "no code until X", "one question at a time", "always read Y before answering". Pull from the user's intent.
6. **Inputs / context the skill needs to read** — files, repos, web pages, MCP tools. Free-text list.
7. **Outputs** — what the skill produces. A plan? A PR? A summary? A series of questions? Edits to specific files?
8. **Closure / done condition** — when does the agent stop running this skill? Examples: "user types ship", "all questions answered", "PR opened", "file written".
9. **Tooling constraints** — `allowed-tools` / `model` overrides? Default: no override. Free-text if yes.
10. **Sync targets** — default is all 6 hosts in `sync-global-skills.ps1`. Ask only if the user wants to exclude any.
11. **Examples block** — does the skill need a worked example inside the body? Choices: short example / no example / link to existing reference. Authoring an example is recommended for `Workflow`-mode skills.
12. **Versioning** — first author? Then `version: "1.0.0"`. Otherwise bump per semver in `metadata.version`.

## Drafting rules

- Frontmatter shape (canonical, matches `~/.claude/skills/web-design-guidelines/SKILL.md`):
  ```yaml
  ---
  name: <kebab-name>
  description: >
    <one paragraph; enumerate every verbatim trigger phrase the user gave; state the hard goal; mention any deny-list>
  metadata:
    author: vaultwares
    version: "1.0.0"
  ---
  ```
- Body: H1 with the skill name, then sections in this order — **Hard rules**, **(skill-specific sections)**, **Closure**.
- Voice: terse, agent-targeted, second-person imperative. No marketing copy. No emojis unless the user asks.
- Keep the description field information-dense — it is the only field the host's skill router sees. Enumerate phrases verbatim so trigger matching is literal.
- For interrogation skills, fix Q1 verbatim and present the exact list of choices the user wants. Do not paraphrase.

## Dissemination — final step

After the user confirms with "ship" / "go" / "yes":

```powershell
& "C:\Users\Administrator\Desktop\Github Repos\vaultwares-docs\scripts\sync-global-skills.ps1" -SkillName <kebab-name>
```

Verify on disk by listing the six expected targets (5 verbatim + 1 .prompt.md):

- `~/.claude/skills/<name>/SKILL.md`
- `~/.codex/skills/<name>/SKILL.md`
- `~/.gemini/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`
- `~/.codeium/windsurf/memories/skills/<name>.md`
- `$APPDATA/Code/User/prompts/<name>.prompt.md`

If the user wants to update an existing skill instead of creating one, the flow is identical except: read the current `vaultwares-docs/skills/<name>/SKILL.md` first, bump `metadata.version`, and only ask questions about fields the user wants to change.

## Closure — design contract

Before disseminating, echo back a one-paragraph contract naming: skill name, behavioral mode, all triggering phrases, all hard rules, output shape, closure condition, sync target set, version. Ask "ship?". On "ship" → run sync → ledger with `-Kind "code-change,verification"` and `-Project "vaultwares-docs"`.

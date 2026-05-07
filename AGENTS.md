# VaultWares — AI Assistant Instructions

This is the **Tier 1 Source of Truth** for all VaultWares projects. Every AI
Assistant working in this workspace should read this file first.

## Lexicon

Standard terms used across all VaultWares projects (full reference:
`vaultwares-agentciation/docs/LEXICON.md`):

- **Host** — application container (VS Code, Claude Desktop, Windsurf, etc.)
- **AI Assistant** — the LLM service (Claude, ChatGPT, Gemini, Codex, etc.)
- **Agent** — a personality/role instance defined as a markdown file
- **Global Instructions Path** — the first file an AI Assistant reads on startup

## Company Overview

VaultWares builds enterprise security hardware and software: encrypted storage
devices, HSMs, biometric authentication, network security appliances, and
encryption software. The brand priority order is:

1. Privacy for individuals
2. Security in service of privacy
3. Functionality → Performance → Scalability → Developer experience

All user-facing strings must exist in English and French (Quebec French). Design
layouts to tolerate French strings being 15-20% longer than English.

Security-related UX must use post-quantum cryptography with ML-KEM. The server
must never read, persist, or reconstruct private keys or shared decryption keys.

## Mandatory: Agent Ledger

Record all completed work in the shared agent ledger as the **last step before
replying** (not at the start of a task):

```powershell
& "C:\Users\Administrator\Desktop\Github Repos\agent-ledger\scripts\record-agent-change.ps1" `
  -Project "<repo name or General Tasks>" `
  -Kind "<plan|commands|code-change|verification|handoff|general>" `
  -Summary "<1024-token max summary>" `
  -Commands @("<cmd1>", "<cmd2>") `
  -Files @("<file1>", "<file2>")
```

Do not log secrets. If the ledger cannot be accessed, say so in your reply.
Full protocol: `agent-ledger/AGENTS.md`.

## Design & Brand → vault-themes

Before any UI, branding, design token, or theme work, read:
- `vault-themes/AGENTS.md` — full design system rules, token reference, visual rules, quality gates
- `vault-themes/brand/brand-guide.md` — brand philosophy and identity

Never hardcode colors, fonts, or spacing. Use named tokens from `vault-themes`.

## AI Infrastructure → vaultwares-agentciation

For OMX operating contract, Agent definitions, delegation rules, Lore commit
protocol, and skill distribution, read:
- `vaultwares-agentciation/AGENTS.md`
- `vaultwares-agentciation/docs/LEXICON.md`

## Documentation Standards

This site (`vaultwares-docs`) uses Mintlify with MDX and YAML frontmatter.
Every page needs `title` and `description` in frontmatter. Use second-person
voice, relative paths for internal links, and language tags on all code blocks.
New pages must be added to `docs.json` navigation.

## Credit Optimization (when MCP is available)

If connected to the `vaultwares-mcp` server, run the credit optimization
pipeline before substantive tasks:

1. `credit_classify` — categorize the task intent
2. `credit_recommend` — get model tier recommendation
3. `credit_optimize` — compress the prompt if beneficial
4. `credit_analyze_batch` — check for batching opportunities (multi-prompt tasks)

Never reduce output quality to save credits.

## Source of Truth Hierarchy

| Tier | Repo | Governs |
|------|------|---------|
| 1 | `vaultwares-docs` | Company rules, mandatory protocols, pointers to tier-2 |
| 2 | `vault-themes` | Design tokens, brand, visual rules, theme manager |
| 2 | `vaultwares-agentciation` | OMX contract, Agents, Lore protocol, skills |
| 2 | `agent-ledger` | Ledger protocol, agent header, event schema |
| 3 | Each repo | Repo-specific rules only |

Narrower scope overrides broader. A repo's AGENTS.md overrides this file for
repo-specific concerns.

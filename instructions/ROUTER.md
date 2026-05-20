# VaultWares assistant TOC (router)
This file is the single entrypoint for VaultWares company protocols.
Default read target: summaries. Notes are human reference and are read only when the user explicitly says: read full notes.
Protocol categories are executed only when relevant.
## ROUTER routine (always, first)
1) Resume shortcut: if the prior assistant reply contains a VW_STATE block with resume.resumeMode=true, resume from that state:
- Do not re-run routing, routines, or estimates; use the stored routerCategories/protocolsSelected/overlaysApplied/estimate as-is.
- Set VW_STATE.interview.completed=true and continue execution.
- Do not re-trigger the interview gate again for the same resumeId.
2) Do a quick safety/scope check: if the request is ambiguous or risky, ask clarifying questions. Routing never replaces clarification.
3) Scan the full protocol category table below end-to-end, then select 1+ relevant categories.
4) Decide which other routines are relevant for this prompt (tools/routines, etc.).
5) Run relevant routines (if any).
6) Read the selected summary files in table order (mandatory).
7) Compute estimate: estimated_output_tokens for the task (mandatory). Tokens are the primary estimate. Time is derived if needed.
8) Apply overlay protocols driven by the estimate:
- If estimated_output_tokens >= 8000: add overlay LONG_RUNNING_TASKS (even if other protocols already match).
## Other routines (run only when relevant)
- Tools/routines (optional): if an MCP routine exists (credit optimization, batching, etc.), decide whether to run it. This does not change which protocols apply.
- Ledger (always, last step before replying): record completed work in agent-ledger. If you cannot access agent-ledger, state that in the reply and include a compact ledger block for later capture.
## Protocol categories (scan all; select relevant; read summaries in this order)
| Category | Applies when | Summary | Notes | Keywords (non-exclusive) |
|---|---|---|---|---|
| SOURCE_OF_TRUTH | Any VaultWares work; when unsure where to look | instructions/summaries/SOURCE_OF_TRUTH.md | instructions/notes/SOURCE_OF_TRUTH.md | ssot,sot,where is,source of truth |
| SUBMODULE_BOUNDARIES | Work touches submodules or vendored copies | instructions/summaries/SUBMODULE_BOUNDARIES.md | instructions/notes/SUBMODULE_BOUNDARIES.md | submodule,mirror,vendor |
| SECURITY_POSTURE | Any security/crypto/auth/key handling | instructions/summaries/SECURITY_POSTURE.md | instructions/notes/SECURITY_POSTURE.md | security,crypto,jwt,api key,keys |
| SECRETS_HANDLING | Tokens, credentials, env vars, secrets storage | instructions/summaries/SECRETS_HANDLING.md | instructions/notes/SECRETS_HANDLING.md | secret,.env,token,credential |
| NETWORK_INFRASTRUCTURE | Any networking, SSH, VPN, VPS, ports, CI runner egress | instructions/summaries/NETWORK_INFRASTRUCTURE.md | instructions/notes/NETWORK_INFRASTRUCTURE.md | tailnet,tailscale,ssh,vps,nginx,ports,runner |
| BILINGUAL_STRINGS | Any user-facing strings/copy/UI text | instructions/summaries/BILINGUAL_STRINGS.md | instructions/notes/BILINGUAL_STRINGS.md | en,qc,french,translation,i18n |
| BRAND_TOKENS_UI | Any UI/UX/design/branding/themes/tokens | instructions/summaries/BRAND_TOKENS_UI.md | instructions/notes/BRAND_TOKENS_UI.md | ui,ux,theme,tokens,brand |
| CLEANUP_REFACTOR | Refactors, cleanup, re-org, simplification | instructions/summaries/CLEANUP_REFACTOR.md | instructions/notes/CLEANUP_REFACTOR.md | refactor,cleanup,rewrite,declutter |
| FILE_CHANGES | Creating/moving/deleting files/folders | instructions/summaries/FILE_CHANGES.md | instructions/notes/FILE_CHANGES.md | create file,delete,rename,move |
| RENAMING | Renaming a GitHub repo, Jira project, or any cross-system tracked identifier | instructions/summaries/RENAMING.md | instructions/notes/RENAMING.md | rename,github rename,repo rename,jira rename |
| DEPENDENCY_POLICY | Adding/updating deps, toolchains, lockfiles | instructions/summaries/DEPENDENCY_POLICY.md | instructions/notes/DEPENDENCY_POLICY.md | dependency,npm,pip,cargo,upgrade |
| GIT_BRANCH_POLICY | Branching/commits/main branch rules | instructions/summaries/GIT_BRANCH_POLICY.md | instructions/notes/GIT_BRANCH_POLICY.md | git,branch,commit,merge,main |
| PR_POLICY | Publishing PRs, reviewers, CI expectations | instructions/summaries/PR_POLICY.md | instructions/notes/PR_POLICY.md | pr,pull request,review,ci |
| VERIFICATION | Any claim of working/correct/complete | instructions/summaries/VERIFICATION.md | instructions/notes/VERIFICATION.md | verify,tests,typecheck,lint |
| GUI_VERIFICATION | Web UI changes or docs UI changes | instructions/summaries/GUI_VERIFICATION.md | instructions/notes/GUI_VERIFICATION.md | ui,gui,frontend,docs,spa |
| DOCS_STANDARDS | Writing docs pages, frontmatter, navigation | instructions/summaries/DOCS_STANDARDS.md | instructions/notes/DOCS_STANDARDS.md | mdx,frontmatter,docs.json,navigation |
| GLOBAL_INSTRUCTION_SYNC | Editing Tier-1 global instructions | instructions/summaries/GLOBAL_INSTRUCTION_SYNC.md | instructions/notes/GLOBAL_INSTRUCTION_SYNC.md | sync,instructions,hosts |
| KNOWLEDGE_SYNC | Maintaining durable knowledge across repos | instructions/summaries/KNOWLEDGE_SYNC.md | instructions/notes/KNOWLEDGE_SYNC.md | knowledge,runbook,ssot,docs |
| KNOWLEDGE_SCOUT | Consulting or updating KNOWLEDGE_SCOUT.md | instructions/summaries/KNOWLEDGE_SCOUT.md | instructions/notes/KNOWLEDGE_SCOUT.md | scout,expensive,quirk |
| MULTI_AGENT_FLOW | Trigger phrases or multi-agent orchestration | instructions/summaries/MULTI_AGENT_FLOW.md | instructions/notes/MULTI_AGENT_FLOW.md | team,swarm,le stéphane,le méchant |
| AUTOMATION_POLICY | Monitors, schedules, background jobs | instructions/summaries/AUTOMATION_POLICY.md | instructions/notes/AUTOMATION_POLICY.md | cron,automation,monitor,pm2 |
| DEPLOYMENT_POLICY | Deploy/release ops, VPS changes | instructions/summaries/DEPLOYMENT_POLICY.md | instructions/notes/DEPLOYMENT_POLICY.md | deploy,release,vercel,nginx |
| BACKUP_EXPORT_POLICY | Backups, exports, restore testing | instructions/summaries/BACKUP_EXPORT_POLICY.md | instructions/notes/BACKUP_EXPORT_POLICY.md | backup,export,restore |
| LONG_RUNNING_TASKS | Overlay: estimated_output_tokens >= 8000 | instructions/summaries/LONG_RUNNING_TASKS.md | instructions/notes/LONG_RUNNING_TASKS.md | long running,checkpoint,resume,vw_state |
| HANDLING_BUGS | Bugs, defects, unexpected behavior | instructions/summaries/HANDLING_BUGS.md | instructions/notes/HANDLING_BUGS.md | bug,broken,error,regression |
| INCIDENT_RESPONSE | Prod incident, outage, security event | instructions/summaries/INCIDENT_RESPONSE.md | instructions/notes/INCIDENT_RESPONSE.md | incident,outage,breach |
| LEGAL_COMPLIANCE | Compliance/legal/process constraints | instructions/summaries/LEGAL_COMPLIANCE.md | instructions/notes/LEGAL_COMPLIANCE.md | compliance,policy,legal |

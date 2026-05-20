# GLOBAL_INSTRUCTION_SYNC
Applies when: editing vaultwares-docs/AGENTS.md (Tier-1 global instructions).
Do:
- After modifying vaultwares-docs/AGENTS.md, run: vaultwares-docs/scripts/sync-global-instructions.ps1
- Sync only pre-instructions/pointers; do not duplicate the full protocol library into host targets.
Do not:
- Leave host targets stale after AGENTS.md changes.
Done when:
- Sync ran successfully (or failure and reason are recorded).

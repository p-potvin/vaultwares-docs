# PROJECT_CREATION

Applies when: creating a new VaultWares repo, app, package, service, product surface, or Jira-tracked project.

Do:
- Pick the canonical project name, repo name, owner, Jira key, and runtime class before writing broad docs.
- Create or update the repo root `README.md`, `ROADMAP.md`, `TODO.md`, and `AGENTS.md` so future contributors see the project purpose, boundaries, commands, and next steps.
- Add `vaultwares-themes` as a submodule for user-facing apps unless there is a documented reason not to use VaultWares Redesign tokens.
- Create the Jira project or document the exact blocker. Use a 2-10 character uppercase key and add the repo mapping to `vw-jira-sync/config.yaml`.
- Add the GitHub webhook and run `vw-jira-sync` backfill only after the Jira project exists.
- Add a VaultWares Docs page under `docs-content/` and regenerate page resources.
- Update service inventory only when the project has a deployed runtime URL, package distribution channel, or monitored service.
- Record the project creation in agent-ledger and mention any incomplete external-system steps.

Do not:
- Claim the Jira project exists unless the API/UI creation was actually verified.
- Put secrets, tokens, webhook secrets, or private API keys in repo docs, Jira descriptions, or ledger entries.
- Create direct public access paths for private services while onboarding a project.
- Duplicate global instructions inside the new repo; point to VaultWares Docs instead.

Done when:
- Repo metadata exists, docs are discoverable, Jira/vw-jira-sync status is explicit, submodule boundaries are clear, verification ran, and ledger records the creation.

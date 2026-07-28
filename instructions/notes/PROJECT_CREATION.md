# Project Creation Policy Notes

Welcome to the VaultWares project creation policy! This guide outlines the minimum requirements for bootstrapping a new repository or service so that it doesn't become an untracked "code island."

## Why We Bootstrap Standardly

When a new project is created without standard metadata, Jira tracking, or documentation, it becomes invisible to the rest of the company. Onboarding new developers becomes difficult, and operational scripts (like backups or deployments) ignore it.

## The Minimum Project Package

When creating a new repo, app, or service, you must complete the following checklist:

### 1. Repository Identity & Root Files
Define the canonical name, owner, and runtime class (e.g., web app, service, automation).
You must create or update these root files:
- `README.md`: Purpose, commands, environments, and safety boundaries.
- `ROADMAP.md`: High-level, milestone-based goals.
- `TODO.md`: Immediate operational tasks.
- `AGENTS.md`: Repo-specific AI boundaries and a pointer to global docs.

### 2. UI and Theming (If Applicable)
If the project has a user-facing UI, add `vaultwares-themes` as a git submodule. Do not patch the theme inside this submodule; update the standalone theme repo first.

### 3. Jira and Sync Automation
- Create a team-managed Kanban Jira project with an uppercase 2-10 character key.
- Update `vw-jira-sync/config.yaml` to map the repo to the new Jira key.
- Add the GitHub webhook pointing to our infrastructure.
- **Run the backfill script only after the Jira project is confirmed to exist.**

### 4. VaultWares Docs Integration
The project must be discoverable. Add a project page under the appropriate `docs-content/` section in the `vaultwares-docs` repository using proper frontmatter, and regenerate the page resources.

### 5. Services Inventory
Update `docs-content/operations/services-inventory.mdx` **only** when the project has a deployed runtime URL, a package distribution channel, or a monitored endpoint. Do not add local-only code milestones to the live inventory.

## When is it "Done"?
A project creation is complete when all repo metadata exists, the docs page is live, Jira sync is explicitly configured and verified, the submodule boundaries are set, and the entire creation event is recorded in the agent ledger.

# PROJECT_CREATION Notes

Last updated: Wed, 01 Jul 2026 00:09 America/Toronto.

This protocol exists so new VaultWares apps do not appear as untracked code
islands. The minimum project creation package is:

1. Repository identity:
   - canonical repo name
   - owner/org
   - one-sentence purpose
   - runtime class: web app, desktop app, mobile app, service, library, docs,
     automation, or experiment
   - security/privacy boundary

2. Root files:
   - `README.md` with purpose, commands, environment names, and safety boundary
   - `ROADMAP.md` with milestone-level work
   - `TODO.md` with immediate operational tasks
   - `AGENTS.md` with repo-specific boundaries and a pointer to VaultWares Docs

3. Theme and UI:
   - add `vaultwares-themes` as a submodule for apps with user-facing UI
   - do not patch the theme inside the submodule checkout
   - update the standalone `vaultwares-themes` repo first, then update the
     submodule pointer

4. Jira and sync:
   - create a team-managed Kanban Jira project with an uppercase 2-10 character
     key
   - add `repo_project_keys` and `repos` entries in `vw-jira-sync/config.yaml`
   - add the repository webhook to `https://hooks.vaultwares.ca/github`
   - run `python scripts/backfill.py --repo <repo>` only after Jira exists
   - do not paste Jira or GitHub tokens into docs, chat, or ledger

5. VaultWares Docs:
   - add a project page under the most specific `docs-content/` section
   - use `title` and `description` frontmatter
   - link to repo root files and relevant operations runbooks
   - regenerate page resources with `npm run generate:page-resources`

6. Inventory:
   - update `docs-content/operations/services-inventory.mdx` only when there is
     a deployed URL, package distribution surface, monitored service, or
     operator-facing endpoint
   - for local-only code milestones, document the project page instead

7. Verification:
   - run the smallest local checks that prove the new metadata/docs render
   - for external systems, record verified success or the exact blocker

For media clients, preserve the Comet rule: torrent/debrid lookup and stream URL
resolution stay server-side. Thin clients may consume only VaultWares-controlled
media APIs and playback URLs returned by those APIs.

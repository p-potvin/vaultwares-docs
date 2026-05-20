# RENAMING notes

## Why the mapping file order matters
`backfill.py` uses `mapping/{repo}.json` (format: `{"prs": {}, "commits": {}}`) as its
idempotency checkpoint. If the file still has the old name when backfill runs under the new
name, the script treats every previously-synced PR and commit as new → creates duplicates in
Jira. Cleaning up duplicates requires Jira REST DELETE calls or manual UI deletion.

Tested rename: `i-dub-thee` → `vaultwares-asttro` (2026-05-19). Partial re-backfill before
mapping rename created IDUB-7 through IDUB-12 (6 duplicates); cleaned up manually.

## Jira label scheme
Labels embed the current GitHub repo name:
- PR tasks: `gh-pr-{owner}-{repo}-{number}`
- Commit tasks: `gh-commit-{owner}-{repo}-{sha12}`

After a rename, only new events use the new-name labels. Existing issues keep old labels —
that's fine. JQL lookups in live_sync.py search by label within the project, so both old and
new labels resolve correctly as long as the Jira project key is unchanged.

## Multi-org repos
If the repo being renamed is in a non-default org (listed under `repo_owners` in config.yaml),
update that entry too (key = new name, value = org unchanged).

## What does NOT need updating
- Jira project key — stays the same (it's the stable identifier).
- GitHub Actions caller workflow in the repo — GitHub redirects the repo URL automatically.
- Existing Jira issues — they stay where they are; no field changes needed.

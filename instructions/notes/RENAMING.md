# Renaming Policy Notes

Welcome to the VaultWares renaming policy! This guide outlines the exact, multi-step procedure required when renaming critical infrastructure like GitHub repositories or Jira projects, ensuring we don't break tracking or duplicate data.

## The Danger of Renaming

Systems like `vw-jira-sync` rely on stable identifiers to map GitHub PRs and Commits to Jira tasks. If you rename a repository without following the correct sequence, the sync scripts will lose their checkpoint. They will treat all historical data as "new" and create hundreds of duplicate tickets in Jira, which requires tedious manual cleanup.

## The 6-Step Repo Rename Procedure

If you must rename a GitHub repository, you **must** follow this exact order.

1. **Rename on GitHub:** Change the repository name in the GitHub UI/Settings.
2. **Update Config:** Update the `repo_project_keys` and `repos` lists in `vw-jira-sync/config.yaml` to reflect the new name.
3. **Rename the Mapping File (Critical):**
   - Before doing anything else, rename the local mapping checkpoint.
   - Run: `Copy-Item mapping\old-name.json mapping\new-name.json`
   - Then: `Remove-Item mapping\old-name.json`
4. **Run Backfill:** Run the backfill script using the new name. Because the mapping file was renamed, it will prevent duplicates.
   - `python scripts/backfill.py --repo new-name`
5. **Redeploy Workflows:** Update the CI/CD caller workflows.
   - `python scripts/deploy_caller_workflows.py --repo new-name --strategy main`
6. **Commit and Push:** Commit these configuration changes in `vw-jira-sync` and push to `main`.

## What Does NOT Need Updating
- **The Jira Project Key:** This stays the same (it is the stable identifier).
- **Existing Jira Issues:** They keep their old labels; JQL lookups handle this automatically.

## When is it "Done"?
A rename is complete when the configuration yaml is updated, the mapping file is renamed, the backfill runs with zero errors (and zero duplicates), the caller workflow is re-deployed, and all changes are pushed to main.

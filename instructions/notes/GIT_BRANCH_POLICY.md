# Git Branch Policy Notes

Welcome to the VaultWares Git branch policy! This guide defines how we use branches to organize work, manage releases, and collaborate effectively.

## Our Branching Strategy

We use a structured branching model to ensure that our `main` branch is always stable, deployable, and represents the current source of truth. Work should never happen directly on `main` unless it is an extreme emergency.

## Guidelines for Branching

### 1. Branch Naming Conventions
Always use descriptive, standardized branch names. This helps everyone understand what the branch is for at a glance.
- **Features:** `feature/short-description` (e.g., `feature/add-login-form`)
- **Bugfixes:** `bugfix/issue-description` (e.g., `bugfix/fix-header-alignment`)
- **Chores/Maintenance:** `chore/update-dependencies`

### 2. Never Push Directly to Main
All changes must go through a Pull Request (PR). Direct commits to the `main` branch bypass our CI/CD checks, skip code review, and violate our deployment policies. **Merge directly to main only if explicitly instructed by a lead engineer in an emergency.**

### 3. Keep Branches Short-Lived
Branches should not live for weeks. The longer a branch diverges from `main`, the harder it will be to merge later (merge conflicts!). Aim to merge your work within a few days. If a feature takes longer, break it down into smaller, mergeable chunks.

### 4. Rebase over Merge Commits (Local Workflow)
When updating your local branch with the latest changes from `main`, prefer `git rebase main` over `git merge main`. This keeps the commit history linear and easier to read, rather than cluttering it with "Merge branch 'main' into feature" commits.

## When is it "Done"?
A branch is ready when it is correctly named, contains focused work, is up to date with `main`, and has an associated Pull Request outlining the changes and how they were verified.

# Dependency Policy Notes

Welcome to the VaultWares dependency policy! This guide explains how we manage external libraries, packages, and frameworks to keep our projects secure, stable, and lean.

## The Cost of Dependencies

Every time we add an external package to our project, we are adopting someone else's code. This comes with risks:
- **Security:** We inherit their vulnerabilities.
- **Maintenance:** We must keep the package updated.
- **Bloat:** We increase our bundle size and installation time.

We treat adding a new dependency as a significant architectural decision, not a casual convenience.

## Guidelines for Managing Dependencies

### 1. Evaluate Before You Install
Before running `npm install` or `pip install`, ask yourself:
- Do we *really* need this? Can we easily write the 50 lines of code to do it ourselves?
- Is the package actively maintained? When was the last commit?
- Are there known security vulnerabilities?
- How large is the package, and does it bring in a massive tree of sub-dependencies?

### 2. Lock Files are Sacred
Always commit your lock files (`package-lock.json`, `poetry.lock`, etc.). These files guarantee that every developer and our CI/CD pipelines are using the exact same versions of every package. Never delete a lock file to "fix" an installation issue; diagnose the actual dependency conflict instead.

### 3. Keep Environments Isolated
When working in Python, **always prefer `uv`** (or standard `venv` if `uv` is unavailable) to isolate project dependencies from your global system environment. Never install project-specific packages globally.

### 4. Audit and Update Regularly
Dependencies go stale quickly. We must regularly audit our dependencies for security patches and major version upgrades. Stale dependencies are the leading cause of security breaches in modern web applications.

## When is it "Done"?
A change involving dependencies is complete when the new package is strictly necessary, documented, pinned in the lock file, and verified to not introduce security flaws or significant bloat.

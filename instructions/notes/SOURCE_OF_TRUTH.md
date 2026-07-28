# Source of Truth Policy Notes

Welcome to the VaultWares Source of Truth (SoT) policy! This guide explains how we resolve conflicts between different instructions and prevent documentation drift across our repositories.

## The Problem with Multiple Documents

In a complex ecosystem, the same topic (e.g., how to deploy, how to format code) might be mentioned in a global wiki, a repository README, and an automated script. When these disagree, developers get confused.

## The Source of Truth Hierarchy

To prevent this, we maintain a strict hierarchy of authority. When in doubt, prefer the narrowest, most specific file, but defer to the highest tier for global rules.

### Tier 1: `vaultwares-docs`
This repository is the ultimate authority for company-wide protocols, security postures, networking setups, and cross-repo standards. If something here contradicts a local repo file regarding a global policy, Tier 1 wins.

### Tier 2: Core Repositories
These are standalone structural repositories that govern how our tools look and track history:
- `vaultwares-themes` (The single source for design tokens and CSS variables)
- `vaultwares-adk`
- `agent-ledger`

### Tier 3: Repo-Local Guidance
These are files located inside specific project repositories (e.g., `README.md`, `AGENTS.md`, `TODO.md`). They govern the *local* execution of that specific project.

## Guidelines for Navigating Truth

### 1. Read Before Acting
When tackling a task, identify the governing tier for the change. Prefer reading the exact SoT file over doing a broad, generic search across all repos.

### 2. Missing Sources
If a referenced SoT file is missing or out of date, **say so**. Propose the next-best canonical location to update or create it. Do not invent new documentation paths silently.

### 3. Do Not Duplicate
Never copy a Tier-1 global protocol (like the `SECURITY_POSTURE.md` rules) and paste it into a Tier-3 repo's README. Reference the global doc instead.

## When is it "Done"?
You are following this policy correctly when you can explicitly name the exact Source of Truth files you consulted for your task and explain why they govern your changes.

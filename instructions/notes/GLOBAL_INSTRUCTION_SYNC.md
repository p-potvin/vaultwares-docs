# Global Instruction Sync Notes

Welcome to the VaultWares global instruction sync policy! This guide explains how we maintain and distribute Tier-1 instructions across our various repositories.

## The Problem of Instruction Drift

When you have multiple repositories, it's easy for core protocols (like coding standards or security postures) to get copied and pasted. Over time, these copies drift. Repo A has one version of the rules, and Repo B has a slightly different, outdated version.

## The Sync Strategy

To solve this, we rely on a single source of truth and a synchronization script.

### 1. The Source of Truth
The canonical source for Tier-1 instructions is the `vaultwares-docs` repository. If a global instruction needs to change, it changes here first. **Do not duplicate global protocols manually into random repos.**

### 2. The Synchronization Script
We use a script (e.g., `sync-global-instructions.ps1`) to push updates from `vaultwares-docs` to the marked sections of other repositories. This script looks for specific markdown markers in the target repos and injects the updated text between them.

### 3. Manual Invocation
Currently, this sync process is manual. When you update a global instruction, you must run the sync script to ensure the changes are disseminated. Do not assume it happens automatically via a cron job.

## When is it "Done"?
A global instruction update is complete when the source file in `vaultwares-docs` is updated, the sync script has been run without warnings, and you have verified that the target repositories reflect the new instructions.

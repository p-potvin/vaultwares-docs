# Submodule Boundaries Policy Notes

Welcome to the VaultWares submodule boundaries policy! This guide explains how we handle git submodules to prevent repository drift and ensure patches are applied to the correct source of truth.

## The Problem with Submodules

A git submodule is essentially a window into another repository. It is very easy to make changes to files *inside* that window, commit them to the parent repository, and accidentally create a fragmented fork of the vendor code that never gets pushed back to the original source.

## Guidelines for Handling Submodules

### 1. Treat Submodules as Read-Only
When you are working inside a project and you need to look at code within a submodule directory, treat it as strictly read-only. Use it to understand behavior, check types, or view templates, but **do not edit the files there.**

### 2. Edit Standalone Repositories
If a change is required in a Tier-2 repository (such as `vaultwares-themes`, `vaultwares-adk`, or `agent-ledger`), you must edit the code in its **standalone repository checkout**, not inside the submodule folder of the app you are currently working on.
- Usually, this means navigating to `%USERPROFILE%\Desktop\Github Repos\<repo>` (or the equivalent root location), making the patch, committing it, and pushing it there.
- Once the standalone repo is updated, you return to your app and update the submodule pointer to the new commit.

### 3. Never Patch Locally
**Strict Rule:** Never implement Tier-2 changes inside another repo's submodule directory. It guarantees that the changes will be lost or overwritten the next time the submodule is updated.

## When is it "Done"?
A change involving shared vendor code or themes is complete when the final patch is applied, tested, and committed in the standalone repository checkout, and the parent project's submodule pointer is successfully updated to reference that new commit.

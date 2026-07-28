# File Changes Policy Notes

Welcome to the VaultWares file changes policy! This guide outlines the best practices for creating, modifying, and deleting files within our repositories to ensure a clean and traceable git history.

## The Importance of Clean Commits

A repository's history is a story. When you change files, you are writing the next chapter. If you bundle unrelated changes together, or if you modify files without verifying the outcome, the story becomes confusing and impossible to debug.

## Guidelines for Modifying Files

### 1. Small, Focused Changes
Do not make massive, sweeping changes across dozens of files in a single step if it can be avoided. Keep your file modifications focused on a single logical task. If you need to fix a typo, update a dependency, and implement a feature, those should be distinct actions.

### 2. Verify Every Modification
**Always Verify Your Work.** After every action that modifies the state of the codebase (creating, deleting, or editing a file), you must use a read-only tool (like reading the file back) to confirm that the action was executed successfully and had the intended effect.

### 3. Edit Source, Not Artifacts
If you determine a file is a build artifact (e.g., located in a `dist`, `build`, or `target` directory), **do not edit it directly**.
- You must trace the code back to its original source file and make your changes there.
- After modifying the source, run the appropriate build command (e.g., `npm run build`) to regenerate the artifact safely.

### 4. Respect File Encodings
When writing to configuration files (especially cross-platform), be hyper-aware of line endings. For example, when writing secrets or environment variables to a Linux `.env` file from a Windows environment, ensure you strip `CRLF` endings, or the file will be corrupted with `\r` characters.

## When is it "Done"?
A file change task is complete when the source files (not artifacts) are updated, the changes have been visually verified for correctness, and the modifications are logically grouped for review.

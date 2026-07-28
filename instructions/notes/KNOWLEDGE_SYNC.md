# Knowledge Sync Policy Notes

Welcome to the VaultWares knowledge sync policy! This guide outlines how we manage the synchronization of durable knowledge—specifically summaries and detailed notes—across our environment.

## The Goal of Knowledge Sync

While `GLOBAL_INSTRUCTION_SYNC` handles operational commands and `SKILL_SYNC` handles specific agent abilities, Knowledge Sync ensures that the foundational "why" and "how" of our policies (the summaries and notes) remain accurate and paired together.

## Guidelines for Synchronizing Knowledge

### 1. Maintain the Pair Structure
Our knowledge base relies on a two-tier system:
- **Summaries (`instructions/summaries/`):** High-level, scannable rules (Applies when, Do, Do not, Done when).
- **Notes (`instructions/notes/`):** Detailed, human-friendly expansions that explain the rationale behind the summaries.
Every summary file *must* have a corresponding notes file with the exact same filename.

### 2. Synchronization Updates
When a policy changes, you must update *both* the summary and the notes file to reflect the new reality. If you update a summary to ban a specific API call, the notes file must be updated to explain *why* that call is banned.

### 3. Source of Truth Integrity
These markdown files serve as the durable memory for agents and human developers alike. They must be kept clean, well-formatted, and free of temporary scratchpad notes.

## When is it "Done"?
A knowledge sync update is complete when both the summary and notes files are updated, their content is aligned, and they are formatted correctly as Markdown.

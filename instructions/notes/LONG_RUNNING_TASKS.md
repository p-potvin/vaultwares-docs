# Long Running Tasks Policy Notes

Welcome to the VaultWares long-running tasks policy! This guide explains how we manage tasks that require significant processing time or generate massive amounts of output, ensuring they don't break our toolchains or loop infinitely.

## The Problem with Long Tasks

When an AI agent or automated script runs a task that generates a massive amount of output (like reading a 10,000-line log file or generating complex, multi-file codebases), it can hit token limits, timeout thresholds, or get stuck in a recursive loop of failures.

## Guidelines for Managing Long Tasks

### 1. The Token Threshold Trigger
**Intent:** Prevent looping and force a minimal interview when long tasks are likely.
**Trigger:** If the estimated output tokens for a task exceed **8000**, the long-running task protocol engages.

### 2. The Interview Phase
Before beginning a massive generation or processing task, ask exactly **one high-impact question** to the user to confirm the scope and approach (assuming the last reply had no question). Do not start a massive refactor without confirming the architectural direction.

### 3. Preserving State for Resumption
Long tasks fail. When they do, they must be able to resume.
- **State Recording:** The current state (`VW_STATE`) must be recorded in the agent ledger. This ledger entry is treated as the ultimate source of truth for resuming the task.
- **Do Not Recompute:** The estimated size of the task is never recomputed on resume; rely on the ledger.
- **Avoid Chat Clutter:** Do not paste the raw `VW_STATE` payload into the chat UI unless the user explicitly asks for it. Instead, use a `VW_STATE_REF` pointer (e.g., a resume ID and the ledger event path/hash).

## When is it "Done"?
A long-running task is safely managed when its state is committed to the ledger, user confirmation was obtained for large token outputs, and the task can be safely paused and resumed without data loss.

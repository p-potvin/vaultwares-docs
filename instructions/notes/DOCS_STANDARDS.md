# Docs Standards Notes

Welcome to the VaultWares documentation standards! This guide ensures that our internal and external documentation remains accurate, easy to read, and highly maintainable.

## The Philosophy of Good Docs

Code tells you *how* a system works; documentation tells you *why* it exists and *how to use it*. Poor documentation is often worse than no documentation because it leads developers down the wrong path. We treat our docs with the same rigor as our source code.

## Guidelines for Writing Documentation

### 1. Use the Canonical Locations
Do not scatter README files randomly throughout the codebase. Our documentation has a strict hierarchy:
- **Tier 1:** The `vaultwares-docs` repository is the source of truth for global protocols and architecture.
- **Tier 2:** Standalone core repositories (`vaultwares-themes`, `vaultwares-adk`, `agent-ledger`).
- **Tier 3:** Repo-local `README.md`, `ROADMAP.md`, and `TODO.md` files for project-specific instructions.

### 2. Be Explicit and Actionable
Avoid vague statements. Tell the reader exactly what to do, what commands to run, and what output to expect.
- Use code blocks for all terminal commands.
- Provide examples of expected input and output.

### 3. Keep it Human-Friendly
Write in plain, accessible language. Avoid overly dense jargon where simple terms will do. Use formatting (bolding, lists, headings) to make the document skimmable.

### 4. Document Decisions (ADRs)
When making a significant architectural change, document the *decision* and the *trade-offs* considered. If we chose technology A over technology B, write down why. This prevents future developers from rehashing the same debates.

## When is it "Done"?
A documentation update is complete when it accurately reflects the current state of the system, is located in the correct canonical tier, uses clear markdown formatting, and provides actionable guidance for the next reader.

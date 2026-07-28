# Multi-Agent Flow Policy Notes

Welcome to the VaultWares multi-agent flow policy! This guide details how different AI agents and automated systems collaborate to solve complex problems within our ecosystem.

## The Philosophy of Agent Collaboration

No single agent is perfect at everything. Some are great at deep codebase analysis, others at writing UI components, and others at orchestrating deployments. Multi-agent flow is about passing context cleanly between these specialized tools.

## Guidelines for Multi-Agent Handoffs

### 1. The Ledger is the Handshake
When one agent finishes a task and another needs to pick it up, they do not communicate directly. They communicate through the **Agent Ledger**.
- Before an agent finishes its turn, it must record a summary of what it accomplished, the decisions it made, and the exact state of the codebase.
- The next agent begins by reading the ledger to understand the context.

### 2. Clear Boundaries
Do not try to make one agent do another agent's job. If you are an architecture agent, output a plan and write the architectural decision records. Do not try to write the CSS for the frontend. Stop, document, and hand off.

### 3. Explicit Summaries
When calling tools like `done`, the summary provided must be succinct but highly descriptive. "Fixed the bug" is not acceptable. "Resolved EMFILE error in file watcher by batching fsPromises to a max concurrency of 32" is acceptable.

## When is it "Done"?
A multi-agent task phase is complete when the work is committed, the context and decisions are fully documented in the agent ledger, and a clear, descriptive summary is provided to unblock the next agent in the pipeline.

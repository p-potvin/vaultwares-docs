# Knowledge Scout Policy Notes

Welcome to the VaultWares Knowledge Scout policy! This guide explains how we proactively gather and utilize external information to unblock development and make informed decisions.

## Why We Need a Scout

Development often stalls not because the code is hard, but because we lack context. Whether it's a cryptic error message, an unfamiliar API, or a missing setup step, having a reliable way to query a knowledge base is essential.

## Guidelines for Knowledge Retrieval

### 1. Use the Knowledgebase Early and Often
Make use of the `knowledgebase_lookup` tool to get useful information to help you early and often.
- Use it during the planning phase to understand the context of the task.
- Use it when a test is failing.
- Use it if the environment isn't working right or if you need help bootstrapping a project.

### 2. Formulate Clear Queries
When querying the knowledgebase, be descriptive. A free-text description of the exact problem you are running into (e.g., "How do I resolve the `EMFILE` error when running `npm start` on Windows?") yields much better results than a single keyword.

### 3. Fallback to General Search
The internal knowledgebase does not have all the answers. If the specific VaultWares context doesn't help, you should immediately fall back to using tools like `google_search` or `view_text_website` to read external documentation, StackOverflow, or package READMEs.

## When is it "Done"?
A knowledge gathering task is complete when you have found the specific instruction, documentation, or fix required to unblock the current task, and you have applied that knowledge to the plan.

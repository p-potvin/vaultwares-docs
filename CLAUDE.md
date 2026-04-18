# VaultWares documentation

## Working relationship

- You can push back on ideas — this can lead to better documentation. Cite sources and explain your reasoning when you do so.
- ALWAYS ask for clarification rather than making assumptions.
- NEVER lie, guess, or make up information.

## Project context

- **Product:** VaultWares — enterprise security hardware and software (encrypted storage, HSMs, biometric devices, network appliances, encryption software).
- **Format:** MDX files with YAML frontmatter.
- **Config:** `docs.json` for navigation, theme, and settings.
- **Components:** Mintlify components (Card, CardGroup, Steps, Tabs, Note, Warning, Tip, Info, Check, CodeGroup, etc.).
- **Deployment:** Vercel (via `vercel.json`) and Mintlify CDN (via GitHub app).

## Content strategy

- Document just enough for user success — not too much, not too little.
- Prioritize accuracy and usability of information.
- Make content evergreen when possible.
- Search for existing information before adding new content. Avoid duplication unless done for a strategic reason.
- Check existing patterns for consistency.
- Start by making the smallest reasonable changes.

## Frontmatter requirements for pages

Every MDX page must start with:

```yaml
---
title: "Clear, descriptive page title"
description: "Concise summary for SEO and navigation"
---
```

## Writing standards

- Second-person voice ("you").
- Prerequisites at the start of procedural content.
- Test all code examples before publishing.
- Match the style and formatting of existing pages.
- Include both basic and advanced use cases.
- Language tags on all code blocks.
- Alt text on all images.
- Relative paths for internal links.

## Navigation

- All new pages must be added to the `navigation` section in `docs.json` to appear in the sidebar.
- Group pages logically within the appropriate tab (Product documentation, Security & compliance, API reference, Support, AI tools).

## Git workflow

- NEVER use `--no-verify` when committing.
- Ask how to handle uncommitted changes before starting.
- Create a new branch when no clear branch exists for changes.
- Commit frequently throughout development.
- NEVER skip or disable pre-commit hooks.

## Do not

- Skip frontmatter on any MDX file.
- Use absolute URLs for internal links.
- Include untested code examples.
- Make assumptions — always ask for clarification.
- Add pages without updating `docs.json` navigation.

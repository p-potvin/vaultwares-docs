# vaultwares-docs

VaultWares documentation site (Mintlify-style MDX content rendered by a custom
React + Vite app).

Primary goals:
- Provide public product documentation and private ops onboarding docs.
- Keep UX consistent with VaultWares brand and the `vault-themes` design system.
- Maintain strict, repeatable verification for GUI changes (see `AGENTS.md`).

## Repo layout

- `docs-content/` — documentation pages as `.mdx` (frontmatter required).
- `docs.json` — navigation structure (SoT for docs ordering/sections).
- `src/App.tsx` — router + nav rendering + MDX/markdown rendering.
- `public/` — static assets.
- `vault-themes/` — design tokens & brand system (submodule).
- `vaultwares-agentciation/` — agent workflow docs (submodule).

## Writing docs

### Page format

All `.mdx` pages must include YAML frontmatter:

```mdx
---
title: "My Page Title"
description: "One sentence description"
---

## Content
```

### Add a new page

1) Add a file under `docs-content/` (example: `docs-content/getting-started/foo.mdx`).
2) Add the page to `docs.json` navigation.
3) Keep nav labels bilingual (English + Quebec French):
   - update the nav list in `src/App.tsx` (search `NAV_SECTIONS`).
4) Verify the route renders (see “Verification”).

## Development

Install dependencies:

```bash
npm ci
```

Run dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview built app locally:

```bash
npm run preview
```

## Deployment (current)

Production deploys are designed to keep the server in control:

- GitHub sends a **signed push webhook**.
- `vw-deployd` on the VPS verifies signature + allowlist and deploys by commit SHA.

Webhook endpoint:
- `https://hooks.vaultwares.ca/github`

The deploy mechanism lives outside this repo (see `automation-suite/deployd`).

## Verification (must-do for GUI changes)

Do not mark the site “working” from a single `200 OK`.

Minimum verification checklist:
- Navigate at least **2 links deep** (route changes) and back.
- Inspect DevTools **Network** (dynamic imports/assets) and **Console** (runtime errors).
- Trigger at least one hover/focus state and one error/empty state relevant to the change.

The full standard lives in `AGENTS.md`.

## Submodules

Initialize:

```bash
git submodule update --init --recursive
```

Important: when changing `vault-themes` or `vaultwares-agentciation`, do it in
their standalone repos (not via submodule copies).

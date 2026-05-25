# vaultwares-docs

VaultWares documentation site (native MDX content rendered by a custom
React + Vite docs app).

Primary goals:
- Provide public product documentation and private ops onboarding docs.
- Keep UX consistent with VaultWares brand and the `vaultwares-themes` design system.
- Maintain strict, repeatable verification for GUI changes (see `AGENTS.md`).

## Repo layout

- `docs-content/` — source documentation pages as `.mdx` (frontmatter required, internal source).
- `src/resources/pages/*.json` — generated EN/QC page resources consumed by the frontend.
- `src/resources/pageResourcesManifest.ts` — generated route/resource index.
- `src/App.tsx` — router + nav rendering + locale resource rendering.
- `public/` — static assets.
- `vaultwares-themes/` — design tokens & brand system (submodule).
- `vaultwares-adk/` — agent workflow docs (submodule).

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

1) Add EN + QC source files under `docs-content/` (example: `docs-content/getting-started/foo.mdx` and `foo-QC.mdx`).
2) Regenerate frontend page resources:
   - `npm run generate:page-resources`
3) Keep nav labels bilingual (English + Quebec French):
   - update section labels/order in `src/resources/uiResources.ts`.
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

Important: when changing `vaultwares-themes` or `vaultwares-adk`, do it in
their standalone repos (not via submodule copies).

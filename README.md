# VaultWares Documentation

Official documentation for [VaultWares](https://vaultwares.com) — enterprise-grade security hardware and software, including encrypted storage, hardware security modules (HSMs), biometric devices, network appliances, and encryption software.

## Overview

This repository contains the source for [VaultWares Documentation](https://docs.vaultwares.com), built with [Mintlify](https://mintlify.com). The docs cover:

- **Hardware products** — VaultDrive, VaultHSM, VaultScan, VaultGate
- **Software products** — VaultCrypt, VaultAccess, VaultBackup, VaultMonitor
- **Installation & setup** — hardware installation, software deployment, initial configuration, integration guides
- **Security & compliance** — encryption protocols, certifications, GDPR, HIPAA, PCI DSS
- **API reference** — authentication, REST endpoints, webhooks, SDKs
- **Support** — FAQs, contact, warranty, RMA, updates

## Local development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview changes locally:

```bash
npm install -g mintlify
```

Run the following command at the root of this repository (where `docs.json` is located):

```bash
mintlify dev
```

View your local preview at `http://localhost:3000`.

## Contributing

- All documentation pages are MDX files with YAML frontmatter (`title` and `description` required).
- Navigation is configured in `docs.json`.
- Use Mintlify components for callouts, steps, tabs, cards, and code examples.
- See `CLAUDE.md` for AI-assisted writing guidelines and documentation standards.

## Deployment

This documentation is deployed to [Vercel](https://vercel.com) on every push to the default branch. The `vercel.json` at the root of this repository configures the build.

You can also publish changes via the [Mintlify GitHub app](https://dashboard.mintlify.com/settings/organization/github-app), which deploys to Mintlify's CDN automatically.

## Troubleshooting

- **Dev environment not starting:** Re-install the CLI with `npm install -g mintlify` to ensure you have the latest version.
- **Page shows as 404:** Make sure the page path is listed under `navigation` in `docs.json`.

## Resources

- [Mintlify documentation](https://mintlify.com/docs)
- [VaultWares customer portal](https://portal.vaultwares.com)
- [VaultWares community](https://community.vaultwares.com)

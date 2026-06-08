# vaultwares-docs Tasks

## Completed (2026-06-02)

- [x] **Tailnet DNS Resolver Configuration** — Configured greencloud-vps as exact-host tailnet DNS resolver using dnsmasq. Set up host-record answers for docs.vaultwares.ca, api.vaultwares.ca, hooks.vaultwares.ca, secrets.vaultwares.ca, and warden.vaultwares.ca to 100.73.93.84. Enabled DNS on tailscale0 via UFW. Updated docs-content/operations/tailscale.mdx with Restricted/Split DNS documentation and compliance warnings.

- [x] **Tailnet Access Verification** — Verified client-side tailnet override for vaultwares docs and secrets. Confirmed docs returns 200 with valid TLS and HTML content; secrets redirects to warden (200); warden returns 200 with valid TLS and VaultWarden JSON payload. Disabled unnecessary dnsmasq configuration on vaultwares-1 and cleaned up UFW rules.

## Remaining

- [ ] Monitor tailnet DNS resolver performance and stability
- [ ] Document rollout plan for other tailnet members

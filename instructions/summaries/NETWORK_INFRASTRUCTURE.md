# NETWORK_INFRASTRUCTURE
Applies when: tailscale/tailnet, SSH, VPS, ports, nginx, firewalls, CI runners, any network access.
Do:
- Tailnet is the default control plane. Private services are tailnet-only.
- SSH to servers is tailnet-only. Prefer SSH over Tailscale or tailnet IPs.
- No outside contact for sensitive ops: do not open inbound ports for admin access; do not add public egress dependencies without explicit approval.
- For loops or batches of TCP/UDP/HTTP/API requests, apply REQUEST_RATE_LIMITING before running commands.
- CI: do not rely on outside GitHub-hosted runners for VaultWares infrastructure; use self-hosted runners only.
- Consult these SoT pages before changes:
  - vaultwares-docs/docs-content/operations/network-map.mdx
  - vaultwares-docs/docs-content/operations/tailscale.mdx
  - vaultwares-docs/docs-content/operations/residential-egress-proxy.mdx (Brume2 tinyproxy used by shared-tube /api/stream — touching its ACL, env, or the Brume device itself can take all video playback down)
Do not:
- Add “quick temporary” public access paths.
Done when:
- Access paths are tailnet-first and documented; verification includes connectivity from the intended tailnet perspective.

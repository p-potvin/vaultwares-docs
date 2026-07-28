# Network Infrastructure Policy Notes

Welcome to the VaultWares network infrastructure policy! This guide provides the rules for how our services communicate securely across servers, Virtual Private Servers (VPS), and CI runners.

## The Tailnet Perimeter

The core philosophy of our infrastructure is simple: **assume the public internet is hostile**. We use Tailscale (the tailnet) as our default control plane.

## Guidelines for Network Configuration

### 1. Private by Default
Private services (databases, internal APIs, monitoring dashboards) are **tailnet-only**. They must never be exposed to the public internet directly.
- **SSH Access:** SSH access to servers must only occur over the tailnet. Never open port 22 to the public internet. Prefer standard SSH over Tailscale's built-in SSH or bare tailnet IPs when configuring scripts.

### 2. No Temporary Public Access
**Strict Prohibition:** Do not add "quick temporary" public access paths to private services just to test something or to make an onboarding step easier. If it needs to be accessed, the user must be authenticated on the tailnet.

### 3. CI Runner Security
Do not rely on outside, GitHub-hosted runners for VaultWares infrastructure tasks (deployments, building sensitive artifacts). You must use our self-hosted runners that are securely authenticated to our tailnet.

### 4. Consult the Source of Truth
Before making any changes to routing, proxies, or firewalls, you must consult the Tier-1 operations documents:
- `operations/network-map.mdx`
- `operations/tailscale.mdx`
- `operations/residential-egress-proxy.mdx` (Note: Modifying the Brume2 tinyproxy ACLs can take down the entire video playback system. Tread carefully.)

## When is it "Done"?
Network configurations are complete when the access paths are tailnet-first, properly documented in the infrastructure runbooks, and verified by confirming connectivity strictly from the intended tailnet perspective.

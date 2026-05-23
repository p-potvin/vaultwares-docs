# NETWORK_INFRASTRUCTURE notes
Include: tailnet name, tailnet-only SSH, deny-by-default services, and the list of allowed ports/tags.
If a network change impacts routing or ACLs, require a rollback plan.
For any loop or batch of network requests, including localhost and tailnet targets, apply REQUEST_RATE_LIMITING first.

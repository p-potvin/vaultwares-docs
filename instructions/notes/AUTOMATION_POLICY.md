# Automation Policy Notes

Welcome to the VaultWares automation policy! This guide provides context on how we handle scheduled tasks, background jobs, and recurring automations to ensure they run safely and transparently.

## The Core Philosophy

When building automations—whether it's a cron job, a background worker, or a scheduled monitor—we prioritize **visibility and control**. Automations that run silently in the background can easily become "ghosts" in the system, causing unexpected behavior or resource spikes that are hard to debug.

## Guidelines for Building Automations

### 1. Transparency is Key
Always prefer explicit, inspectable configurations over hidden states. Anyone looking at the project should be able to quickly understand:
- What automations are running?
- When do they trigger?
- What are they doing?

### 2. Document the Lifecycle
Every automation must have a paper trail in the repository. Make sure you clearly record:
- **Deployment:** Where does this automation run (e.g., which server or container)?
- **Controls:** How can another engineer stop, pause, or roll back this automation if something goes wrong?

### 3. Headless Execution on Windows
If you are running a scheduled task using PowerShell, ensure it runs completely silently without popping up console windows that might interrupt a user session.
Always use `conhost.exe` with the following robust arguments:
`--headless pwsh.exe -NoProfile -WindowStyle Hidden -NonInteractive -ExecutionPolicy Bypass -File <your script>`

### 4. Safety-Sensitive Jobs
*Crucial addition:* If a background job is safety-sensitive (e.g., it deletes data, modifies production states, or interacts with external APIs heavily), **it must require human approval before being enabled.** Never let a destructive or high-stakes task run entirely on autopilot without a confirmation gate.

### 5. Network Boundaries
Automations must respect our security perimeter. **Do not create automations that run outside the tailnet policy.** All background communication should occur within our secured tailscale network.

## When is it "Done"?
You can consider your automation task complete when the automation is fully documented, its lifecycle and location are clear, and its execution can be reliably verified without relying on hidden side-effects.

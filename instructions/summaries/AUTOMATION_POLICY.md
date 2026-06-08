# AUTOMATION_POLICY
Applies when: cron, monitors, recurring automations, background jobs, schedulers.
Do:
- Prefer explicit, inspectable configs; avoid hidden state.
- Record inside the repo what runs where, and how to stop/rollback.
- If scheduled task, use conhost.exe with arguments: "--headless pwsh.exe -NoProfile -WindowStyle Hidden -NonInteractive -ExecutionPolicy Bypass -File <your script>"
Do not:
- Create automations that run outside the tailnet policy.
Done when:
- Automation is documented and verifiable.

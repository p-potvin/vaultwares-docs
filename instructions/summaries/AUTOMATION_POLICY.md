# AUTOMATION_POLICY
Applies when: cron, monitors, recurring automations, background jobs, schedulers.
Do:
- Prefer explicit, inspectable configs; avoid hidden state.
- Record what runs where, and how to stop/rollback.
Do not:
- Create automations that run outside the tailnet policy.
Done when:
- Automation is documented and verifiable.

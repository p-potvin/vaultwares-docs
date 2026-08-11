# AUTOMATION_POLICY
Applies when: cron, monitors, recurring automations, background jobs, schedulers.

## Any automation touching HuggingFace needs explicit approval first

Inference Providers, Spaces, ZeroGPU, Jobs, Hub API, or a gateway in front of
them (`vault-inference`). Before creating one, get from the user:

- approval to create it at all,
- the schedule and a **time constraint** (window, max runtime, or max runs/day),
- a hard request cap per run.

Do not create it and then ask. Do not assume a previously approved HF automation
authorises a new one. See REQUEST_RATE_LIMITING for the no-loop rule that
applies inside each run.

Do:
- Prefer explicit, inspectable configs; avoid hidden state.
- Record inside the repo what runs where, and how to stop/rollback.
- If scheduled task, use conhost.exe with arguments: "--headless pwsh.exe -NoProfile -WindowStyle Hidden -NonInteractive -ExecutionPolicy Bypass -File <your script>"
Do not:
- Create automations that run outside the tailnet policy.
Done when:
- Automation is documented and verifiable.

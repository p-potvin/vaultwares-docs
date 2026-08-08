# REQUEST_RATE_LIMITING
Applies when: any loop or batch of external or internal requests; translation, crawler, API polling, webhook polling, TCP/UDP probes, health checks, model calls, or local service requests.

## HuggingFace: no loops. At all.

Covers everything HF — Inference Providers, Spaces, ZeroGPU, Jobs, Hub API,
`hf` CLI, and any gateway in front of them such as `vault-inference`.

- **Never** write or run a loop, batch, retry-until-success, polling loop, or
  fan-out that issues HF requests. Not "small" ones. Not "just to test".
- One-off calls are fine. A `for` loop over a list of inputs is not.
- A scheduled or recurring task that touches HF requires the user's explicit
  approval **and** an agreed time constraint before it is created. See
  AUTOMATION_POLICY.
- Anything that could retry on failure needs a hard attempt cap written into it,
  not a `while` with a break condition.
- The allowance is finite and real money is behind it: the account is prepaid
  with `canPay: true`, so an overrun bills rather than failing. ZeroGPU is
  capped at 30 min/day of 96 GB VRAM and a loop burns it in one sitting.

If a task seems to need a loop over HF, stop and ask. Do not design around this.

## General

Do:
- Pause and ask before running any loop or batch of TCP, UDP, HTTP, API, translation, crawler, polling, or model requests.
- State the target, request count, expected rate, stop condition, and why the batch is necessary.
- Prefer local Gemma4 through Ollama at `http://localhost:11434` for translation or high-volume helper work when applicable.
- Stagger requests and use small batches so external services, internal services, local models, and the user's PC are not overloaded.
- Add explicit limits, dry-run modes, or confirmation gates to scripts that can generate many requests.
Do not:
- Spam external services or internal services from the user's IP address.
- Run unbounded loops, broad crawls, mass translations, port sweeps, polling loops, or local model batches without approval.
- Use public translation/search/API services for bulk work when a local model can reasonably handle it.
Done when:
- The user approved the request volume/rate or the task was completed with a bounded local/offline method.
- Verification records the target and request volume without logging secrets.

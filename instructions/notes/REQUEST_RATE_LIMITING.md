# REQUEST_RATE_LIMITING notes
This protocol exists because assistant-driven loops can unintentionally generate enough traffic to trigger rate limits, blocks, or service strain from the user's IP address.

Before any request batch, identify:
- target host or service
- protocol and endpoint shape
- total expected request count
- concurrency
- delay between requests
- retry behavior
- stop condition
- whether local/offline processing can replace the request loop

For translation and other text transformation tasks, prefer `Gemma4` via local Ollama at `http://localhost:11434` when applicable. Use sequential calls with a delay and small chunks. Do not overload the model or the user's PC.

Scripts that can issue many requests should default to safe behavior:
- dry-run by default when feasible
- require a confirmation flag such as `--yes`
- expose `--limit`, `--delay-ms`, and target/model options
- print the planned request count before execution
- stop on repeated failures or rate-limit responses

This applies to internal services too. Tailnet/localhost/private endpoints are not a free pass for unbounded loops.

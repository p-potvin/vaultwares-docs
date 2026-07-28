# Request Rate Limiting Policy Notes

Welcome to the VaultWares request rate limiting policy! This guide explains how we prevent our automated agents and scripts from overwhelming external services, internal APIs, and local resources.

## The Risk of Automated Loops

AI assistants and scripts can execute tasks incredibly fast. When placed in a loop—such as crawling websites, translating text, polling an API, or scanning ports—they can easily generate enough traffic to trigger rate limits, get our IPs banned, or crash local services.

## Guidelines for Managing Request Rates

### 1. Always Ask First
Before initiating any loop or batch of external/internal requests (TCP, UDP, HTTP, API, translation, etc.), **you must pause and ask the user for approval.**
You must explicitly state:
- The target host or service.
- The total expected request count.
- The concurrency (how many parallel requests).
- The delay between requests.
- The stop condition.

### 2. Prefer Local Processing
For bulk work like text transformation or translation, do not use public APIs if a local model can handle it. **Prefer using local Gemma4 via Ollama** (`http://localhost:11434`) to save external bandwidth and preserve privacy.

### 3. Stagger and Chunk
Never fire off hundreds of requests at once.
- Use sequential calls with a defined delay (e.g., 500ms).
- Process data in small chunks.
- Do not overload the local Ollama model or the user's PC memory.

### 4. Build Safety into Scripts
If you are writing a script that issues many requests, default to safety:
- Implement a `--dry-run` mode.
- Require a `--yes` confirmation flag to execute.
- Expose `--limit` and `--delay-ms` options.
- Ensure the script stops on repeated failures or HTTP 429 (Too Many Requests) responses.

### 5. Internal Services Are Not Exempt
Do not assume that because a service is on `localhost` or the tailnet, it can handle unbounded loops. Rate limit internal requests just as strictly as external ones.

## When is it "Done"?
A batch task is done when it is completed within a bounded, approved limit, staggered safely, and the total request volume is recorded in the verification notes without logging sensitive data.

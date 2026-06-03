# CODING_STANDARDS
Applies when: writing, refactoring, or optimizing logical processes, IPC handlers, or front-facing UI logic across any VaultWares project.

## 1. Metric-Based Logical Quality
- **Function Bounds**: Maximum **50 to 80 lines of logical execution** (excluding docstrings and formatting).
- **Cyclomatic Complexity ($V(G)$)**: Must be **$< 10$**. If a function exceeds 10 independent control paths (nested conditional blocks, catch blocks, loops), it must be factored out into highly focused, reusable helpers.
- **Single Responsibility Principle**: A function must perform cohesive actions in a single architectural domain. Do not mix disk I/O, parsing raw content, and GUI state mapping inside the same block.

## 2. Latency & Thread Non-blocking Hard Limits
- **Main Thread Limit**: HARD limit of **$16.7\text{ms}$** (the single-frame budget for 60 FPS rendering) for any synchronous work on the UI event thread.
- **Asynchronous Thresholds**: For I/O or database access, any process running synchronously on the backend event thread that blocks for **$> 50\text{ms}$** is unacceptable. All I/O must be asynchronous (`fs.promises`).
- **Interactive UI Feedback**: Any operation taking **$> 200\text{ms}$** must provide explicit real-time feedback (loaders, skeletons).

## 3. High-Performance Caching & Hydration Architecture
- **Double-Hydration Strategy**: To ensure sub-50ms visual paint on application startup or view transitions, always load and display the last known cached states first.
- **Concurrent Updates**: Concurrently spawn a non-blocking background task/IPC call to retrieve fresh disk metadata, seamlessly updating the state and persistent cache once complete.

## 4. Strict Prohibited Anti-Patterns
- **Synchronous I/O**: Direct bans on `fs.existsSync`, `fs.readFileSync`, `fs.statSync`, or `fs.readdirSync` inside standard event loops or client-facing operations. Use `fsPromises.access`, `fsPromises.readFile`, `fsPromises.stat`, or `fsPromises.readdir`.
- **Unbounded Parallel Promises**: Never execute `Promise.all` over large arrays or data matrices of variable size (causes socket/file handle exhaustion like `EMFILE`). Limit concurrency via batch chunking (e.g. max parallel execution of 32 tasks).
- **Silent Exception Swallowing**: Swallowing errors via empty `catch` blocks is prohibited. All exceptions must be caught, recorded with structured logging context, or handled gracefully at the boundary layer.
- **Hardcoded Secret Keys**: Hardcoding API tokens, dev keys, or configuration variables inside source files is strictly banned. Expose via clean `process.env` or persistent configuration schemas.

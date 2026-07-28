# CODING_STANDARDS notes

Welcome to the VaultWares coding standards! This guide expands on the core rules outlined in our coding standards summary, providing context and rationale to help you write cleaner, faster, and more reliable code.

These standards apply whenever you are writing, refactoring, or optimizing logical processes, Inter-Process Communication (IPC) handlers, or user-facing UI logic across any VaultWares project.

---

## 1. Metric-Based Logical Quality

Writing code that is easy to read, test, and maintain is crucial for the long-term health of our projects. We enforce a few strict metrics to ensure our functions stay manageable:

- **Function Bounds (Keep it Short!):** Aim for functions to be between **50 and 80 lines of logical execution**. This does not include docstrings, comments, or basic formatting. Smaller functions are easier to understand at a glance and much easier to unit test. If you find your function growing past this limit, it's a strong sign it needs to be broken down.
- **Cyclomatic Complexity (Keep it Simple!):** The complexity score (often written as $V(G)$) must remain **below 10**. In practical terms, this means if your function has more than 10 independent control paths—think `if/else` blocks, `try/catch` statements, or `for/while` loops nested together—it's too complex. Break those deep nests out into smaller, reusable helper functions that do one thing well.
- **Single Responsibility Principle (Keep it Focused!):** A function should only ever do one thing. It must perform cohesive actions that belong to a single architectural domain. For instance, do not mix reading a file from disk, parsing that raw file content, and mapping the resulting data to GUI state all in the same block of code. Separate these into discrete steps: a reader, a parser, and a state mapper.

## 2. Latency & Thread Non-blocking Hard Limits

Performance is a feature. We want our applications to feel snappy and responsive, which means we have to respect the limitations of the event loop and thread execution.

- **Main Thread Limit (60 FPS Rule):** You have a strict budget of **16.7 milliseconds** for any synchronous work on the UI event thread. Why? Because 16.7ms is the maximum time you have to render a single frame at 60 frames per second. If you block the main thread longer than this, the application stutters.
- **Asynchronous Thresholds (Don't Block the Backend!):** For background operations like I/O or database access, running synchronous code on the backend event thread that blocks for more than **50 milliseconds** is unacceptable. All I/O must be strictly asynchronous (e.g., using `fs.promises` instead of synchronous file system calls).
- **Interactive UI Feedback (Show the User Something!):** If an operation is going to take longer than **200 milliseconds**, you must provide explicit, real-time feedback to the user. This means showing a loading spinner, a progress bar, or a skeleton screen so the user knows the application hasn't frozen.

## 3. High-Performance Caching & Hydration Architecture

To ensure our apps feel instantly available, we use specific strategies for loading data.

- **Double-Hydration Strategy:** To achieve a visual paint in under 50ms on application startup or when transitioning between views, always load and display the **last known cached state first**. This gives the user immediate visual feedback while the real data loads.
- **Concurrent Updates:** While that cached data is being displayed, spawn a non-blocking background task (or an IPC call) to fetch the fresh data. Once the fresh data arrives, seamlessly update the application state and the persistent cache behind the scenes.

## 4. Strict Prohibited Anti-Patterns

There are a few things that are outright banned in the VaultWares codebase. Please ensure none of these make it into your pull requests:

- **Synchronous I/O is Banned:** Never use synchronous file system methods like `fs.existsSync`, `fs.readFileSync`, `fs.statSync`, or `fs.readdirSync` in standard event loops or client-facing operations. Always reach for their asynchronous equivalents like `fsPromises.access`, `fsPromises.readFile`, `fsPromises.stat`, or `fsPromises.readdir`.
- **No Unbounded Parallel Promises:** Do not run `Promise.all` over large arrays or data matrices of unknown or variable sizes. Attempting to open thousands of files or network sockets at once will lead to resource exhaustion (like the dreaded `EMFILE` error). Instead, limit your concurrency by batching tasks (for example, process a maximum of 32 tasks in parallel at any given time).
- **No Silent Exception Swallowing:** Empty `catch` blocks are strictly prohibited. Errors should never be ignored silently. You must catch them, record them with proper structured logging context, or handle them gracefully at the boundary layer so the application can recover or fail predictably.
- **No Hardcoded Secret Keys:** Never hardcode API tokens, development keys, or configuration variables directly into your source files. Always expose these through a clean `process.env` configuration or via a persistent configuration schema.

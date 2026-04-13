# Browser Strategy: Optimizing Token Usage

## Three Tiers

### Tier 1: Lite (WebFetch)

- **Cost:** ~200-1000 tokens
- **Use for:** Reconnaissance — page structure, navigation links, static content, checking if a page exists
- **Tool:** `WebFetch` with the target URL
- **Limitation:** No JavaScript execution, no interactive element refs, no form filling

### Tier 2: Snapshot (Playwright MCP snapshot)

- **Cost:** ~500-2000 tokens per snapshot
- **Use for:** Interactive discovery — element refs, JS-rendered content, dynamic UI state
- **Tool:** Playwright MCP `browser_snapshot`
- **Optimization:** Each action returns an automatic snapshot. Only call `browser_snapshot` explicitly when you need a fresh view without performing an action.

### Tier 3: Full Browser (Playwright MCP actions)

- **Cost:** ~50-200 tokens per action (requires Tier 2 first)
- **Use for:** Selector capture — clicking, filling, navigating to verify real behavior and capture generated Playwright code
- **Required for:** All test code generation and selector verification

## Decision Rules

1. **Start lite.** For any new URL, use `WebFetch` first to understand the page structure.
2. **Recognize SPAs.** If `WebFetch` returns minimal HTML (e.g., just `<div id="root">` or `<div id="app">`), the page is JavaScript-rendered. Escalate to browser immediately.
3. **Escalate when needed.** Switch to Playwright MCP when you need:
   - JavaScript-rendered content
   - Interactive element refs
   - Authentication-gated pages
   - Real selector verification for test code
4. **Stay in browser once open.** Once you've opened the browser for a URL, continue with Playwright MCP. Don't switch back to `WebFetch` for the same page.
5. **Minimize snapshots.** Use the automatic snapshot returned after each action. Call `browser_snapshot` only when you need to re-inspect without acting.

## User Overrides

Users can control the strategy with natural language:

| User says | Effect |
|---|---|
| "use lite mode" / "save tokens" / "quick exploration" | Maximize `WebFetch`, only use browser when necessary |
| "use browser mode" / "use full browser" / "be thorough" | Use Playwright MCP for everything (skip WebFetch) |
| _(nothing — default)_ | Pick the right tier automatically per phase |

## Per-Agent Defaults

| Agent | Default Start Tier | Rationale |
|---|---|---|
| **Planner** | Tier 1 (Lite) | Exploration-heavy; WebFetch covers initial reconnaissance |
| **Generator** | Tier 3 (Full) | Must capture real selectors; browser always required |
| **Healer** | Tier 1 (Lite) | Start with error analysis + quick page check; browser for debugging |

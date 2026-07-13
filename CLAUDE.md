# Squad Up

A browser-based, 5-a-side dream-team match simulator for SuperSportBet (SBET). Full product spec lives in `SPEC.md` at the repo root, read the relevant section before implementing anything, don't rely on memory of it.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Zustand for client state (squad selections, match state)
- Vitest for unit tests, Playwright for e2e and visual/screenshot checks
- Howler.js for audio (ambient bed + stings, see SPEC.md section 8.4)

## Commands

- `npm run dev` — dev server inside the sandbox (for a quick look before a PR/preview exists)
- `npm run build` — production build, must pass before any phase is considered done
- `npm run typecheck` — run after any non-trivial change
- `npm run lint` — eslint
- `npm test` — Vitest unit tests (prefer running a single file during iteration: `npm test -- path/to/file`)
- `npm run test:e2e` — Playwright

## Cloud sandbox realities

This project runs in Claude Code's cloud environment (Desktop app, Remote), not a local machine. A few things follow from that:

- Every session starts from a **fresh sandbox cloned from GitHub**. Nothing persists between sessions except what's actually pushed. If it's not committed and pushed, the next session won't see it, there is no local disk continuity to fall back on.
- Cloud sessions **auto-accept file edits**, there's no per-edit approval step like local "Ask" mode. The PR + Netlify deploy preview is the real review checkpoint, not a running commentary of individual edits. Treat every phase's PR as the thing that actually gets checked, not a formality.
- Cloud sessions **push a branch and open a PR automatically** when a task finishes. Rename the branch/PR to match this project's `phase-N-short-description` convention if the default naming doesn't, so Netlify preview URLs and history stay easy to navigate.
- **Network access is limited by default** in a cloud sandbox. `npm install`/`registry.npmjs.org` needs to work for basically every phase, and if Figma MCP is used for design-fidelity checks, MCP server access needs to be explicitly allowed too. Configure the environment (via the environment dropdown → Add/edit environment in the app) for unrestricted network access, or an explicit allowlist covering at minimum: `registry.npmjs.org`, `github.com`, `api.github.com`, `raw.githubusercontent.com`, and `mcp.figma.com` if Figma MCP is in use.
- Add a `SessionStart` hook (or a setup script the environment runs on boot) that does `npm install` automatically, so every fresh sandbox is ready without Claude having to figure that out from scratch each phase. Set this up in Phase 0.
- This is a fast-moving part of the product, if any of the above doesn't match what you see in the app, trust the app's current behavior over this file and update it.

## Deployment: GitHub + Netlify

- Every phase of work ships as its own branch and PR, not a direct push to `main`. In the cloud environment this happens automatically when a task completes, confirm the branch/PR name matches the phase convention below rather than leaving the default. Netlify builds a deploy preview per PR automatically once its GitHub App is connected to the repo (a one-time setup, not something a session needs to do), use that preview URL as the primary check for anything visual, it's what actually ships, not just what runs in the sandbox.
- Branch naming: `phase-N-short-description`, matching the phase in the build plan. PR title matches the phase name.
- Merge once the Netlify preview checks out against SPEC.md / the relevant Figma node. Don't merge on a sandbox build alone, the sandbox and the actual Netlify build environment aren't guaranteed identical.
- If a PR's Netlify build check fails, Claude Code's Auto-fix (toggle in the PR's CI status bar) can pick up the failure and fix it without a new session, worth using instead of starting over.
- `netlify.toml` lives at the repo root, set up in Phase 0. If a later change needs an environment variable (this will come up once real OAuth replaces the mocked auth), it goes in Netlify's site settings, never committed to the repo.

## Code style

- Function components, no class components
- Tailwind only, no CSS-in-JS, no separate stylesheets
- Design tokens (colors, type, radii) come from SPEC.md section 6, wire them into `tailwind.config` once in Phase 1, reference by token name everywhere after, don't hardcode hex values in components

## Architecture rules

- `lib/simulation/` is pure logic, no UI or React imports. It must be independently testable and independently reusable, this is a hard requirement, not a style preference, see SPEC.md section 14 on why (future multiplayer needs a deterministic, server-runnable engine).
- `lib/auth/` is an interface (`login(provider)`, `getSession()`), not a specific provider. The current implementation is mocked, it must be swappable for real OAuth without touching any screen that calls it.
- A `Match` object is generated once, in full, before the Live Commentary Page starts playing it back. Nothing about match outcome is computed live during playback. This is why mid-match exit doesn't need resume logic, see SPEC.md section 9.

## Workflow

- Reference Figma nodes by ID (SPEC.md section 13) when implementing a screen's layout. If the Figma MCP is connected and the environment's network access allows it (see Cloud sandbox realities above), use it to pull `get_design_context` / `get_screenshot` for the relevant node and compare against what gets built.
- Before considering a screen "done," produce a screenshot and compare it against the Figma reference (or the SPEC.md description, for the two screens with no Figma frame: How to Play, Profile/History).
- Work on a phase branch, not directly on `main` (see Deployment above). Reference the SPEC.md section implemented in commit messages and the PR description.
- Don't touch `lib/simulation/` and UI code in the same commit unless the change genuinely spans both.

## Known gaps (see SPEC.md section 12)

- Player database, profanity word list, and sound effects are placeholder/stub data until sourced. Don't block screen implementation on having final data, use a small stub dataset and swap it later.
- How to Play and Profile/History have no Figma design. Build to the written spec in SPEC.md, functional over polished.

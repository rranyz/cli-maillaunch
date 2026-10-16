# Maillaunch

A TypeScript CLI for managing email campaigns over the Gmail API and
Microsoft Graph API — CSV recipient imports, personalized templates,
OAuth authentication, persistent campaign state, retries, daily sending
limits, and structured logs.

## Requirements

- Node.js LTS (tested on Node.js 24)
- npm

## Setup

```bash
npm install
```

## Project structure

```
src/        TypeScript source (compiled to dist/ — see below)
dist/       Compiled JavaScript output (generated, not committed)
tests/      Unit and integration tests (run against src/ directly, not compiled)
docs/       Requirements, architecture, and decision records
data/       Runtime data: SQLite database, campaign/token storage (not committed)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the CLI from TypeScript source directly (via `tsx`), for local development. |
| `npm run build` | Compile `src/` to `dist/` with `tsc`. |
| `npm start` | Run the compiled CLI from `dist/main.js`. This is how the tool runs in production. |
| `npm run typecheck` | Type-check the project without emitting output. |
| `npm test` | Build (`pretest`) and run all tests under `tests/` with the Node.js test runner. |

## TypeScript conventions

- **Strict mode** is enabled (`strict: true` in `tsconfig.json`).
- **Module resolution is NodeNext** (`module`/`moduleResolution: "nodenext"`), matching Node's native ESM loader.
- Relative imports in source files must include the **`.js` extension**, even though the source file is `.ts` — this is required by NodeNext ESM resolution. For example:

  ```ts
  import { createProgram } from "./cli/createProgram.js";
  ```

- Source lives in `src/` and compiles to `dist/`; `tests/` and `data/` are excluded from the production build (see `tsconfig.json`'s `exclude`).
- Production execution (`npm start`, the published `maillaunch` bin, and the `main`/`types` package entry points) always runs the **compiled JavaScript in `dist/`**, never the TypeScript source directly.

## Configuration

Copy `maillaunch.config.example.yaml` to `maillaunch.config.yaml` and fill in
your provider credentials. Never commit a config file containing real
credentials — see `.gitignore` and `CLAUDE.md` for the project's security
rules.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Verifies production execution runs against the compiled dist/ output,
// not the TypeScript source. `npm test` runs `npm run build` first
// (see the `pretest` script) so this file is always up to date.
const here = path.dirname(fileURLToPath(import.meta.url));
const compiledEntry = path.resolve(here, "../../dist/main.js");

test("compiled CLI entry runs and reports its version", () => {
  const output = execFileSync(process.execPath, [compiledEntry, "--version"], {
    encoding: "utf8",
  });

  assert.equal(output.trim(), "0.1.0");
});

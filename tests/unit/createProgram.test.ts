import { test } from "node:test";
import assert from "node:assert/strict";

import { createProgram } from "../../src/cli/createProgram.js";

test("createProgram sets name, description, and version", () => {
  const program = createProgram();

  assert.equal(program.name(), "maillaunch");
  assert.equal(program.description(), "CLI email campaign manager");
  assert.equal(program.version(), "0.1.0");
});

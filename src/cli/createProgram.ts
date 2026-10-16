import { Command } from "commander";

/**
 * Builds the root CLI program.
 *
 * Kept separate from the entrypoint so commands can be registered here
 * (and unit-tested) without spawning a process.
 */
export function createProgram(): Command {
  return new Command()
    .name("maillaunch")
    .description("CLI email campaign manager")
    .version("0.1.0");
}

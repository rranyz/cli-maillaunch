#!/usr/bin/env node

import { createProgram } from "./cli/createProgram.js";

const program = createProgram();

program.parse();

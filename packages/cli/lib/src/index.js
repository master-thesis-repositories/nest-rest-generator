#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_rest_api_1 = require("./commands/generate_rest_api");
const infer_1 = require("./commands/infer");
const cli_1 = require("./core/cli");
const config_1 = require("./core/config");
cli_1.Cli.program
    .version((0, config_1.version)(), "-v, --version", "display the current version number")
    .description("A tool to generate NestJs interaction tooling.");
cli_1.Cli.program
    .command("generate")
    .option("-i, --input <input>", "the name of the input directory", ".")
    .option("-o, --output <output>", "the name of the output file", "api.json")
    .description("generate postman compatible json for the nest.js rest api")
    .action((args) => {
    const inputDirectory = args.input;
    const outputFile = args.output;
    (0, generate_rest_api_1.generatePostman)(inputDirectory, outputFile);
});
cli_1.Cli.program
    .command("infer")
    .description("infer testing")
    .action(() => {
    (0, infer_1.inferVars)();
});
cli_1.Cli.start();

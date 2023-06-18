#!/usr/bin/env node
import {generatePostman} from "./commands/generate_rest_api";
import {inferVars} from "./commands/infer";
import {Cli} from "./core/cli";
import {version} from "./core/config";


Cli.program
.version(version(), "-v, --version", "display the current version number")
.description("A tool to generate NestJs interaction tooling.");

Cli.program
.command("generate")
.option("-i, --input <input>", "the name of the input directory", ".")
.option("-o, --output <output>", "the name of the output file", "api.json")
.description("generate postman compatible json for the nest.js rest api")
.action((args: any) => {
  const inputDirectory: string = args.input;
  const outputFile: string = args.output;

  generatePostman(inputDirectory, outputFile);
});

Cli.program
.command("infer")
.description("infer testing")
.action(() => {
  inferVars();
});

Cli.start();

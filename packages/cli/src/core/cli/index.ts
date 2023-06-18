import {Command} from "commander";


export class Cli {

  private static _program?: Command;

  private static get args(): string[] {
    return process.argv;
  }

  public static get program(): Command {
    if (!this._program) {
      this._program = new Command();
    }

    return this._program;
  }

  public static start(): void {
    this.program.parse(this.args);
  }
}

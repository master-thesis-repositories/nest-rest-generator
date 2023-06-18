"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cli = void 0;
const commander_1 = require("commander");
class Cli {
    static _program;
    static get args() {
        return process.argv;
    }
    static get program() {
        if (!this._program) {
            this._program = new commander_1.Command();
        }
        return this._program;
    }
    static start() {
        this.program.parse(this.args);
    }
}
exports.Cli = Cli;

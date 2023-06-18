import { Command } from "commander";
export declare class Cli {
    private static _program?;
    private static get args();
    static get program(): Command;
    static start(): void;
}

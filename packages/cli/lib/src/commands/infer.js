"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferVars = void 0;
const fs_1 = __importDefault(require("fs"));
const ts = __importStar(require("typescript"));
const inferVars = () => {
    const filename = "./src/test/index.ts";
    const file = fs_1.default.readFileSync(filename, "utf-8");
    const sourceFile = ts.createSourceFile("test.ts", file, ts.ScriptTarget.Latest, true);
    const program = ts.createProgram([sourceFile.fileName], {});
    const typeChecker = program.getTypeChecker();
    // Source
    if (sourceFile) {
        ts.forEachChild(sourceFile, (node) => {
            // Variable Statement
            if (ts.isVariableStatement(node)) {
                const stmt = node;
                ts.forEachChild(node, (node) => {
                    // Variable Declaration List
                    if (ts.isVariableDeclarationList(node)) {
                        ts.forEachChild(node, (node) => {
                            // Variable Declaration
                            if (ts.isVariableDeclaration(node)) {
                                ts.forEachChild(node, (node) => {
                                    // Identifier
                                    if (ts.isIdentifier(node)) {
                                        const symbol = typeChecker.getSymbolAtLocation(node);
                                        if (symbol) {
                                            console.log(node.getText(sourceFile));
                                            console.log(symbol);
                                            console.log();
                                            // const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                                            // console.log(`Variable ${node.text} has type: ${typeChecker.typeToString(type)}`);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                // @ts-ignore
                // node.declartionList.declarations.forEach((declaration) => {
                //   if (ts.isIdentifier(declaration.name)) {
                //     console.log("id");
                //     const symbol = typeChecker.getSymbolAtLocation(declaration.name);
                //     if (symbol) {
                //       // @ts-ignore
                //       const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                //       console.log(`Variable ${declaration.name.text} has type: ${typeChecker.typeToString(type)}`);
                //     }
                //   }
                // })
            }
        });
    }
};
exports.inferVars = inferVars;

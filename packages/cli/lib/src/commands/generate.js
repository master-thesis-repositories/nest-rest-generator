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
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputFile = void 0;
const typescript_1 = __importStar(require("typescript"));
// create name property
const nameProp = typescript_1.factory.createPropertySignature(undefined, typescript_1.factory.createIdentifier("name"), undefined, typescript_1.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword));
// create age property
const ageProp = typescript_1.factory.createPropertySignature(undefined, typescript_1.factory.createIdentifier("age"), undefined, typescript_1.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword));
// create User type
const userType = typescript_1.factory.createTypeAliasDeclaration([typescript_1.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.factory.createIdentifier("User"), undefined, typescript_1.factory.createTypeLiteralNode([nameProp, ageProp]));
const userProp = typescript_1.factory.createPropertySignature(undefined, typescript_1.factory.createIdentifier("user"), undefined, typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier("User"), undefined));
const adminType = typescript_1.factory.createTypeAliasDeclaration([typescript_1.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.factory.createIdentifier("Admin"), undefined, typescript_1.factory.createTypeLiteralNode([userProp]));
const nodes = typescript_1.factory.createNodeArray([userType, adminType]);
const sourceFile = typescript_1.default.createSourceFile("placeholder.ts", "", typescript_1.default.ScriptTarget.ESNext, true, typescript_1.default.ScriptKind.TS);
const printer = typescript_1.default.createPrinter();
exports.outputFile = printer.printList(typescript_1.default.ListFormat.MultiLine, nodes, sourceFile);

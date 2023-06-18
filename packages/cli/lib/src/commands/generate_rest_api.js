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
exports.generatePostman = exports.generateDefault = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
// Methods
const getMethodNames = (filename) => {
    const file = fs.readFileSync(filename, "utf-8");
    const sourceFile = ts.createSourceFile("names.ts", file, ts.ScriptTarget.Latest);
    const names = [];
    const visit = (node) => {
        if (ts.isMethodDeclaration(node)) {
            const name = node.name.getText(sourceFile);
            names.push(name);
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
    return names;
};
const getMethods = (filename) => {
    const file = fs.readFileSync(filename, "utf-8");
    const sourceFile = ts.createSourceFile("methods.ts", file, ts.ScriptTarget.Latest);
    const methods = [];
    const visit = (node) => {
        if (ts.isMethodDeclaration(node)) {
            // const methodName = node.name.getText(sourceFile);
            const method = node.getText(sourceFile);
            methods.push(method);
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
    return methods;
};
// Decorators
const getDecoratorValues = (decorator) => {
    const values = [];
    if (ts.isCallExpression(decorator.expression)) {
        const args = decorator.expression.arguments;
        // Extract argument values
        args.forEach((arg) => {
            if (ts.isStringLiteral(arg)) {
                values.push(arg.text);
            }
        });
    }
    return values;
};
// Routes
const getRoutes = (filename) => {
    const file = fs.readFileSync(filename, "utf-8");
    const sourceFile = ts.createSourceFile("methods.ts", file, ts.ScriptTarget.Latest);
    const controller = {
        name: "",
        path: "",
    };
    const methods = [];
    const visit = (node) => {
        if (ts.isClassDeclaration(node)) {
            const className = node.name.getText(sourceFile);
            node.forEachChild((child) => {
                if (ts.isDecorator(child)) {
                    // @ts-ignore
                    const decoratorName = child.expression.expression.escapedText;
                    const params = getDecoratorValues(child);
                    if (decoratorName === "Controller") {
                        controller.name = className;
                        controller.path = params.length > 0 ? params[0] : "/";
                    }
                }
            });
            // TODO: Create class
        }
        if (ts.isMethodDeclaration(node)) {
            const method = {
                name: "",
                method: "",
                path: "",
                params: [],
                body: false,
            };
            const methodName = node.name.getText(sourceFile);
            node.forEachChild((child) => {
                if (ts.isParameter(child)) {
                    child.forEachChild((pChild) => {
                        if (ts.isDecorator(pChild)) {
                            // @ts-ignore
                            const decoratorName = pChild.expression.expression.escapedText;
                            const params = getDecoratorValues(pChild);
                            if (decoratorName === "Param") {
                                const param = params.length > 0 ? params[0] : "unknown";
                                method.params.push(param);
                            }
                            if (decoratorName === "Body") {
                                method.body = true;
                            }
                        }
                    });
                }
                if (ts.isDecorator(child)) {
                    // @ts-ignore
                    const decoratorName = child.expression.expression.escapedText;
                    const params = getDecoratorValues(child);
                    if (["Post", "Get", "Delete", "Put", "Patch", "Options", "Head", "All"].includes(decoratorName)) {
                        method.name = methodName;
                        method.method = decoratorName;
                        method.path = params.length > 0 ? params[0] : "/";
                    }
                }
            });
            if (method.method !== "") {
                methods.push(method);
            }
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
    return {
        controller,
        methods,
    };
};
const getAllRoutes = (rootDirectory) => {
    const files = [];
    const readDirectoryRecursive = (dir) => {
        const entries = fs.readdirSync(dir);
        entries.forEach(entry => {
            const fullPath = path.join(dir, entry);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                readDirectoryRecursive(fullPath); // Recursively read subdirectories
            }
            else if (stats.isFile() && entry.endsWith(".controller.ts")) {
                files.push(fullPath);
            }
        });
    };
    readDirectoryRecursive(rootDirectory);
    return files.map((file) => {
        return getRoutes(file);
    });
};
const getAllRoutesExport = (rootDirectory, base) => {
    const routes = getAllRoutes(rootDirectory);
    const result = [];
    for (const route of routes) {
        const thing = {
            name: route.controller.name,
            requests: route.methods.map((method) => {
                return {
                    name: method.name,
                    type: method.method,
                    path: (base + "/" + route.controller.path + "/" + method.path).replaceAll("//", "/"),
                };
            }),
        };
        result.push(thing);
    }
    return result;
};
// Postman Support
const getPostman = (api) => {
    return {
        info: {
            "_postman_id": "db4f37b3-d6e9-476b-baf6-0ca3b2819ac6",
            "name": "Appie Demo",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: api.map((controller) => {
            return {
                name: controller.name,
                item: controller.requests.map((request) => {
                    const url = new URL(request.path);
                    return {
                        name: request.name,
                        request: {
                            method: request.type.toUpperCase(),
                            header: [],
                            url: {
                                raw: request.path,
                                protocol: url.protocol.replaceAll(":", ""),
                                host: url.hostname.split("."),
                                port: url.port,
                                path: url.pathname.split("/").filter(p => p !== ""),
                            },
                        },
                        response: [],
                    };
                })
            };
        }),
    };
};
// Generators
const generateDefault = () => {
    const rootDirectory = ".";
    const result = getAllRoutesExport(rootDirectory, "http://localhost:5000");
    console.log(JSON.stringify(result, null, 2));
};
exports.generateDefault = generateDefault;
const generatePostman = (rootDirectory, output) => {
    const packageJsonPath = path.join(rootDirectory, "./package.json");
    if (rootDirectory === "." && fs.existsSync(packageJsonPath)) {
        rootDirectory = "src";
    }
    const result = getAllRoutesExport(rootDirectory, "http://localhost:5000");
    const postman = getPostman(result);
    const raw = JSON.stringify(postman, null, 2);
    if (fs.existsSync(output)) {
        console.error("File already exists");
        return;
    }
    fs.writeFileSync(output, raw, { encoding: "utf-8" });
};
exports.generatePostman = generatePostman;

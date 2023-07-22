import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import TypeScriptUtil from "../util/TypeScriptUtil";


// Methods
const getMethodNames = (filename: string) => {
  const file = fs.readFileSync(filename, "utf-8");
  const sourceFile = ts.createSourceFile("names.ts", file, ts.ScriptTarget.Latest);
  const names: string[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isMethodDeclaration(node)) {
      const name = node.name.getText(sourceFile);
      names.push(name);
    }

    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return names;
}

const getMethods = (filename: string) => {
  const file = fs.readFileSync(filename, "utf-8");
  const sourceFile = ts.createSourceFile("methods.ts", file, ts.ScriptTarget.Latest);
  const methods: string[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isMethodDeclaration(node)) {
      // const methodName = node.name.getText(sourceFile);
      const method = node.getText(sourceFile);
      methods.push(method);
    }

    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return methods;
}

// Decorators
const getDecoratorValues = (decorator: ts.Decorator): string[] => {
  const values: string[] = [];

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
}

// Routes
const getRoutes = (filename: string) => {
  const project = TypeScriptUtil.getProject(filename);
  const sourceFile = project.sourceFile;

  const controller = {
    name: "",
    path: "",
  };

  const methods: any[] = [];


  const visit = (node: ts.Node) => {

    if (ts.isClassDeclaration(node)) {
      const className = node.name!.getText(sourceFile);

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
      const method: any = {
        name: "",
        method: "",
        path: "",
        params: [],
        body: false,
        bodyType: "",
        bodyDecls: "",
        returnType: "",
        returnDecls: ""
      };

      const type = TypeScriptUtil.getReturnType(project.typeChecker, node);
      const typeString = TypeScriptUtil.getTypeString(project.typeChecker, type);
      const typeDecl = TypeScriptUtil.getTypeDeclaration(type) || "";

      method.returnType = typeString;
      method.returnDecls = typeDecl;

      const methodName = node.name.getText(sourceFile);

      node.forEachChild((child) => {
        if (ts.isParameter(child)) {
          child.forEachChild((pChild) => {
            if (ts.isDecorator(pChild)) {
              // @ts-ignore
              const decoratorName = pChild.expression.expression.escapedText;
              const params = getDecoratorValues(pChild);

              const type = TypeScriptUtil.getType(project.typeChecker, child);
              const typeString = TypeScriptUtil.getTypeString(project.typeChecker, type);
              const typeDecl = TypeScriptUtil.getTypeDeclaration(type) || "";

              if (decoratorName === "Param") {
                const param = params.length > 0 ? params[0] : "unknown";

                method.params.push({
                  param: param,
                  paramType: typeString,
                  paramDecls: typeDecl,
                });
              }

              if (decoratorName === "Body") {
                method.body = true;
                method.bodyType = typeString;
                method.bodyDecls = typeDecl;
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
  }

  ts.forEachChild(sourceFile, visit);

  return {
    controller,
    methods,
  }
}

const getAllRoutes = (rootDirectory: string) => {

  const files: any[] = [];

  const readDirectoryRecursive = (dir: string) => {
    const entries = fs.readdirSync(dir);

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        readDirectoryRecursive(fullPath); // Recursively read subdirectories
      } else if (stats.isFile() && entry.endsWith(".controller.ts")) {
        files.push(fullPath);
      }
    });
  };

  readDirectoryRecursive(rootDirectory);

  return files.map((file) => {
    return getRoutes(file);
  });
}

const getAllRoutesExport = (rootDirectory: string, base: string) => {
  const routes = getAllRoutes(rootDirectory);
  const result: any = [];

  for (const route of routes) {
    const thing = {
      name: route.controller.name,
      requests: route.methods.map((method) => {
        return {
          ...method,
          name: method.name,
          type: method.method,
          path: (base + "/" + route.controller.path + "/" + method.path).replaceAll("//", "/"),
        };
      }),
    };

    result.push(thing);
  }

  return result;
}

// Postman Support
const getPostman = (api: any[]) => {

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
}

// Generators
// "name": "getExample",
// "method": "Get",
// "path": "http:/localhost:5000/app/",
// "params": [],
// "body": false,
// "bodyType": "",
// "bodyDecls": "",
// "returnType": "ExampleLocal",
// "returnDecls": "type ExampleLocal = {\n  example: StringType;\n  test: number;\n}",
// "type": "Get"

const methodTemplate = (options: any) => {

  return `
${options.returnDecls}
${options.bodyDecls}
${options.params.map(param => param.paramDecls).join("\n")}

const ${options.name} = async (body?: ${options.bodyType || "any"}, params?: {${options.params.map(param => `${param.param}: ${param.paramType}`)}}): Promise<${options.returnType}> => {
  const response = await fetch("${options.path}", {
    method: "${options.method.toUpperCase()}",
    body: JSON.stringify(body),
  });
  
  return await response.json();
};`
};

export const generateClientApi = () => {
  const rootDirectory: string = ".";

  const result = getAllRoutesExport(rootDirectory, "http://localhost:5000");
  for (const request of result[0].requests) {
    console.log(methodTemplate(request));
  }
}

// Base Generators
export const generateDefault = () => {
  const rootDirectory: string = ".";

  const result = getAllRoutesExport(rootDirectory, "http://localhost:5000");
  console.log(JSON.stringify(result, null, 2));
}

export const generatePostman = (rootDirectory: string, output: string) => {

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

  fs.writeFileSync(output, raw, {encoding: "utf-8"});
}

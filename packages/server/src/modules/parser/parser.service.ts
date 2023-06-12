import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";


@Injectable()
export class ParserService implements OnApplicationBootstrap {
  // Run Code
  public onApplicationBootstrap(): any {
    const rootDirectory: string = "./src";

    const result = this.getAllRoutesExport(rootDirectory, "http://localhost:5000");
    console.log(JSON.stringify(result, null, 2));
  }

  public getMethodNames(filename: string) {
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

  public getMethods(filename: string) {
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

  private getDecoratorValues(decorator: ts.Decorator): string[] {
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

  public getRoutes(filename: string) {
    const file = fs.readFileSync(filename, "utf-8");
    const sourceFile = ts.createSourceFile("methods.ts", file, ts.ScriptTarget.Latest);

    const controller = {
      name: "",
      path: "",
    };

    const methods = [];


    const visit = (node: ts.Node) => {

      if (ts.isClassDeclaration(node)) {
        const className = node.name.getText(sourceFile);

        node.forEachChild((child) => {
          if (ts.isDecorator(child)) {
            // @ts-ignore
            const decoratorName = child.expression.expression.escapedText;
            const params = this.getDecoratorValues(child);

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
                const params = this.getDecoratorValues(pChild);

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
            const params = this.getDecoratorValues(child);

            method.name = methodName;
            method.method = decoratorName;
            method.path = params.length > 0 ? params[0] : "/";
          }
        });

        methods.push(method);
      }

      ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);

    return {
      controller,
      methods,
    }
  }

  public getAllRoutes(rootDirectory: string) {

    const files = [];

    const readDirectoryRecursive = (dir: string) => {
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
      return this.getRoutes(file);
    });
  }

  public getAllRoutesExport(rootDirectory: string, base: string) {
    const routes = this.getAllRoutes(rootDirectory);
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
  }

}

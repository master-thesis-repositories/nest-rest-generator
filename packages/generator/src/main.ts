import * as fs from "fs";
import ts from "typescript";


const node = ts.createSourceFile(
  "a.ts",
  fs.readFileSync("../nest/src/app.controller.ts", "utf-8"),
  ts.ScriptTarget.Latest,
);

node.forEachChild(child => {
  if (ts.SyntaxKind[child.kind] === "ClassDeclaration") {
    child.forEachChild(child => {

      if (ts.SyntaxKind[child.kind] === "MethodDeclaration") {

        let requestMethod = "";
        let name = "";
        child.forEachChild(child => {

          if (ts.SyntaxKind[child.kind] === "Decorator") {
            // const callExpression = child.getChildren()[0];
            // const identifier = callExpression.getChildren()[0];

            // @ts-ignore
            console.log("request method:", child.expression.expression.escapedText);
          }

          if (ts.SyntaxKind[child.kind] === "Identifier") {
            // @ts-ignore
            console.log("name:", child.escapedText);
          }


        });

      }
    });
  }
});

// console.log(node);


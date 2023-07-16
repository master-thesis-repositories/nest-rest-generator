import * as ts from "typescript";
import TypeScriptUtil from "../util/TypeScriptUtil";


function getAliasTypes(type: ts.Type): ts.TypeAliasDeclaration[] {
  const aliasTypes: ts.TypeAliasDeclaration[] = [];

  function checkTypeForAliases(type: ts.Type) {
    if (type.symbol && type.symbol.declarations) {
      type.symbol.declarations.forEach((declaration) => {
        if (ts.isTypeAliasDeclaration(declaration)) {
          aliasTypes.push(declaration);
        }
      });
    }

    (type as any).types?.forEach(checkTypeForAliases);
  }

  checkTypeForAliases(type);

  return aliasTypes;
}

export const extract = () => {

  const project = TypeScriptUtil.getProject("./src/test/index.ts");

  TypeScriptUtil.forEachVariableIdentifier(project.sourceFile, (node) => {
    console.log(node.getText(project.sourceFile));

    const symbol = project.typeChecker.getSymbolAtLocation(node)!;
    const type = project.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    // const type2 = project.typeChecker.

    console.log(type);
    // console.log(getAliasTypes(type));

    // console.log(symbol);
    // console.log((type as any).value);
    // console.log((type as any).regularType.value);

    // if (node.getText(project.sourceFile) === "e") {
    //   type.symbol.members?.forEach((value, key) => {
    //     const type = project.typeChecker.getTypeOfSymbolAtLocation(value, value.valueDeclaration!);
    //     const strType = project.typeChecker.typeToString(type);
    //     console.log("\t", strType);
    //
    //     if (strType !== "string") {
    //       type.symbol.members?.forEach((value, key) => {
    //         const type = project.typeChecker.getTypeOfSymbolAtLocation(value, value.valueDeclaration!);
    //         const strType = project.typeChecker.typeToString(type);
    //
    //         console.log("\t\t", strType);
    //       })
    //     }
    //   });
    //
    //   // SIMILAR TO: typeToString(type)
    //   // type.symbol.declarations?.forEach(d => {
    //   //   console.log(d.getText(project.sourceFile));
    //   // });
    // }

    // if (node.getText(project.sourceFile) === "g") {
    //   console.log(type);
    // }

    console.log(project.typeChecker.typeToString(type));
    console.log("\n ---------- \n");
  });
}


export const extract2 = () => {
  const project = TypeScriptUtil.getProject("../demo/src/app.controller.ts");


  TypeScriptUtil.forEachNode(project.sourceFile, (node) => {

    if (ts.isClassDeclaration(node)) {
      console.log("class", node.name?.getText(project.sourceFile));
      node.forEachChild(child => {
        if (ts.isDecorator(child)) {
          console.log("  decorator", child.getChildAt(1).getChildAt(0).getText(project.sourceFile));
          console.log("  decorator (value)", child.getChildAt(1).getChildAt(2).getText(project.sourceFile));
        }
      });
    }

    if (ts.isPropertyDeclaration(node)) {
      console.log("property", node.name.getText(project.sourceFile));
      node.forEachChild(child => {
        if (ts.isDecorator(child)) {
          console.log("  decorator", child.getChildAt(1).getChildAt(0).getText(project.sourceFile));
          console.log("  decorator (value)", child.getChildAt(1).getChildAt(2).getText(project.sourceFile));
        }
      });
    }

    if (ts.isMethodDeclaration(node)) {
      console.log("");
      console.log("method", node.name.getText(project.sourceFile));

      const signature = project.typeChecker.getSignatureFromDeclaration(node)!;
      const type = project.typeChecker.getReturnTypeOfSignature(signature);
      console.log(project.typeChecker.typeToString(type));

      node.forEachChild(child => {
        if (ts.isDecorator(child)) {
          console.log("  decorator", child.getChildAt(1).getChildAt(0).getText(project.sourceFile));
          console.log("  decorator (value)", child.getChildAt(1).getChildAt(2).getText(project.sourceFile));
        }

        if (ts.isParameter(child)) {
          console.log("    parameter", child.name.getText(project.sourceFile));

          child.forEachChild(child2 => {
            if (ts.isDecorator(child2)) {
              console.log("      decorator", child2.getChildAt(1).getChildAt(0).getText(project.sourceFile));
              console.log("      decorator (value)", child2.getChildAt(1).getChildAt(2).getText(project.sourceFile));

              console.log(child.getChildAt(3).getText(project.sourceFile));

              const type = project.typeChecker.getTypeAtLocation(child);
              console.log(project.typeChecker.typeToString(type));
            }
          });
        }
      });
    }

  });
}
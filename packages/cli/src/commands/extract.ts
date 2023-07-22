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


function resolveAliasTypes(typeChecker: ts.TypeChecker, type: ts.Type, visited: Set<ts.Type> = new Set()): string {
  if (visited.has(type)) {
    return 'Circular reference';
  }

  visited.add(type);

  const a = type.aliasSymbol;
  if (type.aliasSymbol) {
    // console.log(type.aliasSymbol);
    const t = type.aliasSymbol.getDeclarations()?.at(0)!;
    const tt = typeChecker.getTypeAtLocation(t);
    const s = tt.symbol;

    // console.log("symbol:", s);
    const ttt = typeChecker.getTypeOfSymbolAtLocation(a!, a!.valueDeclaration!);

    console.log("ttt", typeChecker.typeToString(ttt));

    const aliasedType = typeChecker.getDeclaredTypeOfSymbol(type.symbol);
    return resolveAliasTypes(typeChecker, aliasedType, visited);
  }

  return typeChecker.typeToString(type);
}


export const extract2 = () => {
  // , ["../demo/src/app.service.ts"]
  const project = TypeScriptUtil.getProject("../demo/src/app.controller.ts");


  TypeScriptUtil.forEachNode(project.sourceFile, (node) => {

    if (ts.isClassDeclaration(node)) {
      console.log("class", TypeScriptUtil.getName(node, project.sourceFile));

      // const decorators = TypeScriptUtil.getDecorators(node);
      // for (const decorator of decorators) {
      //   console.log("", "decorator",
      //     TypeScriptUtil.getDecoratorName(decorator, project.sourceFile),
      //     TypeScriptUtil.getDecoratorParameter(decorator, project.sourceFile),
      //   );
      // }
    }

    if (ts.isPropertyDeclaration(node)) {
      console.log("property", TypeScriptUtil.getName(node, project.sourceFile));

      // const decorators = TypeScriptUtil.getDecorators(node);
      // for (const decorator of decorators) {
      //   console.log("", "decorator",
      //     TypeScriptUtil.getDecoratorName(decorator, project.sourceFile),
      //     TypeScriptUtil.getDecoratorParameter(decorator, project.sourceFile)
      //   );
      // }
    }

    if (ts.isMethodDeclaration(node)) {
      console.log("");
      console.log("method", node.name.getText(project.sourceFile));

      const signature = project.typeChecker.getSignatureFromDeclaration(node)!;
      const type = project.typeChecker.getReturnTypeOfSignature(signature);

      if (type.aliasSymbol) {
        const decl = type.aliasSymbol.getDeclarations()![0];
        const src = decl.getSourceFile();
        console.log(type.aliasSymbol.getDeclarations()?.length);

        console.log(decl.getText(src));
      }

      // if (type.symbol) {
      //   const decl = type.symbol.getDeclarations()![0];
      //   console.log(decl);
      //
      //   console.log(decl.getText(project.sourceFile));
      // }

      console.log(project.typeChecker.typeToString(type));

      node.forEachChild(child => {
        if (ts.isDecorator(child)) {
          // console.log("", "decorator",
          //   TypeScriptUtil.getDecoratorName(child, project.sourceFile),
          //   TypeScriptUtil.getDecoratorParameter(child, project.sourceFile)
          // );
        }

        if (ts.isParameter(child)) {
          console.log("    parameter", child.name.getText(project.sourceFile));

          child.forEachChild(child2 => {
            if (ts.isDecorator(child2)) {
              // console.log("", "", "decorator",
              //   TypeScriptUtil.getDecoratorName(child2, project.sourceFile),
              //   TypeScriptUtil.getDecoratorParameter(child2, project.sourceFile)
              // );

              const type = project.typeChecker.getTypeAtLocation(child);
              console.log(project.typeChecker.typeToString(type));
            }
          });
        }
      });
    }

  });
}


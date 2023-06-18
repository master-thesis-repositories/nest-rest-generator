import * as ts from "typescript";


function typeToJson(program: any, typeNode: ts.TypeNode | undefined): any {
  if (!typeNode) {
    return null;
  }

  const typeChecker = program.getTypeChecker();
  const type = typeChecker.getTypeFromTypeNode(typeNode);

  if (type.isUnion()) {
    return type.types.map((subType) => typeToJson(program, typeChecker.typeToTypeNode(subType, undefined, undefined)));
  } else if (type.isIntersection()) {
    return type.types.map((subType) => typeToJson(program, typeChecker.typeToTypeNode(subType, undefined, undefined)));
  } else if (type.isObject()) {
    const symbol = type.getSymbol();
    if (symbol) {
      const json: any = {};
      symbol.members?.forEach((member) => {
        const propertyName = member.getName();
        const propertyTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!), undefined, undefined);
        json[propertyName] = typeToJson(program, propertyTypeNode);
      });
      return json;
    }
  }

  return typeChecker.typeToString(type);
}


export const inferVars = () => {

  const filename = "./src/test/index.ts";
  const program = ts.createProgram([filename], {});
  const typeChecker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filename)!;


  // Source
  if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {

      // Variable Statement
      if (ts.isVariableStatement(node)) {
        const stmt = node;
        ts.forEachChild(node, (node) => {

          // Variable Declaration List
          if (ts.isVariableDeclarationList(node)) {
            const declList = node;
            ts.forEachChild(node, (node) => {

              // Variable Declaration
              if (ts.isVariableDeclaration(node)) {
                const decl = node;
                ts.forEachChild(node, (node) => {

                  // Identifier
                  if (ts.isIdentifier(node)) {
                    const symbol = typeChecker.getSymbolAtLocation(node);
                    console.log(node.getText(sourceFile));
                    // console.log(symbol);
                    // console.log(node);
                    // console.log(node);
                    if (symbol) {
                      // console.log(symbol);
                      // console.log();
                      const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
                      const typeNode = typeChecker.typeToTypeNode(type, undefined, undefined);
                      // console.log(type);
                      // console.log(typeToJson(program, typeNode));

                      // console.log(type);
                      // const symbolJson = symbolToJson(symbol);
                      // console.log(JSON.stringify(symbolJson, null, 2));
                      // console.log(type.symbol);

                      console.log(typeChecker.typeToString(type));
                      // console.log(`Variable ${node.text} has type: ${typeChecker.typeToString(type)}`);
                    }
                    console.log();
                  }
                })
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

}

export const inferVars2 = () => {
  const filename = "./src/test/index.ts";
  const program = ts.createProgram([filename], {});
  const typeChecker = program.getTypeChecker();

  // Get the source file
  const sourceFile = program.getSourceFile(filename)!;

  // Traverse the AST to find variable declarations and retrieve their types
  function traverse(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      const declarationList = node.declarationList;
      declarationList.declarations.forEach((declaration) => {
        if (ts.isIdentifier(declaration.name)) {
          const symbol = typeChecker.getSymbolAtLocation(declaration.name);
          console.log(symbol);
          if (symbol) {
            const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
            console.log(`Variable ${declaration.name.text} has type: ${typeChecker.typeToString(type)}`);
          }
        }
      });
    }
    ts.forEachChild(node, traverse);
  }

  traverse(sourceFile);
};


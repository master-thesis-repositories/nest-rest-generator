import * as ts from "typescript";
import * as fs from "fs";


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

const resolveSymbol = (symbol: ts.Symbol) => {
  console.log(symbol.members);
  // symbol.

  return "";
}

// function resolveTypeProperties(typeChecker: ts.TypeChecker, type: ts.Type): object {
//   const properties: { [key: string]: any } = {};
//
//   typeChecker.getPropertiesOfType(type).forEach(property => {
//     const propertyName = property.getName();
//
//     // Get the type of the property
//     const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, node);
//
//     // Recursively resolve nested object types
//     if (propertyType.symbol && propertyType.symbol.members) {
//       properties[propertyName] = resolveTypeProperties(propertyType);
//     } else {
//       properties[propertyName] = typeChecker.typeToString(propertyType);
//     }
//   });
//
//   return properties;
// }


export const inferVars = () => {

  const filename = "./src/test/index.ts";
  const program = ts.createProgram([filename], {});
  const typeChecker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filename)!;

  // const types: ts.Type[] = [];

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

                      const resolve = (type: ts.Type) => {
                        const properties: {[key: string]: any} = {};

                        typeChecker.getPropertiesOfType(type).forEach(prop => {
                          const name = prop.getName();
                          const propType = typeChecker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!);

                          if (propType?.symbol?.members) {
                            properties[name] = resolve(propType);
                          }
                          else {
                            properties[name] = typeChecker.typeToString(propType);
                          }
                        });

                        return properties;
                      }

                      const resolveTypeDefinition = (type: ts.Type) => {
                        if (type.isUnion()) {
                          return type.types.map(resolveTypeDefinition);
                        }

                        if (type.isIntersection()) {
                          return type.types.reduce((acc: any, curr: ts.Type) => {
                            return Object.assign(acc, resolveTypeDefinition(curr));
                          }, {});
                        }

                        if (type.symbol) {
                          const properties: { [key: string]: any } = {};

                          typeChecker.getPropertiesOfType(type).forEach(property => {
                            const propertyName = property.getName();
                            const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, node);
                            properties[propertyName] = resolveTypeDefinition(propertyType);
                          });

                          return properties;
                        }

                        return typeChecker.typeToString(type);
                      }

                      // console.log(JSON.stringify(resolveTypeDefinition(type), null, 2));

                      console.log("1", typeChecker.typeToString(type), "\n");
                      //
                      // if (type.symbol) {
                      //   // @ts-ignore
                      //   // delete type.symbol.checker;
                      //   //
                      //   // console.log(type.symbol);
                      //
                      //   const sType = typeChecker.getTypeOfSymbolAtLocation(type.symbol, type.symbol.valueDeclaration!);
                      //   console.log("2", typeChecker.typeToString(sType));
                      // }
                      // console.log("");
                      //
                      // if (type.aliasSymbol) {
                      //   // @ts-ignore
                      //   // delete type.symbol.checker;
                      //   //
                      //   // console.log(type.symbol);
                      //
                      //   const sType = typeChecker.getTypeOfSymbolAtLocation(type.aliasSymbol, type.aliasSymbol.valueDeclaration!);
                      //   console.log("2", typeChecker.typeToString(sType));
                      // }
                      // console.log("");


                      // console.log(type);
                      // console.log(typeToJson(program, typeNode));

                      // console.log(type);
                      // const symbolJson = symbolToJson(symbol);
                      // console.log(JSON.stringify(symbolJson, null, 2));
                      // console.log(type.symbol);

                      // if (type.symbol) {
                      //   console.log("resolve");
                      //   console.log(resolveSymbol(type.symbol));
                      // }
                      //
                      // console.log("literal", type.isLiteral());
                      // console.log("alias", !!type.aliasSymbol);
                      // console.log("symbol", !!type.symbol, type.isClassOrInterface());
                      // console.log(typeChecker.typeToString(type));
                      // console.log("\n");
                      // console.log(`Variable ${node.text} has type: ${typeChecker.typeToString(type)}`);


                      // if (type.isUnion()) {
                      //   console.log("Union");
                      // }
                      //
                      // if (type.isIntersection()) {
                      //   console.log("Intersection");
                      // }
                      //
                      // console.log((type as any).value);
                      // console.log((type as any).types);
                      // console.log((type as any).intrinsicName);
                      // console.log((type as any).symbol);
                      // console.log((type as any).symbolAlias);
                    }
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

  // console.log(types);
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


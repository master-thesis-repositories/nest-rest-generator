import * as ts from "typescript";


type Project = ReturnType<typeof TypeScriptUtil.getProject>;


class TypeScriptUtil {

  // Project
  public static getProject(filename: string, files: string[] = []) {
    const program = ts.createProgram([filename, ...files], {declaration: true, declarationMap: true});
    const typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile(filename)!;

    return {
      program,
      typeChecker,
      sourceFile,
    };
  }

  // Nodes
  public static getNodes(root: ts.Node) {
    const nodes: ts.Node[] = [];

    TypeScriptUtil.forEachNode(root, (node) => {
      nodes.push(node);
    });

    return nodes;
  }

  // ForEach
  public static forEachNode(root: ts.Node, callback: (node: ts.Node) => void) {

    const visit = (node: ts.Node) => {
      callback(node);
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(root, visit);
  }

  public static forEachIdentifier(root: ts.Node, callback: (identifier: ts.Identifier) => void) {
    this.forEachNode(root, (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        callback(node);
      }
    });
  }

  public static forEachVariableIdentifier(root: ts.Node, callback: (identifier: ts.Identifier) => void) {
    this.forEachNode(root, (node: ts.Node) => {
      if (ts.isIdentifier(node) && ts.isVariableDeclaration(node.parent)) {
        callback(node);
      }
    });
  }

  // Getters
  public static getParameters(node: ts.Node, sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker) {
    const parameters: any[] = [];

    node.forEachChild(node => {
      if (ts.isParameter(node)) {
        parameters.push({
          node,
          type: this.getType(typeChecker, node),
          decorators: this.getDecorators(node, sourceFile),
        });
      }
    });

    return parameters;
  }

  public static getDecorators(node: ts.Node, source: ts.SourceFile) {
    const parameters: any[] = [];

    node.forEachChild(node => {
      if (ts.isDecorator(node)) {
        parameters.push({
          node: node,
          name: node.getChildAt(1).getChildAt(0).getText(source),
          parameter: node.getChildAt(1).getChildAt(2).getText(source),
        });
      }
    });

    return parameters;
  }

  // Name
  public static getName(node: ts.DeclarationStatement | ts.PropertyDeclaration, source: ts.SourceFile) {
    return node.name?.getText(source);
  }

  // Types
  public static getType(typeChecker: ts.TypeChecker, node: ts.Node) {
    return typeChecker.getTypeAtLocation(node);
  }

  public static getReturnType(typeChecker: ts.TypeChecker, node: ts.SignatureDeclaration) {
    const signature = typeChecker.getSignatureFromDeclaration(node)!;
    return typeChecker.getReturnTypeOfSignature(signature);
  }

  public static getTypeDeclaration(type: ts.Type) {
    if (type.aliasSymbol) {
      const decl = type.aliasSymbol.getDeclarations()![0];
      const src = decl.getSourceFile();

      return decl.getText(src);
    }
  }

  public static getTypeString(typeChecker: ts.TypeChecker, type: ts.Type) {
    return typeChecker.typeToString(type);
  }
}

export default TypeScriptUtil;
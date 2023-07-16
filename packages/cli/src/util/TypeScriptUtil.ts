import * as ts from "typescript";


type Project = ReturnType<typeof TypeScriptUtil.getProject>;


class TypeScriptUtil {

  // Project
  public static getProject(filename: string) {
    const program = ts.createProgram([filename], {});
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

  // NestJs
  // public static findClass(root: ts.Node) {
  //   const visit = (node: ts.Node) => {
  //     callback(node);
  //     ts.forEachChild(node, visit);
  //   }
  //
  //   ts.forEachChild(root, visit);
  //
  // }

  // Type Extraction



}

export default TypeScriptUtil;
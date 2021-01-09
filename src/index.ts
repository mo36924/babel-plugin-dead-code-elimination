import "./module";
import type { default as _babel, NodePath, PluginObj } from "@babel/core";
import babelPluginMinifyDeadCodeElimination from "babel-plugin-minify-dead-code-elimination";

export default (babel: typeof _babel, options: any): PluginObj => {
  const visitor = babelPluginMinifyDeadCodeElimination(babel, options).visitor;

  for (const visitNode of Object.values<any>(visitor)) {
    if (visitNode && !visitNode.enter && visitNode.exit) {
      visitNode.enter = visitNode.exit;
    }
  }

  visitor.Program.enter = (path: NodePath, state: any) => {
    path.traverse(
      {
        ...visitor,
        Program() {},
      },
      state,
    );

    visitor.Program.exit(path, state);
  };

  const _visitor = { ...visitor };

  for (const [key, value] of Object.entries(_visitor)) {
    if (value && typeof value === "object") {
      _visitor[key] = { ...value };
    }
  }

  return {
    name: "dead-code-elimination",
    visitor: _visitor,
  };
};

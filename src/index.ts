import "./module";
import type { default as _babel, PluginObj } from "@babel/core";
import babelPluginMinifyDeadCodeElimination from "babel-plugin-minify-dead-code-elimination";

export default (babel: typeof _babel, options: any): PluginObj => {
  const visitor = babelPluginMinifyDeadCodeElimination(babel, options).visitor;

  for (const visitNode of Object.values<any>(visitor)) {
    if (visitNode && !visitNode.enter && visitNode.exit) {
      visitNode.enter = visitNode.exit;
    }
  }

  return {
    name: "dead-code-elimination",
    visitor: visitor,
  };
};

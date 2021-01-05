import "./module";
import type { default as _babel, PluginObj } from "@babel/core";
import babelPluginMinifyDeadCodeElimination from "babel-plugin-minify-dead-code-elimination";
export default (babel: typeof _babel, options: any): PluginObj => {
  const { visitor } = babelPluginMinifyDeadCodeElimination(babel, options);

  return {
    name: "dead-code-elimination",
    visitor: {
      ...visitor,
      Program: {
        enter: typeof visitor.Program === "object" ? visitor.Program.exit : visitor.Program,
        ...visitor.Program,
      },
    },
  };
};

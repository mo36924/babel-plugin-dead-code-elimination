import typescript from "@rollup/plugin-typescript";
import { builtinModules } from "module";
import { dependencies, devDependencies, peerDependencies } from "./package.json";

const externalModules = [
  ...builtinModules,
  ...Object.keys({ ...dependencies, ...devDependencies, ...peerDependencies }),
];

/** @type import("rollup").RollupOptions */
const outputOptions = {
  sourcemap: true,
  sourcemapExcludeSources: true,
  preferConst: true,
  exports: "auto",
  interop: "auto",
};

/** @type import("rollup").RollupOptions */
const rollupOptions = {
  input: "src/index.ts",
  external: externalModules,
  output: [
    {
      file: "dist/index.mjs",
      format: "module",
      ...outputOptions,
    },
    {
      file: "dist/index.js",
      format: "commonjs",
      ...outputOptions,
    },
  ],
  plugins: [typescript()],
};

export default rollupOptions;

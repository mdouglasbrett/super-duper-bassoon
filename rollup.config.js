import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    external: ["fs", "path"],
    output: [{ file: pkg.main, format: "cjs" }, { file: pkg.module, format: "esm" }],
    plugins: [
      babel({
        exclude: "node_modules/**/*"
      }),
      resolve(),
      commonjs()
    ]
  }
];

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

export default [
  {
    input: 'src/main.ts',
    external: ['fs', 'path'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' }
    ],
    plugins: [
      babel({
        extensions,
        exclude: 'node_modules/**/*'
      }),
      resolve(),
      commonjs()
    ]
  }
];

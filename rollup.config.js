import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
    {
        input: 'src/main.js',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'esm' }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**/*'
            })
        ]
    }
];

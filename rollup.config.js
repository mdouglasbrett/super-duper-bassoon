import babel from 'rollup-plugin-babel';
import pkg from './package';

export default [
    {
        entry: 'src/main.js',
        external: [],
        targets: [
            { dest: pkg.main, format: 'cjs' },
            { dest: pkg.main, format: 'esm' }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**/*'
            })
        ]
    }
];

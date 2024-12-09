import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslint from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    eslint.configs.recommended,
    pluginJs.configs.recommended,
    prettierConfig,
    ...tseslint.configs.recommendedTypeChecked,
    {
        ignores: [
            'tailwind.config.js',
            'vite.config.ts',
            'postcss.config.js',
            'src-tauri',
            'eslint.config.js',
            'dist',
            'node_modules',
        ],
    },
    {
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.browser,
        },
    },
];

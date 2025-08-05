import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
// import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
    { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    {
        rules: {
            indent: [0, 4],
            'no-else-return': 1,
            'space-unary-ops': 'off',
            'no-unused-vars': 'warn',
            semi: [0, 'always'],
            'no-unreachable': 0,
        },
    },
    /* stylistic.configs.customize({
        // the following options are the default values
        indent: 4,
        quotes: 'single',
        semi: false,
        jsx: true,
        'array-element-newline': 1,
        // ...
    }), */
]);

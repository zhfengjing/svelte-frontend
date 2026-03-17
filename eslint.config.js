import js from '@eslint/js'
import globals from 'globals'
import sveltePlugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    rules: {
      // 代码质量
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',

      // Svelte 规范
      'svelte/no-unused-svelte-ignore': 'warn',
      'svelte/no-at-html-tags': 'error',
      'svelte/valid-compile': 'error'
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser
    }
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**']
  }
]

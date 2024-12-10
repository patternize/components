import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 7,
      sourceType: 'module',
      parser: tsParser
    },
    plugins: {
      react,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      import: importPlugin
    },
    rules: {
      'react/button-has-type': 0,
      'react/no-array-index-key': 0,
      'no-use-before-define': 0,
      'react/sort-comp': 0,
      'react/prefer-stateless-function': 0,
      'react/require-default-props': 0,
      'no-underscore-dangle': 0,
      'no-debugger': 0,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/no-named-as-default': 0,
      'import/prefer-default-export': 0,
      'object-shorthand': 0,
      'react/forbid-prop-types': 0,
      'class-methods-use-this': 0,
      'no-param-reassign': [
        2,
        {
          props: false
        }
      ],
      'react/jsx-filename-extension': 0,
      'react/jsx-props-no-spreading': 0,
      'react/prop-types': 0,
      'import/no-extraneous-dependencies': 0,
      'import/extensions': [
        'error',
        'always',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'no-unused-vars': 1,
      '@typescript-eslint/no-unused-vars': 1,
      'import/no-named-as-default-member': 0,
      'import/no-named-default': 0,
      'no-self-compare': 0,
      'no-new': 0,
      'no-shadow': 0,
      'no-case-declarations': 0,
      camelcase: 0
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['./src']
        }
      }
    }
  },
  {
    files: ['*.test.ts'],
    rules: {
      'no-unused-expressions': 'off'
    }
  }
];

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'coverage/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_|next$' }],
      'no-undef': 'error',
    },
  },
];

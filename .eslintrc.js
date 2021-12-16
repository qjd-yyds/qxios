module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['prettier'],
  // exclude: ['dist'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-unused-vars': 'off'
  }
};

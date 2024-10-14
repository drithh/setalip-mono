/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  extends: ['@repo/eslint-config/next.js', 'next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
};

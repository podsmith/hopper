// @ts-check
/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  bracketSpacing: true,
  plugins: [
    'prettier-plugin-toml',
    '@prettier/plugin-oxc',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '@/.*',
    '~/.*',
    '^[.]',
    '',
  ],
};

export default config;

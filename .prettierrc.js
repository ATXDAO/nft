module.exports = {
  tabWidth: 2,
  singleQuote: true,
  plugins: [require('prettier-plugin-solidity')],
  overrides: [
    {
      files: '*.sol',
      options: {
        tabWidth: 4,
        singleQuote: false,
      },
    },
    {
      files: '*.ts',
      options: {
        bracketSpacing: true,
        trailingComma: 'es5',
      },
    },
  ],
};

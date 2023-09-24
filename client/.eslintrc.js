module.exports = {
  root: true,
  extends: ['@react-native','plugin:@tanstack/eslint-plugin-query/recommended'],
  rules: {
    'prettier/prettier': ['off', {singleQuote: true}],
  },
};

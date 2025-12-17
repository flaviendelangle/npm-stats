export default {
 plugins: ["@trivago/prettier-plugin-sort-imports"],
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ["react", "^([a-z])", "^@mui", "^@/", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};
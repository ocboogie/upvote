// To let eslint-import-resolver-webpack know that client is the base path
process.chdir("./client");

module.exports = {
  extends: ["plugin:vue/recommended", "prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "vue/max-attributes": "off",
    "vue/html-indent": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off",
    "vue/html-closing-bracket-spacing": "off"
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: require.resolve("@vue/cli-service/webpack.config.js")
      }
    }
  }
};

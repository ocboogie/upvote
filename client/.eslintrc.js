// To let eslint-import-resolver-webpack know that client is the base path
process.chdir("./client")

module.exports = {
  extends: ["plugin:vue/recommended", "prettier/vue"],
  parserOptions: {
    parser: "babel-eslint"
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: require.resolve("@vue/cli-service/webpack.config.js")
      }
    }
  }
}

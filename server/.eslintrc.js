module.exports = {
  // typescript-eslint-parser has typescript as a peer-dependency. We're putting
  // typescript-eslint-parser in the server package so we don't have to have two
  // typescrpit dependencies, one in the root package for linting, and one in the
  // server package for compiling. eslint finds the parser in the cwd, so we
  // have to explicitly say where it is
  parser: require.resolve("typescript-eslint-parser"),
  env: {
    node: true
  },
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-restricted-syntax": "off"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"]
      }
    }
  }
}

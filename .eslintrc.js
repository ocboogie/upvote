module.exports = {
  extends: ["airbnb-base", "prettier"],
  parser: "babel-eslint",
  env: {
    node: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-param-reassign": "off",
    "consistent-return": "off"
  },
  plugins: ["prettier"],
  root: true
}

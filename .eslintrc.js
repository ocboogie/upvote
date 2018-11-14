module.exports = {
  extends: ["airbnb-base", "prettier"],
  parser: "babel-eslint",
  env: {
    node: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-param-reassign": "off"
  },
  plugins: ["prettier"],
  root: true
}

module.exports = {
  extends: ["airbnb-base", "prettier"],
  parser: "babel-eslint",
  env: {
    node: true
  },
  rules: {
    "prettier/prettier": "error"
  },
  plugins: ["prettier"],
  root: true
};

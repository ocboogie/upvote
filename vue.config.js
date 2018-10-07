const path = require("path");

module.exports = {
  outputDir: "dist/client",
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "/src/client")
      }
    },
    entry: {
      app: "./src/client/main.js"
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/variables.scss";'
      }
    }
  }
};

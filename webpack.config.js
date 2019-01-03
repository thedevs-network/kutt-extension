const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
      options: "./src/scripts/options.js",
      popup: "./src/scripts/popup.js",
      background: "./src/scripts/background.js"
    },
    output: {
      path: path.resolve(__dirname, "extension"),
      filename: "scripts/[name].js",
      publicPath: ""
    },
    node: {
        fs: 'empty'
    },
    plugins: [
      new CopyWebpackPlugin([ { from: 'src/images', to: 'assets' } ])
    ],
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader"
          },  
          {
            test: /\.(html)$/,
            use: {
              loader: "html-loader",
              options: {
                attrs: [':data-src']
              }
            }
          }  
        ]
    },
    devServer: {
        port: 3000,
        contentBase: "./extension"
    }
};
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
      options: ["./src/scripts/options.js", './src/styles/options.scss'],
      popup: ["./src/scripts/popup.js", './src/styles/popup.scss'],
      background: "./src/scripts/background.js"
    },
    output: {
      path: path.resolve(__dirname, "extension"),
      filename: "js/[name].js",
      publicPath: ""
    },
    node: {
        fs: 'empty'
    },
    plugins: [
      new CleanWebpackPlugin(["extension"]),
      new CopyWebpackPlugin([ 
          { 
            from: 'src/images', 
            to: 'assets' 
          },
          {
            from: 'src/manifest.json',
            to: ''
          } 
        ]),
      new HtmlWebpackPlugin({
        template: 'src/options.html',
        inject: false,
        filename: 'options.html'
      }),
      new HtmlWebpackPlugin({
        template: 'src/popup.html',
        inject: false,
        filename: 'popup.html'
      })
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
          },
          {
            test: /\.scss$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].css',
                        context: './src/styles/',
                        outputPath: 'css/',
                        publicPath: '../'
                    }
                },
                {
                    loader: 'extract-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                      plugins: function () {
                        return [
                          require('precss'),
                          require('autoprefixer')
                        ];
                      }
                    }
                },
                {
                    loader: 'sass-loader',
                }
              ]
            }  
        ]
    },
    devServer: {
        port: 3000,
        contentBase: "./extensions"
    }
};
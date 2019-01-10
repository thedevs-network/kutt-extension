const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => ({
    entry: {
      options: ["./src/scripts/options.js", './src/styles/options.scss'],
      popup: ["./src/scripts/popup.js", './src/styles/popup.scss'],
      background: ["babel-polyfill", "./src/scripts/background.js"]
    },
    output: {
      path: path.resolve(__dirname, "extension"),
      filename: "js/[name].js",
      publicPath: ""
    },
    node: {
        fs: 'empty'
    },
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
            test: /\.svg$/,
            loader: 'url-loader'
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
    plugins: [
      new CleanWebpackPlugin(["extension"]),
      new CopyWebpackPlugin([ 
          { 
            from: 'src/assets', 
            to: 'assets' 
          },
          {
            from: 'src/manifest.json',
            to: ''
          }, 
          {
            from: 'src/scripts/vendor/browser-polyfill.js',
            to: 'js/browser-polyfill.js', 
            flatten: true,
          },
      ]),
      new HtmlWebpackPlugin({
        template: 'src/options.html',
        inject: false,
        minify: options.mode === "production" ? true : false,
        filename: 'options.html'
      }),
      new HtmlWebpackPlugin({
        template: 'src/popup.html',
        inject: false,
        minify: options.mode === "production" ? true : false,
        filename: 'popup.html'
      })
    ],
    optimization: {
      minimizer: [
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorOptions: { 
            map: false
          },
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        }),
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          extractComments: false
        }),
      ]
    },
    devServer: {
        port: 3000,
        contentBase: "./extensions"
    }
});
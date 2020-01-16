const path = require('path');
const webpack = require('webpack');
const wextManifest = require('wext-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const WriteWebpackPlugin = require('write-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const manifestInput = require('./src/manifest');
const targetBrowser = process.env.TARGET_BROWSER;
const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const manifest = wextManifest[targetBrowser](manifestInput);

const getExtensionFileType = () => {
  if (targetBrowser === 'opera') {
      return 'crx';
  }
  if (targetBrowser === 'firefox') {
      return 'xpi';
  }
  return 'zip';
};

module.exports = {
  mode: 'development',
  entry: {
    background: path.join(sourcePath, 'Background', 'index.ts'),
    options: path.join(sourcePath, 'Options', 'index.tsx'),
    popup: path.join(sourcePath, 'Popup', 'index.tsx')
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: path.join(destPath, targetBrowser)
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
          path.join(process.cwd(), `extension/${targetBrowser}`),
          path.join(process.cwd(), `extension/${targetBrowser}.${getExtensionFileType()}`),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'html', 'popup.html'),
      inject: 'body',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'html', 'options.html'),
      inject: 'body',
      filename: 'options.html',
      chunks: ['options']
    }),
    new CopyWebpackPlugin([{ from: path.join(sourcePath, 'assets'), to: 'assets' }]),
    new WriteWebpackPlugin([{ name: manifest.name, data: Buffer.from(manifest.content) }]),
  ]
}
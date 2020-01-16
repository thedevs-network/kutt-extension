const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  watch: nodeEnv === 'watch',
  entry: {
    background: path.join(sourcePath, 'background', 'index.ts');
    options: path.join(sourcePath, 'options', 'index.ts');
    popup: path.join(sourcePath, 'popup', 'index.ts');
  },
  output: {
    path: destPath;
    filename: '[name].bundle.js';
  },
  module: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CheckerPlugin();
  ]
}
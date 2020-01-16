const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  watch: nodeEnv === 'watch',
  entry: {
    background: path.join(sourcePath, 'Background', 'index.ts'),
    options: path.join(sourcePath, 'Options', 'index.tsx'),
    popup: path.join(sourcePath, 'Popup', 'index.tsx')
  },
  output: {
    path: destPath,
    filename: '[name].bundle.js',
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
    new CheckerPlugin()
  ]
}
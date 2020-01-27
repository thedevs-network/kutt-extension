const path = require('path');
const webpack = require('webpack');
const wextManifest = require('wext-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebpackPlugin = require('write-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtensionReloader = require('webpack-extension-reloader');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const manifestInput = require('./src/manifest');

const targetBrowser = process.env.TARGET_BROWSER;
const sourcePath = path.join(__dirname, 'src');
const viewsPath = path.join(__dirname, 'views');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const manifest = wextManifest[targetBrowser](manifestInput);

const extensionReloader =
    nodeEnv === 'development'
        ? new ExtensionReloader({
              port: 9128,
              reloadPage: true,
              entries: {
                  // TODO: reload manifest on update
                  background: 'background',
                  extensionPage: ['popup', 'options'],
              },
          })
        : () => {
              this.apply = () => {};
          };

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
    mode: nodeEnv,

    entry: {
        background: path.join(sourcePath, 'Background', 'index.ts'),
        options: path.join(sourcePath, 'Options', 'index.tsx'),
        popup: path.join(sourcePath, 'Popup', 'index.tsx'),
        styles: [path.join(sourcePath, 'Popup', 'popup.scss'), path.join(sourcePath, 'Options', 'options.scss')],
    },

    output: {
        filename: 'js/[name].bundle.js',
        path: path.join(destPath, targetBrowser),
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            'webextension-polyfill-ts': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill-ts')),
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
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
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            // eslint-disable-next-line global-require
                            plugins: [require('autoprefixer')()],
                        },
                    },
                    'resolve-url-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    plugins: [
        // for awesome-typescript-loader
        new CheckerPlugin(),
        // https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/518
        new FixStyleOnlyEntriesPlugin({ silent: true }),
        new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
        // delete previous build files
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.join(process.cwd(), `extension/${targetBrowser}`),
                path.join(process.cwd(), `extension/${targetBrowser}.${getExtensionFileType()}`),
            ],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(viewsPath, 'popup.html'),
            inject: 'body',
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(viewsPath, 'options.html'),
            inject: 'body',
            filename: 'options.html',
            chunks: ['options'],
        }),
        // copy assets
        new CopyWebpackPlugin([{ from: path.join(sourcePath, 'assets'), to: 'assets' }]),
        // write manifest.json
        new WriteWebpackPlugin([{ name: manifest.name, data: Buffer.from(manifest.content) }]),
        // plugin to enable browser reloading in development mode
        extensionReloader,
    ],
};

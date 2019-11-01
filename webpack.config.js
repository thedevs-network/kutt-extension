/* eslint-disable global-require, import/no-extraneous-dependencies */
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WriteWebpackPlugin = require('write-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const wextManifest = require('wext-manifest');
const path = require('path');

const manifestInput = require('./src/manifest');

const targetBrowser = process.env.TARGET_BROWSER;
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

module.exports = () => {
    return {
        entry: {
            options: ['./src/scripts/options.js'],
            popup: ['./src/scripts/popup.js'],
            history: ['./src/scripts/history.js'],
            background: ['./src/scripts/background.js'],
            styles: ['./src/styles/popup.scss', './src/styles/history.scss', './src/styles/options.scss'],
        },
        output: {
            path: path.resolve(__dirname, 'extension', targetBrowser),
            filename: 'js/[name].js',
            publicPath: '',
        },
        node: {
            fs: 'empty',
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attrs: [':data-src'],
                        },
                    },
                },
                {
                    test: /\.svg$/,
                    loader: 'url-loader',
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
                        {
                            loader: 'extract-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [require('precss'), require('autoprefixer')];
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
            ],
        },
        plugins: [
            new FixStyleOnlyEntriesPlugin({ silent: true }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    path.join(process.cwd(), `extension/${targetBrowser}`),
                    path.join(process.cwd(), `extension/${targetBrowser}.${getExtensionFileType()}`),
                ],
                cleanStaleWebpackAssets: false,
                verbose: true,
            }),
            new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
            new HtmlWebpackPlugin({
                template: 'src/options.html',
                inject: false,
                filename: 'options.html',
            }),
            new HtmlWebpackPlugin({
                template: 'src/popup.html',
                inject: false,
                filename: 'popup.html',
            }),
            new HtmlWebpackPlugin({
                template: 'src/history.html',
                inject: false,
                filename: 'history.html',
            }),
            new WriteWebpackPlugin([{ name: manifest.name, data: Buffer.from(manifest.content) }]),
        ],
        optimization: {
            minimizer: [
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {
                        map: false,
                    },
                    cssProcessorPluginOptions: {
                        preset: ['default', { discardComments: { removeAll: true } }],
                    },
                    canPrint: true,
                }),
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
                new ZipPlugin({
                    path: path.resolve(__dirname, 'extension'),
                    extension: `${getExtensionFileType()}`,
                    filename: `${targetBrowser}`,
                }),
            ],
        },
        devServer: {
            port: 3000,
            contentBase: './extension',
        },
    };
};

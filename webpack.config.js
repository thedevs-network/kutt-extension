/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const path = require('path');

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
            path: path.resolve(__dirname, 'extension', process.env.TARGET),
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
            new CleanWebpackPlugin([`extension/${process.env.TARGET}`, `extension/${process.env.TARGET}.zip`]),
            new CopyWebpackPlugin([
                {
                    from: 'src/assets',
                    to: 'assets',
                },
                {
                    from: `src/manifest.${process.env.TARGET}.json`,
                    to: 'manifest.json',
                },
            ]),
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
                    filename: `${process.env.TARGET}.zip`,
                }),
            ],
        },
        devServer: {
            port: 3000,
            contentBase: './extension',
        },
    };
};

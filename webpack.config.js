const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
        auth: './src/js/auth.js',
        game: './src/js/game.js',
        ranking: './src/js/ranking.js',
        buttons: './src/js/buttons.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, 
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'img',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css'
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/templates/index.html',
            inject: true,
            chunks: ['main', 'buttons']
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/templates/login.html',
            inject: true,
            chunks: ['main', 'auth']
        }),
        new HtmlWebpackPlugin({
            filename: 'register.html',
            template: './src/templates/register.html',
            inject: true,
            chunks: ['main', 'auth']
        }),
        new HtmlWebpackPlugin({
            filename: 'game.html',
            template: './src/templates/game.html',
            inject: true,
            chunks: ['main', 'game']
        }),
        new HtmlWebpackPlugin({
            filename: 'ranking.html',
            template: './src/templates/ranking.html',
            inject: true,
            chunks: ['main', 'ranking']
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: './src/templates/404.html'
        })
    ],
    output: {
        filename: '[name].bundle.[contentHash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
}
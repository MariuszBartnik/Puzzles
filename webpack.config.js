const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    entry: {
        main: './src/js/main.js',
        auth: './src/js/auth.js',
        game: './src/js/game.js',
        ranking: './src/js/ranking.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 
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
                    'sass-loader' ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'img'
                }
            },
            {
                test: /\.html$/i,
                use: 'html-loader',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/templates/index.html',
            inject: true,
            chunks: ['main']
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
        })
    ],
    output: {
        filename: '[name].bundle.[contentHash].js',
        path: path.resolve(__dirname, 'dist')
    }
}
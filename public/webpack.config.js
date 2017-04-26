'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'login': './containers/login.jsx',
        'channel': './containers/channel.jsx',
        'master': './containers/master.jsx',
        'vendor': ['react', 'react-dom','antd']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js[x]?$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'common.js'
        }),
        new UglifyJSPlugin()

    ],
    devtool: 'source-map'
};
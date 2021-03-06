var path = require('path');
const Dotenv = require('dotenv-webpack');
const DotenvPlugin = require('webpack-dotenv-plugin');


module.exports = {
    context: __dirname + "/app",
    entry: "./main.js",

    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }],
        loaders: [
            {
	            test: /\.js$/,
	            exclude: /node_modules/,
	            loader: 'babel-loader',
              query: {
	                presets: ['es2015', 'react']
	            }
            },
            {
	            test: /\.jsx$/,
	            exclude: /node_modules/,
	            loader: 'babel-loader',
              query: {
	                presets: ['es2015', 'react']
	            }
            }
        ],
    },
    externals: {
        fs: '{}',
        tls: '{}',
        net: '{}',
        console: '{}'
    },
    resolve: {
        extensions: ['.js', '.scss']
    }
};

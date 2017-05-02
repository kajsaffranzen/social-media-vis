var path = require('path');

module.exports = {
    context: __dirname + "/app",
    entry: "./main.js",

    output: {
        //path: __dirname + "/dist",
        path: path.join(__dirname, '/dist'),
        //publicPath: '/',
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
	            test: /\.js$/,
	            exclude: /node_modules/,
	            loader: 'babel-loader',
              query: {
	                presets: ['es2015']
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
        rules: [{
           test: /\.scss$/,
           use: [{
               loader: "style-loader" // creates style nodes from JS strings
           }, {
               loader: "css-loader" // translates CSS into CommonJS
           }, {
               loader: "sass-loader" // compiles Sass to CSS
           }]
       }]
    },
    externals: {
        fs: '{}',
        tls: '{}',
        net: '{}',
        console: '{}'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};

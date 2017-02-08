var path = require('path');

module.exports = {
    context: __dirname + "/app",
    entry: "./main.js",

    output: {
        //filename: "bundle.js",
        //path: __dirname + "/dist",
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
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
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
//module.exports = config;

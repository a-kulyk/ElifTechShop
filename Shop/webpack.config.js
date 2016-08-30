var path = require('path');

module.exports = {
    context: path.join(__dirname, "client"),
    entry: "./core.js",
    output: {
        path: path.join(__dirname, "client"),
        filename: "build.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },{
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style!css'
            },{
                test: /\.(jpg|png|gif)$/,
                include: /img/,
                loader: 'url'
            },{
                test: /\.svg/, loader: 'svg-url-loader'
            }
        ]
    }
};
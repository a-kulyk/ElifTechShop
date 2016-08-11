var webpack = require("webpack");
module.exports = {
    entry: "./app",
    output: {
        publicPath: 'assets/',
        path: 'assets',
        filename: "app.build.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" }
        ]
    },
    resolve: {
        modulesDirectories: ["node_modules"]
    },
    watch: true
};
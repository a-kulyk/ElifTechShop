'use strict';

module.exports = {
    context: __dirname + "/frontend",
    entry: "./app.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel'},
            { test: /\.html$/, loader: 'raw'}
        ]
    }
};
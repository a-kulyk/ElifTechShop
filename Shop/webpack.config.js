'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    //watch: NODE_ENV == 'development',
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
    },
    externals: {
        "./bower_components/angular/angular": "angular",
        "../bower_components/angular/angular": "angular"
        //"angular-route": "ngRoute"
    },
    devtool: NODE_ENV == 'development' ? 'source-map' : null
};
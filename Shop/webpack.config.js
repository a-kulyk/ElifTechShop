'use strict';

module.exports = {
    context: __dirname + "/frontend",
    entry: "./app.js",
    output: {
        path: __dirname + "/public",
        filename: "app.js"
    }
};
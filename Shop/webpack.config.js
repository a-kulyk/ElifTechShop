module.exports = {
    context: __dirname + "/client",
    entry: "./core.js",
    output: {
        path: __dirname + "/client",
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
            }
        ]
    }


};/**
 * Created by devilmini on 03.08.16.
 */

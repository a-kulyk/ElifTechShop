/**
 * Created by dmytro on 04.08.16.
 */
module.exports = {
    context: __dirname + '/frontend/js',
    entry: './app.js',
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js'
    },
    devtool: 'source-map'
}
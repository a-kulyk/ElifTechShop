/**
 * Created by dmytro on 04.08.16.
 */
module.exports = {
    context: __dirname + '/frontend/js',
    entry: {
        app: './app.js',
        libs: './libs/libs.js'
    },
    output: {
        path: __dirname + '/public/js',
        publicPath: '/js/',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'file?name=[path][name].[ext]'
            }
        ]
    }
}
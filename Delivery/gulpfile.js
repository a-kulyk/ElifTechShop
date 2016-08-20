"use strict";
let gulp = require('gulp');
let webpackStream = require('webpack-stream');
let webpack = webpackStream.webpack;
let plumber = require('gulp-plumber');
let notify = require('gulp-notify');
let named = require('vinyl-named');
let del = require('del');
let nodemon = require('gulp-nodemon');

const NODE_ENV = process.env.NODE_ENV || 'development'

gulp.task('clean', function () {
    return del('public')
})
gulp.task('assets', function () {
    return gulp.src('frontend/assets/**', gulp.lastRun('assets'))
        .pipe(gulp.dest('public'));
});
gulp.task('webpack', function () {
    let options = {
        watch: NODE_ENV == 'development',
        devtool: NODE_ENV == 'development' ? 'eval' : null,
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.png$/,
                    loader: "url-loader?limit=100000"
                },
                {
                    test: /\.jpg$/,
                    loader: "file-loader"
                },
                {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/octet-stream'
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file'
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=image/svg+xml'
                }
            ]
        },
        plugins: [
            new webpack.NoErrorsPlugin()
        ]
    }
    return gulp.src('frontend/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Webpack',
                message: err.message
            }))
        }))
        .pipe(named())
        .pipe(webpackStream(options))
        .pipe(gulp.dest('public'))
})

gulp.task('build', gulp.series('clean', 'assets', 'webpack'));

gulp.task('watch', function () {
    gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
})

gulp.task('dev', gulp.series('clean', gulp.parallel(gulp.series('assets', 'watch'), 'webpack')));
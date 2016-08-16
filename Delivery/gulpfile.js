"use strict";
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const named = require('vinyl-named');
const del = require('del');
const nodemon = require('gulp-nodemon');

gulp.task('clean', function () {
    return del('public')
})
gulp.task('assets', function () {
    return gulp.src('frontend/assets/**', gulp.lastRun('assets'))
        .pipe(gulp.dest('public'));
});
gulp.task('webpack', function () {
    let options = {
        watch: true,
        devtool: 'eval',
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
                
                /*                {
                 test: /\.js$/,
                 exclude: /(node_modules|bower_components)/,
                 loader: 'babel',
                 query: {
                 presets: ['es2015']
                 }
                 }*/
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

gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
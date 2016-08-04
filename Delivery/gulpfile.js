/**
 * Created by dmytro on 04.08.16.
 */
"use strict";
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const named = require('vinyl-named');

gulp.task('webpack', function () {
    let options = {
        watch: true,
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
        },
        plugins:[
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
        .pipe(gulp.dest('public/js'))
})


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
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    }
                },
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
        .pipe(gulp.dest('public/js'))
})

gulp.task('build', gulp.series('clean', 'assets', 'webpack'));

gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
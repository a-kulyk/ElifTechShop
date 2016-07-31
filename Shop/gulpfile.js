'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');//ToDo: for dev
const del = require('del');
const jade = require('gulp-jade');
const webpack = require('webpack-stream');
const newer = require('gulp-newer');
const eslint = require('gulp-eslint');

const NODE_ENV = process.env.NODE_ENV || 'development';




gulp.task('clean', function() {
    return del('public');
});

gulp.task('html', function () {
    return gulp.src('frontend/**/*.html')
        .pipe(newer('public'))
        //.pipe(jade({locals: {} }))
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    return gulp.src('frontend/bower_components/**/*.js')
        .pipe(newer('public/bower_components'))
        .pipe(gulp.dest('public/bower_components'));
});

gulp.task('webpack', function () {
    return gulp.src('frontend/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('public'));
});

gulp.task('font', function () {
    return gulp.src('frontend/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(newer('public'))
        .pipe(gulp.dest('public'));
});

gulp.task('css', function () {
    return gulp.src('frontend/**/*.css')
        .pipe(newer('public'))
        .pipe(gulp.dest('public'));
});

gulp.task('check_frontend', function () {
    return gulp.src(['frontend/**/*.js', '!frontend/bower_components/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('check_backend', function () {
    return gulp.src([
        'server.js',
        'db/**/*.js',
        'models/**/*.js',
        'routes/**/*.js'
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('check', gulp.series('check_frontend', 'check_backend'));



gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel('html', 'js', 'css', 'font', 'webpack')));

gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
    gulp.watch('frontend', gulp.series('build'));
});




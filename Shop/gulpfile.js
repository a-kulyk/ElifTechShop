'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');//ToDo: for dev
const del = require('del');
const jade = require('gulp-jade');

var env = process.env.NODE_ENV || 'development';




gulp.task('clean', function() {
    return del('public');
});

gulp.task('html', function () {
    return gulp.src('frontend/**/*.jade'/*, {since: gulp.lastRun('html')}*/)
        .pipe(jade({locals: {} }))
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    return gulp.src('frontend/**/*.js'/*, {since: gulp.lastRun('js')}*/)
        .pipe(gulp.dest('public'));
});

gulp.task('css', function () {
    return gulp.src('frontend/**/*.css'/*, {since: gulp.lastRun('css')}*/)
        .pipe(gulp.dest('public'));
});


gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel('html', 'js', 'css')));

gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
    gulp.watch('frontend', gulp.series('build'));
});


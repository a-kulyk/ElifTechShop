// Karma configuration
// Generated on Sat Aug 13 2016 17:41:53 GMT+0300 (EEST)
var path = require('path');
var webpackConfig = require('./public/webpack.config');
var entry = path.resolve(webpackConfig.context, webpackConfig.entry);
var preprocessors = {};
preprocessors[entry] = ['webpack'];
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        //files: [
        //  'public/assets/app.build.js',
        //  'public/*.test.js',
        //  'public/**/*.test.js'
        //],
        files: [
            entry,
            'public/*.test.js',
            'public/**/*.test.js',
            'node_modules/angular/angular.js',
            {pattern: 'node_modules/angular-mocks/angular-mocks.js', read: false}
        ],
        webpack: webpackConfig,

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: preprocessors,


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        plugins: [
            require('karma-mocha'),
            require('karma-phantomjs-launcher'),
            require('karma-jasmine'),
            require('karma-chai'),
            require('karma-webpack'),
            require('karma-angular'),
            require('angular-mocks')
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}

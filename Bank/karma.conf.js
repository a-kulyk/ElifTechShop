var webpackConfig = require('./public/webpack.config');
var preprocessors = {};
preprocessors['entry'] = ['webpack'];

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
            './public/build.js'
        ],
        webpack: webpackConfig,
        preprocessors: preprocessors,
        port: 9876,
        colors: true,
        reporters: ['mocha'],
        browsers: ['Chrome'],
        plugins: [
            require('karma-webpack'),
            'karma-chai',
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-ng-html2js-preprocessor',
            'karma-mocha-reporter'
        ]
    });
};
'use strict';
module.exports = function(karma) {
    karma.set({

        frameworks: [ 'jasmine', 'browserify' ],

        files: [
            'public/main.js',
            'spec/**/*Spec.js'
        ],

        reporters: [ 'dots' ],

        preprocessors: {
            'spec/**/*Spec.js': [ 'browserify' ]
        },

        browsers: [ 'PhantomJS' ],

        logLevel: 'LOG_DEBUG',

        singleRun: true,
        autoWatch: false,

        // browserify configuration
        browserify: {
            debug: true
        }
    });
};
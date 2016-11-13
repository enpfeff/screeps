/**
 * @module screeps
 * @since 11/13/16
 * @author Ian Pfeffer
 */
"use strict";

const webpack = require('webpack');

function webpackConfig(watch = false) {
    let config = {

        // build output
        stats: {
            colors: true,
        },
        output: {
            filename: 'main.js',
            libraryTarget: 'umd'
        },
        watch: watch,
        loaders: [],
        plugins: []
    };


    return config;
}

module.exports = webpackConfig();
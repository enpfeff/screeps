/**
 * Created by enpfeff on 11/10/16.
 */
const screeps = require('gulp-screeps');
const runSequence = require('gulp-run-sequence');
const webpack = require('gulp-webpack');
const cleaner = require('gulp-clean');
const gulp = require('gulp');
const credentials = require('./credential.json');

const config = {
    src: ['./dist/*.js']
};

function build() {
    return gulp.src(['./main.js'])
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist/'));
}

function clean() {
    return gulp.src(['./dist'])
        .pipe(cleaner({force: true}))
}

function deploy() {
    return gulp.src(config.src).pipe(screeps(credentials));
}

function gulpDefault(cb) {
    return runSequence('clean', 'build', 'deploy', cb);
}

gulp.task('deploy', deploy);
gulp.task('build', build);
gulp.task('clean', clean);
gulp.task('default', gulpDefault);

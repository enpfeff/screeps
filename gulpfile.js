/**
 * Created by enpfeff on 11/10/16.
 */
const screeps = require('gulp-screeps');
const runSequence = require('gulp-run-sequence');
const webpack = require('gulp-webpack');
const cleaner = require('gulp-clean');
const gulp = require('gulp');
const gutil = require('gulp-util');
const credentials = require('./credential.json');
const pkg = require('./package.json');
const fs = require('fs');
const path = require('path');

const VERSION_FILE = 'version.json';
const VERSION_PATH = './dist/';

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

gulp.task('version', ['clean'], version);
gulp.task('deploy', ['build'], deploy);
gulp.task('build', ['clean', 'version'], build);
gulp.task('clean', clean);
gulp.task('default', ['clean', 'version', 'build'], deploy);


//
//  NON first class citizens
//

/**
 * bump patch version number by one and then write out version.json
 * webpack will then resolve the version.json file during build
 */
function version(cb) {
    // bump the version
    let versions = pkg.version.split('.');
    versions[versions.length - 1]++;
    pkg.version = versions.join('.');

    // get the json prepped
    const versionJson = { version: pkg.version };

    try {
        gutil.log(`bumped version to ${pkg.version} now writing package.json`);
        fs.writeFileSync(path.normalize(path.join(__dirname, 'package.json')), JSON.stringify(pkg, null, 2));

        gutil.log(`writing new version.json file`);

        const dir = path.normalize(path.join(__dirname, VERSION_PATH));
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);

        fs.writeFileSync(path.normalize(path.join(dir, VERSION_FILE)), JSON.stringify(versionJson, null, 4));
    } catch(e) {
        gutil.log(`We messed up ${e.message}`);
    } finally {
        cb();
    }
}

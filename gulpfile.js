/**
 * Created by enpfeff on 11/10/16.
 */
const screeps = require('gulp-screeps');
const gulp = require('gulp');
const credentials = require('./credential.json');

const config = {
    src: ['main.js']
};

function deploy() {
    return gulp.src(config.src).pipe(screeps(credentials));
}

gulp.task('deploy', deploy);

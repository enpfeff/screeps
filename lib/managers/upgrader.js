/**
 * @module screeps
 * @since 11/13/16
 * @author Ian Pfeffer
 */
"use strict";

function create(sourcesById) {

}

function run() {

}

function init(sources, targets) {
    const sourcesById = _.groupBy(sources, 'id');
    return {
        create: _.partial(create, sourcesById),
        run
    }
}

module.exports = init;
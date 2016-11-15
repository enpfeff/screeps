/**
 * Created by enpfeff on 11/10/16.
 */
const CONSTANTS = require('./constants');

function getHarvesterSources(room) {
    return room.find(FIND_SOURCES_ACTIVE);
}

module.exports = {
    [CONSTANTS.TYPE.HARVESTER]: getHarvesterSources
};
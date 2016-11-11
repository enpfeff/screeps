/**
 * Created by enpfeff on 11/10/16.
 */

function getHarvesterSources(room) {
    return room.find(FIND_SOURCES_ACTIVE);
}

module.exports = {
    getHarvesterSources
};
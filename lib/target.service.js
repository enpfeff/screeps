/**
 * Created by enpfeff on 11/10/16.
 */

function getHarvesterTargets(room) {
    _.filter(room.find(FIND_STRUCTURES), filterTargetForHarvester)
}

function filterTargetForHarvester(structure) {
    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        (structure.energy < structure.energyCapacity);
}

module.exports = {
    getHarvesterTargets
};
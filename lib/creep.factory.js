/**
 * Created by enpfeff on 11/10/16.
 */

const CONSTANTS = require('constants');
const manageHarvesters = _.partial(manageType, CONSTANTS.HARVESTER);

function factory(room) {
    let creeps = room.find(FIND_CREEPS);
    manageHarvesters(creeps, room.find(FIND_SOURCES), getHarvesterTargets(room));

    return {id: room.id, room};
}

function getHarvesterTargets(room) {
    return _.filter(room.find(FIND_STRUCTURES), (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity;
    });
}


/**
 *
 * @param TYPE
 * @param creeps
 * @param [sources]
 * @param [targets]
 */
function manageType(TYPE, creeps, sources, targets) {
    let minions = _.filter(creeps, (minion) => minion.memory.role === TYPE);
    console.log(`${TYPE}Manager: found ${minions.length} minion(s)`);

    const controller = require(TYPE)(minions, sources, targets);

    // make sure we have all the types we need
    controller.create();

    // make sure they take there action this tick
    _.each(minions, controller.run);
}


module.exports = factory;
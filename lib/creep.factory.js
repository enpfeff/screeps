/**
 * Created by enpfeff on 11/10/16.
 */

const CONSTANTS = require('constants');
const manageHarvesters = _.partial(manageType, CONSTANTS.HARVESTER);
const targetService = require('target.service');
const sourceService = require('source.service');

function factory(room) {
    let creeps = room.find(FIND_MY_CREEPS);
    manageHarvesters(creeps, sourceService.getHarvesterSources(room), targetService.getHarvesterTargets(room));

    return {id: room.id, room};
}

/**
 *
 * @param TYPE
 * @param creeps
 * @param [sources]
 * @param [targets]
 */
function manageType(TYPE, creeps, sources, targets) {
    let minions = _.filter(creeps, (minion) => !_.isUndefined(minion) ? minion.memory.role === TYPE : false);
    console.log(`${TYPE}Manager: found ${minions.length} minion(s)`);

    const controller = require(TYPE)(minions, sources, targets);

    // make sure our meta data is correct in memory
    refreshMemory(TYPE, minions);

    // make sure we have all the types we need
    controller.create();

    // make sure they take there action this tick
    _.each(minions, controller.run);
}

function refreshMemory(TYPE, minons) {
    const typedMinions = _.filter(Memory.creeps, _.startsWith(TYPE));
    _.each(typedMinions, (typedMinion) => {
        console.log(JSON.stringify(typedMinion));
    });

}

module.exports = factory;
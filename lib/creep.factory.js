/**
 * Created by enpfeff on 11/10/16.
 */

const CONSTANTS = require('./constants');
const harvestManager = _.partial(manageType, CONSTANTS.HARVESTER);
const upgradeManager = _.partial(manageType, CONSTANTS.UPGRADER);
const targetService = require('./target.service');
const sourceService = require('./source.service');

function factory(room) {
    console.log("========= Start of Loop ==========");
    let creeps = room.find(FIND_MY_CREEPS);
    harvestManager(creeps, sourceService.getHarvesterSources(room), targetService.getHarvesterTargets(room));
    upgradeManager();

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

    const controller = require(`./managers/${TYPE}`)(minions, sources, targets);

    // make sure our meta data is correct in memory
    refreshMemory(TYPE, minions);

    // make sure we have all the types we need
    controller.create();

    // make sure they take there action this tick
    _.each(minions, controller.run);
}

function refreshMemory(TYPE, minions) {
    // put all the minions known in a hash
    let minionsHash = {};
    _.each(minions, (minion) => minionsHash[minion.name] = true);

    let notInMemoryMinions = [];
    // find a collection of minions that arent in the hash and are of TYPE
    _.each(Memory.creeps, (creep, key) => {
        if(!_.startsWith(key, TYPE)) return;
        if(!_.isUndefined(minionsHash[key])) return;
        if(creep.state.name === CONSTANTS.STATE.CREATE.name) return;

        return notInMemoryMinions.push(key);
    });

    _.each(notInMemoryMinions, (minion) => {
        console.log(`Deleting from memory: ${minion}`);
        delete Memory.creeps[minion]
    });
}

module.exports = factory;
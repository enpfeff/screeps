/**
 * Created by enpfeff on 11/10/16.
 */

const CONSTANTS = require('./constants');
const TYPES = CONSTANTS.TYPE;
const targetService = require('./target.service');
const sourceService = require('./source.service');
const spawnService = require('./spawn.service');
const PriorityQueue = require('fastpriorityqueue');


let myPriorityQueue;

/**
 * for the room we need to manage everything about it this invokes all the other types
 * @param room
 * @returns {{id: *, room: *}}
 */
function factory(room) {
    myPriorityQueue = new PriorityQueue(spawnService.comparatorGenerator(room));
    // compile all the tasks
    _.each(TYPES, (type) => manage(type, room));

    console.log(`myQueue size: ${myPriorityQueue.size}`);
    console.log(`top of q: ${JSON.stringify(myPriorityQueue.peek())}`);

    return {id: room.id, room};
};

/**
 * invokes the manageType based on the type
 * @param type
 * @param room
 * @returns {*}
 */
function manage(type, room) {
    let creeps = room.find(FIND_MY_CREEPS);
    const sourcesFn = sourceService[type];
    const targetsFn = targetService[type];

    if(_.isUndefined(sourcesFn) || _.isUndefined(targetsFn)) {
        return console.log(`${type}'s source and targets arent set up`);
    }

    myPriorityQueue.add(manageType(type, creeps, sourcesFn(room), targetsFn(room)));

}

/**
 *  manages a specific type of minion
 * @param TYPE
 * @param creeps
 * @param [sources]
 * @param [targets]
 */
function manageType(TYPE, creeps, sources, targets) {
    let minions = _.filter(creeps, (minion) => !_.isUndefined(minion) ? minion.memory.role === TYPE : false);
    console.log(`${TYPE}Manager: found ${minions.length} minion(s)`);

    // get the factory and create the controller that manages all the minions
    const factory = require(`./managers/${TYPE}`);
    if(_.isUndefined(factory)) return console.log(`${TYPE}'s factory is not defined`);
    const controller = factory(minions, sources, targets);

    // make sure our meta data is correct in memory
    refreshMemory(TYPE, minions);

    // make sure we have all the types we need
    let spawnTask = controller.create();

    // make sure they take there action this tick
    _.each(minions, controller.run);

    return spawnTask;
}

/**
 * corrects the Memory / meta data about the game
 * @param TYPE
 * @param minions
 */
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

// Pete
// grant
// dan
// Joe
// 
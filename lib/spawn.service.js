/**
 * @module screeps
 * @since 11/15/16
 * @author Ian Pfeffer
 */
"use strict";
const CONSTANTS = require('./constants');
const sourcesService = require('./source.service');

/**
 *
 * @param queue: a priority queue for which tasks go where
 * @param room: the current room
 */
function init(queue, room) {

}

// things in the priority queue will look like
// {
//      priority: <integer>,
//      type: <CONSTANTS.TYPE>
//      creep: { body, id, memory }
// }
function comparatorGenerator(room) {
    // we want to create creeps based on the following priority
    // 0.  HIGHEST priority is set
    // 1.  Harvesters if there are none
    // 2.  Upgraders if there are none
    // 3.  Attackers: Theres an enemy in the room //TODO
    // 4.  Repairmen //TODO
    // 5.  Upgraders to the limit
    // 6.  Harvesters to the limit

    const creeps = room.find(FIND_MY_CREEPS);
    const harvesterSources = sourcesService[CONSTANTS.TYPE.HARVESTER](room);
    const controllers = _.isArray(room.controller) ? room.controller : [room.controller];
    const enemyCreeps = room.find(FIND_HOSTILE_CREEPS);


    const harvesters = getType(creeps, CONSTANTS.TYPE.HARVESTER);
    const noHarvesters = harvesters.length === 0;
    const upgraders = getType(creeps, CONSTANTS.TYPE.UPGRADER);
    const noUpgraders = upgraders.length === 0;

    return function(a, b) {
        const chooseMyType = _.partial(chooseType, a, b);
        let result = null;

        // if this happens we go with this no matter what
        result = chooseMyType(CONSTANTS.PRIORITY.HIGHEST, 'priority');
        if(!_.isNull(result)) return result;

        if(noHarvesters) {
            result = chooseMyType(CONSTANTS.TYPE.HARVESTER, 'type');
            if(!_.isNull(result)) return result;
        }
        if(noUpgraders) {
            result = chooseMyType(CONSTANTS.TYPE.UPGRADER, 'type');
            if(!_.isNull(result)) return result;
        }

        if(CONSTANTS.LIMITS[CONSTANTS.TYPE.UPGRADER].source * controllers.length > upgraders.length) {
            result = chooseMyType(CONSTANTS.TYPE.UPGRADER, 'type');
            if(!_.isNull(result)) return result;
        }

        if(CONSTANTS.LIMITS[CONSTANTS.TYPE.HARVESTER].source * harvesterSources > harvesters.length) {
            result = chooseMyType(CONSTANTS.TYPE.HARVESTER, 'type');
            if(!_.isNull(result)) return result;
        }

        return a.priority > b.priority;
    }
}

function chooseType(a, b, TYPE, prop) {
    if(a[prop] === TYPE) return a;
    if(b[prop] === TYPE) return b;
    return null;
}

function getType(creeps, TYPE) {
    return _.filter(creeps, (minion) => !_.isUndefined(minion) ? minion.memory.role === TYPE : false);
}

function createTask(priority, creep) {
    if (!_.isObject(creep)) return console.log('task has empty creep');
    if(_.isUndefined(priority)) return console.log('need a priority');

    return {
        priority,
        creep
    }
}

function createCreep(body, id, memory) {
    return {
        body, id, memory
    }
}

function canSpawnCreep(spawn) {
    return spawn.canCreateCreep(HARVESTER_BODY, _.uniqueId('SomeName')) === OK;
}

function findSpawn(spawns) {
    let availableSpawns = _.filter(spawns, canSpawnCreep);

    // nothing is available
    if (_.isUndefined(availableSpawns) || availableSpawns.length === 0) return null;

    // find the spawn closest to the objective which is a source
    return _.first(_.values(spawns));
}


module.exports.createTask = createTask;
module.exports.createCreep = createCreep;
module.exports.comparatorGenerator = comparatorGenerator;
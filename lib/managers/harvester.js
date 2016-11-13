/**
 * Created by enpfeff on 11/10/16.
 */
const CONSTANTS = require('../constants');
const HARVESTER = CONSTANTS.HARVESTER;
const HARVESTER_BODY = [WORK, CARRY, MOVE];

/**
 * Manages Creation of harvesters
 * @param sources
 */
function create(sourcesById) {
    let assignmentId = findAssignmentId(sourcesById);
    if(_.isEmpty(assignmentId)) return;

    return spawnHarvester(assignmentId);
}

function spawnHarvester(assignmentId) {
    const id = _.uniqueId(HARVESTER);

    const aSpawn = findSpawn(Game.spawns);
    if(_.isNull(aSpawn)) return console.log("No available spawns");

    console.log(`Creating ${id}`);
    return aSpawn.createCreep(HARVESTER_BODY, id, {
        role: HARVESTER,
        id: id,
        assignment: assignmentId,
        state: CONSTANTS.STATE.CREATE
    });
}

function canSpawnHarvester(spawn) {
    return spawn.canCreateCreep(HARVESTER_BODY, _.uniqueId('SomeName')) === OK;
}

function findSpawn(spawns) {
    let availableSpawns = _.filter(spawns, canSpawnHarvester);

    // nothing is available
    if (_.isUndefined(availableSpawns) || availableSpawns.length === 0) return null;

    // find the spawn closest to the objective which is a source
    return _.first(_.values(spawns));
}

/**
 * Manages how harvesters are ran within their context
 * @param sourcesById
 * @param targets
 * @param minion
 * @returns {*}
 */
function run(sourcesById, targets, minion) {
    console.log(`[${minion.name}] run`);
    minion.memory.state = CONSTANTS.STATE.RUNNING;
    let ret;

    // go get monies!
    if(minion.carry.energy < minion.carryCapacity) {
        // make sure we have an assignment
        if(_.isUndefined(minion.memory.assignment)){
            minion.memory.assignment = findAssignmentId(sourcesById, minion);
        }

        // harvest it if we can otherwise move towards it
        const source = _.first(sourcesById[minion.memory.assignment]);
        ret = minion.harvest(source);

        if(ret === ERR_NOT_IN_RANGE) {
            console.log(`[${minion.name}] moving to ${source.id}`);
            minion.moveTo(source);
        }

        return;
    }

    if(targets.length === 0) return console.log(`[${minion.name}] No targets to go to`);
    const target = findClosestTarget(targets, minion);

    // try to transfer things but move them if you cant
    console.log(`${minion.name} have mins lets go`);
    ret = minion.transfer(target, RESOURCE_ENERGY);
    if(ret == ERR_NOT_IN_RANGE) minion.moveTo(target);

}

function findClosestTarget(targets, minion) {
    //TODO
    return _.first(targets);
}

function findAssignmentId(sourcesById) {
    // produces an obj of sources that are being worked on and by how many
    // {id: 1, id2: 3, ... , idN : x}
    let countedSources = _.chain(Memory.creeps)
        .map(creep => creep.assignment)
        .reject(_.isEmpty)
        .countBy()
        .value();

    // we now have a list of keys that cant be worked on
    const temp = _.reduce(countedSources, (acc, val, key) => {
        if(val >= CONSTANTS.LIMITS[HARVESTER].source) acc[key] = true;
        return acc;
    }, {});

    // take the difference of the arrays and you have a list of nodes that can be worked on
    const validNodes = _.difference(_.keys(sourcesById), _.keys(temp));

    // return the first one
    return _.first(validNodes);
}

/**
 * Factory Creation
 * @param minions
 * @param sources
 * @param targets
 * @returns {{create: *, run: *}}
 */
function init(minions, sources, targets) {
    const sourcesById = _.groupBy(sources, 'id');
    if(_.isUndefined(minions)) minions = [];

    return {
        create: _.partial(create, sourcesById),
        run: _.partial(run, sourcesById, targets)
    }
}


module.exports = init;
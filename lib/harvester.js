/**
 * Created by enpfeff on 11/10/16.
 */
const CONSTANTS = require('constants');
const HARVESTER = CONSTANTS.HARVESTER;

function create(minions, sources) {
    const perSource = CONSTANTS.LIMITS[HARVESTER].source;

    if(minions.length * perSource <= sources.length) {
        // if we dont have enough harvesters go ahead and create them
        _.each(_.range(sources.length - minions.length), () => {
            console.log("Creating Harvester");

            //TODO figure out where to spawn creeps
            const id = _.uniqueId(HARVESTER);
            _.first(_.values(Game.spawns)).createCreep([WORK, CARRY, MOVE], id, {
                role: HARVESTER,
                id: id
            });
        });
    }
}

function run(sourcesById, targets, minion) {
    console.log(`Run on ${minion.name}`);
    let ret;

    console.log(JSON.stringify(minion));

    // go get monies!
    if(minion.carry.energy < minion.carryCapacity) {

        // make sure we have an assignment
        if(_.isUndefined(minion.memory.assignment)) {
            minion.memory.assignment = findAssignmentId(sourcesById, minion);
        }

        // harvest it if we can otherwise move towards it
        const source = sourcesById[minion.memory.assignment];
        ret = minion.harvest(source);

        if(ret === ERR_NOT_IN_RANGE) {
            console.log(`${minion.name} moving to ${source.id}`);
            minion.moveTo(source);
        }

        return;
    }

    if(targets.length === 0) return minion.say("No where to go :(");
    const target = findClosestTarget(targets, minion);

    // try to transfer things but move them if you cant
    console.log(`${minion.name} have mins lets go`);
    ret = minion.transfer(target, RESOURCE_ENERGY);
    if(ret === ERR_NOT_IN_RANGE) minion.moveTo(target);

}

function findClosestTarget(targets, minion) {
    return _.first(targets);
}

function findAssignmentId(sourcesById, minion) {
    return _.first(_.keys(sourcesById));
}

function init(minions, sources, targets) {
    const sourcesById = _.groupBy(sources, 'id');
    if(_.isUndefined(minions)) minions = [];

    return {
        create: _.partial(create, minions, sources),
        run: _.partial(run, sourcesById, targets)
    }
}

module.exports = init;
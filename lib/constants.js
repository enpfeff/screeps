/**
 * Created by enpfeff on 11/10/16.
 */

// limits on things per controller level
module.exports.BUILDINGS = {

    1: {
        spawns: 1
    },
    2: {
        spawns: 1,
        extensions: 5,
        ramparts: true,
        walls: true
    },
    3: {
        spawns: 1,
        extensions: 10,
        ramparts: true,
        walls: true,
        roads: true
    },
    4: {
        spawns: 1,
        extensions: 20,
        ramparts: true,
        walls: true,
        roads: true,
        storage: 1
    },
    5: {
        spawns: 1,
        extensions: 30,
        ramparts: true,
        walls: true,
        roads: true,
        storage: 1
    },
    6: {
        spawns: 1,
        extensions: 40,
        ramparts: true,
        walls: true,
        roads: true,
        storage: 1
    },
    7: {
        spawns: 1,
        extensions: 50,
        ramparts: true,
        walls: true,
        roads: true,
        storage: 1
    },
    8: {
        spawns: 1,
        extensions: 60,
        ramparts: true,
        walls: true,
        roads: true,
        storage: 1
    }
};

const HARVESTER = 'harvester';

module.exports.HARVESTER = HARVESTER;
module.exports.LIMITS = {
    [HARVESTER]: {
        source: 2
    }
};


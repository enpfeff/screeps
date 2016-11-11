/**
 * Created by enpfeff on 11/10/16.
 */

const CreepFactory = require('creep.factory');

function loop() {
    // go get all the creeps and execute there functions
    const roomControllers = _.groupBy(_.map(Game.rooms, CreepFactory), 'id');
}


module.exports = { loop };
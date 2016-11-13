/**
 * Created by enpfeff on 11/10/16.
 */

const CreepFactory = require('./lib/creep.factory');

function loop() {
    // for all the rooms let the creep factory manage
    const roomControllers = _.map(Game.rooms, CreepFactory);
}


module.exports = { loop };
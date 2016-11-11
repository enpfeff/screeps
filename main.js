/**
 * Created by enpfeff on 11/10/16.
 */

const CreepFactory = require('creep.factory');

function loop() {
    // for all the rooms let the creep factory manage
    const roomControllers = _.groupBy(_.map(Game.rooms, CreepFactory), 'id');
}


module.exports = { loop };
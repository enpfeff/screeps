/**
 * Created by enpfeff on 11/10/16.
 */

const CreepFactory = require('./lib/creep.factory');
const version = require('json!version');

function loop() {
    console.log(`========= Version: ${version.version} ==========`);
    // for all the rooms let the creep factory manage
    const roomControllers = _.map(Game.rooms, CreepFactory);
}


module.exports = { loop };
var shortID = require('shortid');
//var Vector2 = require('./vector2.js')

module.exports = class Player
{
    constructor()
    {
        this.username = '';
        this.id = shortID.generate();
        this.position = {"x": 0, "y": 0};
    }
}
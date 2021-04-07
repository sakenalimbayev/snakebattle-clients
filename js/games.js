var Stuff = require('./stuff.js');

var Games = module.exports = {

    gameName : '',

    init : function(name) {
        this.gameName = name;
    },

    'require': function(name) {
        name = Stuff.clean(name);

        if (name == 'elements') {
            // case node
            var module = require('./games/' + this.gameName + '/elements.js');
            if (typeof module != 'undefined') {
                return Element = module;
            }

            // case browser stub
             if (this.gameName == 'snakebattle') {
                return Element = SnakeBattleElement;
            }
        } else if (name == 'board') {
            // case node
            var module = require('./games/' + this.gameName + '/board.js');
            if (typeof module != 'undefined') {
                return Board = module;
            }

            // case browser stub
           if (this.gameName == 'snakebattle') {
                return Board = SnakeBattleBoard;
            }
        } else if (name == 'direction') {
            // case node
            var module = require('./games/' + this.gameName + '/direction.js');
            if (typeof module != 'undefined') {
                return module();
            }

            // case browser stub
         if (this.gameName == 'snakebattle') {
                return Direction = SnakeBattleDirection();
            }
        }
    }
};

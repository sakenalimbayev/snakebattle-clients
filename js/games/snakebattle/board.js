var SnakeBattleBoard = module.exports = function(board){

    var Games = require('./../../games.js');
    var Direction = Games.require('./direction.js');
    var Point = require('./../../point.js');
    var util = require('util');
    var Stuff = require('./../../stuff.js');
    var Element = Games.require('./elements.js');
    var LengthToXY = require('./../../lxy.js');

    var contains = function (a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i].equals(obj)) {
                return true;
            }
        }
        return false;
    };

    var boardSize = function () {
        return Math.sqrt(board.length);
    };

    var size = boardSize();
    var xyl = new LengthToXY(size);



    var getHead = function() {
        var result = [];
        result = result.concat(findAll(Element.HEAD_DOWN));
        result = result.concat(findAll(Element.HEAD_LEFT));
        result = result.concat(findAll(Element.HEAD_RIGHT));
        result = result.concat(findAll(Element.HEAD_UP));
        result = result.concat(findAll(Element.HEAD_EVIL));
        result = result.concat(findAll(Element.HEAD_FLY));
        result = result.concat(findAll(Element.HEAD_SLEEP));
        return result[0];
    }

    var GetApples = function() {
       return findAll(Element.APPLE);
    }

    var GetGold = function() {
        return findAll(Element.GOLD);
    }

    var GetFlyingPill = function() {
        return findAll(Element.FLYING_PILL);
    }

    var GetWalls = function() {
        var result = [];
        result = result.concat(findAll(Element.WALL));
        result = result.concat(findAll(Element.START_FLOOR));
        return result;
    }

    var GetSnake = function () {
        var result = [];
        result = result.concat(findAll(getHead()));
        result = result.concat(findAll(Element.TAIL_END_DOWN));
        result = result.concat(findAll(Element.TAIL_END_LEFT));
        result = result.concat(findAll(Element.TAIL_END_UP));
        result = result.concat(findAll(Element.TAIL_END_RIGHT));

        result = result.concat(findAll(Element.BODY_HORIZONTAL));
        result = result.concat(findAll(Element.BODY_VERTICAL));
        result = result.concat(findAll(Element.BODY_LEFT_DOWN));
        result = result.concat(findAll(Element.BODY_LEFT_UP));
        result = result.concat(findAll(Element.BODY_RIGHT_DOWN));
        result = result.concat(findAll(Element.BODY_RIGHT_UP));

        return result;
    }

    var GetAllEnemySnakePoints = function () {
        var result = [];
        result = result.concat(findAll(Element.ENEMY_HEAD_DOWN));
        result = result.concat(findAll(Element.ENEMY_HEAD_RIGHT));
        result = result.concat(findAll(Element.ENEMY_HEAD_UP));
        result = result.concat(findAll(Element.ENEMY_HEAD_DEAD));
        result = result.concat(findAll(Element.ENEMY_HEAD_EVIL));
        result = result.concat(findAll(Element.ENEMY_HEAD_FLY));
        result = result.concat(findAll(Element.ENEMY_HEAD_SLEEP));

        result = result.concat(findAll(Element.ENEMY_TAIL_END_DOWN));
        result = result.concat(findAll(Element.ENEMY_TAIL_END_LEFT));
        result = result.concat(findAll(Element.ENEMY_TAIL_END_UP));
        result = result.concat(findAll(Element.ENEMY_TAIL_END_RIGHT));
        result = result.concat(findAll(Element.ENEMY_TAIL_INACTIVE));

        result = result.concat(findAll(Element.ENEMY_BODY_HORIZONTAL));
        result = result.concat(findAll(Element.ENEMY_BODY_VERTICAL));
        result = result.concat(findAll(Element.ENEMY_BODY_LEFT_DOWN));
        result = result.concat(findAll(Element.ENEMY_BODY_LEFT_UP));
        result = result.concat(findAll(Element.ENEMY_BODY_RIGHT_DOWN));
        result = result.concat(findAll(Element.ENEMY_BODY_RIGHT_UP));

        return result;
    }

    var isAt = function (x, y, element) {
        if (new Point(x, y).isOutOf(size)) {
            return false;
        }
        return getAt(x, y) == element;
    };

    var getAt = function (x, y) {
        if (new Point(x, y).isOutOf(size)) {
            return Element.WALL;
        }
        return board.charAt(xyl.getLength(x, y));
    };

    var boardAsString = function () {
        var result = "";
        for (var i = 0; i < size; i++) {
            result += board.substring(i * size, (i + 1) * size);
            result += "\n";
        }
        return result;
    };

    var GetStones = function() {
        var result = [];
        result = result.concat(findAll(Element.STONE));
        return result;
    }

    var getBarriers = function () {
        var result = [];
        result = result.concat(GetStones());
        result = result.concat(GetWalls);
        return result;
    };

    var IsBarrierAt = function (point)
    {
        return getBarriers().some((x) => (x.x === point.x && x.y === point.y));
    }

    var IsEnemyAliveSnakeAt = function (point) {
        var enemy = GetAllEnemySnakePoints();
        return enemy.some((x) => (x.x === point.x && x.y === point.y));

    }

    var IsSnakeAlive = function () {
        var head = getHead();
        return head.x !== 0 & head.y !==0;
    }


    var toString = function () {
        return util.format("%s\n" +
            "Board" +
            boardAsString())
    };


    var findAll = function (element) {
        var result = [];
        for (var i = 0; i < size * size; i++) {
            var point = xyl.getXY(i);
            if (isAt(point.getX(), point.getY(), element)) {
                result.push(point);
            }
        }
        return result;
    };

    var getWalls = function () {
        return findAll(Element.WALL);
    };

    var isAnyOfAt = function (x, y, elements) {
        for (var index in elements) {
            var element = elements[index];
            if (isAt(x, y, element)) {
                return true;
            }
        }
        return false;
    };

    var isNear = function (x, y, element) {
        if (new Point(x, y).isOutOf(size)) {
            return false;
        }
        return isAt(x + 1, y, element) || // TODO to remove duplicate
            isAt(x - 1, y, element) ||
            isAt(x, y + 1, element) ||
            isAt(x, y - 1, element);
    };

    var isBarrierAt = function (x, y) {
        return contains(getBarriers(), new Point(x, y));
    };

    var countNear = function (x, y, element) {
        if (new Point(x, y).isOutOf(size)) {
            return 0;
        }
        var count = 0;
        if (isAt(x - 1, y, element)) count++; // TODO to remove duplicate
        if (isAt(x + 1, y, element)) count++;
        if (isAt(x, y - 1, element)) count++;
        if (isAt(x, y + 1, element)) count++;
        return count;
    };

    return {
        size: boardSize,
        isAt: isAt,
        boardAsString: boardAsString,
        getBarriers: getBarriers,
        toString: toString,
        findAll: findAll,
        getWalls: getWalls,
        isAnyOfAt: isAnyOfAt,
        isNear: isNear,
        isBarrierAt: isBarrierAt,
        countNear: countNear,
        getAt: getAt,
        getHead: getHead,
        GetApples: GetApples,
        GetGold:GetGold,
        IsSnakeAlive:IsSnakeAlive,
        IsEnemyAliveSnakeAt:IsEnemyAliveSnakeAt,
        IsBarrierAt:IsBarrierAt,
        GetStones:GetStones,
        GetAllEnemySnakePoints:GetAllEnemySnakePoints,
        GetSnake:GetSnake,
        GetFlyingPill:GetFlyingPill,


    };
};

const view = require('../tetris/View.js');

function init(channel, player_1, player_2) {
    var board = createBoard();
    setInterval(gameLoop.bind(this, board, channel, player_1, player_2), 500);
};

function createBoard() {
    var board = [];
    for (var x = 0; x < 10; x++) {
        board.push([]);
        for (var y = 0; y < 20; y++) {
            board[x][y] = 0;
        }
    }
    return board;
}

function gameLoop(board, channel, player_1, player_2) {
    var isFloating = false;
    var floatPlane;
    var newGame = true;

    if (!isFloating) {
        floatPlane = createBoard();
        var newBlock = spawnBlock();
        if (canPlaceBlock(board, newBlock)) {
            board = placeBlock(board, newBlock);
            floatPlane = placeBlock(board, newBlock);
        } else return; // Game Over
        isFloating = true;
    } else {
        if (hasCollided(board)) {
            // Check for Lines
            // 
            isFloating = false;
        }
        var result = moveBlock(board, floatPlane);
        board = result[0];
        floatPlane = result[1];
    }

    view.draw(newGame, channel, player_1, player_2);
    if(newGame) newGame = false;
};

function moveBlock(board, floatPlane) {
    for (var x = 0; x < 10; x++) {
        for (var y = 19; y >= 0; y--) {
            if (floatPlane[x][y] !== 0) {
                floatPlane[x][y + 1] = floatPlane[x][y];
                board[x][y + 1] = floatPlane[x][y];
                floatPlane[x][y] = 0;
                board[x][y] = 0;
            }
        }
    }
    return [board, floatPlane];
};

function hasCollided(board, floatPlane) {
    // for(var x = 0; x < floatPlane.length)
    return false;
};

function canPlaceBlock(board, block) {
    for (var y = 0; y < block.length; y++)
        for (var x = 3; x < block[y].length; x++)
            if (board[x][y] !== 0)
                return false;
    return true;
};

function placeBlock(board, block) {
    for (var y = 0; y < block.length; y++)
        for (var x = 0; x < block[y].length; x++)
            board[x + 3][y] = block[y][x];
    return board;
};

function spawnBlock() {
    var pieces = [[[1, 1, 1, 1]],   //I Block
    [[1, 1, 1], [0, 1]],            //T Block
    [[0, 1, 1], [1, 1]],            //S Block
    [[1, 1], [0, 1, 1]],            //Z Block
    [[1, 1, 1], [1]],               //L Block
    [[1, 1, 1], [0, 0, 1]],         //J Block
    [[1, 1], [1, 1]]               //Square Block
    ];

    var piece = pieces[Math.floor(Math.random() * 7)].slice();
    var color = Math.floor(Math.random() * 6) + 1;

    for (var x = 0; x < piece.length; x++)
        for (var y = 0; y < piece[x].length; y++)
            piece[x][y] *= color;

    return piece;
};

exports.init = init;
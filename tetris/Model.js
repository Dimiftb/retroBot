const view = require('../tetris/View.js');

function init(channel, player_1, player_2) {
    var board = createBoard();
    var floatPlane = createBoard();
    gameLoop(board, floatPlane, false, channel, player_1, player_2);
};

function createBoard() {
    var board = [];
    for (var x = 0; x < 20; x++) {
        board.push([]);
        for (var y = 0; y < 10; y++) {
            board[x][y] = 0;
        }
    }
    return board;
}

async function gameLoop(board, floatPlane, isFloating, channel, player_1, player_2, message) {
    if (!isFloating) {
        floatPlane = createBoard();
        var newBlock = spawnBlock();

        if (canPlaceBlock(board, newBlock)) {

            board = placeBlock(board, newBlock);
            floatPlane = placeBlock(floatPlane, newBlock);

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
    message = await view.draw(channel, board, player_1, player_2, message);

    var t = setTimeout(gameLoop.bind(null, board, floatPlane, isFloating, channel, player_1, player_2, message), 2000);
};

function moveBlock(board, floatPlane) {
    for (var x = board.length - 1; x > 0; x--) {
        for (var y = 0; y < board[0].length; y++) {
            if (floatPlane[x][y] !== 0) {
                floatPlane[x + 1][y] = floatPlane[x][y];
                board[x + 1][y] = floatPlane[x][y];
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
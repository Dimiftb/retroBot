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

        } else {
            console.log("Game Over");
            return; // Game Over
        }
        isFloating = true;
    } else {
        if (hasCollided(board, floatPlane)) {
            // Check for Lines
            // 
            isFloating = false;
        } else {
            var result = moveBlock(board, floatPlane);
            board = result[0];
            floatPlane = result[1];
        }
    }
    let col = await view.draw(channel, board, player_1, player_2, message);

    let mov = col[0];
    message = col[1];
    switch (mov) {
        case "right":
            var result = moveRight(board, floatPlane);
            board = result[0];
            floatPlane = result[1];
            break;
        case "left":
            var result = moveLeft(board, floatPlane);
            board = result[0];
            floatPlane = result[1];
            break;
        case "rotate":
            rotate(board, floatPlane);
            break;
    }

    var t = setTimeout(gameLoop.bind(null, board, floatPlane, isFloating, channel, player_1, player_2, message), 750);
};

function moveBlock(board, floatPlane) {
    for (var x = board.length - 1; x >= 0; x--) {
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

function checkLeft(board, floatPlane) {
    for (var x = 0; x < board.length; x++)
        for (var y = 0; y < board[0].length; y++)
            if (floatPlane[x][y] !== 0 && floatPlane[x][y - 1] === 0 && board[x][y - 1] !== 0 && y - 1 > 0)
                return false;
    return true;
}

function checkRight(board, floatPlane) {
    for (var x = 0; x < board.length; x++)
        for (var y = 0; y < board[0].length; y++)
            if (floatPlane[x][y] !== 0 && floatPlane[x][y + 1] === 0 && board[x][y + 1] !== 0 && y + 1 < board[0].length)
                return false;
    return true;
}

function moveLeft(board, floatPlane) {
    if (checkLeft(board, floatPlane))
        for (var x = 0; x < board.length; x++)
            for (var y = 0; y < board[0].length; y++)
                if (floatPlane[x][y] !== 0) {
                    floatPlane[x][y - 1] = floatPlane[x][y];
                    board[x][y - 1] = floatPlane[x][y];
                    floatPlane[x][y] = 0;
                    board[x][y] = 0;
                }
    return [board, floatPlane];
};

function moveRight(board, floatPlane) {
    if (checkRight(board, floatPlane))
        for (var x = 0; x < board.length; x++)
            for (var y = board[0].length - 1; y >= 0; y--)
                if (floatPlane[x][y] !== 0) {
                    floatPlane[x][y + 1] = floatPlane[x][y];
                    board[x][y + 1] = floatPlane[x][y];
                    floatPlane[x][y] = 0;
                    board[x][y] = 0;
                }
    return [board, floatPlane];
};

function checkRotate(board, floatPlane) {

};

function rotate(board, floatPlane) {
    // Finding the center of the block
    let top = floatPlane.length - 1, bot = 0, left = floatPlane[0].length - 1, right = 0;
    for (var x = 0; x < floatPlane.length; x++)
        for (var y = 0; y < floatPlane[0].length; y++)
            if (floatPlane[x][y] !== 0) {
                if (top >= y)
                    top = y;
                if (bot <= y)
                    bot = y;
                if (left >= x)
                    left = x;
                if (right <= x)
                    right = x;
            }

    let block = [];
    for (var x = left; x <= right; x++) {
        let row = [];
        for (var y = top; y <= bot; y++) {
            row.push(floatPlane[x][y]);
        }
        block.push(row);
    }
    // console.log(block);

    let center_x = (right - left);
    let center_y = (bot - top);

};

function rotateBlock(block) {

}

function hasCollided(board, floatPlane) {
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[0].length; y++) {
            if (floatPlane[x][y] !== 0) {
                if (x === board.length - 1 || (board[x + 1][y] !== 0 && floatPlane[x + 1][y] === 0))
                    return true;
            }
        }
    }
    return false;
};

function canPlaceBlock(board, block) {
    for (var y = 0; y < block.length; y++)
        for (var x = 0; x < block[y].length; x++)
            if (board[x][y + 3] !== 0)
                return false;
    return true;
};

function placeBlock(board, block) {
    for (var y = 0; y < block.length; y++)
        for (var x = 0; x < block[y].length; x++)
            board[x][y + 3] = block[y][x];
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
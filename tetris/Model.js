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

function rotate(board, floatPlane) {
    // Finding the center of the Block
    let left = floatPlane[0].length - 1, right = 0, top = floatPlane.length - 1, bot = 0;
    for (var y = 0; y < floatPlane.length; y++)
        for (var x = 0; x < floatPlane[0].length; x++)
            if (floatPlane[y][x] !== 0) {
                if (left >= x)
                    left = x;
                if (right <= x)
                    right = x;
                if (top >= y)
                    top = y;
                if (bot <= y)
                    bot = y;
            }

    // Isolate the Block
    let block = [];
    for (var y = top; y <= bot; y++) {
        let row = [];
        for (var x = left; x <= right; x++) {
            row.push(floatPlane[y][x]);
        }
        block.push(row);
    }

    // Rotate the Block
    if (block.length > 3 || block[0].length > 3) {      // Long Piece
        let col = block[0][0];
        if (block.length > 1)
            block = [col, col, col, col];
        else
            block = [[col], [col], [col], [col]]
    } else if (block.length < 3 && block[0].length < 3) // Square Block
        return;
    else {
        // Get the 3x3 Grid
        if (block.length === 2)
            block.push([0, 0, 0]);
        else for (a of block) a.push(0);

        rotateBlock(block);
    }

    // Remove the block from the grid
    for (var y = 0; y < floatPlane.length; y++)
        for (var x = 0; x < floatPlane[0].length; x++)
            if (floatPlane[y][x] !== 0) {
                floatPlane[y][x] = 0;
                board[y][x] = 0;
            }

    // Place The Block back on the grid
    checkRotPlacement(block, board, floatPlane, left, top);

};

function checkRotPlacement(block, board, floatPlane, left, top) {
    if (left + block[0].length > board[0].length)
        left = board[0].length - block[0].length;

    var temp = checkTopPlacement(block, board, top, left);
    for (; temp !== top; temp = checkTopPlacement(block, board, top, left))
        top = temp;

    // Place the Block
    for (var y = top; y < top + block.length; y++)
        for (var x = left; x < left + block[0].length; x++) {
            if (block[y - top][x - left] !== 0) {
                floatPlane[y][x] = block[y - top][x - left];
                board[y][x] = block[y - top][x - left];
            }
        }
}

function checkTopPlacement(block, board, top, left) {
    for (var y = top; y < top + block.length; y++)
        for (var x = left; x < left + block[0].length; x++) {
            if (block[y - top][x - left] !== 0 && board[y][x] !== 0) {
                top--;
            }
        }
    return top;
}

function rotateBlock(block) {
    // Transpose matrix, block is the Piece.
    for (let y = 0; y < block.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [block[x][y], block[y][x]] =
                [block[y][x], block[x][y]];
        }
    }

    // Reverse the order of the columns.
    block.forEach(row => row.reverse());
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
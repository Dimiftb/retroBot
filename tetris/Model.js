// const view = require('./tetris/View.js');

function init(channel, player_1, player_2) {
    var board = [];
    for (var x = 0; x < 10; x++) {
        board.push([]);
        for (var y = 0; y < 20; y++) {
            board[x][y] = 0;
        }
    }

    console.log(spawnPiece());
};

function spawnPiece() {
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

    for(var x = 0; x < piece.length; x++)
        for(var y = 0; y < piece[x].length; y++)
        piece[x][y] *= color;

    return piece;
}

exports.init = init;
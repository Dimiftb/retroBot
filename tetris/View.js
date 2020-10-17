const model = require('../tetris/Model.js')
const discord = require('discord.js')

async function draw(init){
   //var board = model.board;
   //var channel = model.channel
   let str;

   if(init){
        str.concat( '|                    |\n' + 
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' + 
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    '|                    |\n' +
                    ' _ _ _ _ _ _ _ _ _ _ _\n\n' +
            ':arrow_left:                    :arrow_right:');
            
        const msg = await channel.send(str);
    }
   else{
        str.concat('|')
        for(var i = 0; i < board.length; i++){
            for(var j = 0; i < board[i].length; j++){
                switch (board[i][j]) {
                    case '0':
                        str.concat(' ')
                        break;
                    case '1':
                        str.concat(' :red_square: ')
                        break;
                    case '2':
                        str.concat(' :orange_square: ')
                        break;
                    case '3':
                        str.concat(' :yellow_square: ')
                        break;
                    case '4':
                        str.concat(' :green_square: ')
                        break;
                    case '5':
                        str.concat(' :blue_square:')
                        break;
                    case '6':
                        str.concat(' :purple_square: ')
                        break;    
                }
            str.concat('|\n')
            }
        str.concat(' _ _ _ _ _ _ _ _ _ _ _')
        }
        msg.edit(str)
    }
   
}
exports.draw = draw;
const model = require('../tetris/Model.js')
const discord = require('discord.js')

async function draw(channel, board, player_1, player_2, msg){
    if(typeof msg === 'undefined'){
        let str = ( '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '|                                                            |\n' + 
                    '---------------------------------------\n\n' +
            ':arrow_left:                                                  :arrow_right:');
        return await channel.send(str);
    }
   else{
        let str = ('\n|');
        for(var i = 0; i < board.length; i++){
            for(var j = 0; j < board[i].length; j++){
                switch (board[i][j]) {
                    case 0:
                        str = str.concat(' ')
                        break;
                    case 1:
                        str = str.concat(' :red_square: ')
                        break;
                    case 2:
                        str = str.concat(' :orange_square: ')
                        break;
                    case 3:
                        str = str.concat(' :yellow_square: ')
                        break;
                    case 4:
                        str = str.concat(' :green_square: ')
                        break;
                    case 5:
                        str = str.concat(' :blue_square:')
                        break;
                    case 6:
                        str = str.concat(' :purple_square: ')
                        break;    
                }
            }
            str = str.concat('|\n')
        }
        str = str.concat('---------------------------------------\n\n' +
        ':arrow_left:                                                  :arrow_right:');
        msg.edit(str);
    }
    return msg;   
}
exports.draw = draw;
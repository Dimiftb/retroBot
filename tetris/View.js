const model = require('../tetris/Model.js')
const discord = require('discord.js')


function create_string(board){
    let str = ('');
        for(var i = 0; i < board.length; i++){
            str = str.concat('|')
            for(var j = 0; j < board[i].length; j++){
                switch (board[i][j]) { 
                    case 0:
                        str = str.concat('       ')
                        break;
                    case 1:
                        str = str.concat(':red_square: ')
                        break;
                    case 2:
                        str = str.concat(':orange_square: ')
                        break;
                    case 3:
                        str = str.concat(':yellow_square: ')
                        break;
                    case 4:
                        str = str.concat(':green_square: ')
                        break;
                    case 5:
                        str = str.concat(':blue_square: ')
                        break;
                    case 6:
                        str = str.concat(':purple_square: ')
                        break;    
                }
            }
            str = str.concat('|\n')
        }
        str = str.concat('---------------------------------------------\n\n')

    return str
}
async function draw(channel, board, player_1, player_2, msg){
    let react

    if(typeof msg === "undefined"){
        let msg = await channel.send("Loading board...")
        await msg.react("⬅️")
        await msg.react("🔄")
        await msg.react("➡️")
        return ['', msg]
    }
    else{
        let action = "null"
        await msg.edit(create_string(board));

        if(await msg.reactions.resolve('⬅️').users.resolve(player_1) !== null){
            // left
            action = "left"
            await msg.reactions.resolve('⬅️').users.remove(player_1);
        }else if(await msg.reactions.resolve('🔄').users.resolve(player_1) !== null){
            // rotate
            action = "rotate"
            await msg.reactions.resolve('🔄').users.remove(player_1);
        }
         else if(await msg.reactions.resolve('➡️').users.resolve(player_1) !== null){
            // right
            action = "right"
            await msg.reactions.resolve('➡️').users.remove(player_1);
        }
        return [action, msg]
    }   
}

exports.draw = draw;
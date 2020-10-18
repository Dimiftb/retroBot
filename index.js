const { Client } = require('discord.js');
const settings = require('./settings.js');
const model = require('./tetris/Model.js');

const bot = new Client();

bot.on('message', msg => {
    if (!msg.content.startsWith("!")) return;

    const args = msg.content.slice(1).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "play") {
        model.init(msg.channel, msg.author.id, msg.author.id);
        // msg.channel.send(`<@${msg.author.id}> has issued a challenge to retro pong.`).then(messageReaction => {
        //     messageReaction.react("👍");

        //     const filter = (reaction, user) => {
        //         return ['👍'].includes(reaction.emoji.name) && user.id !== messageReaction.author.id && user.id !== msg.author.id;
        //     };

        //     const collector = messageReaction.createReactionCollector(filter, { max: 1, time: 15000 });

        //     collector.on('collect', (reaction, user) => {
        //         msg.channel.send(`<@${user.id}> has accepted the challenge from <@${msg.author.id}>.`);

        //         model.init(msg.channel, msg.author.id, user.id);
        //     });

        //     collector.on('end', collected => {
        //         console.log(`Collected ${collected.size} items`);
        //     });
            
        //     // messageReaction.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        //     //     .then((reaction, user) => {
        //     //         msg.channel.send(`${user.tag} has accepted the challenge from <@${msg.author.id}>.`);
        //     //     });
        //     // model.init();
        // });
    }
});

bot.login(settings.token);
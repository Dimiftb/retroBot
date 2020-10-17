const { Client } = require('discord.js');
const settings = require('./settings.js');

const bot = new Client();

bot.on('message', msg => {
    if (!msg.content.startsWith("!")) return;

    const args = msg.content.slice(1).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "challenge") {
        msg.channel.send(`<@${msg.author.id}> has issued a challenge to retro pong.`).then(messageReaction => {
            messageReaction.react("👍");

            const filter = (reaction, user) => {
                return ['👍'].includes(reaction.emoji.name) && user.id !== messageReaction.author.id && user.id !== msg.author.id;
            };

            // messageReaction.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            //     .then(collected => {
            //         msg.channel.send(`${collected.user} has accepted the challenge from <@${msg.author.id}>.`);
            //     });
        });

    }
});

bot.login(settings.token);
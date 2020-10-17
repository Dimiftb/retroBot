const { Client, MessageReaction } = require('discord.js');
const settings = require('./settings.js');

const bot = new Client();

bot.on('message', msg => {
    if (!msg.content.startsWith("!")) return;

    const args = msg.content.slice(1).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "challenge") {
        msg.channel.send(`<@${msg.author.id}> has issued a challenge to retro pong.`).then(messageReaction => {
            messageReaction.react("👍");
        })

    }
});

bot.login(settings.token);
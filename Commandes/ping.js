const Discord = require("discord.js")

module.exports = {

    name: "ping",
    description: "Affiche ton ping",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(bot, message, args) {

        await message.reply(`Ping : \`${bot.ws.ping}\``)
    }
}
const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "beta",
    description: "Information sur la beta du bot",
    permission: "Aucune",
    dm: false,

async run(bot, message, args) {
    const { AttachmentBuilder, EmbedBuilder } = require('discord.js');


        const exampleEmbed = new EmbedBuilder()    //ba cest une commande embed ya pas de code ducon
	    .setTitle(`Beta`)
        .setDescription(`Bonjour et merci d'utiliser mon bot discord !\nLe bot est actuellement en beta et je vous invite donc a rejoindre le serveur discord pour me faire part de vos idées, de vos bugs et des changements potentielles que je pourrais apporter au bot !\n Ou tout simplement en m'envoyant un message privé sur discord ! (Pika#0801) \n Je m'excuse par avance pour les bugs et les crashs qui pourraient arriver. \n Ou pour toutes les fonctionnalités encore manquantes tel que le pokedex`)
        .addFields([
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Lien du serveur discord :',
                value: `https://discord.gg/c76WU76GxT`,
                inline: true,
            },
        ])
        .setTimestamp(Date.now())
        message.reply({ embeds: [exampleEmbed]})
    }
}
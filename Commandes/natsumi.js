const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "natsumi",
    description: "Information sur la talentueuse Natsumi",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

async run(bot, message, args) {
    const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
        const file = new AttachmentBuilder(`assets/Pika_LogoBot.png`);

        const exampleEmbed = new EmbedBuilder()    //ba cest une commande embed ya pas de code ducon
        .setColor(`#FFA500`)
	    .setTitle(`Natsumi`)
        .setDescription(`Un ENORME merci a Natsumi pour m'avoir fait la photo de profil du bot !\n Je le trouve juste insane c'est pourquoi une commande lui est dédié, vous pouvez retrouver tout son travail sur les différents liens`)
        .setImage(`attachment://Pika_LogoBot.png`)
        .addFields([
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Liens :',
                value: `https://natskei.carrd.co/`,
                inline: true,
            },
            {
                name: 'Discord :',
                value: `✘ ⲛⲇⲧ⳽ⳙⲙⲓ ✘#4007`,
                inline: true,
            },
        ])
        .setTimestamp(Date.now())
        message.reply({ embeds: [exampleEmbed], files: [file] })
    }
}
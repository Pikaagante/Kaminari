const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');
const {point} = require('../main.js');

module.exports = {

    name: "tuto",
    description: "Comment utiliser le bot",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

async run(bot, message, args) {
    try {
    const { AttachmentBuilder, EmbedBuilder } = require('discord.js');


        const exampleEmbed = new EmbedBuilder()    //ba cest une commande embed ya pas de code ducon
	    .setTitle(`Tuto`)
        .setDescription(`Hey ! Merci a toi d'utiliser mon bot ! \n Voici un petit tuto pour pouvoir utiliser le bot sans problème (toute les commandes sont indiques dans /help)`)
        .addFields([
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Argent',
                value: "Vous avez 3 manières d'obtenir de l'argent : \n\n 1. En travaillant toute les 10 minutes ```/job```  \n\n 2. Avec la loterie ```/loterie``` (!! vous pouvez perdre votre argent !!) \n\n 3. Avec le ```/daily```",
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Ball',
                value: "Pour capturer un pokemon il y a 2 étapes \n\n 1. Tout d'abord utiliser la commande qui permet d'acheter une pokeball ```/buy <ball>```\n\n 2. Utiliser la commande pour l'ouvrir ```/open <ball>``` Et voila vous possedez desormais un pokemon !",
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Shop',
                value: "Pour voir le contenue d'une pokeball et son prix ```/shop <ball>``` ou voir l'intégralité des balls ```/shop all```",
                inline: true,
            },
        ])
        .setTimestamp(Date.now())
        message.reply({ embeds: [exampleEmbed]})
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'exécution de la commande :", error);
        const errorEmbed = new EmbedBuilder()
          .setTitle('Erreur')
          .setDescription('Une erreur est survenue lors de l\'ouverture de votre pokéball.')
          .setColor('Red')
          .setTimestamp();
        message.reply({ embeds: [errorEmbed] });
      }
    }
}
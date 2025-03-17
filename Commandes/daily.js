const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');
const {argent} = require('../main.js')
const {point} = require('../main.js');


module.exports = {

    name: "daily",
    description: "Ton argent quotidien",
    permission: "Aucune",
    dm: false,
    cooldown: 86400,

    async run(bot, message, args) {
        try {
    if (point.getPoint(message.user.id) > 0) {

        argent.addData(message.user.id, argent.getKey(message.user.id)+1000)
        argent.saveData()
        const exampleEmbed = new EmbedBuilder()
	    .setTitle(`🔥   Récompense quotidienne !   🔥`)
        .setDescription(`Voici ta récompense quotidienne : 1000P$ ! \n\n Votre argent s'élève à : ${argent.getArgent(message.user.id)}P$`)
        .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed]})

    } else {

            const exampleEmbed = new EmbedBuilder()
            .setTitle(`Daily`)
            .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
            .setTimestamp(Date.now());
            message.reply({ embeds: [exampleEmbed]})

        }
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
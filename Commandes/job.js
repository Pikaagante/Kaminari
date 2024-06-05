const Discord = require("discord.js")
const {argent} = require('../main.js')
const {point} = require('../main.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    name: "job",
    description: "pour gagner de l'argent",
    permission: "Aucune",
    dm: false,
    cooldown: 600,

    async run(bot, message, args) {
        

      if (point.getPoint(message.user.id) > 0) {
        var arg = Math.floor(Math.random()*200)+400; // On génère un nombre aléatoire entre 400 et 600 
        var mes = Math.floor(Math.random()*9);      // On génère un nombre aléatoire entre 1 et 12 qui servira a choisir un message

        const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

        const exampleEmbed = new EmbedBuilder()
	    .setTitle(`Job`)
        .setDescription(`${balls.getBalls(mes)} : ${arg}P$ \n\n Votre argent s'élève à : ${argent.getArgent(message.user.id)}P$`)
        .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed]})

        argent.addData(message.user.id, argent.getKey(message.user.id)+arg)
        argent.saveData()
        

    } else {
        const exampleEmbed = new EmbedBuilder()
        .setTitle(`Job`)
        .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
        .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed]})
    }
}
}


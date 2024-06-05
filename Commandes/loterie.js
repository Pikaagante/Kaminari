const Discord = require("discord.js")
const {argent} = require('../main.js')
const {point} = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "loterie",
    description: "tu veux parier ?",
    permission: "Aucune",
    dm: false,
    cooldown: 120,
    options: [
        {
            type:"integer",
            name:"loterie",
            description:"Entre la somme que vous voulez parier",
            required:true
        }
    ],

    async run(bot, message, args) {
        
    if (point.getPoint(message.user.id) > 0) {
        let mise = args.getInteger("loterie")
        const arg = Math.floor(Math.random() * 1001); // On récupère un nombre aléatoire entre 0 et 1000
        const exampleEmbed = new EmbedBuilder()
        .setTitle(`Loterie`)
        .setDescription(`Argent misé : ${mise}P$ \n Argent gagné : ${arg}P$`)

        if(mise < argent.getKey(message.user.id)){
            if(arg < 1000 && arg > 776){

                argent.addData(message.user.id, argent.getKey(message.user.id) - mise)
                argent.saveData()
                mise = mise * 2
                exampleEmbed.setDescription(`Vous avez obtenu ${mise}P$ soit 2 fois votre mise`)
                argent.addData(message.user.id, argent.getKey(message.user.id) + mise)
                argent.saveData()
                message.reply({ embeds: [exampleEmbed]})

            } else if (arg < 775 && arg > 551){

                argent.addData(message.user.id, argent.getKey(message.user.id) - mise)
                argent.saveData()
                mise = mise * 1.5
                exampleEmbed.setDescription(`Vous avez obtenu ${mise}P$ soit 1.5 fois votre mise \n\n Votre argent s'élève à : ${argent.getArgent(message.user.id)}P$`)
                argent.addData(message.user.id, argent.getKey(message.user.id) + mise)
                argent.saveData()
                message.reply({ embeds: [exampleEmbed]})

            } else if (arg < 550 && arg > 276){

                argent.addData(message.user.id, argent.getKey(message.user.id) - mise)
                argent.saveData()
                mise = mise * 0.5
                exampleEmbed.setDescription(`Vous avez obtenu ${mise}P$ soit 0,5 fois votre mise \n\n Votre argent s'élève à : ${argent.getArgent(message.user.id)}P$`)
                argent.addData(message.user.id, argent.getKey(message.user.id) + mise)
                argent.saveData()
                message.reply({ embeds: [exampleEmbed]})

            } else if (arg < 275 && arg > 0){

                argent.addData(message.user.id, argent.getKey(message.user.id) - mise)
                argent.saveData()
                mise = mise * 0
                exampleEmbed.setDescription(`Vous avez obtenu ${mise}P$ soit 0 fois votre mise \n\n Votre argent s'élève à : ${argent.getArgent(message.user.id)}P$`)
                argent.addData(message.user.id, argent.getKey(message.user.id) + mise)
                argent.saveData()
                message.reply({ embeds: [exampleEmbed]})
            
            }
        } else {

            exampleEmbed.setDescription(`Vous n'avez pas assez d'argent`)
            message.reply({ embeds: [exampleEmbed]})

        }

        } else {

            const exampleEmbed = new EmbedBuilder()
            .setTitle(`Loterie`)
            .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
            .setTimestamp(Date.now());
            message.reply({ embeds: [exampleEmbed]})

        }
    }
}

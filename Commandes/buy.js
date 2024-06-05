const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const { inventory } = require('../main.js')
const { balls } = require('../main.js')
const { argent } = require('../main.js')
const {point} = require('../main.js');
const fs = require('fs')
const path = require('path')
   
module.exports = {
    name: "buy",
    description: "acheter une ball",
    permission: "Aucune",
    dm: false,
    cooldown:600,
    options: [
        {
            type: "string",
            name: "balls",
            description: "les balls a voir",
            required: true
        },
        {
            type: "integer",
            name: "quantite",
            description: "la quantite de balls a acheter",
            required: true
        }
    ],

    async run(bot, message, args) {

    const exampleEmbed = new EmbedBuilder()
	.setTitle(`Achat`)
    .setDescription(`Oui`)
    .setTimestamp(Date.now());
    
    if (point.getPoint(message.user.id) > 0) {
        let ballee = args.getString("balls").toLowerCase() 
        ballee = ballee.charAt(0).toUpperCase() + ballee.slice(1) // On met la première lettre en majuscule et le reste en minuscule
        const balle = args.getString("balls").toUpperCase() // On récupère la pokeball choisi en majuscule qui permettra un choix dans la fonction ball


        if (point.getPoint(message.user.id) > balls.getBalls(balle).MinPoint) {


            const nbr = args.getInteger("quantite")

            if ((balls.getBalls(balle).price*nbr) < argent.getArgent(message.user.id)) {
              i=1
              while (i<=nbr) {
                argent.addData(message.user.id, argent.getKey(message.user.id) - balls.getBalls(balle).price)
                argent.saveData()
                inventory.addToList(message.user.id, balle)
                inventory.saveData()
                i=i+1
              }
                exampleEmbed.setDescription(`Vous avez acheter ${nbr} ${ballee} pour ${balls.getBalls(balle).price*nbr}P$ \n\n Il vous reste: ${argent.getArgent(message.user.id)}P$`)
                message.reply({ embeds: [exampleEmbed]})

            } else {
                
                exampleEmbed.setDescription(`Vous n'avez pas assez d'argent pour acheter une ${ballee}`)
                message.reply({ embeds: [exampleEmbed]})

            }
        } else {

            const nbrpoint = balls.getBalls(balle).MinPoint - point.getPoint(message.user.id) 
        
            exampleEmbed.setDescription(`Vous n'avez pas debloque la ${ballee} il vous manque ${nbrpoint} point `)
            message.reply({ embeds: [exampleEmbed]})

        }
    } else {

        exampleEmbed.setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
        message.reply({ embeds: [exampleEmbed]})
    }
  }
}
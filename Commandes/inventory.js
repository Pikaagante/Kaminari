const Discord = require("discord.js")
const {inventory} = require('../main.js')
const {point} = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "inventory",
    description: "Voir son inventaire",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(bot, message, args) {
      if (point.getPoint(message.user.id) > 0) {
        const inventoryList = inventory.getInventory(message.user.id);
        const inventoryCounts = {};
    
        // Compte le nombre de chaque balle dans l'inventaire
        inventoryList.forEach(ball => {
          if (inventoryCounts[ball]) {
            inventoryCounts[ball]++;
          } else {
            inventoryCounts[ball] = 1;
          }
        });
    
        // Construit une chaîne de caractères pour afficher les résultats
        let inventoryString = "Vous avez : \n";

        for (const ball in inventoryCounts) {
          const ballCount = inventoryCounts[ball];
          const formattedBallName = ball.charAt(0).toUpperCase() + ball.slice(1).toLowerCase();
          inventoryString += `${formattedBallName} x${ballCount}\n`;
        }
    
        const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

        const exampleEmbed = new EmbedBuilder()
          .setTitle("Inventaire")
          .setDescription(inventoryString);
    
        message.reply({ embeds: [exampleEmbed] });
    } else {
        const exampleEmbed = new EmbedBuilder()
        .setTitle(`Inventaire`)
        .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
        .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed]})
    }
}
}
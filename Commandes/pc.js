const { dresseur } = require('../main.js');
const {point} = require('../main.js');

module.exports = {
    name: "pc",
    description: "voir ton pc",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(client, message, args) {

      if (point.getPoint(message.user.id) > 0) {

        const dresseurList = dresseur.getDresseur(message.user.id);
        const pokemonCounts = {};
    
        // Compte le nombre de chaque balle dans l'inventaire
        dresseurList.forEach(ball => {
          if (pokemonCounts[ball]) {
            pokemonCounts[ball]++;
          } else {
            pokemonCounts[ball] = 1;
          }
        });
    
        // Construit une chaîne de caractères pour afficher les résultats
        let inventoryString = "Vous avez : \n";

        for (const ball in pokemonCounts) {
          const ballCount = pokemonCounts[ball];
          const formattedBallName = ball.charAt(0).toUpperCase() + ball.slice(1).toLowerCase();
          inventoryString += `${formattedBallName} x${ballCount}\n`;
        }
    
        const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

        const exampleEmbed = new EmbedBuilder()
          .setTitle("Inventaire")
          .setDescription(inventoryString)
          .setTimestamp(Date.now());
    
        message.reply({ embeds: [exampleEmbed] });

      } else {
        message.reply("Vous n'avez pas commencer l'aventure faite /start pour commencer")
    }
  }
}




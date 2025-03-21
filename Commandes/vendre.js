const { dresseur } = require('../main.js');
const { argent } = require('../main.js');
const { point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "vendre",
  description: "Vendre un Pokémon",
  permission: "Aucune",
  dm: false,
  cooldown: 10,
  options: [
    {
      type: "string",
      name: "pok",
      description: "Le nom du Pokémon à vendre",
      required: true
    }
  ],

  async run(bot, interaction, args) {
    try {
      const userId = interaction.user.id;

      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Pour l'instant en maintenance
      return interaction.reply("Cette commande est en maintenance.");

    } catch (error) {
      console.error("Erreur dans la commande /vendre :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription("Une erreur est survenue lors de la commande /vendre.")
        .setColor('Red')
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

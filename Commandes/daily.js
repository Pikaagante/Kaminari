const { EmbedBuilder } = require('discord.js');
const { argent, point } = require('../main.js');

module.exports = {
  name: "daily",
  description: "Ton argent quotidien",
  permission: "Aucune",
  dm: false,
  cooldown: 86400, // 24h en secondes

  async run(bot, interaction) {
    try {
      const userId = interaction.user.id;

      // Vérifie que le joueur a commencé l'aventure avec /start
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Ajout de l'argent quotidien
      argent.addData(userId, argent.getKey(userId) + 1000);
      argent.saveData();

      // Récupère le nouveau solde après avoir ajouté la récompense.
      const newBalance = argent.getArgent(userId);
      const embed = new EmbedBuilder()
        .setTitle("Récompense quotidienne ! ")
        .setDescription(`Voici ta récompense quotidienne : **1000P$** !\n\nArgent total : **${newBalance}P$**`)
        .setColor("#2ecc71")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande daily :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription("Une erreur est survenue lors de la récupération quotidienne.")
        .setColor('Red')
        .setTimestamp();
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

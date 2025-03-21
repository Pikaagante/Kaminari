const { argent, point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "profil",
  description: "Voir son argent et ses points",
  permission: "Aucune",
  dm: false,
  cooldown: 10,

  async run(bot, interaction) {
    try {
      const userId = interaction.user.id;

      if (point.getPoint(userId) > 0) {
        const embed = new EmbedBuilder()
          .setTitle(`Profil de ${interaction.user.username}`)
          .setDescription(`Argent : ${argent.getArgent(userId)} P$\n Points : ${point.getPoint(userId)}`)
          .setColor("#3498db")
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Profil")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }

    } catch (error) {
      console.error("Erreur dans la commande /profil :", error);

      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de la lecture de votre profil.")
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

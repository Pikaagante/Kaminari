const { EmbedBuilder } = require("discord.js");
const { point } = require("../main.js");

module.exports = {
  name: "classement",
  description: "Qui sera le premier ?",
  permission: "Aucune",
  dm: false,
  cooldown: 5,

  async run(bot, interaction) {
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

      // Obtenir tous les utilisateurs avec leurs points
      const usersWithPoints = point.getUsersWithPoints();

      // Top 10
      const topUsers = point.getTopUsers(10);

      // Remplacer les ID par les pseudos
      const updatedTopUsers = await Promise.all(topUsers.map(async ([userID, points], index) => {
        try {
          const user = await bot.users.fetch(userID);
          const username = user ? user.username : "Utilisateur inconnu";
          return [username, points, index + 1];
        } catch {
          return [`Utilisateur inconnu`, points, index + 1];
        }
      }));

      // Embed
      const embed = new EmbedBuilder()
        .setTitle("Classement des meilleurs dresseurs")
        .setColor("#FFD700")
        .setTimestamp()
        .setDescription(
          updatedTopUsers
            .map(([user, points, index]) => `**${index}.** ${user} — ${points} points`)
            .join("\n")
        );

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande classement :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'affichage du classement.")
        .setColor("Red")
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }
  }
};

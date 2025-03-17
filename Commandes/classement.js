const Discord = require("discord.js");
const { point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "classement",
  description: "Qui sera le premier ?",
  permission: "Aucune",
  dm: false,
  cooldown: 10,

  async run(bot, message, args) {
    try {
      if (point.getPoint(message.user.id) > 0) {

        // Obtenir les utilisateurs avec leurs points
        const usersWithPoints = point.getUsersWithPoints();

        // Obtenir les 10 meilleurs utilisateurs
        const topUsers = point.getTopUsers(10);

        // Récupérer les pseudos des utilisateurs en remplaçant les ID par les pseudos
        const updatedUsersWithPoints = await Promise.all(usersWithPoints.map(async ([userID, points]) => {
          const user = await bot.users.fetch(userID);
          const username = user ? user.username : "Utilisateur inconnu";
          return [username, points];
        }));

        const updatedTopUsers = await Promise.all(topUsers.map(async ([userID, points], index) => {
          const user = await bot.users.fetch(userID);
          const username = user ? user.username : "Utilisateur inconnu";
          return [username, points, index + 1];
        }));

        // Créer un message d'embed pour afficher les informations avec les pseudos
        const exampleEmbed = new EmbedBuilder()
          .setTitle("Classement des utilisateurs")
          .setTimestamp(Date.now())
          .setDescription(
            `Voici les 10 meilleurs utilisateurs :\n${updatedTopUsers.map(([user, points, index]) => `${index}. ${user}: ${points}`).join('\n')}`
          );

        message.reply({ embeds: [exampleEmbed] });

      } else {

        const exampleEmbed = new EmbedBuilder()
          .setTitle("Classement")
          .setDescription(
            "Vous n'avez pas commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed] });
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
};

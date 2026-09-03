const { EmbedBuilder } = require("discord.js");
const { argent, point } = require("../main.js");

module.exports = {
  name: "loterie",
  description: "Tu veux parier ?",
  permission: "Aucune",
  dm: false,
  cooldown: 600,
  options: [
    {
      type: "integer",
      name: "loterie",
      description: "Entre la somme que vous voulez parier",
      required: true
    }
  ],

  async run(bot, interaction, args) {
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

      // Récupère la somme choisie par l'utilisateur.
      let mise = args.getInteger("loterie");
      // Génère un nombre aléatoire entre 0 et 1000.
      const arg = Math.floor(Math.random() * 1001);
      // Récupère le solde actuel du joueur.
      const solde = argent.getArgent(userId);

      const embed = new EmbedBuilder()
        .setTitle("Loterie")
        .setColor("Blurple")
        .setTimestamp();

      // Vérifie que le joueur possède suffisamment d'argent
      if (mise > solde) {
        embed.setDescription(`Vous n'avez pas assez d'argent. Solde actuel : ${solde}P$`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Retire la mise du solde avant de déterminer le résultat.
      argent.addData(userId, argent.getKey(userId) - mise);

      // Détermine le résultat en fonction du nombre aléatoire généré.
      if (arg > 776) {
        mise = mise * 2;
        embed.setDescription(`Tu gagnes ${mise}P$ (2x ta mise) !`);
      } else if (arg > 551) {
        mise = Math.floor(mise * 1.5);
        embed.setDescription(`Tu gagnes ${mise}P$ (1.5x ta mise) !`);
      } else if (arg > 276) {
        mise = Math.floor(mise * 0.5);
        embed.setDescription(`Tu gagnes ${mise}P$ (0.5x ta mise)...`);
      } else {
        mise = 0;
        embed.setDescription(`Tu perds tout... Gagné : ${mise}P$`);
      }

      // Ajoute le résultat de la loterie au compte du joueur.
      argent.addData(userId, argent.getKey(userId) + mise);
      argent.saveData();

      // Affiche le solde restant après la loterie.
      embed.setFooter({ text: `Solde actuel : ${argent.getArgent(userId)}P$` });
      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur commande loterie :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue pendant la loterie.")
        .setColor("Red")
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

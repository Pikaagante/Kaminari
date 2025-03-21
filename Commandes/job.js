const { EmbedBuilder } = require("discord.js");
const { argent, point, balls } = require("../main.js");

module.exports = {
  name: "job",
  description: "Effectuer un job pour gagner de l'argent",
  permission: "Aucune",
  dm: false,
  cooldown: 600, // 10 minutes

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

      const gain = Math.floor(Math.random() * 200) + 400; // 400 à 599
      const jobMessages = [
        "Tu as travaillé dans une ferme",
        "Tu as bossé sur un chantier",
        "Tu as fait du ménage dans un manoir hanté",
        "Tu as été commis dans un fast-food",
        "Tu as peint une fresque murale",
        "Tu as trié des colis dans un entrepôt",
        "Tu as fait des tests de produits pour la Team Rocket",
        "Tu as lavé des voitures",
        "Tu as testé un nouveau jeu Pokémon",
        "Tu as joué dans une pub pour Pokéballs"
      ];

      const randomIndex = Math.floor(Math.random() * jobMessages.length);
      const jobMessage = jobMessages[randomIndex];

      argent.addData(userId, argent.getKey(userId) + gain);
      argent.saveData();

      const embed = new EmbedBuilder()
        .setTitle("Job terminé !")
        .setDescription(`${jobMessage} et gagné **${gain}P$**.\n\n Ton solde actuel est de **${argent.getArgent(userId)}P$**`)
        .setColor("#2ecc71")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande job :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'exécution du job.")
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

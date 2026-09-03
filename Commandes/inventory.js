const { EmbedBuilder } = require("discord.js");
const { inventory, point } = require("../main.js");

module.exports = {
  name: "inventory",
  description: "Voir son inventaire",
  permission: "Aucune",
  dm: false,
  cooldown: 5,

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

      // Récupère l'inventaire du joueur.
      const userInventory = inventory.data?.[userId] || {};
      const ballEntries = Object.entries(userInventory);

      // Vérifie si le joueur ne possède aucune Pokéball.
      if (ballEntries.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Inventaire")
              .setDescription("Votre inventaire est vide.")
              .setColor("#AAAAAA")
              .setTimestamp()
          ],
          ephemeral: true
        });
      }

      let inventoryString = "Vous avez :\n";
      // Parcourt toutes les Pokéballs présentes dans l'inventaire.
      for (const [ballName, info] of ballEntries) {
        const displayName = ballName.charAt(0).toUpperCase() + ballName.slice(1).toLowerCase();
        // Ajoute la Pokéball et sa quantité à la liste.
        inventoryString += `- ${displayName} x${info.nbr}\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle("Inventaire")
        .setDescription(inventoryString)
        .setColor("#2ecc71")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande inventory :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'affichage de l'inventaire.")
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

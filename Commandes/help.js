const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Toutes les commandes disponibles",
  permission: "Aucune",
  dm: false,
  cooldown: 5,

  async run(bot, interaction) {
    try {
      const helpEmbed = new EmbedBuilder()
        .setTitle("Commandes disponibles")
        .setColor("#3498db")
        .setDescription(
          [
            "/profil : ```voir son argent et ses points```",
            "/daily : ```gagner 1000P$ par jour```",
            "/buy <ball> <quantite> : ```acheter des Pokéballs```",
            "/open <ball> <quantite?> : ```ouvrir une ou plusieurs Pokéballs```",
            "/inventory : ```voir ses Pokéballs restantes```",
            "/job : ```gagner de l'argent toutes les 15 minutes```",
            "/loterie : ```tenter sa chance pour gagner de l'argent```",
            "/start : ```commencer l'aventure```",
            "/pc : ```voir ses Pokémon capturés```",
            "/pokedex <filtres?> : ```affiche le Pokédex avec filtres```",
            "/shop <ball> : ```voir le contenu d'une Pokéball```",
            "/vendre <pokemon> : ```vendre un Pokémon capturé```",
            "/tuto : ```voir le tutoriel du bot```",
            "/beta : ```infos sur la version beta du bot```"
          ].join("\n")
        )
        .setTimestamp();

      await interaction.reply({ embeds: [helpEmbed] });

    } catch (error) {
      console.error("Erreur dans la commande help :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'affichage de l'aide.")
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

const { EmbedBuilder } = require("discord.js");
const { point } = require('../main.js');

module.exports = {
  name: "tuto",
  description: "Comment utiliser le bot",
  permission: "Aucune",
  dm: false,
  cooldown: 10,

  async run(bot, interaction) {
    try {
      const embed = new EmbedBuilder()
        .setTitle("📘 Tuto")
        .setDescription("Hey ! Merci à toi d'utiliser mon bot !\nVoici un petit tuto pour bien démarrer (toutes les commandes sont listées dans `/help`)")
        .addFields(
          { name: '\u200b', value: '\u200b', inline: false },
          {
            name: 'Argent',
            value:
              "Tu as 3 moyens d’obtenir de l’argent :\n\n" +
              "1. Travailler toutes les 10 minutes → `/job`\n" +
              "2. Jouer à la loterie → `/loterie` (tu peux perdre ton argent !)\n" +
              "3. Récupérer ta récompense quotidienne → `/daily`",
            inline: true
          },
          { name: '\u200b', value: '\u200b', inline: false },
          {
            name: 'Pokéballs',
            value:
              "Pour capturer un Pokémon, suis ces étapes :\n\n" +
              "1. Acheter une pokéball → `/buy <ball>`\n" +
              "2. L'ouvrir pour tenter une capture → `/open <ball>`",
            inline: true
          },
          { name: '\u200b', value: '\u200b', inline: false },
          {
            name: 'Shop',
            value:
              "Pour voir le contenu d’une pokéball et son prix → `/shop <ball>`\n" +
              "Ou bien consulter toutes les pokéballs disponibles → `/shop all`",
            inline: true
          }
        )
        .setColor("#00BFFF")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande /tuto :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'exécution de la commande.")
        .setColor("Red")
        .setTimestamp();
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

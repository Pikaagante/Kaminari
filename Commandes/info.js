const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { pokemon } = require('../main.js');
const path = require("path");

module.exports = {
  name: "info",
  description: "Voir les infos d'un Pokémon",
  permission: "Aucune",
  dm: false,
  cooldown: 5,
  options: [
    {
      type: "string",
      name: "nom_poke",
      description: "Le nom du Pokémon que vous voulez voir",
      required: true
    }
  ],

  async run(bot, interaction, args) {
    try {
      const rawName = args.getString("nom_poke").toUpperCase();
      const displayName = rawName.charAt(0) + rawName.slice(1).toLowerCase();
      const data = pokemon.getPokemon(rawName);

      if (!data || data.Name !== displayName) {
        return interaction.reply({
          content: "Ce Pokémon n'existe pas ! (Pour le moment seuls les 200 premiers sont dans le Pokédex)",
          ephemeral: true
        });
      }

      const imagePath = path.resolve(__dirname, `../Assets/assetsP/${data.N}.png`);
      const file = new AttachmentBuilder(imagePath);

      const embed = new EmbedBuilder()
        .setColor(data.color || "#ffffff")
        .setTitle(`#${data.N} ${data.Name} | ${data.English_name}`)
        .setDescription(`- Pokémon ${data.Category}`)
        .setThumbnail(`attachment://${data.N}.png`)
        .addFields(
          { name: 'Type', value: data.Type || "Inconnu", inline: true },
          { name: 'Talent', value: data.Talent || "Aucun", inline: true },
          { name: '\u200b', value: '\u200b', inline: false },
          { name: 'Poids', value: data.Weight || "-", inline: true },
          { name: 'Taille', value: data.Size || "-", inline: true },
          { name: '\u200b', value: '\u200b', inline: false },
          { name: 'Groupe Œuf', value: data.Groupe || "-", inline: true },
          { name: 'Évolution', value: data.Evolution || "Aucune", inline: true }
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        files: [file]
      });

    } catch (error) {
      console.error("Erreur dans la commande info :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'affichage des infos du Pokémon.")
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

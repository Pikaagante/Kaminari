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
      // Récupère le nom donné par l'utilisateur et le convertit en majuscule
      const rawName = args.getString("nom_poke").toUpperCase();
      // Transforme le nom en format plus lisible pour l'affichage.
      const displayName = rawName.charAt(0) + rawName.slice(1).toLowerCase();
      // Recherche les informations du Pokémon dans pokemon.json.
      const data = pokemon.getPokemon(rawName);

      // Vérifie que le Pokémon existe et que son nom correspond
      if (!data || data.Name !== displayName) {
        return interaction.reply({
          content: "Ce Pokémon n'existe pas ! (Pour le moment seuls les 200 premiers sont dans le Pokédex)",
          ephemeral: true
        });
      }

      // Construit le chemin vers l'image du Pokémon à partir de son numéro dans le pokédex
      const imagePath = path.resolve(__dirname, `../Assets/assetsP/${data.N}.png`);
      // Prépare l'image pour pouvoir l'envoyer avec le message Discord.
      const file = new AttachmentBuilder(imagePath);

      // Création de l'embed contenant toutes les informations du Pokémon.
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

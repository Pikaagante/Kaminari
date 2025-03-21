const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { pokemon, dresseur, point } = require('../main.js');

module.exports = {
  name: "pokedex",
  description: "Affiche votre Pokédex avec filtres.",
  permission: "Aucune",
  dm: false,
  options: [
    {
      type: "string",
      name: "filter",
      description: "Filtrer selon votre progression",
      required: false,
      choices: [
        { name: "Tous", value: "all" },
        { name: "Seulement débloqués", value: "unlock" },
        { name: "Seulement verrouillés", value: "lock" }
      ]
    },
    {
      type: "string",
      name: "ball",
      description: "Filtrer par Pokéball",
      required: false
    },
    {
      type: "boolean",
      name: "shiny",
      description: "Voir uniquement les Pokémon shiny",
      required: false
    }
  ],

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

      const filter = interaction.options.getString("filter") || "all";
      const ballFilter = interaction.options.getString("ball")?.toUpperCase();
      const shinyOnly = interaction.options.getBoolean("shiny");

      const allPokemon = Object.values(pokemon.data);
      const userData = dresseur.data?.[userId] || {};

      const seenPokemon = new Set();
      let pokedex = [];

      for (const p of allPokemon) {
        const nameKey = p.Name.toUpperCase();
        const userEntry = userData[nameKey];

        if (!userEntry && filter === "unlock") continue;
        if (userEntry && filter === "lock") continue;
        if (shinyOnly && (!userEntry || !userEntry.shiny)) continue;
        if (ballFilter && (!p.balls || !p.balls.includes(ballFilter))) continue;
        if (seenPokemon.has(nameKey)) continue;

        seenPokemon.add(nameKey);

        pokedex.push({
          name: p.Name,
          id: p.N,
          color: p.color || "#FFFFFF",
          ballList: p.balls || [],
          isUnlocked: !!userEntry,
          isShiny: userEntry?.shiny === true,
          quantity: userEntry?.nbr || 1
        });
      }

      if (pokedex.length === 0) {
        return interaction.reply({ content: "Aucun Pokémon trouvé avec ces filtres.", ephemeral: true });
      }

      const itemsPerPage = 10;
      let currentPage = 0;
      const totalPages = Math.ceil(pokedex.length / itemsPerPage);

      const generateEmbed = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const list = pokedex.slice(start, end);

        const embed = new EmbedBuilder()
          .setTitle("Pokédex")
          .setColor("#00BFFF")
          .setFooter({ text: `Page ${page + 1} / ${totalPages}` });

        list.forEach(p => {
          const emoji = p.isUnlocked ? "✅" : "❌";
          const shiny = p.isShiny ? "✨ " : "";
          const count = p.quantity > 1 ? ` x${p.quantity}` : "";
          embed.addFields({
            name: `${emoji} ${shiny}${p.name} (#${p.id})${count}`,
            value: `Balls : ${p.ballList.join(", ") || "Aucune"}`,
            inline: true
          });
        });

        return embed;
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prevPage")
          .setLabel("⬅️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("nextPage")
          .setLabel("➡️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(totalPages <= 1)
      );

      const msg = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [row],
        fetchReply: true
      });

      const collector = msg.createMessageComponentCollector({ time: 60000 });

      collector.on("collect", async i => {
        if (i.user.id !== userId) {
          return i.reply({ content: "❌ Ce menu ne vous appartient pas.", ephemeral: true });
        }

        if (i.customId === "prevPage") currentPage = Math.max(0, currentPage - 1);
        if (i.customId === "nextPage") currentPage = Math.min(totalPages - 1, currentPage + 1);

        const newRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prevPage")
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId("nextPage")
            .setLabel("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1)
        );

        await i.update({
          embeds: [generateEmbed(currentPage)],
          components: [newRow]
        });
      });

      collector.on("end", async () => {
        try {
          await interaction.editReply({ components: [] });
        } catch (e) {
          console.log("Interaction expirée.");
        }
      });

    } catch (error) {
      console.error("Une erreur s'est produite lors de l'exécution de la commande :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors de l'affichage du Pokédex.")
        .setColor("Red")
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }
  }
};

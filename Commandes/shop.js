const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { point, balls } = require("../main.js");


module.exports = {
  name: "shop",
  description: "Voir les balls disponibles",
  permission: "Aucune",
  dm: false,
  cooldown: 5,
  options: [
    {
      type: "string",
      name: "balls",
      description: "Les balls à voir (groupe 1)",
      required: false
    }
  ],

  async run(bot, interaction) {
    try {
      // Vérifie que le joueur a commencé l'aventure avec /start
      const userId = interaction.user.id;
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Accès refusé")
              .setDescription("Vous devez d'abord commencer votre aventure avec `/start`.")
              .setTimestamp()
          ]
        });
      }

      // Récupère le nom de la ball demandé dans la commande.
      const selectedBall = interaction.options.getString("balls");

      if (selectedBall) {
        // **Cas où une Pokéball est spécifiée**
        const ballData = balls.getBalls(selectedBall.toUpperCase());

        // Vérifie que la ball demandée existe bien.
        if (!ballData) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("Erreur")
                .setDescription("Cette Pokéball n'existe pas.")
            ]
          });
        }

        const embed = new EmbedBuilder()
          .setTitle(selectedBall.toUpperCase())
          .setColor("#FFD700")

        // Chaque rareté possède sa propre liste de Pokémon.
        if (ballData.PokemonC !== "Aucun") embed.addFields({ name: "⭐ Commun", value: ballData.PokemonC, inline: true });
        if (ballData.PokemonPC !== "Aucun") embed.addFields({ name: "🔹 Peu Commun", value: ballData.PokemonPC, inline: true });
        if (ballData.PokemonR !== "Aucun") embed.addFields({ name: "🔴 Rare", value: ballData.PokemonR, inline: true });
        if (ballData.PokemonE !== "Aucun") embed.addFields({ name: "🔥 Épique", value: ballData.PokemonE, inline: true });

        // Informations générales de la ball
        embed.addFields(
          { name: "💰 Prix", value: `${ballData.price} P$`, inline: true },
          { name: "🔹 Points requis", value: `${ballData.MinPoint}`, inline: true }
        );

        return interaction.reply({ embeds: [embed] });
      }

      // **Cas où aucune Pokéball n'est spécifiée -> affichage paginé de toutes les Pokéballs**
      let ballsToShow = Object.keys(balls.data).filter(ball => balls.data[ball]?.price !== undefined);
      // Nombre de balls affichées sur chaque page.
      const perPage = 9;
      const totalPages = Math.ceil(ballsToShow.length / perPage);
      let currentPage = 0;

      const generateEmbed = (page) => {
        // Détermine quelles balls doivent être affichées sur cette page.
        const start = page * perPage;
        const end = start + perPage;
        const slice = ballsToShow.slice(start, end);

        const embed = new EmbedBuilder()
          .setTitle("Shop - Liste des Pokéballs")
          .setColor("#FFD700")
          .setFooter({ text: `Page ${page + 1} / ${totalPages}` });

        // Ajoute chaque ball de la page sous forme de champ dans l'embed.
        for (const ballName of slice) {
          const ballData = balls.data[ballName];
          if (!ballData) continue;

          embed.addFields({
            name: ballName.toUpperCase(),
            value: `💰 Prix: **${ballData.price} P$**\n🔹 Points requis: **${ballData.MinPoint}**`,
            inline: true
          });
        }

        return embed;
      };

      // Création des boutons de navigation.
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prevShop")
          .setLabel("⬅️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("nextShop")
          .setLabel("➡️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(totalPages <= 1)
      );

      // Envoie la première page du shop avec les boutons.
      const message = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [row],
        fetchReply: true
      });

      // Pendant 60 secondes, Discord surveille les clics sur les boutons
      const collector = message.createMessageComponentCollector({ time: 60000 });

      collector.on("collect", async i => {
        if (i.user.id !== userId) return i.reply({ content: "Ce bouton n'est pas pour toi.", ephemeral: true });

        // Change la page en fonction du bouton utilisé.
        if (i.customId === "nextShop") currentPage++;
        if (i.customId === "prevShop") currentPage--;

        const newRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prevShop")
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId("nextShop")
            .setLabel("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1)
        );

        await i.update({ embeds: [generateEmbed(currentPage)], components: [newRow] });
      });

      collector.on("end", async () => {
        try { await interaction.editReply({ components: [] }); } catch {}
      });

    } catch (error) {
      console.error("Erreur /shop :", error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Erreur")
            .setDescription("Une erreur est survenue lors du chargement du shop.")
            .setColor("Red")
            .setTimestamp()
        ],
        ephemeral: true
      });
    }
  }
};
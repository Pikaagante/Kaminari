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

      // Vérifie que le joueur a commencé l'aventure avec /start
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Récupère les différents filtres sélectionnés par l'utilisateur
      const filter = interaction.options.getString("filter") || "all";
      const ballFilter = interaction.options.getString("ball")?.toUpperCase();
      const shinyOnly = interaction.options.getBoolean("shiny");

      const allPokemon = Object.values(pokemon.data);

      // Récupère les Pokémon possédés par le joueur.
      const userData = dresseur.data?.[userId] || {};

      const seenPokemon = new Set();
      let pokedex = [];

      // Parcourt tous les Pokémon disponibles dans la base de données.
      for (const p of allPokemon) {
        const nameKey = p.Name.toUpperCase();
        const userEntry = userData[nameKey];

        // Filtre Seulement débloqués
        if (!userEntry && filter === "unlock") continue;
        // Filtre Seulement verrouillés
        if (userEntry && filter === "lock") continue;
        // Si le filtre shiny est activé, ignore les Pokémo
        if (shinyOnly && (!userEntry || !userEntry.shiny)) continue;
        // Si une Pokéball est précisée, vérifie que le Pokémon
        if (ballFilter && (!p.balls || !p.balls.includes(ballFilter))) continue;
        // Évite les doublons dans le résultat final
        if (seenPokemon.has(nameKey)) continue;

        seenPokemon.add(nameKey);

        // Ajoute les informations nécessaires à l'affichage.
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

      // Si aucun Pokémon ne correspond aux filtres
      if (pokedex.length === 0) {
        return interaction.reply({ content: "Aucun Pokémon trouvé avec ces filtres.", ephemeral: true });
      }

      // Nombre de Pokémon affichés sur chaque page.
      const itemsPerPage = 10;
      // Commence sur la première page.
      let currentPage = 0;
      // Calcule le nombre total de pages nécessaires.
      const totalPages = Math.ceil(pokedex.length / itemsPerPage);

      // Fonction qui génère l'embed correspondant à une page.
      const generateEmbed = (page) => {
        // Détermine quelles entrées du tableau doivent être affichées.
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const list = pokedex.slice(start, end);

        const embed = new EmbedBuilder()
          .setTitle("Pokédex")
          .setColor("#00BFFF")
          .setFooter({ text: `Page ${page + 1} / ${totalPages}` });

        // Ajoute chaque Pokémon de la page dans l'embed.
        list.forEach(p => {
          // Affiche une coche si le Pokémon est débloqué,
          const emoji = p.isUnlocked ? "✅" : "❌";
          // Indique si le joueur possède la version shiny.
          const shiny = p.isShiny ? "✨ " : "";
          // Affiche la quantité uniquement si le joueur
          const count = p.quantity > 1 ? ` x${p.quantity}` : "";
          embed.addFields({
            name: `${emoji} ${shiny}${p.name} (#${p.id})${count}`,
            value: `Balls : ${p.ballList.join(", ") || "Aucune"}`,
            inline: true
          });
        });

        return embed;
      };

      // Création des boutons permettant de naviguer entre les pages.
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

      // Envoie la première page du Pokédex avec les boutons.
      const msg = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [row],
        fetchReply: true
      });

      // Créé un collecteur qui écoute les clics sur les boutons pendant 60 secondes
      const collector = msg.createMessageComponentCollector({ time: 60000 });

      collector.on("collect", async i => {
        // Vérifie que la personne qui utilise les boutons est bien celle qui a ouvert le Pokédex.
        if (i.user.id !== userId) {
          return i.reply({ content: "❌ Ce menu ne vous appartient pas.", ephemeral: true });
        }

        // Change de page tout en empêchant de dépasser la première ou la dernière page.
        if (i.customId === "prevPage") currentPage = Math.max(0, currentPage - 1);
        if (i.customId === "nextPage") currentPage = Math.min(totalPages - 1, currentPage + 1);

        // Recrée les boutons afin de mettre à jour leur état selon la page actuelle.
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

        // Met à jour le message avec la nouvelle page.
        await i.update({
          embeds: [generateEmbed(currentPage)],
          components: [newRow]
        });
      });

      // Après 60 secondes boutons désactivés
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

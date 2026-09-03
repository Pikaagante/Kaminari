const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { pokemon, dresseur, inventory, point, balls } = require('../main.js');
const path = require('path');
const fonction = require('./fonction/balle.js');

module.exports = {
  name: "open",
  description: "Ouvrir une ou plusieurs pokéballs",
  permission: "Aucune",
  dm: false,
  cooldown: 0,
  options: [
    {
      type: "string",
      name: "balls",
      description: "Pokéball à utiliser",
      required: true
    },
    {
      type: "integer",
      name: "quantite",
      description: "Quantité à ouvrir (défaut : 1)",
      required: false
    }
  ],

  async run(bot, interaction, args) {
    try {
      const userId = interaction.user.id;
      // Récupère la Pokéball demandée et la convertit en majuscules
      const balle = args.getString("balls").toUpperCase();
      const quantity = args.getInteger("quantite") || 1;

      // Vérifie que le joueur a commencé l'aventure avec /start
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Récupère l'inventaire du joueur puis cherche la Pokéball qu'il souhaite utiliser.
      const userInventory = inventory.data?.[userId] || {};
      const ballInfo = userInventory[balle];

      // Vérifie que le joueur possède suffisamment de Pokéballs.
      if (!ballInfo || ballInfo.nbr < quantity) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setTitle("Erreur d'ouverture")
            .setDescription(`Vous n'avez pas ${quantity} ${balle}(s) dans votre inventaire.`)
            .setTimestamp()],
          ephemeral: false
        });
      }

      if (!dresseur.data[userId]) dresseur.data[userId] = {};

      // Tableau contenant les résultats de toutes les ouvertures.
      let messages = [];
      let lastResult = null;
      let lastShiny = false;

      // Ouvre les Pokéballs une par une.
      for (let i = 0; i < quantity; i++) {

        // Génère un nombre entre 0 et 4096.
        // Le Pokémon devient shiny uniquement si le résultat vaut 1.
        const Tshiny = Math.floor(Math.random() * 4097);
        const isShiny = Tshiny === 1;

        // Détermine aléatoirement quel Pokémon se trouve
        const result = fonction.ball(balle);
        const rawName = result.name;
        const name = rawName.toUpperCase();

        // Vérifie si le joueur possède déjà ce Pokémon.
        const isNew = !dresseur.data[userId][name];

        if (isNew) {
          // Nouveau Pokémon attrapé
          dresseur.data[userId][name] = {
            shiny: isShiny,
            nbr: 1,
            rarity: result.rarity
          };
        } else {
          // Pokémon déjà possédé augmente simplement sa quantité.
          const existing = dresseur.data[userId][name];
          existing.nbr += 1;

          // Si le joueur obtient un shiny, on le garde en mémoire
          if (isShiny && !existing.shiny) existing.shiny = true;
          // Au cas ou ajoute la rareté si elle n'était pas enregistrée.
          if (!existing.rarity) existing.rarity = result.rarity;
        }

        point.addData(userId, point.getKey(userId) + balls.getBalls(result.rarity));

        // Prépare une ligne décrivant le résultat de l'ouverture.
        const line = `${rawName}${isShiny ? " **SHINY**" : ""} (rareté ${result.rarity})${isNew ? " 🆕" : ""}`;
        messages.push(line);

        if (i === quantity - 1) {
          lastResult = result;
          lastShiny = isShiny;
        }
      }

      // Mise à jour de l'inventaire
      ballInfo.nbr -= quantity;
      if (ballInfo.nbr <= 0) delete inventory.data[userId][balle];

      dresseur.saveData();
      point.saveData();
      inventory.saveData();

      // Récupère le serveur et le salon utilisés pour les logs
      const guildName = interaction.guild.name;
      const guildId = "1043996039297892463";
      const channelId = "1109899933332549723";
      const guild = bot.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get(channelId);

      // CAS 1 : UNE SEULE POKÉBALL
      if (quantity === 1) {
        const name = lastResult.name.toUpperCase();
        // Utilise le dossier des GIFs shiny si le Pokémon est shiny,
        const folder = lastShiny ? "assetsGS" : "assetsG";
        // Récupère les données du Pokémon pour connaître son numéro.
        const pokeData = pokemon.getPokemon(name);
        const gifName = pokeData ? `${pokeData.N}.gif` : null;

        if (!gifName) throw new Error(`Aucune donnée trouvée pour le Pokémon : ${name}`);
        const filePath = path.resolve(__dirname, `../Assets/${folder}/${gifName}`);

        try {
          // Prépare le GIF pour pouvoir l'envoyer sur Discord.
          const file = new AttachmentBuilder(filePath);
          // Création du message affichant le Pokémon obtenu.
          const embed = new EmbedBuilder()
            .setTitle(`Ouverture de 1 ${balle}`)
            .setDescription(`${lastResult.name}${lastShiny ? " **SHINY**" : ""} (rareté ${lastResult.rarity})`)
            .setImage(`attachment://${gifName}`)
            .setColor("#2ecc71")
            .setTimestamp();

          await interaction.reply({ embeds: [embed], files: [file] });

          // Création du message de log envoyé dans le salon prévu.
          const logEmbed = new EmbedBuilder()
            .setTitle(lastShiny ? "Nouveau Shiny trouvé !" : "Nouveau Pokémon trouvé !")
            .setDescription(`**${interaction.user.username}** a attrapé un **${lastResult.name}**${lastShiny ? " **SHINY**" : ""} de rareté ${lastResult.rarity} sur le serveur **${guildName}**`)
            .setImage(`attachment://${gifName}`)
            .setColor(lastShiny ? "#FFD700" : "#3498db")
            .setTimestamp();

          channel.send({ embeds: [logEmbed], files: [file] });

        } catch (e) {
          // Si le GIF est introuvable, le Pokémon est quand même affiché
          console.warn("Image introuvable pour le Pokémon :", name);
          const embed = new EmbedBuilder()
            .setTitle(`Ouverture de 1 ${balle}`)
            .setDescription(`${lastResult.name}${lastShiny ? " **SHINY**" : ""} (rareté ${lastResult.rarity})`)
            .setColor("#2ecc71")
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });

          // Log de l'ouverture sans image.
          const logEmbed = new EmbedBuilder()
            .setTitle(lastShiny ? "Nouveau Shiny trouvé (sans image) !" : "Nouveau Pokémon trouvé (sans image) !")
            .setDescription(`**${interaction.user.username}** a attrapé un **${lastResult.name}**${lastShiny ? " **SHINY**" : ""} de rareté ${lastResult.rarity} sur le serveur **${guildName}**`)
            .setColor(lastShiny ? "#FFD700" : "#3498db")
            .setTimestamp();

          channel.send({ embeds: [logEmbed] });
        }

      // CAS 2 : PLUSIEURS POKÉBALLS
      } else {
        // Nombre maximum de résultats affichés sur une page.
        const pageSize = 10;
        const pages = [];

        // Découpe les résultats en plusieurs pages de 10 Pokémon.
        for (let i = 0; i < messages.length; i += pageSize) {
          pages.push(messages.slice(i, i + pageSize));
        }

        // Page actuellement affichée.
        let currentPage = 0;

        // Fonction permettant de générer l'embed correspondant
        const generateEmbed = (pageIndex) => {
          return new EmbedBuilder()
            .setTitle(`Ouverture de ${quantity} ${balle}(s) - Page ${pageIndex + 1}/${pages.length}`)
            .setDescription(pages[pageIndex].join("\n"))
            .setColor("#2ecc71")
            .setTimestamp();
        };

        // Création des boutons permettant de changer de page.
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pages.length <= 1)
        );

        // Envoie la première page avec les boutons.
        const reply = await interaction.reply({
          embeds: [generateEmbed(currentPage)],
          components: [row],
          fetchReply: true
        });

        // Collecteur qui écoute les clics sur les boutons pendant 60 secondes.
        const collector = reply.createMessageComponentCollector({
          time: 60_000,
          filter: i => i.user.id === interaction.user.id
        });

        // Change de page selon le bouton utilisé
        collector.on('collect', async i => {
          if (i.customId === 'next') currentPage++;
          if (i.customId === 'prev') currentPage--;

          row.components[0].setDisabled(currentPage === 0);
          row.components[1].setDisabled(currentPage === pages.length - 1);

          await i.update({
            embeds: [generateEmbed(currentPage)],
            components: [row]
          });
        });

        // Lorsque le délai du collecteur est terminé, désactive tous les boutons.
        collector.on('end', async () => {
          row.components.forEach(b => b.setDisabled(true));
          await reply.edit({ components: [row] });
        });

        // Log indiquant qu'une ouverture multiple a été effectuée.
        const logEmbed = new EmbedBuilder()
          .setTitle("Ouverture multiple")
          .setDescription(`**${interaction.user.username}** a ouvert **${quantity} ${balle}(s)** sur **${guildName}**.`)
          .setColor("#9b59b6")
          .setTimestamp();

        channel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      // Affiche l'erreur dans la console pour faciliter le débogage
      console.error("Erreur open.js :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription("Une erreur est survenue lors de l'ouverture de vos pokéballs.")
        .setColor('Red')
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: false });
    }
  }
};

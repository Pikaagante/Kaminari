const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { pokemon, dresseur, inventory, point, balls } = require('../main.js');
const path = require('path');
const fonction = require('./fonction/balle.js');

module.exports = {
  name: "open",
  description: "Ouvrir une ou plusieurs pokéballs",
  permission: "Aucune",
  dm: false,
  cooldown: 5,
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
      const balle = args.getString("balls").toUpperCase();
      const quantity = args.getInteger("quantite") || 1;

      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      const userInventory = inventory.data?.[userId] || {};
      const ballInfo = userInventory[balle];

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

      let messages = [];
      let lastResult = null;
      let lastShiny = false;

      for (let i = 0; i < quantity; i++) {
        const Tshiny = Math.floor(Math.random() * 4097);
        const isShiny = Tshiny === 1;

        const resultatp = fonction.ball(balle);
        const name = resultatp.name.toUpperCase();

        const existing = dresseur.data[userId][name];
        if (existing) {
          existing.nbr += 1;
          if (isShiny && !existing.shiny) existing.shiny = true;
        } else {
          dresseur.data[userId][name] = { shiny: isShiny, nbr: 1 };
        }

        point.addData(userId, point.getKey(userId) + balls.getBalls(resultatp.rarity));
        messages.push(`${resultatp.name}${isShiny ? " **SHINY**" : ""} (rareté ${resultatp.rarity})`);

        if (i === quantity - 1) {
          lastResult = resultatp;
          lastShiny = isShiny;
        }
      }

      // Mise à jour de l'inventaire
      ballInfo.nbr -= quantity;
      if (ballInfo.nbr <= 0) delete inventory.data[userId][balle];

      dresseur.saveData();
      point.saveData();
      inventory.saveData();

      const embed = new EmbedBuilder()
        .setTitle(`Ouverture de ${quantity} ${balle}(s)`)
        .setDescription(messages.join("\n"))
        .setColor("#2ecc71")
        .setTimestamp();

      const guildName = interaction.guild.name;
      const guildId = "1043996039297892463";
      const channelId = "1109899933332549723";
      const guild = bot.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get(channelId);

      if (quantity === 1) {
        const name = lastResult.name.toUpperCase();
        const folder = lastShiny ? "assetsGS" : "assetsG";
        const filePath = path.resolve(__dirname, `../Assets/${folder}/${pokemon.getPokemon(name).N}.gif`);
        const file = new AttachmentBuilder(filePath);
        embed.setImage(`attachment://${pokemon.getPokemon(name).N}.gif`);

        await interaction.reply({ embeds: [embed], files: [file] });

        const logEmbed = new EmbedBuilder()
          .setTitle(lastShiny ? "Nouveau Shiny trouvé !" : "Nouveau Pokémon trouvé !")
          .setDescription(`**${interaction.user.username}** a attrapé un **${lastResult.name}**${lastShiny ? " **SHINY**" : ""} de rareté ${lastResult.rarity} sur le serveur **${guildName}**`)
          .setImage(`attachment://${pokemon.getPokemon(name).N}.gif`)
          .setColor(lastShiny ? "#FFD700" : "#3498db")
          .setTimestamp();

        channel.send({ embeds: [logEmbed], files: [file] });

      } else {
        await interaction.reply({ embeds: [embed] });

        const logEmbed = new EmbedBuilder()
          .setTitle("Ouverture multiple")
          .setDescription(`**${interaction.user.username}** a ouvert **${quantity} ${balle}(s)** sur **${guildName}**.\n\n${messages.join("\n")}`)
          .setColor("#9b59b6")
          .setTimestamp();

        channel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
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

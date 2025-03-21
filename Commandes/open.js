const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { pokemon, dresseur, inventory, point, balls } = require('../main.js');
const path = require('path');
const fonction = require('./fonction/balle.js');

module.exports = {
  name: "open",
  description: "Ouvrir une pokéball",
  permission: "Aucune",
  dm: false,
  cooldown: 0,
  options: [
    {
      type: "string",
      name: "balls",
      description: "Pokéball à ouvrir",
      required: true
    }
  ],

  async run(bot, message, args) {
    try {
      const userId = message.user.id;

      if (point.getPoint(userId) <= 0) {
        return message.reply({
          embeds: [new EmbedBuilder()
            .setTitle("Open")
            .setDescription("Vous n'avez pas commencé l'aventure. Faites `/start` pour débuter.")
            .setTimestamp()]
        });
      }

      const balle = args.getString("balls").toUpperCase();
      const userInventory = inventory.getInventory(userId);

      if (!userInventory.includes(balle)) {
        return message.reply({
          embeds: [new EmbedBuilder()
            .setTitle("Erreur d'ouverture")
            .setDescription("Vous ne possédez pas cette pokéball.")
            .setTimestamp()]
        });
      }

      const Tshiny = Math.floor(Math.random() * 4097);
      // const Tshiny = 1;
      const resultatp = fonction.ball(balle);
      const name = resultatp.name.toUpperCase();

      // Retirer la ball de l'inventaire
      const index = userInventory.indexOf(balle);
      userInventory.splice(index, 1);
      inventory.saveData();

      const isShiny = Tshiny === 1;

      // Initialiser le joueur dans dresseur si nécessaire
      if (!dresseur.data[userId]) dresseur.data[userId] = {};

      // Si déjà capturé, on incrémente
      const existing = dresseur.data[userId][name];
      if (existing) {
        existing.nbr += 1;
        if (isShiny && !existing.shiny) {
          existing.shiny = true; // mise à jour shiny si nouvellement capturé
        }
      } else {
        dresseur.data[userId][name] = { shiny: isShiny, nbr: 1 };
      }

      dresseur.saveData();

      // Points
      point.addData(userId, point.getKey(userId) + balls.getBalls(resultatp.rarity));
      point.saveData();

      const folder = isShiny ? "assetsGS" : "assetsG";
      const filePath = path.resolve(__dirname, `../Assets/${folder}/${pokemon.getPokemon(name).N}.gif`);
      const file = new AttachmentBuilder(filePath);

      const embed = new EmbedBuilder()
        .setTitle(`Bravo ! Tu as obtenu un nouveau Pokémon !`)
        .setDescription(`Tu as attrapé un ${resultatp.name}${isShiny ? " **SHINY**" : ""} de rareté ${resultatp.rarity}`)
        .setImage(`attachment://${pokemon.getPokemon(name).N}.gif`)
        .setTimestamp();

      await message.reply({ embeds: [embed], files: [file] });

      // Annonce publique
      const guildName = message.guild.name;
      const guildId = "1043996039297892463";
      const channelId = "1109899933332549723";
      const guild = bot.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get(channelId);

      embed.setTitle(isShiny ? "Nouveau Shiny trouvé !" : "Nouveau Pokémon trouvé !");
      embed.setDescription(`**${message.user.username}** a attrapé un **${resultatp.name}**${isShiny ? " **SHINY**" : ""} de rareté ${resultatp.rarity} sur le serveur **${guildName}**`);

      channel.send({ embeds: [embed], files: [file] });

    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription("Une erreur est survenue lors de l'ouverture de votre pokéball.")
        .setColor('Red')
        .setTimestamp();
      message.reply({ embeds: [errorEmbed] });
    }
  }
};

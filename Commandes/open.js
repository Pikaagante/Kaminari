const Discord = require("discord.js");
const { pokemon } = require('../main.js');
const { dresseur } = require('../main.js');
const { inventory } = require('../main.js');
const { point } = require('../main.js');
const { balls } = require('../main.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fonction = require('./fonction/balle.js');

module.exports = {
  name: "open",
  description: "ouvrir une pokeball",
  permission: "Aucune",
  dm: false,
  cooldown: 10,
  options: [
    {
      type: "string",
      name: "balls",
      description: "ball a acheter",
      required: true
    }
  ],

  async run(bot, message, args) {
    if (point.getPoint(message.user.id) > 0) {

      const balle = args.getString("balls").toUpperCase(); // On récupère la pokeball choisie en majuscule qui permettra un choix dans la fonction ball

      if (inventory.getInventory(message.user.id).includes(balle) == true) {

        const Tshiny = Math.floor(Math.random() * 4097); // On récupère un nombre aléatoire entre 0 et 1
        const resultatp = fonction.ball(balle); // On récupère le pokemon de la fonction ball en fonction du choix fait
        const index = inventory.getInventory(message.user.id).indexOf(balle); // On récupère l'index de la pokeball dans l'inventaire
        const name = resultatp.name.toUpperCase(); // On récupère le nom du pokemon en majuscule
        inventory.getInventory(message.user.id).splice(index, 1); // On supprime la pokeball de l'inventaire
        inventory.saveData(); // On sauvegarde l'inventaire

        if (Tshiny == 1) { // Si le nombre aléatoire est égal à 1

          const Nshiny = name + " (SHINY)"; // On ajoute un S à la fin du nom du pokemon
          dresseur.addToList(message.user.id, Nshiny); // On ajoute le pokemon dans la liste du dresseur en majuscule
          dresseur.saveData(); // On sauvegarde la liste du dresseur 
          point.addData(message.user.id, point.getKey(message.user.id) + balls.getBalls(resultatp.rarity)); // On ajoute un point au dresseur
          point.saveData(); // On importe les fonctions d'embed

          const { AttachmentBuilder, EmbedBuilder } = require('discord.js'); // On importe les fonctions d'embed
          const file = new AttachmentBuilder(`./Assets/assetsGS/${pokemon.getPokemon(name).N}.gif`); // On importe l'image du pokemon

          const exampleEmbed = new EmbedBuilder()
            .setTitle(`Bravo tu as obtenu un nouveau pokémon !`)
            .setDescription("Vous avez attrapé un " + resultatp.name + " **SHINY** de rareté " + resultatp.rarity) // On affiche le nom du pokemon et sa rareté
            .setImage(`attachment://${pokemon.getPokemon(name).N}.gif`)
            .setTimestamp(Date.now());
          message.reply({ embeds: [exampleEmbed], files: [file] }); // On envoie l'embed avec l'image du pokemon

          // Envoi du message dans le salon spécifique
          const guildName = message.guild.name;
          const guildId = "1043996039297892463"; // ID du serveur
          const channelId = "1109899933332549723"; // ID du salon
          const guild = bot.guilds.cache.get(guildId);
          const channel = guild.channels.cache.get(channelId);
          exampleEmbed.setTitle(`Nouveau Shiny trouvé !`);
          exampleEmbed.setDescription("**" + message.user.username + "** a attrape un **" + resultatp.name + "** **SHINY** de rareté " + resultatp.rarity + " sur le serveur **" + guildName + "**");
          channel.send({ embeds: [exampleEmbed], files: [file] });

        } else {

          dresseur.addToList(message.user.id, resultatp.name.toUpperCase()); // On ajoute le pokemon dans la liste du dresseur en majuscule
          dresseur.saveData(); // On sauvegarde la liste du dresseur 
          point.addData(message.user.id, point.getKey(message.user.id) + balls.getBalls(resultatp.rarity)); // On ajoute un point au dresseur
          point.saveData(); // On importe les fonctions d'embed
          console.log(name);
          const { AttachmentBuilder, EmbedBuilder } = require('discord.js'); // On importe les fonctions d'embed
          const file = new AttachmentBuilder(`./Assets/assetsG/${pokemon.getPokemon(name).N}.gif`); // On importe l'image du pokemon

          const exampleEmbed = new EmbedBuilder()
            .setTitle(`Bravo tu as obtenu un nouveau pokémon !`)
            .setDescription("Vous avez attrapé un " + resultatp.name + " de rareté " + resultatp.rarity) // On affiche le nom du pokemon et sa rareté
            .setImage(`attachment://${pokemon.getPokemon(name).N}.gif`)
            .setTimestamp(Date.now());
          message.reply({ embeds: [exampleEmbed], files: [file] }); // On envoie l'embed avec l'image du pokemon

          // Envoi du message dans le salon spécifique
          const guildName = message.guild.name;
          const guildId = "1043996039297892463"; // ID du serveur
          const channelId = "1109899933332549723"; // ID du salon
          const guild = bot.guilds.cache.get(guildId);
          const channel = guild.channels.cache.get(channelId);
          exampleEmbed.setTitle(`Nouveau Pokemon trouvé !`);
          exampleEmbed.setDescription("**" + message.user.username + "** a attrape un **" + resultatp.name + "** de rareté " + resultatp.rarity + " sur le serveur **" + guildName + "**");
          channel.send({ embeds: [exampleEmbed], files: [file] });

        }
      } else {

        const exampleEmbed = new EmbedBuilder()
          .setTitle(`Erreur d'ouverture`)
          .setDescription(`Vous ne possédez pas cette pokeball`)
          .setTimestamp(Date.now());
        message.reply({ embeds: [exampleEmbed] });

      }
    } else {

      const exampleEmbed = new EmbedBuilder()
        .setTitle(`Open`)
        .setDescription(`Vous n'avez pas commencé l'aventure faite /start pour commencer`)
        .setTimestamp(Date.now());
      message.reply({ embeds: [exampleEmbed] });

    }
  }
};

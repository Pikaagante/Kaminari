const Discord = require("discord.js")
const {pokemon} = require('../main.js')
const {point} = require('../main.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs')
const path = require('path')

module.exports = {
    name: "info",
    description: "voir un pokemon",
    permission: "Aucune",
    dm: false,
    cooldown: 10,
    options: [
        {
            type: "string",
            name: "nom_poke",
            description: "Le nom du pokemon que vous voulez voir",
            required: true
        }
    ],

    async run(bot, message, args) {
        try {
         // On vérifie que le pokemon existe
         const Npoke = args.getString("nom_poke").toUpperCase();
         const firstLetter = Npoke.charAt(0);
         const restOfString = Npoke.slice(1).toLowerCase();
         const Npokee = firstLetter + restOfString;


    if(pokemon.getPokemon(Npoke).Name == Npokee) {                             // On récupère le nom du pokemon
        const { AttachmentBuilder, EmbedBuilder } = require('discord.js');                  // On importe les fonctions d'embed
        const file = new AttachmentBuilder(`../Assets/assetsP/${pokemon.getPokemon(Npoke).N}.png`);  // On importe l'image du pokemon

        const exampleEmbed = new EmbedBuilder()
        .setColor(`${pokemon.getPokemon(Npoke).color}`)
	    .setTitle(`#${pokemon.getPokemon(Npoke).N} ${pokemon.getPokemon(Npoke).Name} | ${pokemon.getPokemon(Npoke).English_name}`)
        .setDescription(`-Pokémon ${pokemon.getPokemon(Npoke).Category}`)
        .setThumbnail(`attachment://${pokemon.getPokemon(Npoke).N}.png`)
        .addFields([
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Type',
                value: `${pokemon.getPokemon(Npoke).Type}`,     //on recupere le type du pokemon dans le fichier pokemon.json
                inline: true,
            },
            {
                name: 'Talent',
                value: `${pokemon.getPokemon(Npoke).Talent}`,   //on recupere le talent du pokemon dans le fichier pokemon.json
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Poids',
                value: `${pokemon.getPokemon(Npoke).Weight}`,
                inline: true,
            },
            {
                name: 'Taille',
                value: `${pokemon.getPokemon(Npoke).Size}`,
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Groupe oeuf',
                value: `${pokemon.getPokemon(Npoke).Groupe}`,
                inline: true,
            },
            {
                name: 'Evolution',
                value: `${pokemon.getPokemon(Npoke).Evolution}`,
                inline: true,
            }
        ])
        .setTimestamp(Date.now())

        message.reply({ embeds: [exampleEmbed], files: [file] })
    } else {
        message.reply("Ce pokemon n'existe pas ! (Pour le moment seul les 200 pokemon sont présents dans le pokedex")
    }

    } catch (error) {
        console.error("Une erreur s'est produite lors de l'exécution de la commande :", error);
        const errorEmbed = new EmbedBuilder()
          .setTitle('Erreur')
          .setDescription('Une erreur est survenue lors de l\'ouverture de votre pokéball.')
          .setColor('Red')
          .setTimestamp();
        message.reply({ embeds: [errorEmbed] });
      }
    }
}
const Discord = require("discord.js")
const { dresseur } = require('../main.js')
const { argent } = require('../main.js')
const { pokemon } = require('../main.js')
const { point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs')
const path = require('path')
const fonction = require('./fonction/balle.js');

module.exports = {

    name: "vendre",
    description: "vendre un pokemon",
    permission: "Aucune",
    dm: false,
    cooldown: 10,
    options: [
        {
            type: "string",
            name: "pok",
            description: "Le nom du pokemon a vendre",
            required: true
        }
    ],

    async run(bot, message, args) {
        try {
            if (point.getPoint(message.user.id) > 0) {
                message.reply("Cette commande est en maintenance")
                // const poke = args.getString("pok");  // On récupère le nom du pokemon qui servira a etre afficher dans le message
                // const pokeU = poke.toUpperCase();    // On met le nom du pokemon en majuscule pour le comparer avec le nom du pokemon dans le fichier pokemon.json 
                // // const idDresseur = message.user.id.toString(); 
                // const index = dresseur.getDresseur(message.user.id).indexOf(pokeU);  // On récupère l'index du pokemon dans la liste du dresseur
                // const exampleEmbed = new EmbedBuilder()
                // .setColor(`#00FF00 `)
                // .setTitle(`Vente`)
                // .setDescription(`Pokemon`)

                // if (dresseur.getDresseur(message.user.id).includes(pokeU)) {

                //         const pokemonPrice = pokemon.getPokemon(pokeU).price; // On récupère le prix du pokemon dans le fichier pokemon.json 
                //         argent.addData(message.user.id, argent.getKey(message.user.id)+pokemonPrice); // On ajoute le prix du pokemon au porte monnaie du dresseur
                //         argent.saveData();
                //         dresseur.getDresseur(message.user.id).splice(index,1); // On supprime le pokemon de la liste du dresseur
                //         dresseur.saveData();
                //         console.log(`Le Pokémon ${pokeU} a été vendu pour ${pokemonPrice} P$`); // On affiche dans la console que le pokemon a été vendu

                // } else {
                //         console.log(`Le dresseur n'a pas le Pokémon ${poke} dans sa liste.`);
                // }
            } else {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(`#FF0000 `)
                    .setTitle(`Vendre`)
                    .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
                message.reply({ embeds: [exampleEmbed] })
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
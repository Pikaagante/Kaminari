const Discord = require("discord.js");
const { point } = require('../main.js');
const { dresseur } = require('../main.js');
const { inventory } = require("../main.js");
const { argent } = require("../main.js");
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


module.exports = {

    name: "start",
    description: "Débuter votre aventure",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(bot, message, args) {
        try {
            if (point.getPoint(message.user.id) > 0) {
                message.reply("Vous avez déjà commencé votre aventure !")
            } else {
                let ball = "CARNIVOBALL"

                point.addData(message.user.id, point.getKey(message.user.id) + 1)
                point.saveData();
                inventory.addToList(message.user.id, ball)
                inventory.saveData();
                argent.addData(message.user.id, argent.getKey(message.user.id) + 600)
                argent.saveData();

                const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

                const filePath = path.join(__dirname, '..', 'Assets', 'R.png');
                const file = new AttachmentBuilder(filePath);

                const exampleEmbed = new EmbedBuilder()

                    .setColor(`#FFFFFF`)
                    .setTitle(`Team Rocket`)
                    .setDescription(`**Bienvenue a toi** \n\n Je suppose que tu es ici pour acheter nous avons un large choix de pokeball. (Tu pourras commencer par la carnivoball ou la veggieball) \n\n Malheuresement en tant que nouveau client nous ne te laisserons pas beaucoup de choix. \n\n Si tu deviens un de nos clients fidèles tu auras accès a de nouvelle zone et donc de nouveau pokemon. \n\n Comme je suis un être généreux je t'offre ce magnifique Rattata, une ball et 10P$ ne me remercie pas \n\n Un guide du parfait ~~pigeon~~ client est disponible a l'accueil ou avec le **/help** et **/tuto**. \n\n Amuse toi bien et surtout n'oublie pas acheter c'est acheter nous ne remboursons pas.`)
                    .setImage(`attachment://Giovanni.png`)
                    .setThumbnail(`attachment://R.png`)
                message.reply({ embeds: [exampleEmbed], files: [file] })
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
};

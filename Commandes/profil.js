const Discord = require("discord.js")
const { argent } = require('../main.js')
const { pokemon } = require('../main.js')
const { point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "profil",
    description: "voir son argent et ses points",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(bot, message, args) {
        try {
            if (point.getPoint(message.user.id) > 0) {

                const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

                const exampleEmbed = new EmbedBuilder()
                    .setTitle(`Profil`)
                    .setDescription(`Argents : ${argent.getArgent(message.user.id)}$\n points : ${point.getPoint(message.user.id)}`)
                    .setTimestamp(Date.now());

                message.reply({ embeds: [exampleEmbed] })

            } else {

                const exampleEmbed = new EmbedBuilder()
                    .setColor(`#FF0000 `)
                    .setTitle(`Profil`)
                    .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
                    .setTimestamp(Date.now());
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
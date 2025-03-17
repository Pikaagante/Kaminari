const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');


module.exports = {

    name: "help",
    description: "Toute les commandes",
    permission: "Aucune",
    dm: false,
    cooldown: 10,

    async run(bot, message, args) {
        try {
            const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
            const exampleEmbed = new EmbedBuilder()    //ba cest une commande embed ya pas de code ducon
                .setTitle(`Toutes les commandes`)
                .setDescription("/profil : ```permet de voir son argent et ses points```\n /daily ```permet de gagner chaque jour 1000P$```\n /buy <ball> : ```permet d'acheter une ball``` \n /help : ```permet de voir les commandes``` \n /inventory : ```permet de voir ses pokeballs non utilisée``` \n /job : ```permet de gagner de l'argent toute les 15 minutes``` \n /loterie : ```permet de jouer a la loterie``` \n /natsumi : ```permet de voir les liens de l'artiste Natsumi``` \n /open <ball> : ```permet d'ouvrir une pokeball contenue dans l'inventaire``` \n /pc : ```permet de voir tout ses pokemons``` \n /pokedex <pokemon> : ```permet d'avoir toute les infos sur un pokemon``` \n /shop <ball> : ```permet de voir le contenue d'une pokeball et son prix``` \n /start : ```permet de commencer l'aventure``` \n /tuto : ```permet de voir le tuto``` \n /vendre <pokemon> : ```permet de vendre un de ses pokemons```")
                .setTimestamp(Date.now())
            message.reply({ embeds: [exampleEmbed] })
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
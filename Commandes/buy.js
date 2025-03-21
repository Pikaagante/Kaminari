const { EmbedBuilder } = require("discord.js");
const { inventory, balls, argent, point } = require("../main.js");

module.exports = {
    name: "buy",
    description: "acheter une ball",
    permission: "Aucune",
    dm: false,
    cooldown: 5,
    options: [
        {
            type: "string",
            name: "balls",
            description: "la ball à acheter",
            required: true
        },
        {
            type: "integer",
            name: "quantite",
            description: "quantité à acheter",
            required: true
        }
    ],

    async run(bot, message, args) {
        try {
            const userId = message.user.id;
            const balle = args.getString("balls").toUpperCase();
            const ballee = balle.charAt(0) + balle.slice(1).toLowerCase();
            const quantity = args.getInteger("quantite");

            const embed = new EmbedBuilder()
                .setTitle("Achat")
                .setColor("#3498db")
                .setTimestamp(Date.now());

            if (point.getPoint(userId) <= 0) {
                embed.setDescription("Vous n'avez pas commencé l'aventure. Faites `/start` pour commencer.");
                return message.reply({ embeds: [embed] });
            }

            const ballData = balls.getBalls(balle);
            if (typeof ballData !== 'object') {
                embed.setDescription("Cette Pokéball n'existe pas.");
                return message.reply({ embeds: [embed] });
            }

            if (!ballData) {
                embed.setDescription("Cette Pokéball n'existe pas.");
                return message.reply({ embeds: [embed] });
              }              

            if (point.getPoint(userId) < ballData.MinPoint) {
                const manque = ballData.MinPoint - point.getPoint(userId);
                embed.setDescription(`Vous n'avez pas débloqué la ${ballee}. Il vous manque ${manque} points.`);
                return message.reply({ embeds: [embed] });
            }

            const totalPrice = ballData.price * quantity;
            if (argent.getArgent(userId) < totalPrice) {
                embed.setDescription(`Vous n'avez pas assez d'argent. Prix total : ${totalPrice}P$`);
                return message.reply({ embeds: [embed] });
            }

            // Déduire l'argent
            argent.addData(userId, argent.getKey(userId) - totalPrice);
            argent.saveData();

            // Ajouter à l'inventaire
            if (!inventory.data[userId]) inventory.data[userId] = {};
            if (!inventory.data[userId][balle]) {
                inventory.data[userId][balle] = { nbr: 0 };
            }
            inventory.data[userId][balle].nbr += quantity;
            inventory.saveData();

            embed.setDescription(`Vous avez acheté ${quantity} ${ballee}(s) pour ${totalPrice}P$.\n Il vous reste ${argent.getArgent(userId)}P$`);
            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Erreur dans la commande buy :", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Erreur")
                .setDescription("Une erreur est survenue pendant l'achat.")
                .setColor("Red")
                .setTimestamp();
            message.reply({ embeds: [errorEmbed] });
        }
    }
};

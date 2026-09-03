const { EmbedBuilder } = require("discord.js");
const { inventory, balls, argent, point } = require("../main.js");

module.exports = {
  name: "buy",
  description: "Acheter une Pokéball",
  permission: "Aucune",
  dm: false,
  cooldown: 5,
  options: [
    {
      type: "string",
      name: "balls",
      description: "La Pokéball à acheter",
      required: true
    },
    {
      type: "integer",
      name: "quantite",
      description: "Quantité à acheter",
      required: true
    }
  ],

  async run(bot, interaction, args) {
    try {
      const userId = interaction.user.id;

      // Vérifie que le joueur a bien commencé l'aventure avec /start
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Achat impossible")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Récupère le nom de la ball et le met en majuscules
      const balle = args.getString("balls").toUpperCase();
      // Version du nom utilisée uniquement pour afficher le nom
      const ballee = balle.charAt(0) + balle.slice(1).toLowerCase();
      const quantity = args.getInteger("quantite");

      // Empêche l'utilisateur d'acheter 0 ball ou une quantité négative.
      if (quantity <= 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Achat impossible")
              .setDescription("La quantité doit être au moins de 1.")
              .setTimestamp()
          ]
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("Achat")
        .setColor("#3498db")
        .setTimestamp();

      // Récupère les informations de la ball demandée
      const ballData = balls.getBalls(balle);

      // Vérification stricte de l'existence de la ball et de son prix
      if (!ballData || typeof ballData.price !== "number") {
        embed.setColor("#FF0000").setDescription("Cette Pokéball n'existe pas.");
        return interaction.reply({ embeds: [embed] });
      }

      // Vérifie si l'utilisateur a assez de points pour débloquer cette ball
      if (point.getPoint(userId) < ballData.MinPoint) {
        const manque = ballData.MinPoint - point.getPoint(userId);
        embed.setDescription(`Vous n'avez pas débloqué la ${ballee}. Il vous manque ${manque} points.`);
        return interaction.reply({ embeds: [embed] });
      }

      const userArgent = argent.getArgent(userId) || 0;
      const totalPrice = ballData.price * quantity;

      // Vérifie que le joueur possède assez d'argent
      if (userArgent < totalPrice) {
        const manqueArgent = totalPrice - userArgent;
        embed.setDescription(`Vous n'avez pas assez d'argent. Prix total : ${totalPrice}P$.\n Il vous manque **${manqueArgent}P$**.`);
        return interaction.reply({ embeds: [embed] });
      }

      // Déduire l'argent
      argent.addData(userId, userArgent - totalPrice);
      argent.saveData();

      // Ajouter les balls dans l'inventaire
      if (!inventory.data[userId]) inventory.data[userId] = {};
      if (!inventory.data[userId][balle]) {
        inventory.data[userId][balle] = { nbr: 0 };
      }
      inventory.data[userId][balle].nbr += quantity;
      inventory.saveData();

      embed.setDescription(`Vous avez acheté ${quantity} ${ballee}(s) pour ${totalPrice}P$.\nIl vous reste **${argent.getArgent(userId)}P$**`);
      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande buy :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue pendant l'achat.")
        .setColor("Red")
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }
  }
};

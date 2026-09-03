const { dresseur, argent, point } = require('../main.js');
const { EmbedBuilder } = require('discord.js');

const PRIX_RARETE = {
  "Commun": 250,
  "Peu Commun": 350,
  "Rare": 800,
  "Epic": 2000
};

module.exports = {
  name: "vendre",
  description: "Vendre vos doublons de Pokémon (tous ou par rareté)",
  permission: "Aucune",
  dm: false,
  cooldown: 10,
  options: [
    {
      type: "string",
      name: "rarete",
      description: "Rareté à vendre (Commun, Peu Commun, Rare, Epic)",
      required: false,
      choices: [
        { name: "Commun", value: "Commun" },
        { name: "Peu Commun", value: "Peu Commun" },
        { name: "Rare", value: "Rare" },
        { name: "Epic", value: "Epic" }
      ]
    }
  ],

  async run(bot, interaction, args) {
    try {
      const userId = interaction.user.id;
      const rareteChoisie = args.getString("rarete") || "all";

      // Vérif si le joueur a commencé l'aventure
      if (!point.data[userId] || point.getPoint(userId) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Aventure non commencée")
          .setDescription("Vous n'avez pas encore commencé l'aventure. Faites `/start` pour commencer.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }

      // Récupère tous les Pokémon présents dans le Pokédex du joueur.
      const inventaire = dresseur.getDresseur(userId);
      if (inventaire === 'Ce Dresseur nexiste pas' || Object.keys(inventaire).length === 0) {
        return interaction.reply("Vous n'avez aucun Pokémon à vendre.");
      }

      let totalVendus = 0;
      let totalArgent = 0;
      let details = [];

      // Parcourt tous les Pokémon présents dans l'inventaire.
      for (const [nom, info] of Object.entries(inventaire)) {
        // Un Pokémon n'est considéré comme doublon que si le joueur en a minimum 2
        if (info.nbr > 1) {
          const rarete = info.rarity || "Commun";
          // Si une rareté précise a été sélectionnée on ignore le reste
          if (rareteChoisie !== "all" && rarete !== rareteChoisie) continue;

          // Le premier exemplaire est conservé dans le Pokédex le reste est vendu
          const doublons = info.nbr - 1;
          // Calcule l'argent obtenu pour ces doublons.
          const gain = (PRIX_RARETE[rarete] || 250) * doublons;

          totalVendus += doublons;
          totalArgent += gain;
          info.nbr = 1;

          // Ajoute les informations de cette vente au résumé final.
          details.push(`${nom} ×${doublons} → +${gain}P$ (${rarete})`);
        }
      }

      // Si aucun doublon n'a été trouvé, aucune donnée n'est sauvegardée.
      if (totalVendus === 0) {
        if (rareteChoisie === "all") {
          return interaction.reply("Vous n'avez aucun doublon à vendre !");
        } else {
          return interaction.reply(`Aucun doublon trouvé pour la rareté **${rareteChoisie}**.`);
        }
      }

      // Mise à jour argent
      const argentActuel = argent.getArgent(userId) || 0;
      argent.data[userId] = argentActuel + totalArgent;

      dresseur.saveData();
      argent.saveData();

      // Le titre change selon que le joueur a vendu tous ses doublons ou uniquement ceux d'une certaine rareté
      const titre = rareteChoisie === "all"
        ? "Vente de tous les doublons"
        : `Vente des doublons (${rareteChoisie})`;

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle(titre)
        .setDescription(`Vous avez vendu **${totalVendus} Pokémon** pour un total de **${totalArgent}P$** !`)
        .addFields({ name: "Détails", value: details.join("\n").slice(0, 1000) })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur dans la commande /vendre :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription("Une erreur est survenue lors de la vente.")
        .setColor('Red')
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { point, argent, inventory, dresseur } = require("../main.js");
const path = require("path");

module.exports = {
  name: "start",
  description: "Débuter votre aventure",
  permission: "Aucune",
  dm: false,
  cooldown: 5,

  async run(bot, interaction) {
    try {
      const userId = interaction.user.id;

      if (point.getPoint(userId) > 0) {
        return interaction.reply({
          content: "Vous avez déjà commencé votre aventure !",
          ephemeral: true
        });
      }

      // ✅ Ajouter 1 point
      point.addData(userId, 1);
      point.saveData();

      // ✅ Ajouter 600P$
      argent.addData(userId, 600);
      argent.saveData();

      // ✅ Offrir 1 Carnivoball
      if (!inventory.data[userId]) inventory.data[userId] = {};
      if (!inventory.data[userId]["CARNIVOBALL"]) inventory.data[userId]["CARNIVOBALL"] = { nbr: 0 };
      inventory.data[userId]["CARNIVOBALL"].nbr += 1;
      inventory.saveData();

      // ✅ Offrir Rattata
      if (!dresseur.data[userId]) dresseur.data[userId] = {};
      dresseur.data[userId]["RATTATA"] = { shiny: false, nbr: 1 };
      dresseur.saveData();

      // ✅ Embed RP d'accueil
      const filePath = path.join(__dirname, '..', 'Assets', 'R.png');
      const file = new AttachmentBuilder(filePath);

      const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle("Team Rocket")
        .setDescription(
          "**Bienvenue à toi**\n\n" +
          "Je suppose que tu es ici pour acheter ? Nous avons un large choix de pokéballs.\n" +
          "Tu pourras commencer par la **Carnivoball** ou la **Veggieball**.\n\n" +
          "En tant que nouveau client, nous ne te laissons pas beaucoup de choix...\n" +
          "Mais si tu deviens un de nos clients fidèles, tu accéderas à de nouvelles zones et à de nouveaux Pokémon.\n\n" +
          "Comme je suis généreux, je t’offre ce magnifique **Rattata**, une **Carnivoball** et **600P$**.\n" +
          "Ne me remercie pas.\n\n" +
          "Un guide du parfait ~~pigeon~~ client est disponible à l’accueil ou avec `/help` et `/tuto`.\n\n" +
          "**Amuse-toi bien, et surtout... n’oublie pas : acheter c’est acheter. Nous ne remboursons pas.**"
        )
        .setThumbnail("attachment://R.png")
        .setImage("attachment://Giovanni.png")
        .setTimestamp();

      await interaction.reply({ embeds: [embed], files: [file] });

    } catch (error) {
      console.error("Erreur dans /start :", error);
      const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription("Une erreur est survenue lors du lancement de l'aventure.")
        .setColor("Red")
        .setTimestamp();
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

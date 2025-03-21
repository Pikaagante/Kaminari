const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "beta",
  description: "Information sur la bêta du bot",
  permission: "Aucune",
  dm: false,

  async run(bot, interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Beta")
      .setDescription(
        `Bonjour et merci d'utiliser mon bot Discord !\n\n` +
        `Le bot est actuellement en bêta. Je vous invite à rejoindre le serveur Discord pour me faire part de vos **idées**, de vos **bugs** ou **changements potentiels** !\n\n` +
        `Vous pouvez aussi m'envoyer un message privé sur Discord : **Pika#0801**\n\n` +
        `Je m'excuse par avance pour les bugs ou crashs éventuels ainsi que pour les fonctionnalités encore manquantes comme le **Pokédex**.`
      )
      .addFields({
        name: "📌 Lien du serveur Discord",
        value: "https://discord.gg/c76WU76GxT",
        inline: false
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

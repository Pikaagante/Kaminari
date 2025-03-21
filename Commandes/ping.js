const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Affiche ton ping",
  permission: "Aucune",
  dm: false,
  cooldown: 10,

  async run(bot, interaction, args) {
    try {
      const ping = bot.ws.ping;
      const embed = new EmbedBuilder()
        .setTitle("Pong !")
        .setDescription(`Latence WebSocket : \`${ping}ms\``)
        .setColor("#00b0f4")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur dans la commande ping :", error);
      await interaction.reply({
        content: "Une erreur est survenue en récupérant le ping.",
        ephemeral: true
      });
    }
  }
};

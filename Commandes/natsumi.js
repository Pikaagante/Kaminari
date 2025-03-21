const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "natsumi",
    description: "Information sur la talentueuse Natsumi",
    permission: "Aucune",
    dm: false,
    cooldown: 5,

    async run(bot, interaction) {
        try {
            const file = new AttachmentBuilder(`assets/Pika_LogoBot.png`);

            const embed = new EmbedBuilder()
                .setColor(`#FFA500`)
                .setTitle(`Natsumi`)
                .setDescription(`Un ENORME merci à Natsumi pour m'avoir fait la photo de profil du bot !\nJe le trouve juste insane, c'est pourquoi une commande lui est dédiée. Vous pouvez retrouver tout son travail sur les différents liens ci-dessous.`)
                .setImage(`attachment://Pika_LogoBot.png`)
                .addFields(
                    { name: '\u200b', value: '\u200b', inline: false },
                    { name: 'Liens :', value: `https://natskei.carrd.co/`, inline: true },
                    { name: 'Discord :', value: `✘ ⲛⲇⲧ⳽ⳙⲙⲓ ✘#4007`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], files: [file] });
        } catch (error) {
            console.error("Une erreur s'est produite lors de la commande natsumi :", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Erreur')
                .setDescription("Une erreur est survenue lors de l'exécution de la commande.")
                .setColor('Red')
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};

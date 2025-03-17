const Discord = require("discord.js")
const cooldowns = new Discord.Collection();

module.exports = async (bot, interaction) => {
    if (interaction.type !== Discord.InteractionType.ApplicationCommand) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    if (command.cooldown) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const minutesLeft = timeLeft / 60;
                return interaction.reply({
                    content: `Il reste ${minutesLeft.toFixed(1)} minute(s) soit ${minutesLeft.toFixed(1)/60} heures avant de réutiliser \`${command.name}\`.`,
                    ephemeral: true
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    try {
        await command.run(bot, interaction, interaction.options);
    } catch (err) {
        console.error(err);
        interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
    }
}

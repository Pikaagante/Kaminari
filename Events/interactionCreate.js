const Discord = require("discord.js")
const cooldowns = new Discord.Collection();

module.exports = async (bot, interaction) => {

const commandName = interaction.commandName;
const command = bot.commands.get(commandName);

if (command && command.cooldown) {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = command.cooldown * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000; // Temps restant en secondes
            const minutesLeft = timeLeft / 60; // Temps restant en minutes
            return interaction.reply(`Veuillez attendre ${minutesLeft.toFixed(1)} minute(s) avant de réutiliser cette commande.`);
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
}

if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    let command = require(`../Commandes/${interaction.commandName}`);
    command.run(bot, interaction, interaction.options);
}

}
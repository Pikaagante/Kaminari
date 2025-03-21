const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")
const path = require("path")

module.exports = async bot => {
    let commands = [];

    bot.commands.forEach(async command => {
        let slashcommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                const option = command.options[i];
                const optionName = option.name;
                const optionDescription = option.description;
                const isRequired = option.required;
                const choices = option.choices || [];

                if (option.type === "string") {
                    slashcommand.addStringOption(opt => {
                        let o = opt.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired);
        
                        if (choices.length > 0) {
                            choices.forEach(choice => {
                                o.addChoices({ name: choice.name, value: choice.value });
                            });
                        }
        
                        return o;
                    });
                } else if (option.type === "integer") {
                    slashcommand.addIntegerOption(option =>
                        option.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired)
                    );
                } else if (option.type === "boolean") {
                    slashcommand.addBooleanOption(option =>
                        option.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired)
                    );
                } else if (option.type === "user") {
                    slashcommand.addUserOption(option =>
                        option.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired)
                    );
                } else if (option.type === "channel") {
                    slashcommand.addChannelOption(option =>
                        option.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired)
                    );
                } else if (option.type === "role") {
                    slashcommand.addRoleOption(option =>
                        option.setName(optionName)
                            .setDescription(optionDescription)
                            .setRequired(isRequired)
                    );
                }
            }
        }

        await commands.push(slashcommand.toJSON());
    });

    const rest = new REST({ version: "10" }).setToken(bot.token);

    try {
        await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
        console.log("Les commandes slash sont créées avec succès");
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des commandes : ", error);
    }
};

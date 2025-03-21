const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { pokemon, dresseur } = require('../main.js');

module.exports = {
    name: "pokedex",
    description: "Affiche votre Pokédex avec filtres.",
    permission: "Aucune",
    dm: false,
    options: [
        {
            type: "string",
            name: "filter",
            description: "Filtrer selon votre progression",
            required: false,
            choices: [
                { name: "Tous", value: "all" },
                { name: "Seulement débloqués", value: "unlock" },
                { name: "Seulement verrouillés", value: "lock" }
            ]
        },
        {
            type: "string",
            name: "ball",
            description: "Filtrer par Pokéball",
            required: false
        },
        {
            type: "boolean",
            name: "shiny",
            description: "Voir uniquement les Pokémon shiny",
            required: false
        }
    ],

    async run(bot, interaction) {
        const userId = interaction.user.id;
        const filter = interaction.options.getString("filter") || "all";
        const ballFilter = interaction.options.getString("ball")?.toUpperCase();
        const shinyOnly = interaction.options.getBoolean("shiny");

        const allPokemon = Object.values(pokemon.data);
        const userData = dresseur.data?.[userId] || {};

        let pokedex = [];

        // Stockage des Pokémon uniques pour éviter les doublons
        const seenPokemon = new Set();

        for (const p of allPokemon) {
            const nameKey = p.Name.toUpperCase();
            const userEntry = userData[nameKey];

            // Vérifier si le Pokémon appartient bien à l'utilisateur
            if (!userEntry && filter === "unlock") {
                continue;
            }
            if (userEntry && filter === "lock") {
                continue;
            }            

            // Vérifier si le Pokémon est shiny si filtrage activé
            if (shinyOnly && (!userEntry || !userEntry.shiny)) {
                continue;
            }

            // Vérifier si le Pokémon est dans la Pokéball sélectionnée
            if (ballFilter && (!p.balls || !p.balls.includes(ballFilter))) {
                continue;
            }

            // Vérifier si le Pokémon a déjà été affiché (évite les doublons)
            if (seenPokemon.has(nameKey)) {
                continue;
            }
            seenPokemon.add(nameKey);

            const pokedexEntry = {
                name: p.Name,
                id: p.N,
                type: p.Type || "Inconnu",
                color: p.color || "#FFFFFF",
                ballList: p.balls || [],
                isUnlocked: !!userEntry,
                isShiny: userEntry?.shiny === true,
                quantity: userEntry?.nbr || 1
            };

            pokedex.push(pokedexEntry);
        }

        // Appliquer les autres filtres
        if (filter === "unlock") pokedex = pokedex.filter(p => p.isUnlocked);
        if (filter === "lock") pokedex = pokedex.filter(p => !p.isUnlocked);

        if (pokedex.length === 0) {
            return interaction.reply({ content: "❌ Aucun Pokémon trouvé avec ces filtres.", ephemeral: true });
        }

        // Pagination
        const itemsPerPage = 10;
        let currentPage = 0;
        const totalPages = Math.ceil(pokedex.length / itemsPerPage);

        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const list = pokedex.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle("📘 Pokédex")
                .setColor("#00BFFF")
                .setFooter({ text: `Page ${page + 1} / ${totalPages}` });

            list.forEach(p => {
                const emoji = p.isUnlocked ? "✅" : "❌";
                const shiny = p.isShiny ? "✨ " : "";
                const count = p.quantity > 1 ? ` x${p.quantity}` : "";
                embed.addFields({
                    name: `${emoji} ${shiny}${p.name} (#${p.id})${count}`,
                    value: `Type : ${p.type}\nBalls : ${p.ballList.join(", ") || "Aucune"}`,
                    inline: true
                });
            });

            return embed;
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("prevPage")
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("nextPage")
                .setLabel("➡️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(totalPages <= 1)
        );

        const msg = await interaction.reply({
            embeds: [generateEmbed(currentPage)],
            components: [row],
            fetchReply: true
        });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on("collect", async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: "❌ Ce menu ne vous appartient pas.", ephemeral: true });
            }

            if (i.customId === "prevPage") currentPage = Math.max(0, currentPage - 1);
            if (i.customId === "nextPage") currentPage = Math.min(totalPages - 1, currentPage + 1);

            const newRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("prevPage")
                    .setLabel("⬅️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId("nextPage")
                    .setLabel("➡️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [newRow]
            });
        });

        collector.on("end", async () => {
            try {
                await interaction.editReply({ components: [] });
            } catch (e) {
                console.log("Interaction expirée.");
            }
        });
    }
};

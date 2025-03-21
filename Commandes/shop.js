const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { point, balls } = require('../main.js');

module.exports = {
    name: "shop",
    description: "Voir les balls disponibles",
    permission: "Aucune",
    dm: false,
    cooldown: 10,
    options: [
        {
            type: "string",
            name: "balls1",
            description: "Les balls à voir (groupe 1)",
            required: false,
            choices: [
                { name: "CarnivoBall", value: "carnivoball" },
                { name: "VeggieBall", value: "veggieball" },
                { name: "SnackBall", value: "snackball" },
                { name: "CutieBall", value: "cutieball" },
                { name: "RepulsBall", value: "repulsball" },
                { name: "SafariBall", value: "safariball" },
                { name: "AmazonieBall", value: "amazonieball" },
                { name: "AridBall", value: "aridball" },
                { name: "SerreBall", value: "serreball" },
                { name: "AgricoBall", value: "agricoball" },
                { name: "PiafBall", value: "piafball" },
                { name: "GeoBall", value: "geoball" },
                { name: "BubbleBall", value: "bubbleball" },
                { name: "SeaBall", value: "seaball" },
                { name: "MossBall", value: "mossball" },
                { name: "BoomBall", value: "boomball" },
                { name: "UsineBall", value: "usineball" },
                { name: "RobotBall", value: "robotball" },
                { name: "HorrorBall", value: "horrorball" },
                { name: "TomBall", value: "tomball" },
                { name: "VolcanoBall", value: "volcanoball" },
                { name: "ArticBall", value: "articball" },
                { name: "MassBall", value: "massball" },
                { name: "SmallBall", value: "smallball" }
            ]
        },
        {
            type: "string",
            name: "balls2",
            description: "Les balls à voir (groupe 2)",
            required: false,
            choices: [
                { name: "RapidBall", value: "rapidball" },
                { name: "RythmBall", value: "rythmball" },
                { name: "PetBall", value: "petball" },
                { name: "ForestBall", value: "forestball" },
                { name: "DonjonBall", value: "donjonball" },
                { name: "RuineBall", value: "ruineball" },
                { name: "ChevalierBall", value: "chevalierball" },
                { name: "MagieBall", value: "magieball" },
                { name: "PoingBall", value: "poingball" },
                { name: "WaifuBall", value: "waifuball" },
                { name: "HusbandoBall", value: "husbandoball" },
                { name: "XBall", value: "xball" },
                { name: "MystrestBall", value: "mystrestball" },
                { name: "SweetieBall", value: "sweetieball" },
                { name: "RocketBall", value: "rocketball" },
                { name: "CarillonBall", value: "carillonball" },
                { name: "TourbilesBall", value: "tourbilesball" },
                { name: "CendreeBall", value: "cendreeball" },
                { name: "FFBall", value: "ffball" },
                { name: "GTBall", value: "gtball" },
                { name: "GMBall", value: "gmball" },
                { name: "CelesteBall", value: "celesteball" }
            ]
        },
        {
            type: "string",
            name: "balls3",
            description: "Les balls à voir (groupe 3)",
            required: false,
            choices: [
                { name: "CaillouxBall", value: "caillouxball" },
                { name: "LacBall", value: "lacball" },
                { name: "CouronneeBall", value: "couronneeball" },
                { name: "LameBall", value: "lameball" },
                { name: "DieuxBall", value: "dieuxball" },
                { name: "CyclopeeBall", value: "cyclopeeball" },
                { name: "GardienBall", value: "gardienball" },
                { name: "DiurneBall", value: "diurneball" },
                { name: "AetherBall", value: "aetherball" },
                { name: "UcBall", value: "ucball" },
                { name: "PaldeCouroBall", value: "paldeball" }
            ]
        }
    ],

    async run(bot, interaction) {
        try {
            console.log(`🔍 DEBUG - Exécution de la commande SHOP par ${interaction.user.id}`);

            // Vérification du profil utilisateur
            if (!point.getPoint(interaction.user.id)) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF0000")
                            .setTitle("Shop")
                            .setDescription("Vous n'avez pas commencé l'aventure ! Faites `/start` pour débuter.")
                    ],
                    ephemeral: true
                });
            }

            // Récupération des paramètres sélectionnés
            const selectedBalls = [
                interaction.options.getString("balls1"),
                interaction.options.getString("balls2"),
                interaction.options.getString("balls3")
            ].filter(Boolean); // Filtre les valeurs null

            console.log(`🎯 DEBUG - Balls sélectionnées : ${selectedBalls.join(", ") || "Aucune"}`);

            if (selectedBalls.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FFA500")
                            .setTitle("Shop")
                            .setDescription("Veuillez sélectionner une ball parmi les options disponibles.")
                    ],
                    ephemeral: true
                });
            }

            const embeds = [];

            for (const ball of selectedBalls) {
                const ballData = balls.getBalls(ball.toUpperCase());

                if (!ballData) {
                    console.warn(`⚠️ Ball non trouvée -> ${ball}`);
                    continue;
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${ball}`)
                    .setDescription(ballData.Description)
                    .setColor("#FFD700")
                    .setThumbnail("attachment://pokeball.png")
                    .addFields(
                        { name: "💰 Prix", value: `${ballData.price} P$`, inline: true },
                        { name: "🔹 Points min.", value: `${ballData.MinPoint}`, inline: true }
                    );

                if (ballData.PokemonC !== "Aucun") embed.addFields({ name: "⭐ Commun", value: ballData.PokemonC, inline: true });
                if (ballData.PokemonPC !== "Aucun") embed.addFields({ name: "🔹 Peu Commun", value: ballData.PokemonPC, inline: true });
                if (ballData.PokemonR !== "Aucun") embed.addFields({ name: "🔴 Rare", value: ballData.PokemonR, inline: true });
                if (ballData.PokemonE !== "Aucun") embed.addFields({ name: "🔥 Épique", value: ballData.PokemonE, inline: true });

                embeds.push(embed);
            }

            await interaction.reply({
                embeds: embeds,
                files: [new AttachmentBuilder("assets/pokeball.png")]
            });

            console.log("✅ DEBUG - Embed envoyé avec succès.");
        } catch (error) {
            console.error("❌ Erreur lors de l'exécution de la commande SHOP :", error);
            return interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
        }
    }
};

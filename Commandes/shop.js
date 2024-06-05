const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js');
const {point, balls} = require('../main.js');
const fs = require('fs')
const path = require('path')
   
module.exports = {
    name: "shop",
    description: "voir les balls",
    permission: "Aucune",
    dm: false,
    cooldown: 10,
    options: [
        {
            type: "string",
            name: "balls",
            description: "les balls a voir",
            required: true
        }
    ],

    async run(bot, message, args) {

    const { AttachmentBuilder, EmbedBuilder } = require('discord.js');                 
    const file = new AttachmentBuilder(`assets/pokeball.png`);
    const exampleEmbed = new EmbedBuilder()
	.setTitle(`Shop`)
    .setThumbnail(`attachment://pokeball.png`)
    .setDescription(`Voici les balls disponibles à l'achat !`)

    if (point.getPoint(message.user.id) > 0) {
        let ballee = args.getString("balls").toLowerCase() 
        ballee = ballee.charAt(0).toUpperCase() + ballee.slice(1)
        const balle = args.getString("balls").toUpperCase() // On récupère le nom de la pokeball

        if (balle == "ALL") {
            exampleEmbed.addFields([
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: '600P$ :',
                    value: `\n\n **0 point :** \n-Carnivorball  \n -Veggieball \n\n **150 points :** \n -Snackball \n -Cutieball \n -Repulsball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '750P$ :',
                    value: `\n\n **300 points :** \n -Safariball \n -Amazonieball \n -Aridball `,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '900P$ :',
                    value: `\n\n **500 points :** \n -Serreball \n -Agricoball  \n -Piafball \n\n **700 points :**\n -Geoball \n -Fossilball \n\n -------------------------------------------------- `,
                    inline: true,
                },
                {
                    name: '1050P$ :',
                    value: `\n\n **900 points :** \n -Bubbleball \n -SEABALL \n -Mossball \n\n **1100 points :** \n -Boomball \n -Usineball \n -Robotball `,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '1200P$ :',
                    value: `\n\n **1300 points :** \n -Horroball \n -Tomball \n\n **1500 points :** \n -Volcanoball \n -Articball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '1350P$ :',
                    value: `\n\n **1750 points :** \n -Massball \n -Smallball \n\n **2000 points :** \n -Rythmball \n -Rapidball \n -Petball \n\n`,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '1500P$ :',
                    value: `\n\n **2250 points :** \n -Forestball \n -Donjonball \n -Ruineball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '1750P$ :',
                    value: `\n\n **2500 points :** \n -Chevalierball **2500 points** \n -Magieball **2500 points** \n -Petball **2750 points**`,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '2000P$ :',
                    value:`\n\n **2750 points :** \n -Husbando \n -Waifu \n -Poingball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '2150P$ :',
                    value:`\n\n **3050 points :** \n -Xball \n -Mystrestball \n -Sweetieball`,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '2300P$ :',
                    value:`\n\n **3350 points :** \n -Rocketball \n -Carillonball \n -Tourbilesball \n -Cendreeball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '2450P$ :',
                    value:`\n\n **3650 points :** \n -FFball \n -GTball \n -GMball \n -Celesteball`,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '2600P$ :',
                    value:`\n\n **3950 points :** \n -Caillouxball \n -Lacball \n -Couronneeball \n\n --------------------------------------------------`,
                    inline: true,
                },
                {
                    name: '2750P$ :',
                    value:`\n\n **4350 points :** \n -Lameball \n -Dieuxball \n -Cyclopeeball`,
                    inline: true,
                },
                {
                    name: '\u2007',
                    value: '\u2007',
                    inline: false,
                },
                {
                    name: '2900P$ :',
                    value:`\n\n **4750 points :** \n -Gardienball \n -Diurneball \n -Aetherball\n -UCball`,
                    inline: true,
                },
                {
                    name: '3050P$ :',
                    value:`\n\n **5150 points :** \n -Couroball \n -Paldeball`,
                    inline: true,
                }
            ])
            exampleEmbed.setFooter({ text: 'Pour voir une pokéball faite /shop {nom de la pokeball} exemple : /shop horrorball'});
            message.reply({ embeds: [exampleEmbed]})
        } else {
            if (balls.getBalls(balle).PokemonC === 'Aucun' && balls.getBalls(balle).PokemonPC === 'Aucun' && balls.getBalls(balle).PokemonR === 'Aucun') {
                        exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                        exampleEmbed.setTitle(`${ballee}`)
                        exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Epique :**',
                                value : `${balls.getBalls(balle).PokemonE}`,
                                inline: true, 
                            }
                        ])
                        message.reply({ embeds: [exampleEmbed], files: [file]})
            }
            else if (balls.getBalls(balle).PokemonPC === 'Aucun' && balls.getBalls(balle).PokemonR === 'Aucun'){
                        exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                        exampleEmbed.setTitle(`${ballee}`)
                        exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Commun :**',
                                value : `${balls.getBalls(balle).PokemonC}`,
                                inline: true,
                            },
                            {
                                name: '**Epique :**',
                                value : `${balls.getBalls(balle).PokemonE}`,
                                inline: true, 
                            }
                        ])
                        message.reply({ embeds: [exampleEmbed], files: [file]})
            }
            else if (balls.getBalls(balle).PokemonPC === 'Aucun') {
                        exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                        exampleEmbed.setTitle(`${ballee}`)
                        exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Commun :**',
                                value : `${balls.getBalls(balle).PokemonC}`,
                                inline: true,
                            },
                            {
                                name: '**Rare**',
                                value : `${balls.getBalls(balle).PokemonR}`,
                                inline: true,
                            },
                            {
                                name: '**Epique :**',
                                value : `${balls.getBalls(balle).PokemonE}`,
                                inline: false, 
                            }
                        ])
                        message.reply({ embeds: [exampleEmbed], files: [file]})
            } 
            else if (balls.getBalls(balle).PokemonR === 'Aucun'){
                        exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                        exampleEmbed.setTitle(`${ballee}`)
                        exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Commun :**',
                                value : `${balls.getBalls(balle).PokemonC}`,
                                inline: true,
                            },
                            {
                                name: '**Peu Commun :**',
                                value : `${balls.getBalls(balle).PokemonPC}`,
                                inline: true,
                            },
                            {
                                name: '**Epique :**',
                                value : `${balls.getBalls(balle).PokemonE}`,
                                inline: false, 
                            }
                        ])
                        message.reply({ embeds: [exampleEmbed], files: [file]})
            } 
            else if (balls.getBalls(balle).PokemonE === 'Aucun'){
                        exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                        exampleEmbed.setTitle(`${ballee}`)
                        exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Commun :**',
                                value : `${balls.getBalls(balle).PokemonC}`,
                                inline: true,
                            },
                            {
                                name: '**Peu Commun :**',
                                value : `${balls.getBalls(balle).PokemonPC}`,
                                inline: true,
                            },
                            {
                                name: '**Rare :**',
                                value : `${balls.getBalls(balle).PokemonR}`,
                                inline: false, 
                            }
                        ])
                        message.reply({ embeds: [exampleEmbed], files: [file]})
            }
            
                else {
                    exampleEmbed.setDescription(`${balls.getBalls(balle).Description}`)
                    exampleEmbed.setTitle(`${ballee}`)
                    exampleEmbed.addFields ([
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: '**Commun :**',
                                value : `${balls.getBalls(balle).PokemonC}`,
                                inline: true,
                            },
                            {
                                name: '**Peu Commun :**',
                                value : `${balls.getBalls(balle).PokemonPC}`,
                                inline: true,
                            },
                            {
                                name: '\u2007',
                                value: '\u2007',
                                inline: false,
                            },
                            {
                                name: '**Rare :**',
                                value : `${balls.getBalls(balle).PokemonR}`,
                                inline: true, 
                            },
                            {
                                name: '**Epique :**',
                                value : `${balls.getBalls(balle).PokemonE}`,
                                inline: true,
                            }
                    ])
                    message.reply({ embeds: [exampleEmbed], files: [file]})
        }

    }
        
    } else {

        const exampleEmbed = new EmbedBuilder()
        .setColor(`#FF0000 `)
        .setTitle(`Shop`)
        .setDescription(`Vous n'avez pas commencer l'aventure faite /start pour commencer`)
        message.reply({ embeds: [exampleEmbed]})

    }
}
}

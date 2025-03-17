const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({ intents })
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
const config = require("./config")
const path = require('path')

const { Client, Collection } = require('discord.js');
bot.cooldowns = new Collection();

let pokemon, dresseur, argent, point, inventory, balls;

const main = async () => {
    const basePath = path.join(__dirname, 'Database', 'data');

    const Pokemon = require('./Database/pokemon.js')
    pokemon = new Pokemon(path.join(basePath, 'pokemon.json'))
    await pokemon.loadFile()

    const Dresseur = require('./Database/dresseur.js')
    dresseur = new Dresseur(path.join(basePath, 'dresseur.json'))
    await dresseur.loadFile()

    const Argent = require('./Database/argent.js')
    argent = new Argent(path.join(basePath, 'argent.json'))
    await argent.loadFile()

    const Point = require('./Database/point.js')
    point = new Point(path.join(basePath, 'point.json'))
    await point.loadFile()

    const Inventory = require('./Database/inventory.js')
    inventory = new Inventory(path.join(basePath, 'inventory.json'))
    await inventory.loadFile()

    const Balls = require('./Database/balls.js')
    balls = new Balls(path.join(basePath, 'balls.json'))
    await balls.loadFile()
}

main().then(() => {
    module.exports = {
        pokemon,
        dresseur,
        argent,
        point,
        inventory,
        balls
    }

    bot.commands = new Discord.Collection()
    bot.login(config.token)
    loadCommands(bot)
    loadEvents(bot)
})

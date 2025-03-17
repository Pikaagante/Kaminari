const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
const config = require("./config")
const path = require('path')

const { Client, Collection } = require('discord.js');
bot.cooldowns = new Collection();

let pokemon, dresseur;
const main = async () => {
    const Pokemon = require('./Database/pokemon.js')
    pokemon = new Pokemon(path.resolve('Database', 'data', 'pokemon.json').toString())
    await pokemon.loadFile()

    const Dresseur = require('./Database/dresseur.js')
    dresseur = new Dresseur(path.resolve('Database', 'data', 'dresseur.json').toString())
    await dresseur.loadFile()

    const Argent = require('./Database/argent.js')
    argent = new Argent(path.resolve('Database', 'data', 'argent.json').toString())
    await argent.loadFile()

    const Point = require('./Database/point.js')
    point = new Point(path.resolve('Database', 'data', 'point.json').toString())
    await point.loadFile()

    const Inventory = require('./Database/inventory.js')
    inventory = new Inventory(path.resolve('Database', 'data', 'inventory.json').toString())
    await inventory.loadFile()

    const Balls = require('./Database/balls.js')
    balls = new Balls(path.resolve('Database', 'data', 'balls.json').toString())
    await balls.loadFile()

    // const Inventory = require('./Database/inventory.js')
    // inventory = new Inventory(path.resolve('Database', 'data', 'inventory.json').toString())
    // await inventory.loadFile()
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





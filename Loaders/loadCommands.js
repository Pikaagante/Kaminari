const fs = require("fs")
const path = require("path")

module.exports = async bot => {
    const commandesDir = path.resolve(__dirname, "../Commandes")

    fs.readdirSync(commandesDir).filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(path.join(commandesDir, file))  // Utilisation de path.join pour joindre les chemins
        if(!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file.slice(0, file.length - 3)} n'a pas de nom !`)
        bot.commands.set(command.name, command)
        console.log(`Commande ${file} chargée avec succès`)
    })
}

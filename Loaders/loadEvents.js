const fs = require("fs")
const path = require("path")

module.exports = async bot => {
    const eventsDir = path.resolve(__dirname, "../Events")

    fs.readdirSync(eventsDir).filter(f => f.endsWith(".js")).forEach(async file => {

        let event = require(path.join(eventsDir, file))  // Utilisation de path.join pour joindre les chemins
        bot.on(file.split(".js").join(""), event.bind(null, bot))
        console.log(`Evenement ${file} charge avec succes`)
    })
}

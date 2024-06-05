const JSONHandler = require('./JsonHandler')

class pokemon extends JSONHandler {
    constructor(path){
        super(path)
    }

    getPokemon(nom) {
        return super.getKey(nom) ?? 'Ce pokemon nexiste pas'
    }
}

module.exports = pokemon
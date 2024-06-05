const JSONHandler = require('./JsonHandler')

class dresseur extends JSONHandler {
    constructor(path){
        super(path)
    }

    getDresseur(nom) {
        return super.getKey(nom) ?? 'Ce Dresseur nexiste pas'
    }
}

module.exports = dresseur
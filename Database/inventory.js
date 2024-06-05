const JSONHandler = require('./JsonHandler')

class inventory extends JSONHandler {
    constructor(path){
        super(path)
    }

    getInventory(nom) {
        return super.getKey(nom) ?? 'Ce Dresseur nexiste pas'
    }
}

module.exports = inventory
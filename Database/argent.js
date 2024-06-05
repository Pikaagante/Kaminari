const JSONHandler = require('./JsonHandler')

class argent extends JSONHandler {
    constructor(path){
        super(path)
    }

    getArgent(nom) {
        return super.getKey(nom) ?? 'Ce Dresseur nexiste pas'
    }
}

module.exports = argent
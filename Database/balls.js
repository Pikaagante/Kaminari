const JSONHandler = require('./JsonHandler')

class balls extends JSONHandler {
    constructor(path){
        super(path)
    }

    getBalls(nom) {
        return super.getKey(nom) ?? 'Cette ball nexiste pas'
    }
}

module.exports = balls
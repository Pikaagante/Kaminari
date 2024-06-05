const JSONHandler = require('./JsonHandler');

class point extends JSONHandler {
  constructor(path) {
    super(path);
  }

  getPoint(nom) {
    return super.getKey(nom) ?? 'Ce Dresseur n\'existe pas';
  }

  getUsersWithPoints() {
    const users = Object.entries(this.data);
    return users;
  }

  getTopUsers(count = 10) {
    const users = this.getUsersWithPoints();
    users.sort((a, b) => b[1] - a[1]);
    return users.slice(0, count);
  }
}

module.exports = point;

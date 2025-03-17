const fs = require('fs').promises;

class JSONHandler {
  constructor(pathURL) {
    this.path = pathURL;
  }

  async loadFile() {
    this.data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    console.log(`⚡Fichier ${this.path} chargé !`);
  }

  async saveData() {
    await fs.writeFile(this.path, JSON.stringify(this.data, null, '\t'));
  }

  addData(key, value) {
    this.data[key] = value;
  }

  getKey(key) {
    return this.data?.[key] ?? null;
  }

  addToList(key, value) {
    const arr = this.data[key] ?? [];
    arr.push(value);
    this.data[key] = arr;
  }
}

module.exports = JSONHandler;

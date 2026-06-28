const { items } = require('../data/items');

class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.baseAttack = 10;
    this.baseDefense = 2;
    this.gold = 50;
    this.currentRoom = 'village_center';
    this.saveRoom = 'village_center';
    this.inventory = {
      herb: 2
    };
    this.equipped = {
      weapon: null,
      shield: null
    };
  }

  totalAttack() {
    let atk = this.baseAttack;
    if (this.equipped.weapon) {
      const w = items[this.equipped.weapon];
      if (w) atk += w.attack || 0;
    }
    return atk;
  }

  totalDefense() {
    let def = this.baseDefense;
    if (this.equipped.shield) {
      const s = items[this.equipped.shield];
      if (s) def += s.defense || 0;
    }
    return def;
  }

  countHerbs() {
    let total = 0;
    for (const id in this.inventory) {
      const it = items[id];
      if (it && it.type === 'consumable') {
        total += this.inventory[id];
      }
    }
    return total;
  }

  equip(itemId) {
    const it = items[itemId];
    if (!it) return false;
    if (it.type === 'weapon') {
      this.equipped.weapon = itemId;
      return true;
    }
    if (it.type === 'shield') {
      this.equipped.shield = itemId;
      return true;
    }
    return false;
  }

  addItem(itemId, count = 1) {
    if (!this.inventory[itemId]) this.inventory[itemId] = 0;
    this.inventory[itemId] += count;
  }

  removeItem(itemId, count = 1) {
    if (!this.inventory[itemId]) return false;
    if (this.inventory[itemId] < count) return false;
    this.inventory[itemId] -= count;
    if (this.inventory[itemId] <= 0) {
      delete this.inventory[itemId];
      if (this.equipped.weapon === itemId) this.equipped.weapon = null;
      if (this.equipped.shield === itemId) this.equipped.shield = null;
    }
    return true;
  }

  respawn() {
    this.currentRoom = this.saveRoom;
    this.hp = this.maxHp;
  }

  fullHeal() {
    this.hp = this.maxHp;
  }
}

module.exports = { Player };

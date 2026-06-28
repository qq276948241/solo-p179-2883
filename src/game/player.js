const { items } = require('../data/items');

const SKILLS = {
  fireball: {
    id: 'fireball',
    name: '火球术',
    mpCost: 5,
    minLevel: 5,
    desc: '消耗 5 MP，对敌人造成 1.5 倍攻击力的火焰伤害。'
  },
  heal: {
    id: 'heal',
    name: '治疗术',
    mpCost: 3,
    minLevel: 5,
    healAmount: 20,
    desc: '消耗 3 MP，立即恢复 20 HP。'
  },
  armorBreak: {
    id: 'armorBreak',
    name: '破甲斩',
    mpCost: 4,
    minLevel: 5,
    duration: 2,
    desc: '消耗 4 MP，让敌人防御减半，效果持续 2 回合。'
  }
};

class Player {
  constructor() {
    this.level = 1;
    this.exp = 0;
    this.expToNext = 50;
    this.hp = 100;
    this.maxHp = 100;
    this.mp = 50;
    this.maxMp = 50;
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

  static expForLevel(lv) {
    return Math.floor(50 * Math.pow(1.35, lv - 1));
  }

  getAvailableSkills() {
    if (this.level < 5) return [];
    return Object.values(SKILLS);
  }

  hasSkill(skillId) {
    return this.level >= 5 && !!SKILLS[skillId];
  }

  useMp(amount) {
    if (this.mp < amount) return false;
    this.mp -= amount;
    return true;
  }

  gainExp(amount) {
    const leveledUp = [];
    this.exp += amount;

    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.level += 1;
      this.maxHp += 20;
      this.maxMp += 10;
      this.baseAttack += 2;
      this.baseDefense += 1;
      this.hp = this.maxHp;
      this.mp = this.maxMp;
      this.expToNext = Player.expForLevel(this.level);
      leveledUp.push(this.level);
    }
    return leveledUp;
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
    this.mp = this.maxMp;
  }

  fullHeal() {
    this.hp = this.maxHp;
    this.mp = this.maxMp;
  }
}

module.exports = { Player, SKILLS };

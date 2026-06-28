const { items } = require('../data/items');
const { SKILLS, allSkillDefs, getSkillDef } = require('../systems/skills');

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
    this.learnedSkills = [];
  }

  static expForLevel(lv) {
    return Math.floor(50 * Math.pow(1.35, lv - 1));
  }

  learnSkill(skillId) {
    const def = getSkillDef(skillId);
    if (!def) return { success: false, reason: 'unknown' };
    if (this.level < def.minLevel) return { success: false, reason: 'level', minLevel: def.minLevel };
    if (this.learnedSkills.includes(skillId)) return { success: false, reason: 'known' };
    this.learnedSkills.push(skillId);
    return { success: true, skill: def };
  }

  unlearnSkill(skillId) {
    const idx = this.learnedSkills.indexOf(skillId);
    if (idx >= 0) {
      this.learnedSkills.splice(idx, 1);
      return true;
    }
    return false;
  }

  hasLearnedSkill(skillId) {
    return this.learnedSkills.includes(skillId);
  }

  autoLearnSkillsForLevel(prevLevel, newLevel) {
    const newlyLearned = [];
    for (const def of allSkillDefs()) {
      if (prevLevel < def.minLevel && newLevel >= def.minLevel && !this.hasLearnedSkill(def.id)) {
        const r = this.learnSkill(def.id);
        if (r.success) newlyLearned.push(def);
      }
    }
    return newlyLearned;
  }

  getAvailableSkills() {
    return this.learnedSkills
      .map(id => getSkillDef(id))
      .filter(Boolean);
  }

  hasSkill(skillId) {
    return this.hasLearnedSkill(skillId);
  }

  useMp(amount) {
    if (this.mp < amount) return false;
    this.mp -= amount;
    return true;
  }

  gainExp(amount) {
    const leveledUp = [];
    const skillsLearned = [];
    this.exp += amount;

    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      const prevLevel = this.level;
      this.level += 1;
      this.maxHp += 20;
      this.maxMp += 10;
      this.baseAttack += 2;
      this.baseDefense += 1;
      this.hp = this.maxHp;
      this.mp = this.maxMp;
      this.expToNext = Player.expForLevel(this.level);
      leveledUp.push(this.level);
      const learned = this.autoLearnSkillsForLevel(prevLevel, this.level);
      skillsLearned.push(...learned);
    }
    return { levels: leveledUp, skills: skillsLearned };
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

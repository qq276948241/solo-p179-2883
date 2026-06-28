const ui = require('../utils/ui');

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SKILLS = {
  fireball: {
    id: 'fireball',
    name: '火球术',
    mpCost: 5,
    minLevel: 5,
    desc: '消耗 5 MP，对敌人造成 1.5 倍攻击力的火焰伤害。',
    execute(ctx) {
      const { player, enemy, addLog, getEnemyDefense, checkVictoryAfterDamage } = ctx;
      const rawDamage = Math.floor(player.totalAttack() * 1.5);
      const damage = Math.max(1, rawDamage - getEnemyDefense() + rand(-1, 2));
      enemy.hp = Math.max(0, enemy.hp - damage);
      addLog(ui.c(`🔥 你念出咒语，一枚炽热火球呼啸而出！`, ui.colors.fg.brightRed));
      addLog(ui.c(`${this.name} 对 ${enemy.name} 造成了 ${damage} 点灼烧伤害！`, ui.colors.fg.brightRed));
      if (checkVictoryAfterDamage()) {
        return { endTurn: true, victory: true };
      }
      return { endTurn: true, victory: false };
    }
  },

  heal: {
    id: 'heal',
    name: '治疗术',
    mpCost: 3,
    minLevel: 5,
    healAmount: 20,
    desc: '消耗 3 MP，立即恢复 20 HP。',
    execute(ctx) {
      const { player, addLog } = ctx;
      const healAmt = this.healAmount;
      const actual = Math.min(healAmt, player.maxHp - player.hp);
      player.hp = Math.min(player.maxHp, player.hp + healAmt);
      addLog(ui.c(`✨ 你双手结印，柔和的绿光包裹全身！`, ui.colors.fg.brightGreen));
      addLog(ui.c(`${this.name} 恢复了 ${actual} HP！`, ui.colors.fg.brightGreen));
      return { endTurn: true, victory: false };
    }
  },

  armorBreak: {
    id: 'armorBreak',
    name: '破甲斩',
    mpCost: 4,
    minLevel: 5,
    duration: 2,
    desc: '消耗 4 MP，让敌人防御减半，效果持续 2 回合。',
    execute(ctx) {
      const { enemy, addLog, setArmorBreak } = ctx;
      setArmorBreak(this.duration);
      addLog(ui.c(`⚔ 你凝聚斗气，一记破甲斩凌厉劈出！`, ui.colors.fg.brightMagenta));
      addLog(ui.c(`${this.name} 生效！${enemy.name} 防御减半，持续 ${this.duration} 回合。`, ui.colors.fg.brightMagenta));
      return { endTurn: true, victory: false };
    }
  }
};

function getSkillDef(skillId) {
  return SKILLS[skillId] || null;
}

function canLearn(player, skillId) {
  const def = getSkillDef(skillId);
  if (!def) return false;
  return player.level >= def.minLevel;
}

function canCast(player, skillId) {
  const def = getSkillDef(skillId);
  if (!def) return false;
  if (!player.hasLearnedSkill(skillId)) return false;
  return player.mp >= def.mpCost;
}

function executeSkill(ctx, skillId) {
  const def = getSkillDef(skillId);
  if (!def) {
    ctx.addLog(ui.warning(`未知技能: ${skillId}`));
    return { endTurn: false, victory: false, error: 'unknown' };
  }
  if (!ctx.player.useMp(def.mpCost)) {
    ctx.addLog(ui.warning(`MP 不足，无法施放 ${def.name}！`));
    return { endTurn: false, victory: false, error: 'mp' };
  }
  return def.execute.call(def, ctx) || { endTurn: true, victory: false };
}

function allSkillDefs() {
  return Object.values(SKILLS);
}

module.exports = {
  SKILLS,
  getSkillDef,
  canLearn,
  canCast,
  executeSkill,
  allSkillDefs
};

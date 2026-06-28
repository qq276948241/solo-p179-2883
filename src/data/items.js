const items = {
  herb: {
    id: 'herb',
    name: '治疗药草',
    type: 'consumable',
    effect: { heal: 40 },
    price: 25,
    desc: '一种散发清香的草药，使用后恢复 40 HP。'
  },
  superHerb: {
    id: 'superHerb',
    name: '高级药草',
    type: 'consumable',
    effect: { heal: 100 },
    price: 70,
    desc: '炼金术士秘制的药草，使用后恢复 100 HP。'
  },
  woodSword: {
    id: 'woodSword',
    name: '木剑',
    type: 'weapon',
    attack: 3,
    price: 40,
    desc: '新手用的木剑，攻击力 +3。'
  },
  ironSword: {
    id: 'ironSword',
    name: '铁剑',
    type: 'weapon',
    attack: 8,
    price: 120,
    desc: '铁匠精心打造的铁剑，攻击力 +8。'
  },
  steelSword: {
    id: 'steelSword',
    name: '精钢剑',
    type: 'weapon',
    attack: 15,
    price: 280,
    desc: '用精钢锻造的利剑，攻击力 +15。'
  },
  dragonSword: {
    id: 'dragonSword',
    name: '屠龙剑',
    type: 'weapon',
    attack: 25,
    price: 600,
    desc: '传说中斩杀过巨龙的神剑，攻击力 +25。'
  },
  leatherShield: {
    id: 'leatherShield',
    name: '皮盾',
    type: 'shield',
    defense: 3,
    price: 50,
    desc: '轻便的牛皮盾牌，防御力 +3。'
  },
  ironShield: {
    id: 'ironShield',
    name: '铁盾',
    type: 'shield',
    defense: 7,
    price: 150,
    desc: '坚固的铁制盾牌，防御力 +7。'
  },
  steelShield: {
    id: 'steelShield',
    name: '精钢盾',
    type: 'shield',
    defense: 12,
    price: 320,
    desc: '精工打造的精钢盾牌，防御力 +12。'
  }
};

const shopInventory = [
  'herb',
  'superHerb',
  'woodSword',
  'ironSword',
  'steelSword',
  'dragonSword',
  'leatherShield',
  'ironShield',
  'steelShield'
];

module.exports = { items, shopInventory };

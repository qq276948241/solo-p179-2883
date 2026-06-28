const enemies = {
  goblin: {
    name: '哥布林',
    hp: 30,
    maxHp: 30,
    attack: 8,
    defense: 2,
    exp: 15,
    gold: [5, 15],
    herbChance: 0.4,
    attackLines: [
      '哥布林挥舞着生锈的短刀扑了过来！',
      '"嘿嘿，新鲜的肉！"哥布林狞笑着刺来。',
      '哥布林眼中闪着贪婪的光芒，猛地一斩！'
    ],
    deathDesc: '哥布林发出一声凄厉的尖叫，倒在地上抽搐了几下就不动了。'
  },
  wolf: {
    name: '野狼',
    hp: 35,
    maxHp: 35,
    attack: 10,
    defense: 1,
    exp: 18,
    gold: [3, 10],
    herbChance: 0.3,
    attackLines: [
      '野狼露出锋利的獠牙，猛扑上来撕咬！',
      '嗷呜——野狼发出低吼，利爪划过空气！',
      '野狼弓起身子，闪电般窜向你的喉咙！'
    ],
    deathDesc: '野狼哀鸣一声，庞大的身躯轰然倒下，眼睛渐渐失去了神采。'
  },
  skeleton: {
    name: '骷髅战士',
    hp: 45,
    maxHp: 45,
    attack: 12,
    defense: 4,
    exp: 25,
    gold: [10, 25],
    herbChance: 0.35,
    attackLines: [
      '骷髅战士空洞的眼眶中闪着幽火，举剑劈下！',
      '骨骼咯吱作响，骷髅战士以诡异的角度刺出一剑！',
      '"亡...者...归...来..."骷髅战士沙哑地挥刀。'
    ],
    deathDesc: '骷髅战士的骨骼哗啦一声散成一地碎骨，幽火噗地熄灭了。'
  },
  bat: {
    name: '巨型蝙蝠',
    hp: 25,
    maxHp: 25,
    attack: 9,
    defense: 0,
    exp: 12,
    gold: [2, 8],
    herbChance: 0.25,
    attackLines: [
      '巨型蝙蝠扇动肉翅，俯冲而下用尖牙撕咬！',
      '吱吱——蝙蝠在黑暗中发出刺耳尖叫，利爪袭来！',
      '蝙蝠盘旋一周，突然从阴影中猛然扑出！'
    ],
    deathDesc: '巨型蝙蝠发出最后一声尖叫，从空中坠落，肉翅无力地瘫在地上。'
  },
  slime: {
    name: '沼泽史莱姆',
    hp: 40,
    maxHp: 40,
    attack: 7,
    defense: 6,
    exp: 14,
    gold: [4, 12],
    herbChance: 0.5,
    attackLines: [
      '史莱姆鼓起身体，喷吐出腐蚀性的黏液！',
      '"咕噜咕噜..."史莱姆蠕动着撞向你！',
      '史莱姆分裂出一小块，黏糊糊地飞向你的脸！'
    ],
    deathDesc: '史莱姆噗嗤一声化作一滩散发恶臭的绿色液体，渗进了泥土里。'
  },
  bandit: {
    name: '沼泽强盗',
    hp: 55,
    maxHp: 55,
    attack: 14,
    defense: 5,
    exp: 30,
    gold: [20, 45],
    herbChance: 0.45,
    attackLines: [
      '"此路是我开！"强盗挥着大刀砍来！',
      '强盗狞笑："把钱留下，或许给你个痛快！"',
      '强盗脚下一滑却稳住身形，顺势劈出一刀！'
    ],
    deathDesc: '强盗瞪大了眼睛，手中的武器哐当落地，不甘心地倒在了污泥中。'
  },
  caveSpider: {
    name: '洞穴毒蛛',
    hp: 38,
    maxHp: 38,
    attack: 11,
    defense: 2,
    exp: 22,
    gold: [8, 20],
    herbChance: 0.4,
    attackLines: [
      '毒蛛八条腿飞速移动，毒牙闪着寒光咬来！',
      '嘶嘶——毒蛛吐出蛛丝缠住你的视线，同时扑上！',
      '毒蛛从洞顶倒挂而下，毒牙直指你的头顶！'
    ],
    deathDesc: '洞穴毒蛛的腿一根根蜷曲起来，肚子啪地破开，流出黏糊糊的汁液。'
  },
  troll: {
    name: '森林巨魔',
    hp: 80,
    maxHp: 80,
    attack: 18,
    defense: 8,
    exp: 50,
    gold: [40, 80],
    herbChance: 0.6,
    attackLines: [
      '巨魔挥舞着巨棒，带着呼啸声砸下！',
      '"小...虫子...死！"巨魔咆哮着用拳头砸向地面！',
      '巨魔抓起一块大石头，兜头向你扔来！'
    ],
    deathDesc: '巨魔如山般的身躯轰然倒下，整个森林都为之震动，惊起一群飞鸟。'
  },
  shadow: {
    name: '暗影幽魂',
    hp: 50,
    maxHp: 50,
    attack: 15,
    defense: 3,
    exp: 35,
    gold: [15, 35],
    herbChance: 0.35,
    attackLines: [
      '暗影幽魂发出令人牙酸的尖啸，无形的利爪穿透空气！',
      '幽魂融入阴影中，下一秒出现在你身后袭来！',
      '"寒冷...吞噬一切..."幽魂的低语冻结你的血液！'
    ],
    deathDesc: '暗影幽魂发出刺耳的哀鸣，身体如同雾气般消散在空气中。'
  },
  dragonling: {
    name: '幼龙',
    hp: 120,
    maxHp: 120,
    attack: 22,
    defense: 10,
    exp: 100,
    gold: [100, 200],
    herbChance: 0.8,
    attackLines: [
      '幼龙喷出炽热的火焰，龙爪同时撕裂而下！',
      '"卑微的凡人！"幼龙口吐人言，尾巴横扫！',
      '幼龙张开双翼，尖啸着从空中俯冲撕咬！'
    ],
    deathDesc: '幼龙发出不甘的龙吟，庞大的龙躯重重砸在地上，龙鳞失去了光泽。'
  }
};

function createEnemy(type) {
  const template = enemies[type];
  if (!template) return null;
  return JSON.parse(JSON.stringify(template));
}

module.exports = { enemies, createEnemy };

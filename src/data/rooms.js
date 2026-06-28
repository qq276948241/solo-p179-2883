const rooms = {
  village_center: {
    id: 'village_center',
    name: '村子中央',
    description: '你站在村子的中央广场。篝火噼啪作响，松木搭的棚屋散落四周。孩子们在追逐嬉戏，空气中飘着烤面包的香气。',
    exits: { n: 'forest_entrance', e: 'cave_entrance', s: 'swamp_entrance' },
    encounters: [],
    isSavePoint: true,
    isShop: false
  },
  village_shop: {
    id: 'village_shop',
    name: '村子商店',
    description: '一个温暖的小店铺，木质货架上摆满了各种武器、盾牌和药草。留着大胡子的老板笑眯眯地看着你。',
    exits: { s: 'village_center' },
    encounters: [],
    isSavePoint: false,
    isShop: true
  },
  village_altar: {
    id: 'village_altar',
    name: '村子祭坛',
    description: '村中央的祭坛，古老的石碑上刻着守护符文。这里是存盘点，你可以在此休息恢复。',
    exits: { n: 'village_center' },
    encounters: [],
    isSavePoint: true,
    isShop: false
  },

  forest_entrance: {
    id: 'forest_entrance',
    name: '森林入口',
    description: '高耸的古木遮天蔽日，阳光只能透过层层树叶洒下斑驳的光点。腐叶铺成的小径向北延伸。',
    exits: { s: 'village_center', n: 'forest_clearing', e: 'forest_east' },
    encounters: ['goblin', 'wolf']
  },
  forest_clearing: {
    id: 'forest_clearing',
    name: '林间空地',
    description: '一片开阔的林间空地，中央有块巨大的岩石，上面刻着模糊的古老符号。四周的灌木丛沙沙作响。',
    exits: { s: 'forest_entrance', n: 'forest_deep', w: 'forest_stream', e: 'forest_ruins' },
    encounters: ['wolf', 'goblin', 'shadow']
  },
  forest_east: {
    id: 'forest_east',
    name: '密林深处',
    description: '树木变得异常茂密，藤蔓如蛇般缠绕在树干上。远处传来某种生物的低吼。',
    exits: { w: 'forest_entrance', n: 'forest_ruins' },
    encounters: ['goblin', 'caveSpider']
  },
  forest_stream: {
    id: 'forest_stream',
    name: '森林溪流',
    description: '一条清澈的小溪潺潺流过，溪边盛开着不知名的蓝色小花。水面倒映着天空的云影。',
    exits: { e: 'forest_clearing', n: 'forest_troll' },
    encounters: ['slime', 'bat']
  },
  forest_ruins: {
    id: 'forest_ruins',
    name: '森林废墟',
    description: '一座被藤蔓吞噬的古老遗迹，断壁残垣间依稀可见当年的辉煌。空气中弥漫着不安的气息。',
    exits: { s: 'forest_east', w: 'forest_deep', n: 'forest_temple' },
    encounters: ['skeleton', 'shadow', 'goblin']
  },
  forest_deep: {
    id: 'forest_deep',
    name: '幽暗深林',
    description: '阳光几乎无法穿透这里的树冠，四周漆黑一片。枯树的枝丫如鬼爪般伸向天空。',
    exits: { s: 'forest_clearing', e: 'forest_ruins', n: 'forest_troll' },
    encounters: ['shadow', 'wolf', 'bat']
  },
  forest_troll: {
    id: 'forest_troll',
    name: '巨魔领地',
    description: '巨大的脚印遍布泥泞的地面，空气中散发着浓重的腥臭味。一个用兽骨搭建的窝棚矗立在前方。',
    exits: { s: 'forest_stream', e: 'forest_temple' },
    encounters: ['troll', 'wolf']
  },
  forest_temple: {
    id: 'forest_temple',
    name: '远古神殿',
    description: '森林最深处的神殿，巨大的石柱支撑着穹顶，祭坛上闪烁着神秘的光芒。这里潜伏着强大的守护者。',
    exits: { s: 'forest_ruins', w: 'forest_troll' },
    encounters: ['troll', 'shadow', 'dragonling']
  },

  cave_entrance: {
    id: 'cave_entrance',
    name: '洞穴入口',
    description: '阴冷的风从黑漆漆的洞口吹出，带着潮湿和腐朽的气息。洞口的岩石上布满了青苔。',
    exits: { w: 'village_center', e: 'cave_corridor', n: 'cave_high' },
    encounters: ['bat', 'goblin']
  },
  cave_corridor: {
    id: 'cave_corridor',
    name: '狭窄甬道',
    description: '甬道越来越窄，洞顶低垂，你不得不弯腰前行。墙壁上的水珠啪嗒啪嗒滴落。',
    exits: { w: 'cave_entrance', e: 'cave_chamber', s: 'cave_web' },
    encounters: ['bat', 'skeleton']
  },
  cave_high: {
    id: 'cave_high',
    name: '水晶洞窟',
    description: '洞顶镶嵌着无数发光的水晶，将整个洞窟映照得如梦似幻。角落里传来窸窸窣窣的声音。',
    exits: { s: 'cave_entrance', e: 'cave_web' },
    encounters: ['caveSpider', 'bat']
  },
  cave_web: {
    id: 'cave_web',
    name: '蛛网密室',
    description: '厚厚的蜘蛛网几乎封住了整个空间，黏腻的蛛丝在空气中飘荡。无数小眼睛在黑暗中闪烁。',
    exits: { n: 'cave_high', w: 'cave_corridor', e: 'cave_lake' },
    encounters: ['caveSpider', 'caveSpider']
  },
  cave_chamber: {
    id: 'cave_chamber',
    name: '骷髅大厅',
    description: '宽敞的洞穴大厅里堆满了白骨，一座由头骨堆成的小山矗立在中央。空洞的眼眶仿佛在注视着你。',
    exits: { w: 'cave_corridor', n: 'cave_lake', s: 'cave_tomb' },
    encounters: ['skeleton', 'skeleton', 'shadow']
  },
  cave_lake: {
    id: 'cave_lake',
    name: '地下暗湖',
    description: '漆黑如墨的湖水占据了大半个洞穴，水面平静得诡异。偶尔有气泡从湖底冒出，发出咕嘟的声响。',
    exits: { w: 'cave_web', s: 'cave_chamber', e: 'cave_deep' },
    encounters: ['slime', 'bat', 'shadow']
  },
  cave_tomb: {
    id: 'cave_tomb',
    name: '王侯古墓',
    description: '一座华丽的石棺静静安放，四周摆满了陪葬的金银器皿。空气中的死气浓得化不开。',
    exits: { n: 'cave_chamber', e: 'cave_deep' },
    encounters: ['skeleton', 'shadow']
  },
  cave_deep: {
    id: 'cave_deep',
    name: '深渊裂隙',
    description: '洞穴的尽头是一道深不见底的裂隙，赤红的光从深处涌出，伴随着灼热的气息。这里是龙的巢穴。',
    exits: { w: 'cave_lake', s: 'cave_tomb' },
    encounters: ['skeleton', 'dragonling']
  },

  swamp_entrance: {
    id: 'swamp_entrance',
    name: '沼泽边缘',
    description: '脚下的土地变得松软泥泞，枯黄的芦苇在风中摇摆。腐烂的木板下渗出黑色液体，散发着恶臭。',
    exits: { n: 'village_center', s: 'swamp_path', e: 'swamp_hut' },
    encounters: ['slime', 'bandit']
  },
  swamp_path: {
    id: 'swamp_path',
    name: '泥泞小径',
    description: '勉强可称为路的小径在沼泽中蜿蜒，每走一步都发出咕叽咕叽的声响。水面下似乎有什么在游动。',
    exits: { n: 'swamp_entrance', s: 'swamp_deep', w: 'swamp_poison' },
    encounters: ['slime', 'wolf']
  },
  swamp_hut: {
    id: 'swamp_hut',
    name: '废弃茅屋',
    description: '一间歪歪斜斜的茅屋立在木桩上，屋顶破了个大洞。木门半掩着，里面传出奇怪的声响。',
    exits: { w: 'swamp_entrance', s: 'swamp_poison' },
    encounters: ['bandit', 'goblin']
  },
  swamp_poison: {
    id: 'swamp_poison',
    name: '毒雾沼',
    description: '绿色的毒雾在沼泽上飘荡，吸入一口就觉得肺部灼烧。沼泽里咕嘟咕嘟冒着有毒的气泡。',
    exits: { n: 'swamp_hut', e: 'swamp_path', s: 'swamp_island' },
    encounters: ['slime', 'caveSpider']
  },
  swamp_deep: {
    id: 'swamp_deep',
    name: '沼泽深处',
    description: '沼泽的深处几乎没有陆地，四处都是深不见底的黑水。腐烂的树木横七竖八地倒在水中。',
    exits: { n: 'swamp_path', e: 'swamp_island', s: 'swamp_lair' },
    encounters: ['bandit', 'slime', 'shadow']
  },
  swamp_island: {
    id: 'swamp_island',
    name: '孤岛营地',
    description: '沼泽中唯一一块干燥的小岛，上面散落着被遗弃的帐篷和篝火的痕迹。这里曾是强盗的据点。',
    exits: { w: 'swamp_deep', n: 'swamp_poison', s: 'swamp_lair' },
    encounters: ['bandit', 'bandit']
  },
  swamp_lair: {
    id: 'swamp_lair',
    name: '沼泽龙穴',
    description: '沼泽最深处的神秘洞窟，洞壁上覆满了发光的苔藓。传说中幼龙栖息在此，守护着无尽的宝藏。',
    exits: { n: 'swamp_island', w: 'swamp_deep' },
    encounters: ['bandit', 'troll', 'dragonling']
  }
};

module.exports = { rooms };

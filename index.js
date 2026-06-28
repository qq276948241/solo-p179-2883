const readline = require('readline');
const ui = require('./src/utils/ui');
const { rooms } = require('./src/data/rooms');
const { items, shopInventory } = require('./src/data/items');
const { createEnemy } = require('./src/data/enemies');
const { Player } = require('./src/game/player');
const { battle, rand } = require('./src/systems/combat');
const { saveGame, loadGame, hasSave } = require('./src/systems/save');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const player = new Player();
let statusMessage = '欢迎来到勇者大陆！按方向键移动，探索神秘的世界吧。';
let inBattle = false;

const SCREEN_WIDTH = 62;

function directionName(dir) {
  const map = { n: '北', s: '南', e: '东', w: '西' };
  return map[dir] || dir;
}

function renderScreen(bodyCallback) {
  ui.clearScreen();

  const headerLines = [];
  headerLines.push(
    ui.pad(ui.title('  ╔══ 勇者传说 ══╗'), SCREEN_WIDTH) +
    ui.pad(ui.hpBar(player.hp, player.maxHp), SCREEN_WIDTH)
  );
  headerLines.push(
    ui.pad(ui.system('  文字冒险 RPG'), SCREEN_WIDTH) +
    ui.pad(`  金币: ${ui.gold(player.gold)}  攻: ${player.totalAttack()}  防: ${player.totalDefense()}`, SCREEN_WIDTH)
  );
  headerLines.push(ui.divider(SCREEN_WIDTH * 2, '═'));

  process.stdout.write(headerLines.join('\n') + '\n\n');

  if (bodyCallback) {
    bodyCallback();
  }

  process.stdout.write('\n' + ui.divider(SCREEN_WIDTH * 2, '═') + '\n');

  const room = rooms[player.currentRoom];
  const location = room ? `位置: ${ui.place(room.name)}` : '位置: 未知';
  const status = `事件: ${statusMessage || '一切正常'}`;
  process.stdout.write(ui.pad('  ' + location, SCREEN_WIDTH) + ui.pad('  ' + status, SCREEN_WIDTH) + '\n');
}

function renderMain() {
  const room = rooms[player.currentRoom];

  renderScreen(() => {
    if (!room) {
      process.stdout.write(ui.warning('  你迷失在未知的空间...\n'));
      return;
    }

    process.stdout.write('  ' + ui.place('【 ' + room.name + ' 】') + '\n\n');
    process.stdout.write('  ' + room.description + '\n\n');

    if (room.isSavePoint) {
      process.stdout.write('  ' + ui.c('✦ 这是一个存盘点，你可以在此休息并保存进度。', ui.colors.fg.brightCyan) + '\n\n');
    }
    if (room.isShop) {
      process.stdout.write('  ' + ui.c('✦ 商店已营业，欢迎选购！', ui.colors.fg.brightYellow) + '\n\n');
    }

    process.stdout.write(ui.system('  ── 可前往方向 ──') + '\n');
    const exits = room.exits || {};
    for (const dir in exits) {
      const nextId = exits[dir];
      const nextRoom = rooms[nextId];
      const dirName = directionName(dir);
      const dest = nextRoom ? nextRoom.name : '未知区域';
      process.stdout.write(`    [${dir.toUpperCase()}] ${dirName} → ${ui.place(dest)}\n`);
    }
    if (room.id === 'village_center') {
      process.stdout.write(`    [U] 上 → ${ui.place('村子商店')}\n`);
      process.stdout.write(`    [D] 下 → ${ui.place('村子祭坛')}\n`);
    }

    process.stdout.write('\n');
    process.stdout.write(ui.system('  ── 操作菜单 ──') + '\n');
    process.stdout.write('    [I] 背包/装备    [S] 商店 (需在商店)\n');
    process.stdout.write('    [R] 休息/存档    [Q] 退出游戏\n');
    process.stdout.write('\n> 请输入命令: ');
  });
}

function renderInventory() {
  renderScreen(() => {
    process.stdout.write('  ' + ui.title('═══ 背包 & 装备 ═══') + '\n\n');

    process.stdout.write('  ' + ui.c('【当前装备】', ui.colors.fg.brightBlue) + '\n');
    const weapon = player.equipped.weapon ? items[player.equipped.weapon] : null;
    const shield = player.equipped.shield ? items[player.equipped.shield] : null;
    process.stdout.write(`    武器: ${weapon ? ui.item(weapon.name + ` (+${weapon.attack})`) : ui.system('无')}\n`);
    process.stdout.write(`    盾牌: ${shield ? ui.item(shield.name + ` (+${shield.defense})`) : ui.system('无')}\n`);
    process.stdout.write('\n');

    process.stdout.write('  ' + ui.c('【背包物品】', ui.colors.fg.brightCyan) + '\n');
    const keys = Object.keys(player.inventory);
    if (keys.length === 0) {
      process.stdout.write('    ' + ui.system('(空空如也)') + '\n');
    } else {
      keys.forEach((id, i) => {
        const it = items[id];
        if (!it) return;
        let extra = '';
        if (it.type === 'weapon') extra = `(+${it.attack}攻)`;
        if (it.type === 'shield') extra = `(+${it.defense}防)`;
        if (it.type === 'consumable') extra = `(恢复${it.effect.heal}HP)`;
        process.stdout.write(`    [${i + 1}] ${ui.item(it.name)} x${player.inventory[id]} ${ui.system(extra)} - ${it.desc}\n`);
      });
      process.stdout.write('\n');
      process.stdout.write('  输入数字使用/装备，0 返回主菜单\n');
    }
    process.stdout.write('\n> 选择: ');
  });
}

function renderShop() {
  renderScreen(() => {
    process.stdout.write('  ' + ui.title('═══ 村 子 商 店 ═══') + '\n\n');
    process.stdout.write('  ' + ui.gold(`你持有 ${player.gold} 枚金币。`) + '\n\n');
    process.stdout.write('  ' + ui.c('【商品列表】', ui.colors.fg.brightYellow) + '\n');

    shopInventory.forEach((id, i) => {
      const it = items[id];
      if (!it) return;
      let extra = '';
      if (it.type === 'weapon') extra = `(+${it.attack}攻)`;
      if (it.type === 'shield') extra = `(+${it.defense}防)`;
      if (it.type === 'consumable') extra = `(恢复${it.effect.heal}HP)`;
      const priceTag = ui.gold(`${it.price}金`);
      process.stdout.write(`    [${i + 1}] ${ui.item(pad(it.name, 10))} ${ui.system(pad(extra, 12))} ${priceTag}  - ${it.desc}\n`);
    });

    process.stdout.write('\n  输入数字购买，0 离开商店\n');
    process.stdout.write('\n> 选择: ');
  });
}

function pad(str, len) {
  if (str.length >= len) return str;
  return str + ' '.repeat(len - str.length);
}

function renderTitleScreen() {
  renderScreen(() => {
    const lines = [
      '',
      ui.center(ui.title('███╗   ███╗██╗   ██╗███████╗████████╗███████╗██████╗ '), SCREEN_WIDTH * 2),
      ui.center(ui.title('████╗ ████║╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗'), SCREEN_WIDTH * 2),
      ui.center(ui.title('██╔████╔██║ ╚████╔╝ ███████╗   ██║   █████╗  ██████╔╝'), SCREEN_WIDTH * 2),
      ui.center(ui.title('██║╚██╔╝██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██╔══██╗'), SCREEN_WIDTH * 2),
      ui.center(ui.title('██║ ╚═╝ ██║   ██║   ███████║   ██║   ███████╗██║  ██║'), SCREEN_WIDTH * 2),
      ui.center(ui.title('╚═╝     ╚═╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝'), SCREEN_WIDTH * 2),
      '',
      ui.center(ui.c('～ 文 字 冒 险 ～', ui.colors.fg.brightYellow), SCREEN_WIDTH * 2),
      '',
      ui.center(ui.system('从宁静的小村出发，探索森林、洞穴与沼泽'), SCREEN_WIDTH * 2),
      ui.center(ui.system('击败怪物，收集装备，揭开远古神殿的秘密...'), SCREEN_WIDTH * 2),
      '',
      '',
      ui.center('  [1] ' + ui.c('开始新游戏', ui.colors.fg.brightGreen), SCREEN_WIDTH * 2),
      hasSave() ? ui.center('  [2] ' + ui.c('读取存档', ui.colors.fg.brightCyan), SCREEN_WIDTH * 2) : '',
      ui.center('  [Q] ' + ui.c('退出游戏', ui.colors.fg.brightRed), SCREEN_WIDTH * 2),
      '',
      '',
      '  > 请选择: '
    ];
    process.stdout.write(lines.filter(l => l !== undefined).join('\n'));
  });
}

function renderDeath() {
  renderScreen(() => {
    const lines = [
      '',
      '',
      ui.center(ui.c('╔══════════════════════════════════════╗', ui.colors.fg.red), SCREEN_WIDTH * 2),
      ui.center(ui.c('║                                      ║', ui.colors.fg.red), SCREEN_WIDTH * 2),
      ui.center(ui.c('║  ') + ui.title('你 倒 下 了...') + ui.c('  ║', ui.colors.fg.red), SCREEN_WIDTH * 2),
      ui.center(ui.c('║                                      ║', ui.colors.fg.red), SCREEN_WIDTH * 2),
      ui.center(ui.c('╚══════════════════════════════════════╝', ui.colors.fg.red), SCREEN_WIDTH * 2),
      '',
      '',
      ui.center(ui.system(`但你的冒险尚未结束...`), SCREEN_WIDTH * 2),
      ui.center(ui.system(`你在存盘点 ${ui.place(rooms[player.saveRoom]?.name || '村子')} 醒来。`), SCREEN_WIDTH * 2),
      ui.center(ui.system(`HP 已完全恢复。`), SCREEN_WIDTH * 2),
      '',
      '',
      '  按任意键继续...'
    ];
    process.stdout.write(lines.join('\n'));
  });
}

function triggerEncounter(room) {
  if (!room.encounters || room.encounters.length === 0) return false;

  const chance = 0.35;
  if (Math.random() > chance) return false;

  const enemyType = room.encounters[rand(0, room.encounters.length - 1)];
  const enemy = createEnemy(enemyType);
  if (!enemy) return false;

  inBattle = true;
  battle(player, enemy, rl, (cb) => renderScreen(cb), setStatus, (result) => {
    inBattle = false;
    if (result.died) {
      handleDeath();
    } else {
      promptMain();
    }
  });

  return true;
}

function setStatus(msg) {
  statusMessage = msg;
}

function handleDeath() {
  renderDeath();
  rl.question('', () => {
    player.respawn();
    statusMessage = '你从死亡中归来，继续你的冒险吧。';
    promptMain();
  });
}

function move(direction) {
  const room = rooms[player.currentRoom];
  if (!room) return;

  let dir = direction;

  if (room.id === 'village_center') {
    if (dir === 'u') {
      player.currentRoom = 'village_shop';
      statusMessage = '你走进了村子的商店。';
      promptMain();
      return;
    }
    if (dir === 'd') {
      player.currentRoom = 'village_altar';
      statusMessage = '你来到了村子的祭坛前。';
      promptMain();
      return;
    }
  }

  const exits = room.exits || {};
  if (!exits[dir]) {
    statusMessage = '那个方向没有路可走。';
    promptMain();
    return;
  }

  player.currentRoom = exits[dir];
  const nextRoom = rooms[player.currentRoom];
  statusMessage = `你向${directionName(dir)}走，来到了${nextRoom ? nextRoom.name : '新区域'}。`;

  if (triggerEncounter(nextRoom)) {
    return;
  }

  promptMain();
}

function handleRestAndSave() {
  const room = rooms[player.currentRoom];
  if (!room || !room.isSavePoint) {
    statusMessage = '这里没有祭坛，无法存盘。只有村子里才能存档。';
    promptMain();
    return;
  }

  player.fullHeal();
  player.saveRoom = player.currentRoom;
  const result = saveGame(player);

  if (result.success) {
    statusMessage = `你在祭坛前休息，HP 完全恢复。进度已保存到 save.json。`;
  } else {
    statusMessage = `HP 已恢复，但存档失败: ${result.error}`;
  }
  promptMain();
}

function handleShop() {
  const room = rooms[player.currentRoom];
  if (!room || !room.isShop) {
    statusMessage = '你需要先去商店才能购物。';
    promptMain();
    return;
  }
  promptShop();
}

function handleInventory() {
  promptInventory();
}

function promptInventory() {
  renderInventory();
  rl.question('', (ans) => {
    const choice = ans.trim();
    if (choice === '0' || choice === '') {
      promptMain();
      return;
    }
    const idx = parseInt(choice) - 1;
    const keys = Object.keys(player.inventory);
    const id = keys[idx];
    if (!id) {
      statusMessage = '无效的选择。';
      promptMain();
      return;
    }
    const it = items[id];
    if (!it) {
      promptMain();
      return;
    }

    if (it.type === 'consumable') {
      const heal = it.effect.heal || 0;
      player.hp = Math.min(player.maxHp, player.hp + heal);
      player.removeItem(id, 1);
      statusMessage = `使用了 ${it.name}，恢复 ${heal} HP。`;
    } else if (it.type === 'weapon' || it.type === 'shield') {
      player.equip(id);
      statusMessage = `装备了 ${it.name}！`;
    }
    promptMain();
  });
}

function promptShop() {
  renderShop();
  rl.question('', (ans) => {
    const choice = ans.trim();
    if (choice === '0' || choice === '') {
      promptMain();
      return;
    }
    const idx = parseInt(choice) - 1;
    const id = shopInventory[idx];
    if (!id) {
      statusMessage = '无效的选择。';
      promptShop();
      return;
    }
    const it = items[id];
    if (!it) {
      promptShop();
      return;
    }

    if (player.gold < it.price) {
      statusMessage = `金币不足！${it.name} 需要 ${it.price} 金币。`;
      promptShop();
      return;
    }

    player.gold -= it.price;
    player.addItem(id, 1);
    statusMessage = `购买了 ${it.name}！`;
    promptShop();
  });
}

function promptMain() {
  if (inBattle) return;

  renderMain();
  rl.question('', (ans) => {
    const cmd = ans.trim().toLowerCase();

    switch (cmd) {
      case 'n':
      case 'e':
      case 's':
      case 'w':
      case 'u':
      case 'd':
        move(cmd);
        break;
      case 'i':
        handleInventory();
        break;
      case 's':
        handleShop();
        break;
      case 'r':
        handleRestAndSave();
        break;
      case 'q':
        process.stdout.write('\n  ' + ui.system('感谢游玩！再见勇者。') + '\n\n');
        rl.close();
        process.exit(0);
        break;
      default:
        statusMessage = '不认识的命令，请输入 n/e/s/w 移动，或 i/s/r/q 菜单。';
        promptMain();
    }
  });
}

function promptTitle() {
  renderTitleScreen();
  rl.question('', (ans) => {
    const choice = ans.trim().toLowerCase();
    if (choice === '1') {
      statusMessage = '冒险开始！先去村子的祭坛存档，然后出发探索吧。';
      promptMain();
    } else if (choice === '2' && hasSave()) {
      const result = loadGame(player);
      if (result.success) {
        statusMessage = '存档读取成功！继续你的冒险吧。';
        promptMain();
      } else {
        statusMessage = `读取失败: ${result.error}，开始新游戏。`;
        promptMain();
      }
    } else if (choice === 'q') {
      process.stdout.write('\n  ' + ui.system('再见！期待你再次踏上冒险之旅。') + '\n\n');
      rl.close();
      process.exit(0);
    } else {
      promptTitle();
    }
  });
}

process.on('SIGINT', () => {
  process.stdout.write('\n\n  ' + ui.system('再见勇者！（Ctrl+C 已退出）') + '\n\n');
  rl.close();
  process.exit(0);
});

promptTitle();

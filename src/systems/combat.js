const ui = require('../utils/ui');
const { items } = require('../data/items');

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcDamage(attack, defense) {
  const base = attack - defense;
  const variance = rand(-2, 3);
  return Math.max(1, base + variance);
}

function battle(player, enemy, readline, renderFull, setStatus, onEnd) {
  const battleLog = [];
  let playerDefending = false;
  let turn = 1;

  function addLog(text) {
    battleLog.push(text);
    if (battleLog.length > 8) battleLog.shift();
  }

  function renderBattle(message = '') {
    renderFull(() => {
      const lines = [];
      lines.push(ui.title('═══ 战 斗 ═══'));
      lines.push('');
      lines.push(`${ui.enemy(enemy.name)}  Lv.${Math.ceil(enemy.hp / 20)}`);
      lines.push(ui.enemyHpBar(enemy.hp, enemy.maxHp));
      lines.push(`攻击: ${enemy.attack}  防御: ${enemy.defense}`);
      lines.push('');
      lines.push(ui.divider(60, '─'));
      lines.push('');
      lines.push(ui.hpBar(player.hp, player.maxHp));
      lines.push(`攻击: ${player.totalAttack()}  防御: ${player.totalDefense()}`);
      lines.push(`药草: ${player.countHerbs()}  金币: ${ui.gold(player.gold)}`);
      lines.push('');
      lines.push(ui.divider(60, '─'));
      lines.push('');

      for (const log of battleLog) {
        lines.push(log);
      }
      lines.push('');
      lines.push(ui.divider(60, '─'));
      lines.push('');

      if (message) {
        lines.push(message);
        lines.push('');
      }

      lines.push('  [1] ' + ui.c('攻击', ui.colors.fg.brightRed) + '    [2] ' + ui.c('防御', ui.colors.fg.brightBlue));
      lines.push('  [3] ' + ui.c('用道具', ui.colors.fg.brightGreen) + '  [4] ' + ui.c('逃跑', ui.colors.fg.brightYellow));
      lines.push('');
      lines.push('> 请输入选项: ');

      process.stdout.write(lines.join('\n'));
    });
  }

  function enemyTurn() {
    if (enemy.hp <= 0) return;

    const line = enemy.attackLines[rand(0, enemy.attackLines.length - 1)];
    addLog(ui.enemy(line));

    let defense = player.totalDefense();
    if (playerDefending) {
      defense += 5;
      addLog(ui.system('你举起盾牌防御，额外减伤 5 点。'));
    }
    playerDefending = false;

    const damage = calcDamage(enemy.attack, defense);
    player.hp = Math.max(0, player.hp - damage);
    addLog(ui.c(`你受到了 ${damage} 点伤害！`, ui.colors.fg.brightRed));

    if (player.hp <= 0) {
      renderBattle();
      setTimeout(() => {
        onEnd({ victory: false, died: true });
      }, 800);
      return;
    }

    turn++;
    setTimeout(playerTurn, 700);
  }

  function doAttack() {
    const damage = calcDamage(player.totalAttack(), enemy.defense);
    enemy.hp = Math.max(0, enemy.hp - damage);
    addLog(ui.c(`你挥出一击，对 ${enemy.name} 造成了 ${damage} 点伤害！`, ui.colors.fg.brightCyan));

    if (enemy.hp <= 0) {
      addLog('');
      addLog(ui.enemy(enemy.deathDesc));
      const goldDrop = rand(enemy.gold[0], enemy.gold[1]);
      player.gold += goldDrop;
      addLog(ui.gold(`获得金币: +${goldDrop}`));

      if (Math.random() < enemy.herbChance) {
        if (!player.inventory.herb) player.inventory.herb = 0;
        player.inventory.herb += 1;
        addLog(ui.item('获得: 治疗药草 x1'));
      }

      if (Math.random() < enemy.herbChance * 0.3 && enemy.hp === 0) {
        if (!player.inventory.superHerb) player.inventory.superHerb = 0;
        player.inventory.superHerb += 1;
        addLog(ui.item('获得: 高级药草 x1'));
      }

      setStatus(`击败了 ${enemy.name}！获得 ${goldDrop} 金币。`);
      renderBattle();
      setTimeout(() => {
        onEnd({ victory: true, died: false, goldDrop });
      }, 1500);
      return;
    }

    renderBattle();
    setTimeout(enemyTurn, 700);
  }

  function doDefend() {
    playerDefending = true;
    addLog(ui.c('你摆出防御姿态，准备迎接下一次攻击。', ui.colors.fg.brightBlue));
    renderBattle();
    setTimeout(enemyTurn, 700);
  }

  function showItems() {
    const herbItems = [];
    for (const id in player.inventory) {
      const it = items[id];
      if (it && it.type === 'consumable' && player.inventory[id] > 0) {
        herbItems.push({ id, count: player.inventory[id], item: it });
      }
    }

    if (herbItems.length === 0) {
      addLog(ui.warning('背包里没有可用的道具！'));
      renderBattle();
      setTimeout(playerTurn, 700);
      return;
    }

    renderFull(() => {
      const lines = [];
      lines.push(ui.title('═══ 使 用 道 具 ═══'));
      lines.push('');
      herbItems.forEach((h, i) => {
        lines.push(`  [${i + 1}] ${ui.item(h.item.name)} x${h.count}  -  ${h.item.desc}`);
      });
      lines.push(`  [0] 返回战斗`);
      lines.push('');
      lines.push('> 请选择: ');
      process.stdout.write(lines.join('\n'));
    });

    readline.question('', (ans) => {
      const idx = parseInt(ans);
      if (idx === 0 || isNaN(idx)) {
        playerTurn();
        return;
      }
      const selected = herbItems[idx - 1];
      if (!selected) {
        playerTurn();
        return;
      }

      const heal = selected.item.effect.heal || 0;
      player.hp = Math.min(player.maxHp, player.hp + heal);
      player.inventory[selected.id] -= 1;
      addLog(ui.item(`使用了 ${selected.item.name}，恢复 ${heal} HP。`));
      setStatus(`使用了 ${selected.item.name}。`);
      renderBattle();
      setTimeout(enemyTurn, 700);
    });
  }

  function doFlee() {
    if (Math.random() < 0.55) {
      addLog(ui.c('你成功逃脱了战斗！', ui.colors.fg.brightYellow));
      setStatus(`从 ${enemy.name} 的战斗中逃脱。`);
      renderBattle();
      setTimeout(() => {
        onEnd({ victory: false, died: false, fled: true });
      }, 800);
    } else {
      addLog(ui.c('逃跑失败！敌人挡住了你的去路。', ui.colors.fg.magenta));
      renderBattle();
      setTimeout(enemyTurn, 700);
    }
  }

  function playerTurn() {
    renderBattle();

    readline.question('', (ans) => {
      const choice = ans.trim().toLowerCase();

      switch (choice) {
        case '1':
        case 'a':
          doAttack();
          break;
        case '2':
        case 'd':
          doDefend();
          break;
        case '3':
        case 'i':
          showItems();
          break;
        case '4':
        case 'f':
          doFlee();
          break;
        default:
          addLog(ui.warning('无效的选项，请重新输入。'));
          playerTurn();
      }
    });
  }

  addLog(ui.enemy(`一只 ${enemy.name} 出现了！`));
  playerTurn();
}

module.exports = { battle, calcDamage, rand };

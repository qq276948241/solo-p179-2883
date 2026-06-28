const fs = require('fs');
const path = require('path');

const SAVE_FILE = path.join(__dirname, '..', '..', 'save.json');

function saveGame(player) {
  const data = {
    hp: player.hp,
    maxHp: player.maxHp,
    baseAttack: player.baseAttack,
    baseDefense: player.baseDefense,
    gold: player.gold,
    currentRoom: player.currentRoom,
    saveRoom: player.saveRoom,
    inventory: player.inventory,
    equipped: player.equipped,
    createdAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(SAVE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function loadGame(player) {
  try {
    if (!fs.existsSync(SAVE_FILE)) {
      return { success: false, error: '存档文件不存在' };
    }
    const raw = fs.readFileSync(SAVE_FILE, 'utf8');
    const data = JSON.parse(raw);

    player.hp = data.hp;
    player.maxHp = data.maxHp;
    player.baseAttack = data.baseAttack;
    player.baseDefense = data.baseDefense;
    player.gold = data.gold;
    player.currentRoom = data.currentRoom;
    player.saveRoom = data.saveRoom || 'village_center';
    player.inventory = data.inventory || {};
    player.equipped = data.equipped || { weapon: null, shield: null };

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function hasSave() {
  try {
    return fs.existsSync(SAVE_FILE);
  } catch {
    return false;
  }
}

function deleteSave() {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      fs.unlinkSync(SAVE_FILE);
    }
    return true;
  } catch {
    return false;
  }
}

module.exports = { saveGame, loadGame, hasSave, deleteSave, SAVE_FILE };

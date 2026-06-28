# 架构概览

## 文件职责

| 文件 | 干什么 |
|---|---|
| [index.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/index.js) | 主入口。标题画面、主菜单循环、房间渲染、商店/背包界面、遇敌触发、升级弹窗、死亡复活、存盘入口。持有全局 `player` 和 `statusMessage` 状态 |
| [src/game/player.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/game/player.js) | `Player` 类——角色所有运行时状态的唯一来源 |
| [src/systems/combat.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/systems/combat.js) | `battle()` 闭包函数——一场战斗的完整生命周期 |
| [src/systems/skills.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/systems/skills.js) | 技能注册表 + `executeSkill()` 统一调度入口 |
| [src/systems/save.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/systems/save.js) | `saveGame` / `loadGame`——白名单字段读写 `save.json` |
| [src/data/rooms.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/data/rooms.js) | 23 个房间的邻接表地图 |
| [src/data/enemies.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/data/enemies.js) | 10 种敌人定义 + `createEnemy()` 工厂 |
| [src/data/items.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/data/items.js) | 9 种商品 + `shopInventory` 列表 |
| [src/utils/ui.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/utils/ui.js) | ANSI 颜色封装、HP 条、清屏等纯工具函数 |

## 模块调用关系

```
index.js
 ├→ src/game/player.js   (持有 player 实例，调 gainExp/equip/respawn...)
 ├→ src/systems/combat.js (遇敌时调 battle())
 │    └→ src/systems/skills.js (技能子菜单调 executeSkill())
 ├→ src/systems/save.js   (村子里存/读盘)
 ├→ src/data/rooms.js     (渲染房间、检查出口)
 ├→ src/data/enemies.js   (按房间 encounters 随机生成敌人)
 ├→ src/data/items.js     (商店购买、背包使用)
 └→ src/utils/ui.js       (所有终端输出)
```

单方向依赖，没有循环引用。`skills.js` 不依赖 `combat.js`，两者通过 `ctx` 上下文对象解耦。

## Player 状态管理

`Player` 类是游戏中唯一可变状态的中心。关键字段：

- **基础属性**：`level / exp / expToNext / hp / maxHp / mp / maxMp / baseAttack / baseDefense / gold`
- **位置**：`currentRoom`（当前房间 ID）、`saveRoom`（最近存盘点 ID，死亡复活用）
- **背包与装备**：`inventory`（`{ herb: 2, superHerb: 1 }` 形式）、`equipped`（`{ weapon, shield }` 存物品 ID 或 null）
- **技能列表**：`learnedSkills`（`['fireball', 'heal']` 形式，只存 ID）

装备的攻击/防御加成不存字段，由 `totalAttack()` / `totalDefense()` 从 `items` 表实时查。`gainExp()` 返回 `{ levels, skills }` 告诉调用方升了几级、新学了什么技能，由 `index.js` 负责渲染升级弹窗。

## save.js 存读机制

`saveGame(player)` 把 Player 上的白名单字段（共 13 个，见 [save.js#L7-L24](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/systems/save.js#L7-L24)）序列化成 JSON 写到项目根的 `save.json`。不序列化方法、不序列化整个对象——这样加新字段只要往白名单添一行，老存档缺字段时 `loadGame` 用 `|| 默认值` 兜底（比如 `level || 1`、`learnedSkills || []`），保证向后兼容。

仅存盘点（`isSavePoint: true` 的房间）可触发存盘；死亡时 `respawn()` 把 `currentRoom` 重置到 `saveRoom`，HP/MP 全满。

## rooms 地图结构

[rooms.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo179/project179/src/data/rooms.js) 是一个以房间 ID 为 key 的邻接表。每个房间长这样：

```js
forest_clearing: {
  id: 'forest_clearing',
  name: '林间空地',
  exits: { s: 'forest_entrance', n: 'forest_deep', w: 'forest_stream', e: 'forest_ruins' },
  encounters: ['wolf', 'goblin', 'shadow'],
  isSavePoint: false, isShop: false
}
```

`exits` 的 key 是方向（n/e/s/w），value 是目标房间 ID。玩家输入 `n` 时，`index.js` 从 `rooms[currentRoom].exits.n` 取目标 ID 做跳转；如果目标 ID 不存在说明该方向没路。23 个房间通过 `exits` 互相引用串成一张无向图——村子（village_center）是中心枢纽，北通森林 8 房间、东连洞穴 8 房间、南接沼泽 7 房间，每条路线越深敌人越强。

## 一次完整战斗的数据流

```
index.js: triggerEncounter(room)
  ├→ createEnemy() 从 room.encounters 随机选一个敌人
  └→ battle(player, enemy, rl, renderScreen, setStatus, onEnd)
       │
       │  闭包状态: battleLog[], armorBreakTurns, battleEnded, ...
       │
       ├→ playerTurn()  渲染菜单 → readline 等输入
       │   ├→ doAttack()      → calcDamage → enemy.hp-= → checkVictory?
       │   ├→ doDefend()      → 标记 playerDefending
       │   ├→ showItems()     → 用药草 → player.hp+=
       │   ├→ doFlee()        → 55% 概率 finishBattle({fled})
       │   └→ showSkills()    → executeSkill(ctx, id)
       │                         ├→ 扣 MP → skill.execute(ctx)
       │                         └→ 返回 { endTurn, victory, alreadyDead?, noHeal? }
       │
       ├→ enemyTurn()   敌人台词 → calcDamage → player.hp-= → 玩家死?
       │                  破甲倒计 tick
       │
       ├→ checkVictoryAfterDamage()
       │   敌人 hp<=0 → 掉落金币/药草 → setStatus → 1.8s 后 finishBattle()
       │
       └→ finishBattle({ victory, died, fled, exp, goldDrop })
           └→ index.js: onEnd 回调
              ├→ player.gainExp(exp) → 返回 { levels, skills }
              ├→ 渲染升级弹窗（如有）
              └→ 回到主循环
```

核心防护：所有玩家操作入口和 readline 回调都前置 `battleEnded / enemy.hp<=0` 检查，确保 1.8 秒结算延迟窗口内不会操作已死的敌人。`finishBattle()` 带 `battleEnded` 幂等守卫，无论哪个分支先触发都只执行一次 `onEnd`。

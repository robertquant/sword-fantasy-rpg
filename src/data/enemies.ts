import type { EnemyDefinition, Fighter } from '../systems/battleTypes';

export const ENEMIES: Record<string, EnemyDefinition> = {
  bamboo_snake: {
    id: 'bamboo_snake',
    name: '竹叶蛇',
    hp: 48,
    atk: 10,
    def: 4,
    spd: 6,
    color: 0x4a7c3f,
    expReward: 38,
    goldReward: 10,
  },
  bamboo_demon: {
    id: 'bamboo_demon',
    name: '竹妖',
    hp: 120,
    atk: 17,
    def: 8,
    spd: 8,
    color: 0x2d5a27,
    expReward: 90,
    goldReward: 35,
  },
  fire_lizard: {
    id: 'fire_lizard',
    name: '火蜥蜴',
    hp: 80,
    atk: 18,
    def: 8,
    spd: 7,
    color: 0xc0392b,
    expReward: 70,
    goldReward: 24,
  },
  mountain_imp: { id: 'mountain_imp', name: '山魈', hp: 135, atk: 19, def: 9, spd: 9, color: 0x6d5a3d, expReward: 95, goldReward: 30 },
  sword_wraith: { id: 'sword_wraith', name: '残剑影', hp: 165, atk: 22, def: 10, spd: 11, color: 0x9fb6c7, expReward: 120, goldReward: 40 },
  lava_golem: { id: 'lava_golem', name: '熔岩傀儡', hp: 220, atk: 28, def: 15, spd: 6, color: 0xb94a20, expReward: 180, goldReward: 60 },
  flame_demon: { id: 'flame_demon', name: '炎魔', hp: 280, atk: 33, def: 16, spd: 10, color: 0xe25822, expReward: 240, goldReward: 80 },
  ice_wraith: { id: 'ice_wraith', name: '冰魄', hp: 250, atk: 30, def: 14, spd: 12, color: 0x8ed4ff, expReward: 260, goldReward: 85 },
  snow_lady: { id: 'snow_lady', name: '雪女', hp: 330, atk: 36, def: 17, spd: 13, color: 0xd9f4ff, expReward: 330, goldReward: 110 },
  soul_devourer: { id: 'soul_devourer', name: '噬灵魔尊', hp: 500, atk: 44, def: 22, spd: 14, color: 0x5c1b78, expReward: 600, goldReward: 300 },
};

export const createEnemyFighter = (enemyId: string): Fighter => {
  const enemy = ENEMIES[enemyId] ?? ENEMIES.bamboo_snake;

  return {
    name: enemy.name,
    hp: enemy.hp,
    maxHp: enemy.hp,
    mp: 0,
    maxMp: 0,
    atk: enemy.atk,
    def: enemy.def,
    spd: enemy.spd,
    statuses: [],
  };
};

import type { EnemyDefinition, Fighter } from '../systems/battleTypes';

export const ENEMIES: Record<string, EnemyDefinition> = {
  bamboo_snake: {
    id: 'bamboo_snake',
    name: '竹叶蛇',
    hp: 30,
    atk: 8,
    def: 3,
    spd: 6,
    color: 0x4a7c3f,
    expReward: 30,
    goldReward: 8,
  },
  bamboo_demon: {
    id: 'bamboo_demon',
    name: '竹妖',
    hp: 50,
    atk: 12,
    def: 5,
    spd: 8,
    color: 0x2d5a27,
    expReward: 45,
    goldReward: 15,
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

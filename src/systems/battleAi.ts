import Phaser from 'phaser';
import { addStatus, dealDamage, tickStatuses } from './combatRules';
import type { Fighter } from './battleTypes';

export interface TurnResult {
  logs: string[];
  defeated: boolean;
}

export const performPlayerAction = (action: string, player: Fighter, enemy: Fighter): TurnResult => {
  const logs = tickStatuses(player);
  if (player.hp <= 0) return { logs, defeated: true };
  if (action === 'skill') return playerSkill(player, enemy, logs);
  if (action === 'defend') {
    addStatus(player, 'defend', 1, 0);
    return { logs: [...logs, '剑修凝神防御，下回合受到伤害降低。'], defeated: false };
  }
  const outcome = dealDamage(player, enemy, player.atk + 4);
  return { logs: [...logs, `剑修挥剑斩击，造成 ${outcome.damage} 点伤害。`], defeated: enemy.hp <= 0 };
};

export const performEnemyAction = (enemyId: string, enemy: Fighter, player: Fighter): TurnResult => {
  const logs = tickStatuses(enemy);
  if (enemy.hp <= 0) return { logs, defeated: true };
  if (enemyId === 'bamboo_snake' && Phaser.Math.Between(1, 100) <= 45) {
    const outcome = dealDamage(enemy, player, enemy.atk + 5);
    addStatus(player, 'poison', 3, 5);
    return { logs: [...logs, `竹叶蛇使用毒牙，造成 ${outcome.damage} 点伤害，你中毒了。`], defeated: player.hp <= 0 };
  }
  if (enemyId === 'bamboo_demon') return bambooDemonAction(enemy, player, logs);
  const outcome = dealDamage(enemy, player, enemy.atk + 2);
  return { logs: [...logs, `${enemy.name} 攻击，造成 ${outcome.damage} 点伤害。`], defeated: player.hp <= 0 };
};

const playerSkill = (player: Fighter, enemy: Fighter, logs: string[]): TurnResult => {
  if (player.mp < 10) return { logs: [...logs, '灵力不足，无法施展剑气斩。'], defeated: false };
  player.mp -= 10;
  const outcome = dealDamage(player, enemy, Math.floor(player.atk * 2.1));
  return { logs: [...logs, `剑气斩破空而出，造成 ${outcome.damage} 点伤害。`], defeated: enemy.hp <= 0 };
};

const bambooDemonAction = (enemy: Fighter, player: Fighter, logs: string[]): TurnResult => {
  const roll = Phaser.Math.Between(1, 100);
  if (roll <= 30) {
    addStatus(enemy, 'evasion', 2, 35);
    return { logs: [...logs, '竹妖进入竹影分身，闪避提升。'], defeated: false };
  }
  if (roll <= 60) {
    const outcome = dealDamage(enemy, player, enemy.atk + 7);
    addStatus(player, 'weaken', 1, 35);
    return { logs: [...logs, `竹妖施展根须缠绕，造成 ${outcome.damage} 点伤害，你下回合伤害降低。`], defeated: player.hp <= 0 };
  }
  const outcome = dealDamage(enemy, player, enemy.atk + 5);
  return { logs: [...logs, `竹妖刺出竹矛，造成 ${outcome.damage} 点伤害。`], defeated: player.hp <= 0 };
};


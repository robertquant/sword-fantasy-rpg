import Phaser from 'phaser';
import type { Fighter, StatusEffectType } from './battleTypes';

export interface CombatOutcome {
  damage: number;
  logs: string[];
}

export const hasStatus = (fighter: Fighter, type: StatusEffectType): boolean => fighter.statuses.some(status => status.type === type && status.turns > 0);

export const addStatus = (fighter: Fighter, type: StatusEffectType, turns: number, power: number): void => {
  const current = fighter.statuses.find(status => status.type === type);
  if (current) {
    current.turns = Math.max(current.turns, turns);
    current.power = Math.max(current.power, power);
    return;
  }
  fighter.statuses.push({ type, turns, power });
};

export const dealDamage = (attacker: Fighter, defender: Fighter, base: number): CombatOutcome => {
  const weakened = hasStatus(attacker, 'weaken') ? 0.65 : 1;
  const defending = hasStatus(defender, 'defend') ? 0.45 : 1;
  const damage = Math.max(1, Math.floor((base - defender.def + Phaser.Math.Between(-2, 3)) * weakened * defending));
  defender.hp = Math.max(0, defender.hp - damage);
  return { damage, logs: [`${attacker.name} 造成 ${damage} 点伤害。`] };
};

export const tickStatuses = (fighter: Fighter): string[] => {
  const logs: string[] = [];
  fighter.statuses.forEach(status => {
    if (status.type === 'poison') {
      fighter.hp = Math.max(0, fighter.hp - status.power);
      logs.push(`${fighter.name} 中毒，受到 ${status.power} 点伤害。`);
    }
    status.turns -= 1;
  });
  fighter.statuses = fighter.statuses.filter(status => status.turns > 0);
  return logs;
};


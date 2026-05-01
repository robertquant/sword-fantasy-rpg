import type Phaser from 'phaser';

export interface BattleData {
  enemyId: string;
  returnMap: string;
  playerX: number;
  playerY: number;
  chapterIndex?: number;
}

export interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  spd: number;
  statuses: StatusEffect[];
}

export interface EnemyDefinition {
  id: string;
  name: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  color: number;
  expReward: number;
  goldReward: number;
}

export interface StatusBar {
  fill: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
  width: number;
}

export type BattleAction = 'attack' | 'skill' | 'defend' | 'flee';

export type StatusEffectType = 'poison' | 'defend' | 'evasion' | 'weaken';

export interface StatusEffect {
  type: StatusEffectType;
  turns: number;
  power: number;
}

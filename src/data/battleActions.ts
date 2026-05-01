import type { BattleAction } from '../systems/battleTypes';

export interface BattleActionDefinition {
  label: string;
  action: BattleAction;
  color: string;
}

export const BATTLE_ACTIONS: BattleActionDefinition[] = [
  { label: '⚔ 攻击', action: 'attack', color: '#e94560' },
  { label: '✨ 技能', action: 'skill', color: '#3498db' },
  { label: '🛡 防御', action: 'defend', color: '#2ecc71' },
  { label: '🏃 逃跑', action: 'flee', color: '#95a5a6' },
];


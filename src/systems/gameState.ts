export interface QuestState {
  id: string;
  title: string;
  targetEnemyId: string;
  requiredKills: number;
  currentKills: number;
  accepted: boolean;
  completed: boolean;
}

export interface PlayerProgress {
  level: number;
  exp: number;
  nextLevelExp: number;
  gold: number;
}

export interface GameState {
  player: PlayerProgress;
  quest: QuestState;
}

export interface BattleResult {
  playerWon: boolean;
  enemyId: string;
  expReward: number;
  goldReward: number;
}

export const gameState: GameState = {
  player: {
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    gold: 0,
  },
  quest: {
    id: 'clear_bamboo_snakes',
    title: '竹林蛇患',
    targetEnemyId: 'bamboo_snake',
    requiredKills: 3,
    currentKills: 0,
    accepted: false,
    completed: false,
  },
};

export const applyBattleResult = (result: BattleResult): boolean => {
  if (!result.playerWon) return false;

  gameState.player.exp += result.expReward;
  gameState.player.gold += result.goldReward;

  let leveledUp = false;
  while (gameState.player.exp >= gameState.player.nextLevelExp) {
    gameState.player.exp -= gameState.player.nextLevelExp;
    gameState.player.level += 1;
    gameState.player.nextLevelExp += 50;
    leveledUp = true;
  }

  const { quest } = gameState;
  if (quest.accepted && !quest.completed && result.enemyId === quest.targetEnemyId) {
    quest.currentKills = Math.min(quest.requiredKills, quest.currentKills + 1);
    quest.completed = quest.currentKills >= quest.requiredKills;
  }

  return leveledUp;
};


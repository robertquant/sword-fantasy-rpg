import { addItem, createInventory, removeItem, type Inventory } from './inventory';

export interface QuestState {
  id: string;
  title: string;
  targetEnemyId: string;
  requiredKills: number;
  currentKills: number;
  accepted: boolean;
  completed: boolean;
  turnedIn: boolean;
}

export interface PlayerProgress {
  level: number;
  exp: number;
  nextLevelExp: number;
  gold: number;
}

export interface GameState {
  player: PlayerProgress;
  quests: QuestState[];
  activeQuestId: string;
  bambooDepthUnlocked: boolean;
  herbQuest: HerbQuestState;
  inventory: Inventory;
}

export interface HerbQuestState {
  accepted: boolean;
  completed: boolean;
  turnedIn: boolean;
  gatheredHerbIds: string[];
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
  quests: [
    createQuest('clear_bamboo_snakes', '竹林蛇患', 'bamboo_snake', 3, false),
    createQuest('bamboo_demon_trial', '竹林深处', 'bamboo_demon', 1, false),
  ],
  activeQuestId: 'clear_bamboo_snakes',
  bambooDepthUnlocked: false,
  herbQuest: { accepted: false, completed: false, turnedIn: false, gatheredHerbIds: [] },
  inventory: createInventory(),
};

export const getActiveQuest = (): QuestState => gameState.quests.find(quest => quest.id === gameState.activeQuestId) ?? gameState.quests[0];

export const acceptActiveQuest = (): void => {
  getActiveQuest().accepted = true;
};

export const turnInActiveQuest = (): void => {
  const quest = getActiveQuest();
  if (!quest.completed || quest.turnedIn) return;
  quest.turnedIn = true;
  gameState.player.gold += quest.id === 'clear_bamboo_snakes' ? 30 : 80;
  if (quest.id === 'clear_bamboo_snakes') {
    gameState.bambooDepthUnlocked = true;
    gameState.activeQuestId = 'bamboo_demon_trial';
  }
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

  const quest = getActiveQuest();
  if (quest.accepted && !quest.completed && result.enemyId === quest.targetEnemyId) {
    quest.currentKills = Math.min(quest.requiredKills, quest.currentKills + 1);
    quest.completed = quest.currentKills >= quest.requiredKills;
  }

  return leveledUp;
};

export const startHerbQuest = (): boolean => {
  const snakeQuest = gameState.quests.find(quest => quest.id === 'clear_bamboo_snakes');
  if (!snakeQuest?.turnedIn || gameState.herbQuest.accepted) return false;
  gameState.herbQuest.accepted = true;
  return true;
};

export const gatherHerb = (herbId: string): boolean => {
  const quest = gameState.herbQuest;
  if (!quest.accepted || quest.completed || quest.gatheredHerbIds.includes(herbId)) return false;
  quest.gatheredHerbIds.push(herbId);
  addItem(gameState.inventory, 'calming_herb', 1);
  quest.completed = quest.gatheredHerbIds.length >= 3;
  return true;
};

export const turnInHerbQuest = (): boolean => {
  const quest = gameState.herbQuest;
  if (!quest.completed || quest.turnedIn || !removeItem(gameState.inventory, 'calming_herb', 3)) return false;
  quest.turnedIn = true;
  addItem(gameState.inventory, 'healing_pill', 2);
  addItem(gameState.inventory, 'antidote_powder', 1);
  gameState.player.exp += 25;
  return true;
};

function createQuest(id: string, title: string, targetEnemyId: string, requiredKills: number, accepted: boolean): QuestState {
  return { id, title, targetEnemyId, requiredKills, currentKills: 0, accepted, completed: false, turnedIn: false };
}

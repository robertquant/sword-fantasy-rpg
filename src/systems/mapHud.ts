import type { QuestState } from './gameState';
import { gameState } from './gameState';
import { formatInventoryLine } from './inventory';

export const formatMapHud = (activeQuest: QuestState): string => {
  const { player } = gameState;
  const questLine = getQuestLine(activeQuest);
  return `等级 ${player.level}  经验 ${player.exp}/${player.nextLevelExp}  金 ${player.gold}\n${questLine}\n${formatInventoryLine(gameState.inventory)}`;
};

const getQuestLine = (activeQuest: QuestState): string => {
  if (gameState.herbQuest.accepted && !gameState.herbQuest.turnedIn) {
    const done = gameState.herbQuest.gatheredHerbIds.length;
    return `支线: 采药路断 ${done}/3${gameState.herbQuest.completed ? ' 已完成' : ''}`;
  }
  if (!activeQuest.accepted) return '主线: 与村长对话';
  return `${activeQuest.title}: ${activeQuest.currentKills}/${activeQuest.requiredKills}${activeQuest.completed ? ' 已完成' : ''}`;
};

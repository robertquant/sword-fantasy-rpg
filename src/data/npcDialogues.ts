import { getElderDialogue } from './dialogues';
import type { NpcDefinition } from './maps';
import { gameState, startHerbQuest, turnInHerbQuest } from '../systems/gameState';

const getHerbalistDialogue = (): string[] => {
  const snakeQuest = gameState.quests.find(quest => quest.id === 'clear_bamboo_snakes');
  if (!snakeQuest?.turnedIn) {
    return [
      '药师：幽竹林的毒蛇近来暴躁，若中了毒，先稳住气息再出剑。',
      '药师：等蛇患退去，我想请你帮村里采些清心草。',
    ];
  }
  if (!gameState.herbQuest.accepted) {
    startHerbQuest();
    return ['药师：采药路终于能走了，请你去幽竹林外围采 3 株清心草。', '任务已接受：采药路断。'];
  }
  if (gameState.herbQuest.completed && !gameState.herbQuest.turnedIn) {
    turnInHerbQuest();
    return ['药师：这些清心草正好能配药。', '获得奖励：金创药 x2、解毒散 x1、经验 25。'];
  }
  if (gameState.herbQuest.turnedIn) return ['药师：我已备好药材，后续可以考虑开一个药铺。'];
  return [`药师：清心草还差 ${3 - gameState.herbQuest.gatheredHerbIds.length} 株，就在幽竹林外围发光处。`];
};

const simpleDialogues: Record<string, () => string[]> = {
  herbalist: getHerbalistDialogue,
  blacksmith: () => [
    '铁匠：你的剑胚还算结实，但火候未到，遇到强妖会吃力。',
    '铁匠：后面若寻到灵铁，我能帮你打第一把真正的修行长剑。',
    '铁匠：赤焰山的矿脉最好，可那边妖火很重。',
  ],
  patrol_disciple: () => [
    '巡逻弟子：我在竹林边缘见过妖气回旋，深处绝不是普通蛇患。',
    '巡逻弟子：竹妖会分身，别只顾猛攻，防御和净息也要穿插用。',
    '巡逻弟子：若你能清掉竹妖，村道就能重新通往更远的山口。',
  ],
};

export const getNpcDialogue = (npc: NpcDefinition): string[] => {
  if (npc.id === 'village_elder') return getElderDialogue();
  return simpleDialogues[npc.id]?.() ?? [`${npc.name}：愿山风护你一路平安。`];
};

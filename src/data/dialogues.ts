import { gameState } from '../systems/gameState';

export const getElderDialogue = (): string[] => {
  const { quest } = gameState;

  if (!quest.accepted) {
    return [
      '村长：少侠，幽竹林近来毒蛇横行，村民不敢采药。',
      '村长：请你去竹林击败 3 条竹叶蛇，我会记下你的功劳。',
      '任务已接受：竹林蛇患。',
    ];
  }

  if (quest.completed) {
    return [
      '村长：竹林安静多了，你已经证明自己能独当一面。',
      '村长：继续修行吧，通往幽竹林深处的路还很长。',
    ];
  }

  return [
    `村长：还差 ${quest.requiredKills - quest.currentKills} 条竹叶蛇。`,
    '村长：进入东边竹林时要小心，毒蛇常藏在竹影里。',
  ];
};


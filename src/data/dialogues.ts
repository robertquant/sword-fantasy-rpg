import { acceptActiveQuest, getActiveQuest, turnInActiveQuest } from '../systems/gameState';

export const getElderDialogue = (): string[] => {
  const quest = getActiveQuest();

  if (!quest.accepted) {
    acceptActiveQuest();
    if (quest.id === 'bamboo_demon_trial') {
      return [
        '村长：竹林外围已清，但深处传来妖气，恐怕是竹妖在作祟。',
        '村长：去幽竹林最深处击败竹妖，村子才算真正安全。',
        '任务已接受：竹林深处。',
      ];
    }
    return [
      '村长：少侠，幽竹林近来毒蛇横行，村民不敢采药。',
      '村长：请你去竹林击败 3 条竹叶蛇，我会记下你的功劳。',
      '任务已接受：竹林蛇患。',
    ];
  }

  if (quest.completed && !quest.turnedIn) {
    turnInActiveQuest();
    if (quest.id === 'clear_bamboo_snakes') {
      return [
        '村长：竹叶蛇已退，村民终于能重新采药了。',
        '获得奖励：30 金。幽竹林深处已开放。',
        '村长：不过深处还有竹妖盘踞，你若准备好了，再来找我。',
      ];
    }
    return [
      '村长：竹妖已除，青云村暂时安全了。',
      '获得奖励：80 金。当前版本的主线任务已完成。',
    ];
  }

  if (quest.turnedIn && quest.id === 'bamboo_demon_trial') {
    return [
      '村长：青云村会记得你的功劳。可竹妖遗下的黑气，指向更远的山道。',
      '村长：若你准备继续主线，就按 M 键追查灵脉异变。',
    ];
  }

  return [
    `村长：${quest.title}还差 ${quest.requiredKills - quest.currentKills} 个目标。`,
    quest.id === 'clear_bamboo_snakes' ? '村长：进入东边竹林时要小心。' : '村长：竹妖在竹林最深处，不会像毒蛇那样随处出现。',
  ];
};

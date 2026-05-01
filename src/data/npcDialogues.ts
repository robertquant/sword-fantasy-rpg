import { getElderDialogue } from './dialogues';
import type { NpcDefinition } from './maps';

const simpleDialogues: Record<string, string[]> = {
  herbalist: [
    '药师：幽竹林的毒蛇近来暴躁，若中了毒，先稳住气息再出剑。',
    '药师：净息能解毒并回一点气血，别等到血线太低才用。',
    '药师：等村里药材恢复，我可以做些金创药给你备着。',
  ],
  blacksmith: [
    '铁匠：你的剑胚还算结实，但火候未到，遇到强妖会吃力。',
    '铁匠：后面若寻到灵铁，我能帮你打第一把真正的修行长剑。',
    '铁匠：赤焰山的矿脉最好，可那边妖火很重。',
  ],
  patrol_disciple: [
    '巡逻弟子：我在竹林边缘见过妖气回旋，深处绝不是普通蛇患。',
    '巡逻弟子：竹妖会分身，别只顾猛攻，防御和净息也要穿插用。',
    '巡逻弟子：若你能清掉竹妖，村道就能重新通往更远的山口。',
  ],
};

export const getNpcDialogue = (npc: NpcDefinition): string[] => {
  if (npc.id === 'village_elder') return getElderDialogue();
  return simpleDialogues[npc.id] ?? [`${npc.name}：愿山风护你一路平安。`];
};

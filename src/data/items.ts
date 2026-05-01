export type ItemId = 'healing_pill' | 'spirit_pill' | 'antidote_powder' | 'calming_herb';

export interface ItemDefinition {
  id: ItemId;
  name: string;
}

export const ITEMS: Record<ItemId, ItemDefinition> = {
  healing_pill: { id: 'healing_pill', name: '金创药' },
  spirit_pill: { id: 'spirit_pill', name: '灵气丹' },
  antidote_powder: { id: 'antidote_powder', name: '解毒散' },
  calming_herb: { id: 'calming_herb', name: '清心草' },
};

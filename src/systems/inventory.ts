import { ITEMS, type ItemId } from '../data/items';

export type Inventory = Record<ItemId, number>;

export const createInventory = (): Inventory => ({
  healing_pill: 0,
  spirit_pill: 0,
  antidote_powder: 0,
  calming_herb: 0,
});

export const addItem = (inventory: Inventory, itemId: ItemId, amount: number): void => {
  inventory[itemId] += amount;
};

export const removeItem = (inventory: Inventory, itemId: ItemId, amount: number): boolean => {
  if (inventory[itemId] < amount) return false;
  inventory[itemId] -= amount;
  return true;
};

export const formatInventoryLine = (inventory: Inventory): string =>
  `${ITEMS.healing_pill.name} ${inventory.healing_pill}  ${ITEMS.antidote_powder.name} ${inventory.antidote_powder}  ${ITEMS.calming_herb.name} ${inventory.calming_herb}`;

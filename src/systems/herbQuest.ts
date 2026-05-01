import Phaser from 'phaser';
import { QINGYUN_MAP, type HerbNodeDefinition } from '../data/maps';
import { gameState, gatherHerb, startHerbQuest } from './gameState';

export const createHerbNodes = (scene: Phaser.Scene): Phaser.GameObjects.Arc[] =>
  QINGYUN_MAP.herbNodes.map(node => {
    const herb = scene.add.circle(node.x, node.y, 10, 0xa5f27a, 0.82).setStrokeStyle(2, 0xe6ffd1);
    herb.setData('herbNode', node);
    return herb;
  });

export const findNearbyHerb = (
  player: Phaser.Physics.Arcade.Sprite,
  herbNodes: Phaser.GameObjects.Arc[],
): Phaser.GameObjects.Arc | undefined =>
  herbNodes.find(herb => herb.visible && Phaser.Math.Distance.Between(player.x, player.y, herb.x, herb.y) < 54);

export const canGatherHerb = (): boolean => {
  const quest = gameState.herbQuest;
  return quest.accepted && !quest.completed;
};

export const gatherNearbyHerb = (player: Phaser.Physics.Arcade.Sprite, herbNodes: Phaser.GameObjects.Arc[]): string | undefined => {
  const herb = findNearbyHerb(player, herbNodes);
  if (!herb) return undefined;
  if (!canGatherHerb()) return '这株草药还不能采，先找药师问问。';
  const node = getHerbNode(herb);
  if (!gatherHerb(node.id)) return undefined;
  herb.setVisible(false);
  const count = gameState.herbQuest.gatheredHerbIds.length;
  return count >= 3 ? '清心草已采齐，回去找药师。' : `采得清心草。进度 ${count}/3`;
};

export const acceptHerbQuestIfReady = (): boolean => startHerbQuest();

export const getHerbNode = (herb: Phaser.GameObjects.Arc): HerbNodeDefinition => herb.getData('herbNode') as HerbNodeDefinition;

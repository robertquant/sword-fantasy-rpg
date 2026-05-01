import Phaser from 'phaser';
import type { NpcDefinition } from '../data/maps';

export const createNpcSprites = (scene: Phaser.Scene, npcs: NpcDefinition[]): Phaser.Physics.Arcade.Sprite[] =>
  npcs.map(npc => {
    const sprite = scene.physics.add.staticSprite(npc.x, npc.y, npc.texture);
    sprite.setDisplaySize(npc.id === 'village_elder' ? 44 : 50, npc.id === 'village_elder' ? 44 : 50);
    sprite.setData('npc', npc);
    scene.add.text(npc.x, npc.y - 38, npc.name, { fontSize: '13px', color: '#fff' }).setOrigin(0.5);
    return sprite;
  });

export const findNearbyNpc = (
  player: Phaser.Physics.Arcade.Sprite,
  npcSprites: Phaser.Physics.Arcade.Sprite[],
): NpcDefinition | undefined => {
  const sprite = npcSprites.find(target => Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y) < 70);
  return sprite?.getData('npc') as NpcDefinition | undefined;
};

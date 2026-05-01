import type Phaser from 'phaser';
import { QINGYUN_MAP } from '../data/maps';

export const createActorTextures = (scene: Phaser.Scene): void => {
  createCircleTexture(scene, 'hero', 0xe94560, 0xffffff);
  createCircleTexture(scene, 'elder', 0xf0c987, 0x5c3a21);
};

export const drawQingyunMap = (scene: Phaser.Scene): void => {
  scene.add.rectangle(800, 600, QINGYUN_MAP.width, QINGYUN_MAP.height, 0x6f9f59);
  scene.add.rectangle(1180, 515, 430, 650, 0x2f6d3d, 0.88);
  scene.add.rectangle(1180, 515, 410, 620, 0x204b33, 0.32);
  scene.add.rectangle(520, 690, 1050, 70, 0xc8b177);
  scene.add.rectangle(810, 360, 75, 660, 0xc8b177);
  scene.add.rectangle(180, 190, 260, 180, 0x8e5a32);
  scene.add.rectangle(520, 185, 170, 130, 0x8e5a32);
  scene.add.rectangle(130, 850, 240, 190, 0x7d9ec0);
  scene.add.rectangle(1270, 980, 330, 120, 0x2d6f9f);
  scene.add.text(1160, 160, '幽竹林', { fontSize: '24px', color: '#d7f7c2' }).setOrigin(0.5);
  scene.add.text(310, 645, '青云村', { fontSize: '22px', color: '#392414' }).setOrigin(0.5);
};

const createCircleTexture = (scene: Phaser.Scene, key: string, color: number, stroke: number): void => {
  if (scene.textures.exists(key)) return;
  const gfx = scene.make.graphics({ x: 0, y: 0 });
  gfx.fillStyle(color, 1).fillCircle(16, 16, 13);
  gfx.lineStyle(3, stroke, 1).strokeCircle(16, 16, 13);
  gfx.generateTexture(key, 32, 32);
  gfx.destroy();
};


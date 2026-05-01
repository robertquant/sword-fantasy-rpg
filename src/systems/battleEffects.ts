import type Phaser from 'phaser';

export const lunge = (scene: Phaser.Scene, target: Phaser.GameObjects.Image, dx: number, dy = 0): Promise<void> =>
  new Promise(resolve => {
    scene.tweens.add({ targets: target, x: target.x + dx, y: target.y + dy, yoyo: true, duration: 120, onComplete: () => resolve() });
  });

export const hitFlash = (scene: Phaser.Scene, target: Phaser.GameObjects.Image): Promise<void> =>
  new Promise(resolve => {
    scene.tweens.add({ targets: target, alpha: 0.35, yoyo: true, repeat: 2, duration: 70, onComplete: () => { target.setAlpha(1); resolve(); } });
  });

export const swordWave = (scene: Phaser.Scene, x: number, y: number): void => {
  const wave = scene.add.ellipse(x, y, 20, 92, 0xcff6ff, 0.75);
  scene.tweens.add({ targets: wave, y: y - 210, alpha: 0, scaleY: 1.7, duration: 280, onComplete: () => wave.destroy() });
};

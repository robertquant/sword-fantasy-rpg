import type Phaser from 'phaser';

export const lunge = (scene: Phaser.Scene, target: Phaser.GameObjects.Image, dx: number): Promise<void> =>
  new Promise(resolve => {
    scene.tweens.add({ targets: target, x: target.x + dx, yoyo: true, duration: 120, onComplete: () => resolve() });
  });

export const hitFlash = (scene: Phaser.Scene, target: Phaser.GameObjects.Image): Promise<void> =>
  new Promise(resolve => {
    scene.tweens.add({ targets: target, alpha: 0.35, yoyo: true, repeat: 2, duration: 70, onComplete: () => { target.setAlpha(1); resolve(); } });
  });

export const swordWave = (scene: Phaser.Scene, x: number, y: number): void => {
  const wave = scene.add.ellipse(x, y, 18, 80, 0xcff6ff, 0.75).setAngle(70);
  scene.tweens.add({ targets: wave, x: x - 180, alpha: 0, scaleX: 1.8, duration: 260, onComplete: () => wave.destroy() });
};


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
  const group = scene.add.container(x, y);
  const blade = scene.add.ellipse(0, 0, 28, 132, 0xdffcff, 0.86);
  const core = scene.add.ellipse(0, -8, 10, 160, 0xffffff, 0.92);
  const ring = scene.add.ellipse(0, 8, 78, 22, 0x7af6ff, 0.32).setStrokeStyle(2, 0xe9ffff, 0.8);
  group.add([blade, core, ring]);
  scene.tweens.add({ targets: group, y: y - 235, alpha: 0, scaleX: 1.35, scaleY: 1.75, duration: 360, ease: 'Cubic.easeOut', onComplete: () => group.destroy() });
  scene.tweens.add({ targets: ring, angle: 180, scaleX: 1.8, duration: 280 });
  scene.cameras.main.shake(110, 0.006);
};

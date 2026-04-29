import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 显示加载进度
    const bar = this.add.graphics();
    const text = this.add.text(400, 300, '加载中...', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0xe94560, 1);
      bar.fillRect(200, 350, 400 * value, 20);
      text.setText(`加载中... ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      bar.destroy();
      text.destroy();
    });

    // 加载素材 — 后续用 $generate2dsprite 和 $generate2dmap 生成
    // this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
    // this.load.tilemapTiledJSON('village', 'assets/maps/village.json');
    // this.load.image('tiles', 'assets/maps/tiles.png');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

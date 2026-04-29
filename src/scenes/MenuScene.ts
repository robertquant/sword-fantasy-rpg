import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 标题
    this.add.text(width / 2, height / 3, '剑 道 幻 境', {
      fontSize: '48px',
      color: '#e94560',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 副标题
    this.add.text(width / 2, height / 3 + 60, '太古纪元 · 九州大陆', {
      fontSize: '16px',
      color: '#aaa',
    }).setOrigin(0.5);

    // 开始按钮
    const startBtn = this.add.text(width / 2, height * 0.6, '[ 开始冒险 ]', {
      fontSize: '24px',
      color: '#fff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setColor('#e94560'));
    startBtn.on('pointerout', () => startBtn.setColor('#fff'));
    startBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('MapScene'));
    });
  }
}

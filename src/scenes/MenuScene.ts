import Phaser from 'phaser';
import { audioManager } from '../systems/audioManager';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;
    audioManager.unlock(this);
    audioManager.startMusic('title');
    this.add.image(width / 2, height / 2, 'title-background').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x07110f, 0.25);

    this.add.text(width / 2, 150, '剑 道 幻 境', {
      fontSize: '58px',
      color: '#f7e3a3',
      fontStyle: 'bold',
      stroke: '#24130f',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(width / 2, 218, '青云村篇 · 幽竹林试炼', {
      fontSize: '18px',
      color: '#d7f7c2',
      stroke: '#102018',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const startBtn = this.add.text(width / 2, height * 0.68, '开始冒险', {
      fontSize: '26px',
      color: '#2b160f',
      backgroundColor: '#f0c987',
      padding: { x: 38, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height * 0.8, 'WASD / 方向键移动    空格对话', {
      fontSize: '14px',
      color: '#d9d2be',
      backgroundColor: '#0007',
      padding: { x: 14, y: 8 },
    }).setOrigin(0.5);

    startBtn.on('pointerover', () => { audioManager.playSfx('select'); startBtn.setStyle({ backgroundColor: '#ffe0a6' }); });
    startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#f0c987' }));
    startBtn.on('pointerdown', () => {
      audioManager.playSfx('select');
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('MapScene'));
    });
  }
}

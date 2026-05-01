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

    this.load.image('map-qingyun-bamboo', 'assets/maps/qingyun-bamboo-map.png');
    this.load.image('map-qingstone-road', 'assets/maps/qingstone-road.png');
    this.load.image('title-background', 'assets/ui/title-background.png');
    this.load.spritesheet('hero-walk', 'assets/sprites/player/sword-cultivator-walk.png', { frameWidth: 96, frameHeight: 96 });
    this.load.image('elder', 'assets/sprites/npc/village-elder.png');
    this.load.image('npc-herbalist', 'assets/sprites/npc/herbalist.png');
    this.load.image('npc-blacksmith', 'assets/sprites/npc/blacksmith.png');
    this.load.image('npc-patrol', 'assets/sprites/npc/patrol-disciple.png');
    this.load.image('enemy-bamboo-snake', 'assets/sprites/enemies/bamboo-snake.png');
    this.load.image('enemy-bamboo-demon', 'assets/sprites/enemies/bamboo-demon.png');
    this.load.image('enemy-mountain-imp', 'assets/sprites/enemies/mountain-imp.png');
    this.load.image('battleback-bamboo', 'assets/battlebacks/bamboo-battle.png');
    this.load.image('battleback-qingstone-road', 'assets/battlebacks/qingstone-road-battle.png');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

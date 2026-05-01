import Phaser from 'phaser';

export class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private battleKey!: Phaser.Input.Keyboard.Key;
  private startX = 400;
  private startY = 300;

  constructor() {
    super({ key: 'MapScene' });
  }

  init(data: { playerX?: number; playerY?: number }): void {
    this.startX = data.playerX ?? 400;
    this.startY = data.playerY ?? 300;
  }

  create(): void {
    this.cameras.main.fadeIn(500);

    // 临时地面（后续替换为真实地图）
    this.add.rectangle(400, 300, 800, 600, 0x2d5a3d);

    // 临时玩家（后续替换为精灵表）
    this.player = this.add.rectangle(this.startX, this.startY, 28, 28, 0xe94560);

    // 键盘输入
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.battleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B);

    // 临时遇敌区域
    const encounterZone = this.add.rectangle(300, 200, 120, 120, 0x3a7d44, 0.5);
    this.add.text(300, 200, '竹林\n(遇敌)', { fontSize: '12px', color: '#fff' }).setOrigin(0.5);

    // 进入遇敌区域提示
    this.physics.add.existing(this.player);
    this.physics.add.existing(encounterZone);
  }

  update(): void {
    const speed = 3;
    const body = this.player;

    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;

    body.setX(Phaser.Math.Clamp(body.x + vx, 14, 786));
    body.setY(Phaser.Math.Clamp(body.y + vy, 14, 586));

    // 按 B 键触发测试战斗
    if (Phaser.Input.Keyboard.JustDown(this.battleKey)) {
      this.enterBattle();
    }
  }

  private enterBattle(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('BattleScene', {
        enemyId: 'bamboo_snake',
        returnMap: 'MapScene',
        playerX: this.player.x,
        playerY: this.player.y,
      });
    });
  }
}

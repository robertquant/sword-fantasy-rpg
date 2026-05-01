import Phaser from 'phaser';

type Facing = 'down' | 'left' | 'right' | 'up';
type WasdKeys = Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

const MOVE_SPEED = 170;
const IDLE_FRAMES: Record<Facing, number> = { down: 0, left: 4, right: 8, up: 12 };

export class PlayerController {
  private facing: Facing = 'down';

  constructor(private readonly player: Phaser.Physics.Arcade.Sprite) {}

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasd: WasdKeys): void {
    const velocity = new Phaser.Math.Vector2(0, 0);
    if (cursors.left.isDown || wasd.A.isDown) velocity.x -= 1;
    if (cursors.right.isDown || wasd.D.isDown) velocity.x += 1;
    if (cursors.up.isDown || wasd.W.isDown) velocity.y -= 1;
    if (cursors.down.isDown || wasd.S.isDown) velocity.y += 1;
    velocity.normalize().scale(MOVE_SPEED);
    this.player.setVelocity(velocity.x, velocity.y);
    this.updateAnimation(velocity);
  }

  stop(): void {
    this.player.setVelocity(0);
    this.player.anims.stop();
    this.player.setFrame(IDLE_FRAMES[this.facing]);
  }

  private updateAnimation(velocity: Phaser.Math.Vector2): void {
    if (velocity.lengthSq() === 0) {
      this.stop();
      return;
    }
    if (Math.abs(velocity.x) > Math.abs(velocity.y)) this.facing = velocity.x > 0 ? 'right' : 'left';
    else this.facing = velocity.y > 0 ? 'down' : 'up';
    this.player.anims.play(`hero-walk-${this.facing}`, true);
  }
}


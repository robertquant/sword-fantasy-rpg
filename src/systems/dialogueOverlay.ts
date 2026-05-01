import type Phaser from 'phaser';

export class DialogueOverlay {
  private container?: Phaser.GameObjects.Container;
  private text?: Phaser.GameObjects.Text;
  private index = 0;
  private lines: string[] = [];

  constructor(private readonly scene: Phaser.Scene) {}

  open(lines: string[]): void {
    this.destroy();
    this.lines = lines;
    this.index = 0;
    const panel = this.scene.add.rectangle(400, 500, 730, 150, 0x171018, 0.94).setStrokeStyle(2, 0xf0c987);
    this.text = this.scene.add.text(60, 455, this.lines[this.index], {
      fontSize: '18px',
      color: '#fff',
      lineSpacing: 8,
      wordWrap: { width: 680 },
    });
    const hint = this.scene.add.text(720, 565, '空格继续', { fontSize: '13px', color: '#f0c987' }).setOrigin(1, 0.5);
    this.container = this.scene.add.container(0, 0, [panel, this.text, hint]).setScrollFactor(0);
  }

  advance(): boolean {
    if (!this.container || !this.text) return true;
    this.index += 1;
    if (this.index >= this.lines.length) {
      this.destroy();
      return true;
    }
    this.text.setText(this.lines[this.index]);
    return false;
  }

  destroy(): void {
    this.container?.destroy();
    this.container = undefined;
    this.text = undefined;
    this.lines = [];
  }
}


import Phaser from 'phaser';
import { ENEMIES, createEnemyFighter } from '../data/enemies';
import { createStarterPlayer } from '../data/player';
import type { BattleAction, BattleData, Fighter, StatusBar } from '../systems/battleTypes';

const ACTIONS: { label: string; action: BattleAction; color: string }[] = [
  { label: '⚔ 攻击', action: 'attack', color: '#e94560' },
  { label: '✨ 技能', action: 'skill', color: '#3498db' },
  { label: '🛡 防御', action: 'defend', color: '#2ecc71' },
  { label: '🏃 逃跑', action: 'flee', color: '#95a5a6' },
];

export class BattleScene extends Phaser.Scene {
  private player!: Fighter;
  private enemy!: Fighter;
  private turnText!: Phaser.GameObjects.Text;
  private actionButtons: Phaser.GameObjects.Text[] = [];
  private logText!: Phaser.GameObjects.Text;
  private log: string[] = [];
  private isPlayerTurn = true;
  private battleOver = false;
  private battleData!: BattleData;
  private playerHpBar!: StatusBar;
  private playerMpBar!: StatusBar;
  private enemyHpBar!: StatusBar;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: BattleData): void {
    this.battleData = data;
    this.isPlayerTurn = true;
    this.battleOver = false;
    this.log = [];
  }

  create(): void {
    this.cameras.main.fadeIn(300);

    this.player = createStarterPlayer();
    this.enemy = createEnemyFighter(this.battleData.enemyId);
    const enemyDefinition = ENEMIES[this.battleData.enemyId] ?? ENEMIES.bamboo_snake;

    // 战斗背景
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    // 敌人精灵（临时方块，后续替换）
    this.add.rectangle(400, 150, 64, 64, enemyDefinition.color);
    this.add.text(400, 110, this.enemy.name, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

    // 玩家精灵
    this.add.rectangle(400, 420, 48, 48, 0xe94560);
    this.add.text(400, 390, '剑修', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

    // HP/MP 条
    this.playerHpBar = this.createBar(300, 460, 200, 12, 0xe94560, `HP ${this.player.hp}/${this.player.maxHp}`);
    this.playerMpBar = this.createBar(300, 476, 200, 8, 0x3498db, `MP ${this.player.mp}/${this.player.maxMp}`);
    this.enemyHpBar = this.createBar(300, 185, 200, 12, 0xe74c3c, `HP ${this.enemy.hp}/${this.enemy.maxHp}`);

    // 回合提示
    this.turnText = this.add.text(400, 240, '你的回合', { fontSize: '18px', color: '#f1c40f' }).setOrigin(0.5);

    // 操作按钮
    ACTIONS.forEach((a, i) => {
      const btn = this.add.text(100 + i * 170, 530, a.label, {
        fontSize: '20px', color: a.color,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => this.doPlayerAction(a.action));
      this.actionButtons.push(btn);
    });

    // 战斗日志
    this.logText = this.add.text(20, 510, '', { fontSize: '12px', color: '#ccc', wordWrap: { width: 760 } });
  }

  private createBar(x: number, y: number, w: number, h: number, color: number, label: string): StatusBar {
    this.add.rectangle(x, y + h / 2, w, h, 0x333).setOrigin(0, 0.5);
    const fill = this.add.rectangle(x, y + h / 2, w, h, color).setOrigin(0, 0.5);
    const text = this.add.text(x - 10, y - 5, label, { fontSize: '10px', color: '#fff' }).setOrigin(1, 0);
    return { fill, text, width: w };
  }

  private updateBar(bar: StatusBar, current: number, max: number, label: string): void {
    const pct = Phaser.Math.Clamp(current / max, 0, 1);
    bar.fill.width = bar.width * pct;
    bar.text.setText(label);
  }

  private refreshStats(): void {
    this.updateBar(this.playerHpBar, this.player.hp, this.player.maxHp, `HP ${this.player.hp}/${this.player.maxHp}`);
    this.updateBar(this.playerMpBar, this.player.mp, this.player.maxMp, `MP ${this.player.mp}/${this.player.maxMp}`);
    this.updateBar(this.enemyHpBar, this.enemy.hp, this.enemy.maxHp, `HP ${this.enemy.hp}/${this.enemy.maxHp}`);
  }

  private addLog(msg: string): void {
    this.log.push(msg);
    if (this.log.length > 3) this.log.shift();
    this.logText.setText(this.log.join('\n'));
  }

  private doPlayerAction(action: BattleAction): void {
    if (!this.isPlayerTurn || this.battleOver) return;
    this.isPlayerTurn = false;
    this.setButtonsEnabled(false);

    switch (action) {
      case 'attack': {
        const dmg = Math.max(1, this.player.atk - this.enemy.def + Phaser.Math.Between(-3, 3));
        this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
        this.refreshStats();
        this.addLog(`剑修 攻击！造成 ${dmg} 点伤害`);
        break;
      }
      case 'skill': {
        if (this.player.mp < 10) {
          this.addLog('灵力不足！');
          this.isPlayerTurn = true;
          this.setButtonsEnabled(true);
          return;
        }
        this.player.mp -= 10;
        const dmg = Math.max(1, this.player.atk * 1.8 - this.enemy.def + Phaser.Math.Between(-2, 5));
        this.enemy.hp = Math.max(0, this.enemy.hp - Math.floor(dmg));
        this.refreshStats();
        this.addLog(`剑气斩！造成 ${Math.floor(dmg)} 点伤害`);
        break;
      }
      case 'defend':
        this.addLog('剑修 进入防御姿态');
        break;
      case 'flee': {
        if (Math.random() < 0.5) {
          this.addLog('逃跑成功！');
          this.time.delayedCall(800, () => this.endBattle(false));
          return;
        }
        this.addLog('逃跑失败！');
        break;
      }
    }

    // 检查敌人是否死亡
    if (this.enemy.hp <= 0) {
      this.addLog(`${this.enemy.name} 被击败！获得 30 经验值`);
      this.time.delayedCall(1000, () => this.endBattle(false, true));
      return;
    }

    // 敌人回合
    this.turnText.setText('敌方回合');
    this.time.delayedCall(1000, () => this.doEnemyAction());
  }

  private doEnemyAction(): void {
    const dmg = Math.max(1, this.enemy.atk - this.player.def + Phaser.Math.Between(-2, 3));
    this.player.hp = Math.max(0, this.player.hp - dmg);
    this.refreshStats();
    this.addLog(`${this.enemy.name} 攻击！造成 ${dmg} 点伤害`);

    if (this.player.hp <= 0) {
      this.addLog('你被击败了...');
      this.time.delayedCall(1000, () => this.endBattle(true));
      return;
    }

    this.isPlayerTurn = true;
    this.turnText.setText('你的回合');
    this.setButtonsEnabled(true);
  }

  private setButtonsEnabled(enabled: boolean): void {
    this.actionButtons.forEach(btn => {
      btn.setAlpha(enabled ? 1 : 0.4);
    });
  }

  private endBattle(playerLost: boolean, playerWon = false): void {
    this.battleOver = true;
    if (playerLost && !playerWon) {
      this.turnText.setText('战斗失败...').setColor('#e74c3c');
    } else {
      this.turnText.setText('战斗胜利！').setColor('#2ecc71');
    }
    this.time.delayedCall(2000, () => {
      this.scene.start(this.battleData.returnMap || 'MapScene', {
        playerX: this.battleData.playerX,
        playerY: this.battleData.playerY,
      });
    });
  }
}

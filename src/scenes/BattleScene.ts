import Phaser from 'phaser';
import { BATTLE_ACTIONS } from '../data/battleActions';
import { ENEMIES, createEnemyFighter } from '../data/enemies';
import { createStarterPlayer } from '../data/player';
import { performEnemyAction, performPlayerAction } from '../systems/battleAi';
import { hitFlash, lunge, swordWave } from '../systems/battleEffects';
import { audioManager } from '../systems/audioManager';
import type { BattleAction, BattleData, Fighter, StatusBar } from '../systems/battleTypes';

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
  private playerSprite!: Phaser.GameObjects.Image;
  private enemySprite!: Phaser.GameObjects.Image;

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
    audioManager.unlock(this);
    audioManager.startMusic('battle');

    this.player = createStarterPlayer();
    this.enemy = createEnemyFighter(this.battleData.enemyId);
    const enemyDefinition = ENEMIES[this.battleData.enemyId] ?? ENEMIES.bamboo_snake;

    // 战斗背景
    this.add.image(400, 300, 'battleback-bamboo').setDisplaySize(800, 600);
    this.add.rectangle(400, 300, 800, 600, 0x06120d, 0.28);
    this.add.text(400, 38, '幽竹林遭遇战', { fontSize: '22px', color: '#d7f7c2' }).setOrigin(0.5);

    // 敌人精灵
    const enemyKey = this.battleData.enemyId === 'bamboo_demon' ? 'enemy-bamboo-demon' : 'enemy-bamboo-snake';
    this.enemySprite = this.add.image(400, 150, enemyKey).setDisplaySize(this.battleData.enemyId === 'bamboo_demon' ? 150 : 96, this.battleData.enemyId === 'bamboo_demon' ? 150 : 96);
    this.add.text(400, 110, this.enemy.name, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

    // 玩家精灵
    this.playerSprite = this.add.image(400, 420, 'hero-walk', 0).setDisplaySize(74, 74);
    this.add.text(400, 390, '剑修', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

    // HP/MP 条
    this.playerHpBar = this.createBar(300, 460, 200, 12, 0xe94560, `HP ${this.player.hp}/${this.player.maxHp}`);
    this.playerMpBar = this.createBar(300, 476, 200, 8, 0x3498db, `MP ${this.player.mp}/${this.player.maxMp}`);
    this.enemyHpBar = this.createBar(300, 185, 200, 12, 0xe74c3c, `HP ${this.enemy.hp}/${this.enemy.maxHp}`);

    // 回合提示
    this.turnText = this.add.text(400, 240, '你的回合', { fontSize: '18px', color: '#f1c40f' }).setOrigin(0.5);

    // 操作按钮
    BATTLE_ACTIONS.forEach((a, i) => {
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
    if (this.log.length > 4) this.log.shift();
    this.logText.setText(this.log.join('\n'));
  }

  private async doPlayerAction(action: BattleAction): Promise<void> {
    if (!this.isPlayerTurn || this.battleOver) return;
    this.isPlayerTurn = false;
    this.setButtonsEnabled(false);

    if (action === 'flee') {
      this.player.statuses = this.player.statuses.filter(status => status.type !== 'poison');
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 12);
      this.player.mp = Math.min(this.player.maxMp, this.player.mp + 8);
      audioManager.playSfx('poison');
      this.addLog('剑修净息调脉，解除中毒并回复少量 HP/MP。');
    } else {
      audioManager.playSfx(action === 'skill' ? 'skill' : 'attack');
      if (action === 'skill') swordWave(this, this.playerSprite.x, this.playerSprite.y - 45);
      await lunge(this, this.playerSprite, 0, -45);
      const result = performPlayerAction(action, this.player, this.enemy);
      result.logs.forEach(log => this.addLog(log));
      audioManager.playSfx('hit');
      await hitFlash(this, this.enemySprite);
    }
    this.refreshStats();

    if (this.enemy.hp <= 0) {
      const enemyDefinition = ENEMIES[this.battleData.enemyId] ?? ENEMIES.bamboo_snake;
      this.addLog(`${this.enemy.name} 被击败！获得 ${enemyDefinition.expReward} 经验值`);
      this.time.delayedCall(1000, () => this.endBattle(false, true));
      return;
    }

    // 敌人回合
    this.turnText.setText('敌方回合');
    this.time.delayedCall(1000, () => this.doEnemyAction());
  }

  private async doEnemyAction(): Promise<void> {
    await lunge(this, this.enemySprite, 0, 45);
    const result = performEnemyAction(this.battleData.enemyId, this.enemy, this.player);
    result.logs.forEach(log => this.addLog(log));
    audioManager.playSfx(result.logs.some(log => log.includes('中毒')) ? 'poison' : 'hit');
    await hitFlash(this, this.playerSprite);
    this.refreshStats();

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
      audioManager.playSfx('win');
    }
    this.time.delayedCall(2000, () => {
      const enemyDefinition = ENEMIES[this.battleData.enemyId] ?? ENEMIES.bamboo_snake;
      this.scene.start(this.battleData.returnMap || 'MapScene', {
        playerX: this.battleData.playerX,
        playerY: this.battleData.playerY,
        battleResult: {
          playerWon,
          enemyId: enemyDefinition.id,
          expReward: enemyDefinition.expReward,
          goldReward: enemyDefinition.goldReward,
        },
      });
    });
  }
}

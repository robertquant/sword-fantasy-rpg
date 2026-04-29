import Phaser from 'phaser';

interface BattleData {
  enemyId: string;
  returnMap: string;
  playerX: number;
  playerY: number;
}

interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  spd: number;
}

type BattleAction = 'attack' | 'skill' | 'defend' | 'item' | 'flee';

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

    // 初始化战斗数据
    this.player = {
      name: '剑修',
      hp: 100, maxHp: 100,
      mp: 50, maxMp: 50,
      atk: 15, def: 8, spd: 10,
    };

    const enemies: Record<string, Partial<Fighter> & { color: number }> = {
      bamboo_snake: { name: '竹叶蛇', hp: 30, atk: 8, def: 3, spd: 6, color: 0x4a7c3f },
      bamboo_demon: { name: '竹妖', hp: 50, atk: 12, def: 5, spd: 8, color: 0x2d5a27 },
      fire_lizard: { name: '火蜥蜴', hp: 80, atk: 18, def: 8, spd: 7, color: 0xc0392b },
    };

    const e = enemies[this.battleData.enemyId] || enemies.bamboo_snake;
    this.enemy = {
      name: e.name!,
      hp: e.hp!, maxHp: e.hp!,
      mp: 0, maxMp: 0,
      atk: e.atk!, def: e.def!, spd: e.spd!,
    };

    // 战斗背景
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    // 敌人精灵（临时方块，后续替换）
    const enemyGfx = this.add.rectangle(400, 150, 64, 64, e.color);
    this.add.text(400, 110, e.name!, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

    // 玩家精灵
    this.add.rectangle(400, 420, 48, 48, 0xe94560);
    this.add.text(400, 390, '剑修', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

    // HP/MP 条
    this.drawBar(300, 460, 200, 12, this.player.hp / this.player.maxHp, 0xe94560);
    this.drawBar(300, 476, 200, 8, this.player.mp / this.player.maxMp, 0x3498db);
    this.add.text(290, 455, `HP ${this.player.hp}/${this.player.maxHp}`, { fontSize: '10px', color: '#fff' }).setOrigin(1, 0);
    this.add.text(290, 472, `MP ${this.player.mp}/${this.player.maxMp}`, { fontSize: '10px', color: '#fff' }).setOrigin(1, 0);

    this.drawBar(300, 185, 200, 12, this.enemy.hp / this.enemy.maxHp, 0xe74c3c);
    this.add.text(290, 180, `HP ${this.enemy.hp}/${this.enemy.maxHp}`, { fontSize: '10px', color: '#fff' }).setOrigin(1, 0);

    // 回合提示
    this.turnText = this.add.text(400, 240, '你的回合', { fontSize: '18px', color: '#f1c40f' }).setOrigin(0.5);

    // 操作按钮
    const actions: { label: string; action: BattleAction; color: string }[] = [
      { label: '⚔ 攻击', action: 'attack', color: '#e94560' },
      { label: '✨ 技能', action: 'skill', color: '#3498db' },
      { label: '🛡 防御', action: 'defend', color: '#2ecc71' },
      { label: '🏃 逃跑', action: 'flee', color: '#95a5a6' },
    ];

    actions.forEach((a, i) => {
      const btn = this.add.text(100 + i * 170, 530, a.label, {
        fontSize: '20px', color: a.color,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => this.doPlayerAction(a.action));
      this.actionButtons.push(btn);
    });

    // 战斗日志
    this.logText = this.add.text(20, 510, '', { fontSize: '12px', color: '#ccc', wordWrap: { width: 760 } });
  }

  private drawBar(x: number, y: number, w: number, h: number, pct: number, color: number): void {
    this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x333);
    this.add.rectangle(x + (w * pct) / 2, y + h / 2, w * pct, h, color);
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

import Phaser from 'phaser';
import { getElderDialogue } from '../data/dialogues';
import { QINGYUN_MAP, type NpcDefinition } from '../data/maps';
import { DialogueOverlay } from '../systems/dialogueOverlay';
import { EncounterSystem, isPointInZone } from '../systems/encounterSystem';
import { applyBattleResult, gameState, getActiveQuest, type BattleResult } from '../systems/gameState';
import { drawQingyunMap } from '../systems/mapRenderer';
import { PlayerController } from '../systems/playerController';

interface MapSceneData {
  playerX?: number;
  playerY?: number;
  battleResult?: BattleResult;
}

const PLAYER_SIZE = 28;
export class MapScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private battleKey!: Phaser.Input.Keyboard.Key;
  private hudText!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;
  private dialogue!: DialogueOverlay;
  private playerController!: PlayerController;
  private encounters = new EncounterSystem();
  private npcSprites: Phaser.Physics.Arcade.Sprite[] = [];
  private bossTriggered = false;
  private startX = QINGYUN_MAP.playerSpawn.x;
  private startY = QINGYUN_MAP.playerSpawn.y;
  private inputLocked = false;

  constructor() {
    super({ key: 'MapScene' });
  }

  init(data: MapSceneData): void {
    this.startX = data.playerX ?? QINGYUN_MAP.playerSpawn.x;
    this.startY = data.playerY ?? QINGYUN_MAP.playerSpawn.y;
    this.inputLocked = false;
    this.npcSprites = [];
    this.bossTriggered = false;
    if (data.battleResult) this.handleBattleResult(data.battleResult);
  }

  create(): void {
    this.cameras.main.fadeIn(350);
    drawQingyunMap(this);
    this.createAnimations();
    this.createPlayer(); this.createBlockers();
    this.createNpcs();
    this.createInput(); this.createHud();
    this.dialogue = new DialogueOverlay(this);
  }

  update(_time: number, delta: number): void {
    if (this.inputLocked) { this.playerController.stop(); if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.advanceDialogue(); return; }
    this.playerController.update(this.cursors, this.wasd);

    this.trackEncounterDistance(); this.trackBossZone();
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.tryInteract();
    if (Phaser.Input.Keyboard.JustDown(this.battleKey)) this.enterBattle('bamboo_snake');
    this.refreshHud();
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(this.startX, this.startY, 'hero-walk', 0);
    this.player.setDisplaySize(42, 42);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(PLAYER_SIZE, PLAYER_SIZE);
    this.playerController = new PlayerController(this.player);
    this.physics.world.setBounds(0, 0, QINGYUN_MAP.width, QINGYUN_MAP.height);
    this.cameras.main.setBounds(0, 0, QINGYUN_MAP.width, QINGYUN_MAP.height);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.encounters.reset(this.player.x, this.player.y);
  }

  private createBlockers(): void {
    const blockers = this.physics.add.staticGroup();
    QINGYUN_MAP.blockers.forEach(blocker => {
      const rect = this.add.rectangle(blocker.x, blocker.y, blocker.width, blocker.height, 0x000000, 0);
      blockers.add(rect);
    });
    this.physics.add.collider(this.player, blockers);
  }

  private createNpcs(): void {
    QINGYUN_MAP.npcs.forEach(npc => {
      const sprite = this.physics.add.staticSprite(npc.x, npc.y, npc.id === 'village_elder' ? 'elder' : 'hero');
      sprite.setDisplaySize(44, 44);
      sprite.setData('npc', npc);
      this.npcSprites.push(sprite);
      this.add.text(npc.x, npc.y - 34, npc.name, { fontSize: '13px', color: '#fff' }).setOrigin(0.5);
    });
  }

  private createInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.battleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  }

  private createAnimations(): void {
    const rows = { down: 0, left: 4, right: 8, up: 12 };
    Object.entries(rows).forEach(([direction, start]) => {
      const key = `hero-walk-${direction}`;
      if (this.anims.exists(key)) return;
      this.anims.create({ key, frames: this.anims.generateFrameNumbers('hero-walk', { start, end: start + 3 }), frameRate: 8, repeat: -1 });
    });
  }

  private createHud(): void {
    this.hudText = this.add.text(16, 16, '', { fontSize: '16px', color: '#fff', backgroundColor: '#0008', padding: { x: 10, y: 8 } });
    this.noticeText = this.add.text(400, 560, '', { fontSize: '16px', color: '#fff', backgroundColor: '#0008', padding: { x: 12, y: 8 } }).setOrigin(0.5);
    this.hudText.setScrollFactor(0);
    this.noticeText.setScrollFactor(0);
    this.refreshHud();
    this.showNotice('空格与村长对话，进入东边竹林会随机遇敌。');
  }

  private trackEncounterDistance(): void {
    if (this.encounters.shouldTriggerRandom(this.player.x, this.player.y, QINGYUN_MAP.encounterZone, QINGYUN_MAP.bossZone)) this.enterBattle('bamboo_snake');
  }

  private trackBossZone(): void {
    const quest = getActiveQuest();
    if (!isPointInZone(this.player.x, this.player.y, QINGYUN_MAP.bossZone) || this.bossTriggered) return;
    if (!gameState.bambooDepthUnlocked) {
      this.showNotice('竹林深处妖气太重，先回村长处复命。');
      return;
    }
    if (quest.id === 'bamboo_demon_trial' && quest.accepted && !quest.completed) {
      this.bossTriggered = true;
      this.showNotice('竹影忽然合拢，竹妖现身！');
      this.time.delayedCall(600, () => this.enterBattle('bamboo_demon'));
    }
  }

  private tryInteract(): void {
    const npcSprite = this.npcSprites.find(sprite => Phaser.Math.Distance.Between(this.player.x, this.player.y, sprite.x, sprite.y) < 70);
    if (!npcSprite) { this.showNotice('附近没有可交互对象。'); return; }
    const npc = npcSprite.getData('npc') as NpcDefinition;
    if (npc.id === 'village_elder') this.openDialogue(getElderDialogue());
  }

  private openDialogue(lines: string[]): void {
    this.inputLocked = true;
    this.player.setVelocity(0);
    this.dialogue.open(lines);
  }

  private advanceDialogue(): void {
    if (!this.dialogue.advance()) return;
    this.inputLocked = false;
    this.refreshHud();
  }

  private refreshHud(): void {
    const { player } = gameState;
    const activeQuest = getActiveQuest();
    const questLine = activeQuest.accepted ? `${activeQuest.title}: ${activeQuest.currentKills}/${activeQuest.requiredKills}${activeQuest.completed ? ' 已完成' : ''}` : '主线: 与村长对话';
    this.hudText.setText(`等级 ${player.level}  经验 ${player.exp}/${player.nextLevelExp}  金 ${player.gold}\n${questLine}`);
  }

  private showNotice(message: string): void {
    this.noticeText.setText(message);
    this.time.delayedCall(2400, () => { if (this.noticeText.text === message) this.noticeText.setText(''); });
  }

  private handleBattleResult(result: BattleResult): void {
    const leveledUp = applyBattleResult(result);
    if (!result.playerWon) return;
    this.time.delayedCall(450, () => {
      const reward = `击败敌人，获得 ${result.expReward} 经验和 ${result.goldReward} 金。`;
      if (getActiveQuest().completed) this.showNotice(`${reward} 任务已完成，回村长处复命。`);
      else this.showNotice(leveledUp ? `${reward} 等级提升！` : reward);
    });
  }

  private enterBattle(enemyId: string): void {
    this.inputLocked = true;
    this.player.setVelocity(0);
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('BattleScene', {
        enemyId,
        returnMap: 'MapScene',
        playerX: this.player.x,
        playerY: this.player.y,
      });
    });
  }
}

import Phaser from 'phaser';
import { getElderDialogue } from '../data/dialogues';
import { QINGYUN_MAP, type NpcDefinition, type RectDefinition } from '../data/maps';
import { applyBattleResult, gameState, type BattleResult } from '../systems/gameState';
import { createActorTextures, drawQingyunMap } from '../systems/mapRenderer';

interface MapSceneData {
  playerX?: number;
  playerY?: number;
  battleResult?: BattleResult;
}

const PLAYER_SIZE = 28;
const MOVE_SPEED = 170;
const ENCOUNTER_STEP_DISTANCE = 130;
const ENCOUNTER_CHANCE = 0.18;

export class MapScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private battleKey!: Phaser.Input.Keyboard.Key;
  private hudText!: Phaser.GameObjects.Text;
  private noticeText!: Phaser.GameObjects.Text;
  private dialogueBox?: Phaser.GameObjects.Container;
  private npcSprites: Phaser.Physics.Arcade.Sprite[] = [];
  private distanceSinceEncounter = 0;
  private lastPosition = new Phaser.Math.Vector2();
  private startX = QINGYUN_MAP.playerSpawn.x;
  private startY = QINGYUN_MAP.playerSpawn.y;
  private inputLocked = false;

  constructor() {
    super({ key: 'MapScene' });
  }

  init(data: MapSceneData): void {
    this.startX = data.playerX ?? QINGYUN_MAP.playerSpawn.x;
    this.startY = data.playerY ?? QINGYUN_MAP.playerSpawn.y;
    if (data.battleResult) this.handleBattleResult(data.battleResult);
  }

  create(): void {
    this.cameras.main.fadeIn(350);
    createActorTextures(this);
    drawQingyunMap(this);
    this.createPlayer();
    this.createBlockers();
    this.createNpcs();
    this.createInput();
    this.createHud();
  }

  update(_time: number, delta: number): void {
    if (this.inputLocked) {
      this.player.setVelocity(0);
      return;
    }

    const velocity = new Phaser.Math.Vector2(0, 0);
    if (this.cursors.left.isDown || this.wasd.A.isDown) velocity.x -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) velocity.x += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) velocity.y -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) velocity.y += 1;
    velocity.normalize().scale(MOVE_SPEED);
    this.player.setVelocity(velocity.x, velocity.y);

    this.trackEncounterDistance();
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.tryInteract();
    if (Phaser.Input.Keyboard.JustDown(this.battleKey)) this.enterBattle('bamboo_snake');
    this.refreshHud();
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(this.startX, this.startY, 'hero');
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(PLAYER_SIZE, PLAYER_SIZE);
    this.physics.world.setBounds(0, 0, QINGYUN_MAP.width, QINGYUN_MAP.height);
    this.cameras.main.setBounds(0, 0, QINGYUN_MAP.width, QINGYUN_MAP.height);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.lastPosition.set(this.player.x, this.player.y);
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

  private createHud(): void {
    this.hudText = this.add.text(16, 16, '', { fontSize: '16px', color: '#fff', backgroundColor: '#0008', padding: { x: 10, y: 8 } });
    this.noticeText = this.add.text(400, 560, '', { fontSize: '16px', color: '#fff', backgroundColor: '#0008', padding: { x: 12, y: 8 } }).setOrigin(0.5);
    this.hudText.setScrollFactor(0);
    this.noticeText.setScrollFactor(0);
    this.refreshHud();
    this.showNotice('空格与村长对话，进入东边竹林会随机遇敌。');
  }

  private trackEncounterDistance(): void {
    const current = new Phaser.Math.Vector2(this.player.x, this.player.y);
    const moved = Phaser.Math.Distance.BetweenPoints(this.lastPosition, current);
    this.lastPosition.copy(current);
    if (moved <= 0 || !this.isInEncounterZone(QINGYUN_MAP.encounterZone)) return;
    this.distanceSinceEncounter += moved;
    if (this.distanceSinceEncounter < ENCOUNTER_STEP_DISTANCE) return;
    this.distanceSinceEncounter = 0;
    if (Math.random() < ENCOUNTER_CHANCE) this.enterBattle('bamboo_snake');
  }

  private isInEncounterZone(zone: RectDefinition): boolean {
    return this.player.x >= zone.x && this.player.x <= zone.x + zone.width && this.player.y >= zone.y && this.player.y <= zone.y + zone.height;
  }

  private tryInteract(): void {
    const npcSprite = this.npcSprites.find(sprite => Phaser.Math.Distance.Between(this.player.x, this.player.y, sprite.x, sprite.y) < 70);
    if (!npcSprite) {
      this.showNotice('附近没有可交互对象。');
      return;
    }
    const npc = npcSprite.getData('npc') as NpcDefinition;
    if (npc.id === 'village_elder') this.openDialogue(getElderDialogue());
  }

  private openDialogue(lines: string[]): void {
    this.inputLocked = true;
    this.player.setVelocity(0);
    this.dialogueBox?.destroy(); const panel = this.add.rectangle(400, 500, 730, 150, 0x171018, 0.94).setStrokeStyle(2, 0xf0c987);
    const text = this.add.text(60, 445, lines.join('\n'), { fontSize: '17px', color: '#fff', lineSpacing: 8, wordWrap: { width: 680 } });
    const hint = this.add.text(720, 565, '空格继续', { fontSize: '13px', color: '#f0c987' }).setOrigin(1, 0.5);
    this.dialogueBox = this.add.container(0, 0, [panel, text, hint]).setScrollFactor(0);
    if (!gameState.quest.accepted) gameState.quest.accepted = true;
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.dialogueBox?.destroy();
      this.inputLocked = false;
      this.refreshHud();
    });
  }

  private refreshHud(): void {
    const { player, quest } = gameState;
    const questLine = quest.accepted ? `${quest.title}: ${quest.currentKills}/${quest.requiredKills}${quest.completed ? ' 已完成' : ''}` : '主线: 与村长对话';
    this.hudText.setText(`等级 ${player.level}  经验 ${player.exp}/${player.nextLevelExp}  金 ${player.gold}\n${questLine}`);
  }

  private showNotice(message: string): void {
    this.noticeText.setText(message);
    this.time.delayedCall(2400, () => {
      if (this.noticeText.text === message) this.noticeText.setText('');
    });
  }

  private handleBattleResult(result: BattleResult): void {
    const leveledUp = applyBattleResult(result);
    if (!result.playerWon) return;
    this.time.delayedCall(450, () => {
      const reward = `击败竹叶蛇，获得 ${result.expReward} 经验和 ${result.goldReward} 金。`;
      if (gameState.quest.completed) this.showNotice(`${reward} 任务已完成，回村长处复命。`);
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

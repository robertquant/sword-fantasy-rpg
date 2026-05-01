import Phaser from 'phaser';
import { getChapter } from '../data/chapters';
import { completeChapter, gameState, type BattleResult } from '../systems/gameState';
import { DialogueOverlay } from '../systems/dialogueOverlay';
import { audioManager } from '../systems/audioManager';

interface ChapterSceneData {
  chapterIndex?: number;
  battleResult?: BattleResult;
}

export class ChapterScene extends Phaser.Scene {
  private dialogue!: DialogueOverlay;
  private lines: string[] = [];
  private chapterIndex = 1;

  constructor() {
    super({ key: 'ChapterScene' });
  }

  init(data: ChapterSceneData): void {
    this.chapterIndex = data.chapterIndex ?? gameState.mainChapter;
    const chapter = getChapter(this.chapterIndex);
    if (!chapter) return;
    if (data.battleResult?.playerWon) {
      completeChapter(this.chapterIndex);
      this.lines = [`第 ${chapter.index} 章完成：${chapter.title}`, ...chapter.outro, this.getNextLine()];
    } else {
      this.lines = [`第 ${chapter.index} 章：${chapter.title}`, `地点：${chapter.location}`, ...chapter.intro, `目标：击败 ${chapter.enemyId}`];
    }
  }

  create(): void {
    audioManager.unlock(this);
    audioManager.startMusic(gameState.storyComplete ? 'title' : 'map');
    this.add.rectangle(400, 300, 800, 600, 0x111827, 1);
    this.add.text(400, 90, '主线章回', { fontSize: '34px', color: '#f0c987' }).setOrigin(0.5);
    this.add.text(400, 150, `当前进度：第 ${gameState.mainChapter} 章`, { fontSize: '18px', color: '#d7f7c2' }).setOrigin(0.5);
    this.dialogue = new DialogueOverlay(this);
    this.dialogue.open(this.lines);
    this.input.keyboard?.on('keydown-SPACE', () => this.advance());
    this.input.on('pointerdown', () => this.advance());
  }

  private advance(): void {
    if (!this.dialogue.advance()) return;
    if (gameState.storyComplete) { this.scene.start('MapScene'); return; }
    const chapter = getChapter(this.chapterIndex);
    if (!chapter) { this.scene.start('MapScene'); return; }
    if (this.chapterIndex !== gameState.mainChapter) { this.scene.start('ChapterScene', { chapterIndex: gameState.mainChapter }); return; }
    this.scene.start('BattleScene', { enemyId: chapter.enemyId, returnMap: 'ChapterScene', playerX: 420, playerY: 650, chapterIndex: chapter.index });
  }

  private getNextLine(): string {
    if (gameState.storyComplete) return '主线已完成：青云村灵脉复苏，九州仍有更远的路。';
    const next = getChapter(gameState.mainChapter);
    return next ? `下一章开启：${next.title}` : '主线已完成。';
  }
}

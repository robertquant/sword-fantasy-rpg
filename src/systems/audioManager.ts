import type Phaser from 'phaser';

type MusicKey = 'title' | 'map' | 'battle';
type SfxKey = 'select' | 'attack' | 'skill' | 'hit' | 'poison' | 'win';

class AudioManager {
  private context?: AudioContext;
  private musicTimer?: number;
  private track?: HTMLAudioElement;
  private currentMusic?: MusicKey;
  private enabled = true;

  startMusic(key: MusicKey): void {
    if (this.currentMusic === key) return;
    this.stopMusic();
    this.currentMusic = key;
    this.tryMp3Track(key);
  }

  stopMusic(): void {
    if (this.musicTimer) window.clearTimeout(this.musicTimer);
    this.track?.pause();
    this.track = undefined;
    this.musicTimer = undefined;
    this.currentMusic = undefined;
  }

  playSfx(key: SfxKey): void {
    if (!this.enabled) return;
    const map: Record<SfxKey, [number, number, OscillatorType]> = {
      select: [660, 0.08, 'triangle'],
      attack: [220, 0.12, 'sawtooth'],
      skill: [880, 0.18, 'triangle'],
      hit: [120, 0.1, 'square'],
      poison: [180, 0.2, 'sine'],
      win: [740, 0.28, 'triangle'],
    };
    const [freq, duration, type] = map[key];
    this.tone(freq, duration, type, 0.08);
  }

  unlock(scene: Phaser.Scene): void {
    const resume = (): void => {
      void this.getContext()?.resume();
      void this.track?.play().catch(() => undefined);
    };
    scene.input.once('pointerdown', resume);
    scene.input.keyboard?.once('keydown', resume);
  }

  private tryMp3Track(key: MusicKey): void {
    const track = new Audio(`assets/audio/${key}.mp3`);
    track.loop = true;
    track.volume = key === 'battle' ? 0.55 : 0.42;
    track.onerror = () => {
      if (this.currentMusic === key && this.track === track) this.loopMelody(key);
    };
    this.track = track;
    void track.play().catch(() => undefined);
  }

  private loopMelody(key: MusicKey): void {
    const notes = this.getNotes(key);
    notes.forEach((note, index) => this.tone(note, 0.22, 'sine', 0.025, index * 0.28));
    this.musicTimer = window.setTimeout(() => this.currentMusic && this.loopMelody(this.currentMusic), notes.length * 280 + 350);
  }

  private getNotes(key: MusicKey): number[] {
    if (key === 'battle') return [220, 262, 294, 330, 294, 262];
    if (key === 'map') return [392, 440, 494, 440, 392, 330, 392];
    return [330, 392, 494, 587, 494, 392];
  }

  private tone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  private getContext(): AudioContext | undefined {
    this.context ??= new AudioContext();
    return this.context;
  }
}

export const audioManager = new AudioManager();

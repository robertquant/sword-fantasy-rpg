import Phaser from 'phaser';
import type { RectDefinition } from '../data/maps';

const ENCOUNTER_STEP_DISTANCE = 130;
const ENCOUNTER_CHANCE = 0.18;

export class EncounterSystem {
  private distanceSinceEncounter = 0;
  private lastPosition = new Phaser.Math.Vector2();

  reset(x: number, y: number): void {
    this.distanceSinceEncounter = 0;
    this.lastPosition.set(x, y);
  }

  shouldTriggerRandom(x: number, y: number, encounterZone: RectDefinition, excludedZone: RectDefinition): boolean {
    const current = new Phaser.Math.Vector2(x, y);
    const moved = Phaser.Math.Distance.BetweenPoints(this.lastPosition, current);
    this.lastPosition.copy(current);
    if (moved <= 0 || !isPointInZone(x, y, encounterZone) || isPointInZone(x, y, excludedZone)) return false;
    this.distanceSinceEncounter += moved;
    if (this.distanceSinceEncounter < ENCOUNTER_STEP_DISTANCE) return false;
    this.distanceSinceEncounter = 0;
    return Math.random() < ENCOUNTER_CHANCE;
  }
}

export const isPointInZone = (x: number, y: number, zone: RectDefinition): boolean =>
  x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height;


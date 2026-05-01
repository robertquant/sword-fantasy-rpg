export interface RectDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NpcDefinition {
  id: string;
  name: string;
  x: number;
  y: number;
  color: number;
  texture: string;
}

export interface HerbNodeDefinition {
  id: string;
  x: number;
  y: number;
}

export interface MapDefinition {
  width: number;
  height: number;
  playerSpawn: { x: number; y: number };
  encounterZone: RectDefinition;
  bossZone: RectDefinition;
  blockers: RectDefinition[];
  npcs: NpcDefinition[];
  herbNodes: HerbNodeDefinition[];
}

export const QINGYUN_MAP: MapDefinition = {
  width: 1600,
  height: 1200,
  playerSpawn: { x: 420, y: 650 },
  encounterZone: { x: 1050, y: 190, width: 430, height: 650 },
  bossZone: { x: 1260, y: 260, width: 180, height: 180 },
  blockers: [
    { x: 150, y: 115, width: 270, height: 190 },
    { x: 520, y: 120, width: 180, height: 140 },
    { x: 92, y: 760, width: 250, height: 210 },
    { x: 660, y: 500, width: 160, height: 120 },
    { x: 1130, y: 930, width: 320, height: 140 },
    { x: 0, y: 0, width: 1600, height: 40 },
    { x: 0, y: 1160, width: 1600, height: 40 },
    { x: 0, y: 0, width: 40, height: 1200 },
    { x: 1560, y: 0, width: 40, height: 1200 },
  ],
  npcs: [
    { id: 'village_elder', name: '村长', x: 500, y: 575, color: 0xf0c987, texture: 'elder' },
    { id: 'herbalist', name: '药师', x: 300, y: 710, color: 0xb8f0a2, texture: 'npc-herbalist' },
    { id: 'blacksmith', name: '铁匠', x: 620, y: 675, color: 0xf0b06a, texture: 'npc-blacksmith' },
    { id: 'patrol_disciple', name: '巡逻弟子', x: 760, y: 560, color: 0xaed2ff, texture: 'npc-patrol' },
  ],
  herbNodes: [
    { id: 'herb_1', x: 1115, y: 710 },
    { id: 'herb_2', x: 1230, y: 535 },
    { id: 'herb_3', x: 1415, y: 760 },
  ],
};

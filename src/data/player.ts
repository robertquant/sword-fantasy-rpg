import type { Fighter } from '../systems/battleTypes';

export const createStarterPlayer = (): Fighter => ({
  name: '剑修',
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  atk: 14,
  def: 8,
  spd: 10,
  statuses: [],
});

import { QINGYUN_MAP } from '../data/maps';

export const drawQingyunMap = (scene: Phaser.Scene): void => {
  scene.add.image(800, 600, 'map-qingyun-bamboo').setDisplaySize(QINGYUN_MAP.width, QINGYUN_MAP.height);
  scene.add.text(1160, 160, '幽竹林', { fontSize: '24px', color: '#d7f7c2' }).setOrigin(0.5);
  scene.add.text(1350, 260, '竹林深处', { fontSize: '17px', color: '#d7f7c2' }).setOrigin(0.5);
  scene.add.text(310, 645, '青云村', { fontSize: '22px', color: '#392414' }).setOrigin(0.5);
};

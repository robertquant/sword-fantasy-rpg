import { QINGYUN_MAP } from '../data/maps';

export const drawQingyunMap = (scene: Phaser.Scene): void => {
  scene.add.image(800, 600, 'map-qingyun-bamboo').setDisplaySize(QINGYUN_MAP.width, QINGYUN_MAP.height);
  scene.add.rectangle(1350, 350, 190, 190, 0x143421, 0.24).setStrokeStyle(2, 0xa7e47a);
  scene.add.text(1160, 160, '幽竹林', { fontSize: '24px', color: '#d7f7c2' }).setOrigin(0.5);
  scene.add.text(1350, 350, '竹林深处', { fontSize: '17px', color: '#d7f7c2' }).setOrigin(0.5);
  scene.add.text(310, 645, '青云村', { fontSize: '22px', color: '#392414' }).setOrigin(0.5);
};

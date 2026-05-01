export interface ChapterDefinition {
  id: string;
  index: number;
  title: string;
  location: string;
  enemyId: string;
  intro: string[];
  outro: string[];
}

export const MAIN_CHAPTERS: ChapterDefinition[] = [
  chapter('qingyun_trial', 1, '青云初试', '青云村 / 幽竹林外围', 'bamboo_snake', ['村长：幽竹林毒蛇横行，请先替村里清出采药路。'], ['村长：蛇患已退，但竹林深处仍有妖气。']),
  chapter('bamboo_heart', 2, '竹影妖心', '幽竹林深处', 'bamboo_demon', ['村长：竹妖盘踞深处，若不除去，村路终究难安。'], ['竹妖倒下时，黑气从竹根间散出，灵脉裂痕初现。']),
  chapter('mountain_echo', 3, '山道异响', '青石山道', 'mountain_imp', ['巡逻弟子：山道符印被人反向篡改，山魈开始袭人。'], ['被篡改的符印指向一座废弃剑庐。']),
  chapter('old_sword_hut', 4, '旧剑庐', '废弃剑庐', 'sword_wraith', ['旧剑庐中残留剑意，似在等待后来者通过试炼。'], ['残剑影散去，灵脉图残页落入你手中。']),
  chapter('red_flame_foothill', 5, '赤焰山脚', '赤焰山脚', 'fire_lizard', ['赤焰山脚火气翻涌，火蜥蜴挡住去路。'], ['火脉鳞说明火灵眼已被魔气侵染。']),
  chapter('red_mine', 6, '赤焰矿洞', '赤焰矿洞', 'lava_golem', ['矿洞深处有灵铁，却被熔岩傀儡守住。'], ['灵铁到手，铁匠能替你净化剑胚。']),
  chapter('fire_altar', 7, '火祭坛', '赤焰山祭坛', 'flame_demon', ['炎魔守着反转的火灵眼，祭坛烈焰不息。'], ['火灵眼复明，通往雪域的寒雾散开。']),
  chapter('snow_rift', 8, '雪域裂痕', '冰封雪域入口', 'ice_wraith', ['雪域机关失控，冰魄游荡在冻结山门前。'], ['山门开启，雪隐村的灯火在风雪中显现。']),
  chapter('snow_hidden_village', 9, '雪隐村', '雪隐村', 'snow_lady', ['雪女夺走村民魂火，雪隐村沉入长夜。'], ['雪女清醒片刻，指向魔尊殿入口。']),
  chapter('demon_palace', 10, '魔尊殿', '魔尊殿', 'soul_devourer', ['噬灵魔尊即将重塑肉身，九州灵脉只剩最后一线。'], ['魔尊被重新封回灵脉深处，青云村的山风再度清明。']),
];

function chapter(id: string, index: number, title: string, location: string, enemyId: string, intro: string[], outro: string[]): ChapterDefinition {
  return { id, index, title, location, enemyId, intro, outro };
}

export const getChapter = (index: number): ChapterDefinition | undefined => MAIN_CHAPTERS[index - 1];

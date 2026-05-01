export interface EnemyVisual {
  texture: string;
  size: number;
}

export const getEnemyVisual = (enemyId: string): EnemyVisual => {
  if (enemyId === 'bamboo_demon') return { texture: 'enemy-bamboo-demon', size: 150 };
  if (enemyId === 'mountain_imp') return { texture: 'enemy-mountain-imp', size: 132 };
  return { texture: 'enemy-bamboo-snake', size: 96 };
};

export const getBattleback = (chapterIndex?: number): string => (chapterIndex === 3 ? 'battleback-qingstone-road' : 'battleback-bamboo');

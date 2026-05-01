# 开发进度

## 当前阶段: Phase 1 - 核心框架 (MVP)

### 已完成 ✅
- [x] 项目初始化
- [x] 设计文档
- [x] 故事文案框架
- [x] Phaser 基础场景链路 (BootScene → MenuScene → MapScene → BattleScene)
- [x] 临时地图移动 (WASD/方向键)
- [x] 测试战斗入口 (B 键)
- [x] 简单战斗原型（攻击/技能/防御/逃跑）

### 进行中 🔄
- [ ] 正式地图加载 + 碰撞层
- [ ] 角色精灵与动画
- [ ] 战斗 UI 刷新与数据拆分

### 待开始 ⏳
- [ ] 完整回合制战斗
- [ ] 技能系统
- [ ] NPC 对话
- [ ] 随机遇敌
- [ ] 装备/背包
- [ ] 存档系统

## 技术笔记
- 引擎: Phaser 3 + TypeScript + Vite
- 素材生成: agent-sprite-forge ($generate2dsprite, $generate2dmap)
- 目标: 先实现核心循环（移动→战斗→升级），再填充内容

# AGENTS.md - Codex 游戏开发指南

## 项目信息
- **游戏:** 剑道幻境 — 2D 回合制 RPG
- **引擎:** Phaser 3 + TypeScript + Vite
- **设计文档:** DESIGN-DOCUMENT.md（必读）
- **进度:** PROGRESS.md

## 开发规则

### 必须遵守
1. **先读 DESIGN-DOCUMENT.md** — 所有实现以此为基准
2. **每完成一个功能，更新 PROGRESS.md**
3. **TypeScript 强类型** — 不用 any，定义接口
4. **小步提交** — 每个功能点 git commit
5. **文件不超过 200 行** — 超过就拆分模块

### 代码结构
```
src/
  scenes/       — Phaser 场景 (BootScene, MapScene, BattleScene, MenuScene)
  systems/      — 游戏系统 (CombatSystem, DialogueSystem, SaveSystem)
  data/         — 数据定义 (monsters, skills, items, maps)
```

### 素材生成
用 `$generate2dsprite` 生成精灵，用 `$generate2dmap` 生成地图。
生成的素材放入 `public/assets/sprites/` 和 `public/assets/maps/`。

### 禁止
- 不要一次实现整个游戏，按 PROGRESS.md 的顺序逐步推进
- 不要修改 DESIGN-DOCUMENT.md 中的核心设计
- 不要引入重型依赖（Phaser 除外）

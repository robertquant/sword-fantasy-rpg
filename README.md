# 剑道幻境

2D 回合制 RPG 原型，使用 Phaser 3、TypeScript 和 Vite 构建。

## 运行

```bash
pnpm install
pnpm run dev
```

启动后打开 Vite 输出的本地地址，通常是 `http://localhost:5173/`。

## 当前操作

- 点击 `[ 开始冒险 ]` 进入青云村
- 使用 `WASD` 或方向键移动
- 靠近村长按空格接受“竹林蛇患”任务
- 进入东边幽竹林会随机遭遇竹叶蛇
- 按 `B` 可手动触发测试战斗
- 战斗中点击攻击、技能、防御或逃跑
- 击败 3 条竹叶蛇后回村长处复命
- 复命后获得金币奖励，并解锁“竹林深处”
- 再次找村长接“竹林深处”任务，进入深处击败竹妖

## 构建

```bash
pnpm run build
pnpm run preview
```

## 开发说明

- 设计基准见 [DESIGN-DOCUMENT.md](./DESIGN-DOCUMENT.md)
- 开发进度见 [PROGRESS.md](./PROGRESS.md)
- 每次完成阶段性功能后更新进度文档

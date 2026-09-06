# pixi-phaser (pixi-show)

一个用于 **图形 / 游戏效果实验** 的 Vue3 + Vite 多页面项目。每个路由就是一个独立的 demo 页面，用来验证 PixiJS / Phaser / Three.js 的某种效果或玩法原型，不做通用业务封装，追求「一个路由 = 一个可独立运行的效果」。

## 技术栈

| 用途 | 依赖 | 版本 |
| --- | --- | --- |
| 框架 | vue | ^3.2.33 |
| 路由 | vue-router | ^4.0.14 |
| 构建 | vite + @vitejs/plugin-vue | ^4.2.1 |
| 样式 | sass | ^1.62.0 |
| 2D 渲染 | pixi.js + pixi-filters | ^8.3.4 / ^6.0.5 |
| 2D 游戏引擎 | phaser | ^3.85.1 |
| 3D 渲染 | three | ^0.168.0 |
| 动画 | gsap | ^3.12.5 |

## 常用命令

```bash
npm install
npm run dev     # 启动开发服务器，端口 1080
npm run build   # 生产构建，使用 terser 压缩
```

## 目录结构

```
index.html                  入口 HTML，挂载 #app
vite.config.js              vite 配置：端口 1080、别名 @ -> ./src、terser 压缩
public/                     静态资源（直接以 / 根路径引用）
  ├─ images/
  │   ├─ interface/          界面图：background1.jpg ~ background5.jpg（草坪背景）、卡片、铲子等
  │   ├─ Plants/             植物素材（gif 动图为主，按植物名分目录：Peashooter/Repeater/WallNut/...）
  │   ├─ Zombies/            僵尸素材（gif 动图为主）
  │   └─ Card/               植物卡片 png
  ├─ zw/                     旧版「植物合成小游戏」资源：bg.jpg、卡片、等级僵尸 gif
  ├─ img/  gltf/  su7/  three/  js/  json/   其它 demo 的模型与贴图
src/
  ├─ main.js                 createApp + router
  ├─ App.vue                 只有一个 <router-view>，全局 reset（html/body 100% + overflow hidden）
  ├─ router/index.ts         所有页面路由（手写，扁平长列表）
  ├─ api/                    早期业务接口封装（Base/Account/Users/Jobs），demo 基本不用
  ├─ assets/css|img          通用 scss 与图片
  └─ views/                  页面目录，按技术或主题分组
      ├─ event/              交互事件（wheel 等）
      ├─ assets/             资源加载相关
      ├─ filters/            pixi 滤镜：水波纹、color-matrix、displacement 等
      ├─ graphics/           pixi graphics 绘制（渐变等）
      ├─ advanced/           进阶算法（碰撞检测等）
      ├─ phaser/             phaser demo（1/3/4/5、police、offical）
      ├─ three/              three.js demo（1~6、su7、sprite、rob、walker 系列、attack 系列）
      └─ zw/                 旧版「植物大战僵尸」小游戏原型
          ├─ index.vue       游戏主页面（拖拽卡片种植、发射子弹、僵尸推进、失败判定）
          ├─ plant.vue / bullet.vue / zombie.vue   三类实体组件
          ├─ config.js       植物/僵尸等级表 + 地块（row/col）配置
          ├─ utils.js        全局响应式状态与动画循环（score、zombies、bullets、碰撞检测）
          └─ components/scrollNumber.vue   数字滚动组件
```

## 新增一个 demo 页面的约定

1. 在 `src/views/` 下新建 `.vue`（简单 demo 直接单文件，如 `shuibowen.vue`；功能较多的建目录 + `index.vue`，如 `zw/index.vue`、`phaser/offical/index.vue`）。
2. 在 `src/router/index.ts` 的 `routes` 数组末尾追加一项，**使用懒加载动态 import**：

```ts
{
    path: '/your-path',
    component: () => import(`../views/your-path.vue`)
}
```

3. 访问 `http://localhost:1080/your-path` 即可，路由为 `createWebHistory`，无需配置 base。

## 代码风格

- 缩进：**Tab**（全项目统一）。
- 组件统一使用 `<script setup>` 组合式 API。
- 样式写在组件内 `<style lang="scss">`，**多数不加 `scoped`**（demo 项目，注意类名冲突）；全局 reset 只在 `App.vue`。
- 页面默认撑满窗口：`#app`、根容器一般写 `width: 100%; height: 100%`。
- 引用 `public/` 资源用根绝对路径，如 `url(/images/interface/background1.jpg)`、`/zw/bg.jpg`；引用相对资源用相对路径，如 `./images/interface/ZombiesWon.png`。
- 中文注释为主，状态与工具函数倾向于放到独立的 `utils.js` 里用 `ref` 导出共享（见 `views/zw/utils.js` 的做法）。
- 不做 TypeScript 强约束：`src` 下同时存在 `.js` 与 `.ts`（仅 router 和 api 是 ts）。

## 关于「植物大战僵尸」游戏

- 现有原型在 `src/views/zw`（路由 `/zw`），是「植物合成 + 自动射击」的简化玩法，不是标准 PVZ 塔防；其核心逻辑（地块、子弹、碰撞）可参考，但新版本建议重新组织。
- 可用素材：
  - 草坪背景：`/images/interface/background1.jpg` ~ `background5.jpg`（另有 `background1unsodded*.jpg` 无草皮版）。
  - 植物：`/images/Plants/<植物名>/<动作>.gif`。
  - 僵尸：`/images/Zombies/**.gif`。
  - 卡片与 UI：`/images/Card/`、`/images/interface/`（Sun.gif、Shovel/、Almanac_*、FinalWave.gif 等）。
- 新版游戏页面路由：`/zwdzjs` → `src/views/zwdzjs/`
  - `config.js`：舞台尺寸（1400x600，与背景图一致）、草坪网格（9 列 x 5 行，left 253 / top 80 / 格子 81x96）、9 张植物卡配置。
  - `components/cardBar.vue`：顶部卡槽模块，9 个槽位，卡片可 HTML5 拖拽。
  - `index.vue`：固定舞台按窗口等比缩放居中（`transform: scale()`），草坪格子接收 drop/click 完成种植，拖拽时显示半透明预览。所有实体坐标均基于舞台坐标系，与缩放解耦。
  - `utils.js`：全局响应式状态（sun / planted / zombies / bullets / suns / booms / gameOver / cards）+ `requestAnimationFrame` 主循环，含种植扣阳光与冷却、阳光产出与收集、射手开火、子弹飞行与命中、火炬树桩强化、僵尸刷新/行走/啃食/死亡、爆炸判定。
  - `components/plant.vue` `zombie.vue` `sun.vue`：三种实体，各自带血条与状态贴图。
  - 植物特性：向日葵产阳光、豌豆/寒冰（减速）/双发射手射击、坚果墙 4000 血、土豆雷埋设 14s 后炸单格、樱桃炸弹 1.2s 后炸 3x3、大嘴花吞噬后咀嚼、火炬树桩把穿过的豌豆变火豆（伤害翻倍）。
- 注意：`src/views/zw/index.vue` 引用了不存在的 `./images/interface/ZombiesWon.png`，会导致 `npm run build` 失败（dev 不受影响）。

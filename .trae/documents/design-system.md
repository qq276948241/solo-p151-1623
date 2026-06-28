# 视觉设计体系

本文档整理「小区图书角」项目的视觉规范，包括配色、字体、阴影、动画四大模块。每条规范后面附上设计意图，方便后续接手的同学理解"为什么这么定"而非只记"用什么值"。

---

## 1. 配色体系

配色定义在 [tailwind.config.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/tailwind.config.js) 的 `theme.extend.colors` 中。

### 1.1 Primary 墨绿色阶

| 色阶 | 色值 | 语义用途 | 设计意图 |
|---|---|---|---|
| `primary-50` | `#f0f6f2` | 页面背景渐变起点（首页 Hero 区） | 墨绿的极淡版，给白色到墨绿之间一个柔和过渡 |
| `primary-100` | `#d9e8de` | 标签背景（`tag-available`）、按钮未选中态、图标容器底色 | 比米白多一分绿，用于"轻强调"场景 |
| `primary-200` | `#b5d1c0` | 分割线、输入框边框、搜索框边框 | 中等灰度绿，在米白底上形成可感知但不刺眼的分界 |
| `primary-300` | `#86b499` | 空状态图标、辅助文字 | 偏浅，用于"不那么重要"的信息，避免视觉层级混淆 |
| `primary-400` | `#569071` | placeholder 文字、辅助说明 | 中间色阶，占位提示够显眼但不喧宾夺主 |
| `primary-500` | `#3a7254` | hover 态（主按钮 hover 降一阶）、深色模式活跃态 | 和 600 搭配形成交互梯度：500 是"轻按"，600 是"稳坐" |
| **`primary-600`** | **`#2D5A3D`** | **主色**，主按钮背景、导航活跃态、图标圆形容器 | 墨绿正色，整个应用的视觉锚点。饱和度经过调校，在米白底上既有存在感又不压迫 |
| `primary-700` | `#254a32` | 标题文字、强调文字 | 比 600 深一阶，用于文字而非背景，保证可读性 |
| `primary-800` | `#1f3c2a` | 正文强调、卡片书名 | 深墨绿，接近黑但不死黑，保留一点绿色调性 |
| `primary-900` | `#1a3223` | 深色模式卡片边框、分割线 | 最深色阶，仅在 dark mode 下作为"微弱分界"出现 |

**色阶使用原则**：

- **背景从浅到深**：50 → 100 → 200，每一级只跳一阶
- **文字从深到浅**：800 → 700 → 500 → 400，标题深、正文中、辅助浅
- **交互态相邻**：600（静止）→ 500（hover）→ 400（focus ring），相邻色阶保证过渡自然

### 1.2 Cream 米白色阶

| 色阶 | 色值 | 语义用途 | 设计意图 |
|---|---|---|---|
| `cream-50` | `#FDFCFA` | — | 预留，目前未使用 |
| **`cream-100`** | **`#FAF8F5`** | **全局页面背景**、搜索框底色 | 米白正色，比纯白暖一度，长时间阅读不刺眼 |
| `cream-200` | `#F5F0E8` | 卡片封面占位底色、导航栏 logo 容器 hover | 比背景深一阶，用于"浮层"元素和背景区分 |
| `cream-300` | `#EFE8DA` | 标签背景（`tag-borrowed`）、输入框边框 | 偏黄的米白，和棕色搭配形成"在借"标签的暖色调 |
| `cream-400` | `#E5DAC7` | 分隔竖线（详情弹窗中作者名和分类之间的 `|`） | 低存在感分隔，不需要实线但需要视觉停顿 |
| `cream-500` | `#D9C9AE` | — | 预留，目前未使用 |

**为什么用米白不用纯白**：纯白 `#FFFFFF` 在长时间阅读时会造成眩光疲劳。米白加入 2-3% 的暖黄，既保持干净感又降低对比度冲击，特别适合"社区书角"这种需要温度感的场景。

### 1.3 Accent 强调色

| 色名 | 色值 | 语义用途 | 设计意图 |
|---|---|---|---|
| `accent-brown` | `#8B7355` | "在借"标签文字、历史记录图标、借阅历史区标题图标 | 暖棕色，和 cream 色系同源（偏黄的暖调）。用于"已发生"的语义——借出、归还、历史 |
| `accent-red` | `#C0392B` | 到期提醒边框、"即将到期"标签、逾期文字、NavBar 角标背景 | 警示色，但不是纯红。偏暗的砖红，在米白底上醒目但不刺眼，和墨绿形成经典的红绿互补 |

**两色使用边界**：

- `accent-brown` → 用于**信息性**提示（告诉你"这本书在借""这是历史"）
- `accent-red` → 用于**行动性**警示（催你还书、警告逾期）
- **不要**用 accent-red 表示"借出"状态（那是信息，不是警示）
- **不要**用 accent-brown 表示到期提醒（棕色缺乏紧迫感）

### 1.4 深色模式下的特殊色值

深色模式不是简单翻转色阶，而是手动指定了更亮的变体：

| 浅色模式值 | 深色模式值 | 场景 |
|---|---|---|
| `accent-red` (#C0392B) | `#ff6355`（到期卡片边框） | 暗红在暗底上对比度不足，改为亮珊瑚红 |
| `accent-red` | `#ff7a6b`（到期文字、图标） | 文字不需要边框那么亮，稍降一阶 |
| `accent-brown` | `#e0c38a`（在借标签文字、历史图标） | 暖棕在暗底上几乎消失，提亮成金棕 |
| `bg-white` | `#1b2720`（卡片背景） | 不是纯黑，保留墨绿色调 |
| `bg-cream-100` | `#121a16`（页面背景） | 极深墨绿，和卡片背景形成微弱层次 |
| `bg-cream-200` | `#2a2519`（历史图标容器） | 偏暖深色，呼应棕色语义 |

**为什么深色模式不自动翻转**：Tailwind 的 `dark:` 前缀允许逐元素精确控制。自动翻转会导致 accent-red 在暗底上对比度骤降（这正是之前修的 Bug），手动指定才能保证 WCAG AA 合规。

---

## 2. 字体体系

字体定义在 [tailwind.config.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/tailwind.config.js) 的 `fontFamily` 和 [style.css](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/style.css) 的 `:root` 中。

### 2.1 两套字体族

| 用途 | font-family | Tailwind class | 加载来源 |
|---|---|---|---|
| 标题 | `"Source Han Serif", "Noto Serif SC", serif` | `font-serif` | Google Fonts（index.html 引入） |
| 正文 | `"Source Han Sans", "Noto Sans SC", sans-serif` | `font-sans` | Google Fonts + 系统回退 |

### 2.2 字阶规范

| 元素 | 字号 | 字重 | 字体族 | Tailwind 写法 |
|---|---|---|---|---|
| 页面主标题（Hero h1） | 3xl → 4xl (md) | bold (700) | serif | `text-3xl md:text-4xl font-serif font-bold` |
| 区块标题（h2） | 2xl | bold (700) | serif | `text-2xl font-serif font-bold` |
| 卡片书名（h3） | base (16px) | semibold (600) | serif | `font-serif font-semibold text-base` |
| 卡片作者 | sm (14px) | normal (400) | sans | `text-sm` |
| 卡片位置/日期 | xs (12px) | normal (400) | sans | `text-xs` |
| 标签内文字 | xs (12px) | medium (500) | sans | `text-xs font-medium` |
| 详情弹窗标题 | 2xl (24px) | bold (700) | serif | `text-2xl font-serif font-bold` |
| 详情弹窗正文 | sm (14px) | normal (400) | sans | `text-sm` |
| 导航链接 | 默认 (16px) | medium (500) | sans | `font-medium` |
| 统计数字 | 2xl (24px) | bold (700) | sans | `text-2xl font-bold` |

**为什么标题用宋体**：宋体（思源宋体）横细竖粗、笔画有顿挫，天然带有"书卷气"。和圆角的卡片、圆润的墨绿搭配，形成"现代排版 + 传统韵味"的反差。正文用黑体保证长文可读性——黑体笔画均匀，小字号下辨识度更高。

### 2.3 行高与截断

- 标题行高由 `font-serif` 自带，不需要额外设
- 正文 `line-height: 1.6`（style.css `:root` 定义），保证中文行间呼吸感
- 卡片书名 `line-clamp-1`：单行截断，防止长标题撑破卡片高度
- 详情弹窗正文 `leading-relaxed`：1.625 行高，阅读大段简介时更舒适

---

## 3. 阴影体系

阴影定义在 [tailwind.config.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/tailwind.config.js) 的 `boxShadow` 中。

### 3.1 card — 静态卡片阴影

```css
shadow-card: 0 2px 8px rgba(45, 90, 61, 0.08);
```

- **颜色**：`rgba(45, 90, 61, ...)` = primary-600 的低透明度版
- **模糊**：8px，柔和扩散
- **偏移**：Y 2px，微微下沉

**用在**：BookCard 默认态、筛选面板、用户统计卡片、借阅历史表格

**设计意图**：阴影颜色带墨绿色调而非纯灰，让卡片看起来像"从绿色桌面上浮起"而非"悬在白色虚空上"。透明度仅 8%，保证米白底上不突兀。

### 3.2 hover — 悬停卡片阴影

```css
shadow-hover: 0 8px 24px rgba(45, 90, 61, 0.15);
```

- **模糊**：24px（3 倍于 card）
- **偏移**：Y 8px（4 倍于 card）
- **透明度**：15%（接近 2 倍于 card）

**用在**：BookCard hover 态（配合 `-translate-y-1` 上浮）

**设计意图**：card → hover 的过渡传达"卡片被拿起"的物理隐喻。偏移增大模拟光源位置不变时物体升高后阴影下移，模糊增大模拟距离增大后的阴影扩散。透明度翻倍保证视觉重量跟随交互重量升级。

### 3.3 深色模式下的阴影

深色模式下卡片阴影改为 `0 8px 24px rgba(0, 0, 0, 0.5)`（在 style.css 的 `.dark .book-card:hover` 中定义），因为墨绿色阴影在深色背景上不可见，纯黑阴影才有效果。静态阴影 `shadow-card` 在深色模式下被 `dark:shadow-none` 移除——暗色卡片靠边框而非阴影建立层次。

---

## 4. 动画体系

动画定义在 [tailwind.config.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/tailwind.config.js) 的 `animation` + `keyframes` 中，以及 [style.css](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/style.css) 的 `@keyframes pulse-soft-dark`。

### 4.1 pulse-soft — 到期提醒呼吸灯

#### 浅色版：`pulse-soft-light`

```css
@keyframes pulse-soft-light {
  0%, 100% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.45); }
  50%      { box-shadow: 0 0 0 10px rgba(192, 57, 43, 0); }
}
```

- **触发条件**：BookCard 的 `showDueSoonWarning` 为 true 时，卡片加 `.card-due-soon` 类（`border-2 border-accent-red animate-pulse-soft`）
- **触发页面**：MyPage 的到期提醒区块、MyPage 的正在借阅卡片（showDueDate=true 且 isDueSoon）
- **动画时长**：2s ease-in-out infinite
- **效果**：红色外发光从紧贴边框（0px）扩散到 10px 外，然后收回，循环往复

**设计意图**：呼吸灯节奏 2 秒一轮，比 Tailwind 默认 `animate-pulse`（1s）慢一倍。慢节奏传达"提醒"而非"报警"——如果用 1s 急促闪烁，会给用户焦虑感；2s 的节奏更像"我在，注意我"，温和但持续。`rgba(192, 57, 43, 0.45)` 初始透明度不到一半，保证最亮时刻也不刺眼。

#### 深色版：`pulse-soft-dark`

```css
@keyframes pulse-soft-dark {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 99, 85, 0.6),
                0 0 0 0 rgba(255, 99, 85, 0.3) inset;
  }
  50% {
    box-shadow: 0 0 0 12px rgba(255, 99, 85, 0),
                0 0 0 0 rgba(255, 99, 85, 0) inset;
  }
}
```

- **触发条件**：同一张卡片，dark 模式下 class 切换为 `dark:animate-[pulse-soft-dark_2s_ease-in-out_infinite]`
- **差异**：
  - 颜色从 `rgba(192,57,43,...)` 改为 `rgba(255,99,85,...)`（#ff6355 亮珊瑚红），保证暗底上对比度
  - 初始透明度从 0.45 提升到 0.6，抵消暗底对发光的视觉吸收
  - 扩散半径从 10px 增大到 12px，暗环境下需要更大的发光面积才能被注意到
  - 新增 `inset` 内阴影，让边框本身也有发光，暗底上边框和发光融为一体

**为什么需要两套 keyframes**：`box-shadow` 不能用 CSS 变量做颜色插值（Tailwind 的 keyframes 不支持运行时变量），所以必须为浅色和深色各写一套。这比用 JavaScript 动态改 CSS 变量简单可靠。

### 4.2 float — 弹窗入场动画

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
```

- **触发条件**：BookDetailModal 打开时，弹窗容器加 `animate-float`，但 `animation-iteration-count: 1; animation-duration: 0.5s`
- **效果**：弹窗从下方微微上浮 4px 后落回，只播放一次

**设计意图**：4px 的上浮幅度很小，配合 0.5s 的时长，传达"轻轻落在你面前"的感觉。如果幅度太大或循环播放，会像悬浮的广告条，失去"弹窗是稳定对话窗口"的语义。只播一次，之后弹窗静止，用户的注意力回到内容上。

---

## 5. 组件类速查

以下类定义在 [style.css](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/style.css) 的 `@layer components` 中，每个类都有浅色和深色两套样式：

| 类名 | 用途 | 浅色核心 | 深色核心 |
|---|---|---|---|
| `.book-card` | 书籍卡片 | 白底 + shadow-card | #1b2720 底 + primary-900 边框 |
| `.book-card:hover` | 卡片悬停 | shadow-hover + 上浮 1px | 纯黑阴影 |
| `.btn-primary` | 主操作按钮 | primary-600 底 + 白字 | 同浅色 |
| `.btn-primary:disabled` | 禁用态 | primary-300 底 + 禁止缩放 | 同浅色 |
| `.tag` | 标签基类 | 圆角药丸形 | — |
| `.tag-available` | "可借"标签 | primary-100 底 + primary-700 字 | primary-800 底 + primary-200 字 |
| `.tag-borrowed` | "在借"标签 | cream-300 底 + accent-brown 字 | #3a3225 底 + #e0c38a 字 |
| `.tag-due-soon` | "即将到期"标签 | red-100 底 + accent-red 字 | red-950/60 底 + #ff7a6b 字 |
| `.card-due-soon` | 到期卡片 | accent-red 边框 + pulse-soft-light | #ff6355 边框 + pulse-soft-dark |
| `.nav-link` | 导航链接 | primary-700 字 + hover 变底 | primary-200 字 + hover 变底 |
| `.nav-link-active` | 导航活跃态 | primary-600 底 + 白字 | primary-500 底 + 白字 |
| `.section-title` | 区块标题 | primary-700 字 + 底部分割线 | primary-200 字 + 底部分割线 |
| `.input-base` | 文本输入框 | 白底 + cream-300 边框 | #1b2720 底 + primary-900 边框 |
| `.select-base` | 下拉选择框 | 白底 + cream-300 边框 | #1b2720 底 + primary-900 边框 |

---

## 6. 主题切换机制

主题逻辑在 [useTheme.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/composables/useTheme.ts) 中：

```
用户点击 NavBar 月亮/太阳按钮
    │
    ▼ toggleTheme()
    │
    ▼ theme.value = 'light' ↔ 'dark'
    │
    ▼ watch(theme, flush: 'post')
    │
    ▼ applyTheme(t)
        ├── documentElement.classList.remove('light', 'dark')
        ├── documentElement.classList.add(t)
        ├── documentElement.style.colorScheme = t    → 原生控件跟随主题
        ├── localStorage.setItem('theme', t)         → 刷新后保持
        └── meta[name="theme-color"].content         → 移动端浏览器地址栏变色
```

**设计意图**：

- 用 Tailwind 的 `darkMode: "class"` 策略，所有 `dark:` 前缀样式由 `<html>` 上的 `.dark` 类驱动
- `colorScheme` 同步确保 `<select>` 下拉等原生控件也会自动变暗色
- `meta theme-color` 让移动端浏览器地址栏从米白 `#FAF8F5` 变为墨绿深色 `#121a16`，保持沉浸感
- `flush: 'post'` 确保 DOM 更新在 Vue 渲染完成后执行，避免闪烁

---

## 7. v-tooltip 指令的视觉规范

[tooltip.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo151/project151/src/directives/tooltip.ts) 生成的 tooltip 浮层遵循以下规范：

| 属性 | 值 | 设计意图 |
|---|---|---|
| 背景 | `rgba(31, 60, 42, 0.96)` | primary-800 的高透明度版，和主色调统一，96% 不透明保证文字可读 |
| 文字 | `#fff` 白色 | 深墨绿底上白字，最高对比度 |
| 圆角 | `10px` | 和卡片的 `rounded-xl`（12px）接近，保持圆润感 |
| 字号 | `13px` | 比正文 14px 小 1px，暗示"这是辅助信息，不是主内容" |
| 行高 | `1.6` | 和全局正文一致 |
| 最大宽度 | `280px` | 防止长简介撑出屏幕，280px 约等于卡片宽度的 2 倍 |
| 阴影 | `0 8px 24px rgba(0,0,0,0.18)` | 比 shadow-hover 稍弱，浮层比卡片轻 |
| 背景模糊 | `backdrop-filter: blur(6px)` | 微弱毛玻璃，如果底色透出一点也不会糊 |
| 显示延迟 | 200ms | 防止鼠标快速扫过时闪烁 |
| 隐藏延迟 | 300ms | 给用户一点时间把鼠标移到相邻卡片，避免闪断 |

**为什么 tooltip 不走 dark: 切换**：tooltip 的背景是深墨绿（接近深色模式背景色），在浅色底上天然成立。在深色底上，因为底色本身就很深，tooltip 的深墨绿背景反而和背景接近——但因为 tooltip 有白色文字 + box-shadow，仍然能建立层次。如果未来需要深色模式下 tooltip 反转为浅底深字，可以在 `createTooltipEl` 中检测 `document.documentElement.classList.contains('dark')` 动态切换样式。

---

## 8. 响应式断点使用

项目使用 Tailwind 默认断点，实际用到的：

| 断点 | 宽度 | 使用的场景 |
|---|---|---|
| `sm` | 640px | 卡片网格 2→3 列、导航文字显示、表格列显示 |
| `md` | 768px | 卡片网格 3→4 列、统计卡片 2→4 列、弹窗横排布局、表格作者列显示 |
| `lg` | 1024px | 卡片网格 4→5 列、到期提醒 2→3 列 |

**设计意图**：移动端优先，每级断点只加一列。5 列是上限（再窄的卡片放不下书名和作者），3 列是下限（2 列时卡片太大，首页信息密度不够）。

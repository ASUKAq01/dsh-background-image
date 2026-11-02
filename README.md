<p align="center">
  <img src="icon.svg" width="96" height="96" alt="Background Image icon" />
</p>

<h1 align="center">DSH Background Image</h1>

<p align="center">
  为 DeepSeek Harness Web GUI 添加自定义背景图的轻量客户端插件。<br />
  上传图片、调节不透明度与虚化，只改变外观，不移动任何宿主控件。
</p>

<p align="center">
  <a href="https://github.com/ASUKAq01/dsh-background-image/actions/workflows/validate.yml"><img src="https://github.com/ASUKAq01/dsh-background-image/actions/workflows/validate.yml/badge.svg" alt="validate" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ASUKAq01/dsh-background-image" alt="MIT License" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.0.0-blue" alt="1.0.0" /></a>
</p>

<p align="center">
  简体中文 · <a href="README.en.md">English</a>
</p>

---

## 特性

- **上传即用**：支持选择或拖入 JPG / PNG / WebP / GIF，浏览器内自动缩放、重新编码。
- **两个滑块**：背景不透明度（0–100%）与虚化程度（0–40 px），拖动实时生效。
- **主题自适应**：浅色 / 深色主题分别叠加白色、`#151517` 的主题色薄纱；切换主题自动跟随。
- **不改变布局**：背景是 `z-index: -1`、`pointer-events: none` 的固定层，不参与布局，也不拦截点击。
- **可读性优先**：只让主画布、会话区和侧栏的底色透明；卡片、输入框、弹层继续使用不透明表面。
- **本地存储**：图片压缩后保存在当前浏览器的 `localStorage`，不上传、不发起任何网络请求。
- **干净卸载**：插件禁用或卸载时清理样式、CSS 变量、令牌覆盖与类名，界面恢复原样。
- **双语界面**：设置页随 Harness 的界面语言显示中文或英文。

## 安装

插件目前通过 GitHub 分发。需要 DeepSeek Harness `>=0.1.7-rc.1 <0.3.0-0`。

### 方式一：DSH 插件管理器

```sh
git clone https://github.com/ASUKAq01/dsh-background-image.git
```

在 Harness 中打开 **设置 → 插件**，通过添加/安装本地目录的入口选择克隆下来的
`dsh-background-image` 目录，启用后刷新一次页面。

### 方式二：`dsh` CLI

```sh
git clone https://github.com/ASUKAq01/dsh-background-image.git
dsh plugin --profile <profile> add ./dsh-background-image
```

把 `<profile>` 换成你正在使用的 profile（例如 `desktop` 或 `web`），然后重启或刷新 Harness。

### npm

尚未发布到 npm。`package.json` 已按 `@asukaq01/dsh-background-image` 命名，发布后可以使用：

```sh
dsh plugin --profile <profile> add @asukaq01/dsh-background-image
```

## 使用

1. 打开 **设置 → 插件 → 背景图**（也可以从插件列表中本插件的配置入口进入）。
2. 点击「选择图片」，或把图片拖进预览框。
3. 调整「背景不透明度」和「虚化程度」；关闭设置面板即可查看整窗效果。
4. 「移除背景」删除本地图片并恢复宿主原始外观。

> 首次安装完成后需要刷新一次页面，浏览器才会加载新的客户端模块。

## 存储与隐私

- 图片只保存在当前浏览器的 `localStorage`：
  - `dsh.background-image.image.v1`：压缩后的图片与尺寸；
  - `dsh.background-image.settings.v1`：不透明度与虚化值。
- 图片在浏览器内缩放至最长边 2560 px 并优先编码为 WebP，以适配本地存储配额。
- 插件不上传图片、不读取会话内容，也不发起任何网络请求。
- 清除站点数据或在设置页点击「移除背景」会删除已保存的图片。

## 兼容性

- DeepSeek Harness `>=0.1.7-rc.1 <0.3.0-0`
- 使用客户端服务：`ctx.slots`、`ctx.locale`、`ctx.theme.overrideTokens`
- 注册槽位：`settings.plugins.tab`、`plugins.row.config`
- 无构建步骤，`client.js` 直接以 Harness 的模块格式加载

## 实现要点

- 背景层是 `html.dshbg-on body::before`：`position: fixed`、`inset: -180px`、
  `z-index: -1`、`pointer-events: none`；负 inset 为模糊边缘留出余量。
- 通过 `ctx.theme.overrideTokens` 只覆盖两个颜色令牌：
  `--dsw-alias-bg-base` 与 `--dsw-specific-sidebar-fill`，把它们置为 `transparent`。
  其它表面继续使用 `--dsw-alias-bg-layer-*`，因此文字和控件的可读性不受影响。
- 不透明度映射到盖在照片上的主题色薄纱透明度；虚化作用于固定背景层本身。
- 设置页与插件行配置页共享同一个存储与表单组件。
- 所有样式、订阅与令牌覆盖都包在 `ctx.effect` 中，卸载时自动清理。

## 开发

无需打包或编译。把仓库目录安装到某个 profile 后，刷新页面即可看到改动。

```sh
node scripts/validate.mjs
```

校验脚本会检查：`package.json` 字段与导出路径、双语 locale、SVG 图标及其大小、
`cordis.patch.yml` 行声明，以及 `index.js` / `client.js` 的 JavaScript 语法。
GitHub Actions 在每次 push 和 pull request 时运行同一脚本。

## 目录结构

```text
.
├── client.js               # 浏览器端全部实现（背景层 + 设置页）
├── index.js                # Host 端空实现（bundle 需要一个 Host 行）
├── cordis.patch.yml        # 插入 background-image 行
├── locale/
│   ├── en.json             # 插件管理器显示元数据（英文）
│   └── zh.json             # 插件管理器显示元数据（中文）
├── icon.svg                # 插件图标
├── scripts/validate.mjs    # 无依赖校验脚本
├── .github/workflows/      # CI
├── README.md / README.en.md
├── CHANGELOG.md
└── LICENSE
```

## 许可证

[MIT](LICENSE) © 2026 ASUKAq01

图标为随本仓库分发的原创作品，同样以 MIT 许可提供。

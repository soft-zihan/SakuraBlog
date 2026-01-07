# 🌸 Sakura Notes (Static Vue Blog)

这是一个基于 Vue 3 + Tailwind CSS 的纯静态个人博客系统，专为 GitHub Pages 部署设计。
无需复杂的后端服务器，只需要上传 Markdown 文件即可自动生成美观的博客页面。

---

## ✨ 特性

- **纯静态架构**：完全基于客户端渲染 (CSR)，通过 GitHub Actions 预生成数据索引。
- **自动化部署**：Push 代码即自动扫描 `notes` 文件夹，生成 JSON 目录树。
- **Sakura Lab**: 内置 Vue 互动实验室，包含可视化教学组件（响应式原理、生命周期）。
- **无后端个性化**：利用 `localStorage` 存储用户的字体（衬线/无衬线）和字号偏好。
- **深度互动**：
  - **临时高亮**：选中文字可模拟荧光笔效果。
  - **分享卡片**：支持生成带二维码的分享弹窗，方便移动端阅读。
  - **深度链接**：支持通过 URL 参数（如 `?path=notes/vue.md`）直接分享和访问特定笔记。
- **双视图体验**：
  - **Latest (最新)**: 按修改时间倒序展示笔记，快速访问最近内容。
  - **Files (目录)**: 经典的递归树形结构，方便浏览知识体系。
- **二次元美学**：樱花飘落背景、玻璃拟态 (Glassmorphism)、平滑过渡动画、细腻纸张纹理。

---

## 🛠 原理与架构 (Architecture & Principles)

本项目采用 **Build-time Indexing (构建时索引)** 与 **Runtime Fetching (运行时获取)** 相结合的策略，实现了无后端动态感。

### 1. 项目文件结构
```
.
├── index.html           # 页面入口 (Shell)
├── App.vue              # 核心应用逻辑 (路由、布局、状态管理)
├── components/          # Vue 组件
│   ├── LabReactivity.vue # 实验台：响应式原理 (交互组件)
│   ├── LabLifecycle.vue  # 实验台：生命周期 (交互组件)
│   └── FileTree.vue      # 递归目录树组件
├── scripts/
│   └── generate-tree.js # 核心构建脚本 (Node.js)
├── notes/               # 你的笔记数据源 (Markdown文件)
└── package.json         # 项目依赖与脚本配置
```

### 2. 核心工作流 (The Build Loop)
当代码 Push 到 GitHub 时，GitHub Actions 会执行以下步骤：

1.  **Scanner (扫描)**: Node.js 脚本 (`generate-tree.js`) 唤醒，递归遍历 `notes` 文件夹。
2.  **Indexer (索引)**: 脚本读取所有 `.md` 文件的元数据（文件名、路径、修改时间），生成一个巨大的 JSON 索引文件 `public/files.json`。
3.  **Bundler (打包)**: Vite 打包 Vue 代码，生成优化的 JS/CSS 静态资源。
4.  **Publisher (发布)**: 最终的 `dist` 目录（包含前端资源 + JSON索引 + 原始MD文件）被发布到静态网页服务器。

### 3. 前端运行时
当用户访问网页时：
1.  Vue 应用启动，`fetch('/files.json')` 获取目录结构。
2.  用户点击某个文件时，`fetch(filePath)` 获取 Markdown 内容。
3.  利用 `marked.js` 将 Markdown 渲染为 HTML。

这种设计使得博客既拥有静态网站的速度和SEO（相对），又拥有单页应用 (SPA) 的流畅体验。

---

## 🚀 如何开始

### 1. 部署到 GitHub Pages

1. **Fork** 或 **Copy** 此仓库到你的 GitHub。
2. 进入仓库的 `Settings` -> `Pages`。
3. 在 "Build and deployment" 下，Source 选择 **GitHub Actions**。
4. 任何时候你 Push 代码到 `main` 分支，GitHub Actions 会自动运行并部署。

### 2. 添加/写笔记

1. 在项目根目录下找到或新建 `notes` 文件夹。
2. 在 `notes` 下创建任意层级的子文件夹和 `.md` 文件。
3. 若文件夹名为 `VUE学习笔记`，它将自动出现在 Lab 实验室板块中。

---

## 🎨 自定义配置

### 修改头像与名称
打开 `App.vue` 文件，搜索 `<!-- AVATAR IMAGE -->` 区域进行修改。

### 修改主题色
打开 `index.html` 中的 `tailwind.config` script 标签，修改 `colors.sakura` 下的色值。

---

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
# 🌸 Sakura Notes (Static Vue Blog)

**v1.0**

这是一个基于 Vue 3 + Tailwind CSS 的纯静态个人博客系统，专为 GitHub Pages 部署设计。
无需复杂的后端服务器，采用 **Metadata Indexing + Runtime Fetching** 架构，实现极其轻量的静态博客体验。

[Live Demo](https://github.com/soft-zihan)

---

## ✨ 特性 (Features)

- **纯静态架构**：完全基于客户端渲染 (CSR)，通过 GitHub Actions 预生成元数据索引。
- **动态获取**：Markdown 内容按需加载 (Lazy Load)，首屏加载速度极快，适合托管海量笔记。
- **国际化支持**：内置中/英双语切换 (i18n)。
- **主题模式**：支持 "Day Sakura" (浅色) 和 "Night Sakura" (深色) 两种主题模式。
- **Sakura Lab**: 内置 Vue 互动实验室，包含可视化教学组件（响应式原理、生命周期）。
- **无后端个性化**：利用 `localStorage` 存储用户的字体（衬线/无衬线）、字号和主题偏好。
- **深度互动**：
  - **临时高亮**：选中文字可模拟荧光笔效果。
  - **分享引用**：支持直接复制选中的 Markdown 引用格式。
- **宽屏适配**：针对大屏幕优化的阅读体验，左右侧栏自适应。

---

## 🛠 原理与架构 (Architecture & Principles)

本项目采用 **Build-time Metadata (构建时元数据)** 与 **Runtime Content Fetching (运行时内容获取)** 相结合的策略。

### 1. 核心工作流 (The Build Loop)
当代码 Push 到 GitHub 时，GitHub Actions 会执行以下步骤：

1.  **Scanner (扫描)**: Node.js 脚本 (`generate-tree.js`) 遍历 `notes` 文件夹。
2.  **Indexer (索引)**: 脚本生成 `files.json`，其中包含文件路径、标题、修改时间等**元数据**，但不包含内容。这使得索引文件非常小。
3.  **Deploy (部署)**: 所有的 Markdown 文件保持原样被复制到 `dist/notes/` 目录。

### 2. 前端运行时
当用户访问网页时：
1.  Vue 应用启动，`fetch('/files.json')` 获取轻量级目录结构。
2.  **按需加载**：当用户点击某个笔记时，浏览器才发起 `fetch('/notes/xxx.md')` 请求。
3.  **客户端渲染**：利用 `marked.js` 将获取到的 Markdown 文本实时渲染为 HTML。

这种架构相比将所有内容打包进 JS Bundle，具有更好的首屏性能和扩展性。

---

## 🚀 如何开始

### 1. 部署到 GitHub Pages

1. **Fork** 此仓库。
2. 进入仓库的 `Settings` -> `Pages`。
3. Source 选择 **GitHub Actions**。
4. Push 代码到 `main` 分支，等待 Action 执行完毕。

### 2. 写笔记

1. 在项目根目录下 `notes` 文件夹中创建 `.md` 文件。
2. Push 代码，博客自动更新。

---

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
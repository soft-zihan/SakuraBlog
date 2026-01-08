# 🌸 Sakura Notes (Static Vue Blog)

**v1.2**

这是一个基于 Vue 3 + Tailwind CSS 的纯静态个人博客系统，专为 GitHub Pages 部署设计。
无需复杂的后端服务器，采用 **Metadata Indexing + Runtime Fetching** 架构，实现极其轻量的静态博客体验。

[Live Demo](https://github.com/soft-zihan)

---

## ✨ 特性 (Features)

- **纯静态架构**：完全基于客户端渲染 (CSR)，通过 GitHub Actions 预生成元数据索引。
- **图片增强**：
  - **智能路径**：支持 `./` (同级) 和 `../` (跨文件夹) 引用图片。
  - **Lightbox**：内置图片查看器，点击图片可全屏放大。
  - **HTML支持**：支持使用 `<img src="..." width="100">` 控制图片大小。
- **动态获取**：Markdown 内容按需加载 (Lazy Load)，首屏加载速度极快。
- **国际化支持**：内置中/英双语切换 (i18n)。
- **主题模式**：支持 "Day Sakura" (浅色) 和 "Night Sakura" (深色) 两种主题模式。
- **Sakura Lab**: 内置 Vue 互动实验室，包含可视化教学组件（响应式原理、生命周期）。
- **无后端个性化**：利用 `localStorage` 存储用户的字体、字号和主题偏好。

---

## 🛠 原理与架构

1.  **Scanner**: Node.js 脚本扫描 `notes/` 目录生成索引。
2.  **Deploy**: 所有的 Markdown 和 **图片资源** 都会被原样复制到 `dist/notes/` 目录。
3.  **Runtime**: Vue 应用拦截 Markdown 中的图片路径，自动补全为服务器上的真实路径。

---

## 🚀 如何投稿 (Contributing)

我们非常欢迎您的贡献！如果您想分享技术笔记，请遵循以下流程：

1. **Fork** 本仓库。
2. 在 `notes/` 目录下创建新的 `.md` 文件或文件夹。
   * 建议按分类建立文件夹，例如 `notes/Vue/Tips.md`。
   * **图片**：请将图片放在同级目录或 `assets` 文件夹中。
3. 提交 **Pull Request (PR)** 到主分支。

---

## 🚀 如何使用图片

### 1. 放在同级目录 (推荐)
```text
notes/
  Life/
    diary.md
    cat.png
```
在 `diary.md` 中：`![猫猫](./cat.png)`

### 2. 放在资源目录 (整洁)
```text
notes/
  assets/
    logo.png
  Life/
    diary.md
```
在 `diary.md` 中：`![Logo](../assets/logo.png)`

---

## 🚀 部署

1. **Fork** 此仓库。
2. 在项目根目录下 `notes` 文件夹中创建 `.md` 文件。
3. Push 代码，GitHub Actions 会自动构建并部署到 Pages。

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
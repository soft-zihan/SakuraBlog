# 🌸 Sakura Notes

> **v1.0**

这是一个基于 **Vue 3** + **Tailwind CSS** 的纯静态个人博客系统，专为 **GitHub Pages** 部署设计。

[**在线演示 (Live Demo)**](https://soft-zihan.github.io/)

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

1. **Scanner**: Node.js 脚本扫描 `notes/` 目录生成索引。
2. **Deploy**: 所有的 Markdown 和 **图片资源** 都会被原样复制到 `dist/notes/` 目录。
3. **Runtime**: Vue 应用拦截 Markdown 中的图片路径，自动补全为服务器上的真实路径。

---

## 🚀 如何投稿 (Contributing)

我们非常欢迎您的贡献！如果您想分享笔记或贡献代码：

1. 克隆仓库。
2. 直接推送到 `main` 分支。
3. 或者您可以提交 **Pull Request (PR)** 到主分支。

---

## 🚀 自行部署

1. **Fork** 此仓库。
2. 在项目根目录下 `notes` 文件夹中创建 `.md` 文件。
3. Push 代码，在 GitHub 仓库的 **Settings -> Pages** 中选择 **GitHub Actions** 作为构建源。每次 push 会自动构建并部署到 Pages。

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
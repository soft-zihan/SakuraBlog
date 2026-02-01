# 🌸 Sakura Notes

<div align="center">

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?logo=github)](https://soft-zihan.github.io/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/soft-zihan/soft-zihan.github.io)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTY)](https://deepwiki.com/soft-zihan/SakuraBlog)

**一个为 GitHub Pages 设计的纯静态个人博客系统**

[🌐 在线演示](https://soft-zihan.github.io/SakuraBlog/) · [🐛 报告问题](https://github.com/soft-zihan/SakuraBlog/issues)

</div>

---

## 📑 目录

- [✨ 特性概览](#-特性概览)
- [🙏 致谢](#-致谢)
- [🎯 快速开始](#-快速开始)
- [🧪 测试](#-测试)
- [📁 项目结构](#-项目结构)
- [🏗️ 技术架构](#️-技术架构)
- [🔧 配置指南](#-配置指南)
- [📝 内容管理](#-内容管理)
- [🔐 安全与数据](#-安全与数据)
- [🤝 贡献指南](#-贡献指南)
- [📜 更新日志](#-更新日志)
- [🔬 技术实现解析](#-技术实现解析)
- [🧩 静态部署的取舍](#-静态部署的取舍)
- [🚀 改造成前后端项目（去除 Fork+PR 依赖）](#-改造成前后端项目去除-forkpr-依赖)

---

## ✨ 特性概览

### 🎨 界面与交互

| 特性                   | 描述                                                           |
| ---------------------- | -------------------------------------------------------------- |
| **双主题模式**   | 「日樱」浅色主题 + 「夜樱」深色主题，壁纸随主题切换            |
| **动态樱花背景** | 可拖拽樱花花瓣系统，支持物理效果、网格堆叠、移动端触摸优化     |
| **响应式设计**   | 完美适配桌面端和移动端                                         |
| **多语言支持**   | 内置中/英双语切换 (i18n)，切换时保留当前标签页和实验室位置     |
| **无后端个性化** | 使用 `localStorage` 存储字体、阅读密度、主题、花瓣速度等偏好设置 |

### 📚 内容系统

| 特性                    | 描述                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| **Markdown 渲染** | 完整 Markdown 支持，自动目录生成，代码语法高亮                         |
| **全文搜索**      | 基于 MiniSearch 的快速全文检索，支持高亮显示                           |
| **文章管理**      | 收藏、点赞、标签过滤、阅读历史                                         |
| **阅读统计**      | 基于 Umami（Share Token API）展示单篇文章阅读量与阅读人数              |
| **评论系统**      | 基于[Giscus](https://github.com/giscus/giscus) 的 GitHub Discussions 评论 |
| **音乐播放器**    | 内置音乐播放器，支持歌词显示                                           |

### 🛠️ 发布功能

| 特性                     | 描述                                                  |
| ------------------------ | ----------------------------------------------------- |
| **发布工作台**     | 文件导入预览、重命名、文件夹选择、标签/作者元数据注入 |
| **实时预览**       | 编辑时实时 Markdown 预览                              |
| **图片自动上传**   | Markdown 中的本地图片自动上传至 GitHub                |
| **智能 Fork + PR** | 无写入权限用户自动 Fork 并提交 PR，自动同步最新代码   |

### 🧪 学习实验室

| 特性                     | 描述                                   |
| ------------------------ | -------------------------------------- |
| **8 阶段学习路径** | 从 Web 基础到 Vue 3 进阶的完整学习路线（含综合挑战） |
| **交互式组件**     | 可视化教学组件，实时代码演示           |
| **源码查看器**     | 查看本站组件源码；支持“预置笔记/用户笔记”，并按当前语言显示说明 |

#### 学习实验室：给小白的完整读法

- **Stage（阶段）**：站内的学习路线图，强调“边看边玩边验证”（交互组件 + 即时反馈）。当前共有 8 个 Stage：HTML → CSS → JS → TS/异步 → 工程化 → Vue 核心 → Vue 进阶 → 综合挑战。
- **笔记（notes/VUE学习笔记）**：配套的“系统讲解材料”（7 篇章节），更适合从头到尾顺着读，解决“为什么/背景/概念体系”。实验室各 Stage 会反复引用它们作为主线讲解。
- **源码查看器（Source Viewer）**：把“站内 UI 表现”映射到“真实项目源码”。你可以打开具体文件，结合预置笔记理解：某段代码对应本站哪个组件、触发哪个交互、为什么这么写。
- **推荐学习法**：先读对应笔记（尤其 1-4），再回到实验室做交互实验与对照源码；遇到不理解的 UI 效果，就用“打开源码/预置笔记”回溯实现细节。

### 🔐 安全特性

| 特性                     | 描述                                                   |
| ------------------------ | ------------------------------------------------------ |
| **Token 加密存储** | AES-256-GCM 加密，密钥基于浏览器指纹派生               |
| **本地/云端备份**  | 支持本地备份（浏览器）和云端备份（GitHub），可导入导出 |
| **隐私保护**       | 所有数据本地存储，不上传第三方服务器                   |

---

## 🙏 致谢

- 评论系统与阅读统计实现借鉴了 [RyuChan](https://github.com/kobaridev/RyuChan)。

## 🎯 快速开始

### 方式一：Fork 部署（推荐）

1. **Fork 本仓库**

   - 点击右上角 `Fork` 按钮
2. **启用 GitHub Pages**

   - 进入仓库 `Settings` → `Pages`
   - Source 选择 `GitHub Actions`
3. **添加内容**

   - 在 `notes/zh/` 或 `notes/en/` 目录下创建 `.md` 文件
   - 推送代码，GitHub Actions 自动构建部署
4. **访问你的网站**

   - `https://你的用户名.github.io/仓库名/`

### 方式二：本地开发

```bash
# 克隆仓库
git clone https://github.com/soft-zihan/SakuraBlog.git
cd SakuraBlog

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 方式三：在线发布

直接访问 [Sakura Notes](https://soft-zihan.github.io/SakuraBlog/)，点击右上角设置按钮：

1. 输入你的 GitHub Token（需要 `repo` 权限）
2. 配置目标仓库信息
3. 使用发布工作台撰写并发布文章，发布时会自动fork到你的仓库
4. 会自动为你创建 Pull Request

---

## 🧪 测试

```bash
npm run test -- --run
```

---

## 📁 项目结构

```
sakura-notes/
├── 📁 scripts/              # 构建前置脚本（生成 public/ 下的数据）
│   ├── generate-tree.ts
│   ├── generate-raw.ts
│   ├── generate-music.ts
│   └── generate-wallpapers.ts
├── 📁 src/                  # 源码
│   ├── 📄 main.ts           # Vue 应用挂载入口
│   ├── 📄 App.vue           # 根组件
│   ├── 📄 index.html        # HTML 入口
│   ├── 📄 constants.ts      # i18n 国际化常量
│   ├── 📄 types.ts          # 全局类型定义
│   │
│   ├── 📁 views/            # 页面视图
│   │   └── ArticleReader.vue
│   │
│   ├── 📁 layout/           # 布局
│   │   └── AppLayout.vue
│   │
│   ├── 📁 components/       # Vue 组件
│   │   ├── AppHeader.vue      # 顶部导航栏
│   │   ├── ArticleInfoBar.vue  # 文章信息/操作栏
│   │   ├── ArticleToc.vue      # 文章目录（TOC）
│   │   ├── ThemePanel.vue     # 主题面板
│   │   ├── AppSidebar.vue     # 侧边栏
│   │   ├── SidebarFilterPanel.vue # 侧边栏筛选区
│   │   ├── MainContent.vue    # 主内容区
│   │   ├── 📁 Modals/         # 模态组件
│   │   │   ├── CodeModal.vue
│   │   │   └── Lightbox.vue
│   │   └── 📁 lab/            # 学习实验室系统
│   │       ├── LabDashboard.vue
│   │       ├── SourceCodeViewer.vue
│   │       ├── 📁 stage1-foundation/ ... 📁 stage8-challenge/
│   │       └── 📁 stages/        # Lab Stage 包装页
│   │           └── StageLearningGuide.vue
│   │
│   ├── 📁 composables/      # 组合式函数
│   │   ├── useArticleMeta.ts
│   │   ├── useContentRenderer.ts
│   │   ├── useSearch.ts
│   │   ├── useUmamiViewStats.ts # Umami Share Token 阅读统计
│   │   └── ...
│   │
│   ├── 📁 stores/           # Pinia 状态管理
│   │   ├── appStore.ts
│   │   ├── articleStore.ts
│   │   ├── articleNavStore.ts   # 文章目录/导航状态
│   │   ├── learningStore.ts
│   │   └── musicStore.ts
│   │
│   ├── 📁 locales/          # 多语言
│   │   ├── en.ts
│   │   └── zh.ts
│   │
│   ├── 📁 styles/           # 全局样式
│   │   └── app.css
│   │
│   ├── 📁 utils/            # 工具函数
│   │   ├── fileUtils.ts
│   │   ├── i18nText.ts
│   │   ├── sanitize.ts
│   │   ├── storage.ts
│   │   └── wallhavenApi.ts
│   │
├── 📁 public/              # 静态资源（生成数据）
│   ├── 📁 data/
│   │   ├── files.json
│   │   ├── music.json
│   │   ├── wallpapers.json
│   │   ├── 📁 source-notes-preset/  # 源码查看器的“逐文件”预置笔记
│   │   │   ├── 📁 zh/
│   │   │   └── 📁 en/
│   │   ├── source-notes-preset.zh.json
│   │   └── source-notes-preset.en.json
│   ├── 📁 raw/              # 源码查看器用的 raw 文本（由脚本导出）
│   └── 📁 notes/
│
├── 📄 vite.config.ts      # Vite 构建配置
└── 📄 tsconfig.json       # TypeScript 配置
```

说明：`src/utils/i18nText.ts` 并不是界面文案的 i18n（界面文案在 `src/locales/*`），它只负责把源码查看器的预置笔记锚定到代码行（减少代码变动导致的错位）。

---

## 🏗️ 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    客户端 (Browser)                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Vue 3 SFC  │  │   Pinia     │  │  Composables│     │
│  │  Components │  │   Stores    │  │   (逻辑)    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ localStorage│  │  GitHub API │  │  Static     │     │
│  │  (持久化)   │  │  (发布/备份)│  │  Assets     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Pages (静态托管)                     │
├─────────────────────────────────────────────────────────┤
│  index.html + JS bundles + notes/*.md + public/*        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│             GitHub Actions (CI/CD)                       │
├─────────────────────────────────────────────────────────┤
│  generate-tree（含 raw 导出）→ generate-raw（兼容保留）→ vite build → deploy │
└─────────────────────────────────────────────────────────┘
```

### 核心技术栈

| 技术                   | 版本 | 用途                           |
| ---------------------- | ---- | ------------------------------ |
| **Vue 3**        | 3.5  | 前端框架，使用 Composition API |
| **TypeScript**   | 5.4  | 类型安全                       |
| **Vite**         | 4.4  | 构建工具                       |
| **Pinia**        | 3.0  | 状态管理                       |
| **Tailwind CSS** | 3.x  | 原子化 CSS                     |
| **Shiki**        | 1.22 | 代码语法高亮                   |
| **MiniSearch**   | 7.1  | 全文搜索引擎                   |
| **Marked**       | 12.0 | Markdown 解析                  |

### 构建流程

```bash
npm run build
# 等价于:
# 1. node scripts/generate-tree.js  → 扫描 notes/ 生成 public/files.json
# 2. node scripts/generate-raw.js   → 生成源码文件供查看器使用
# 3. node scripts/generate-music.js → 扫描 public/music/ 生成 music.json
# 4. node scripts/generate-wallpapers.js → 生成壁纸配置
# 5. vite build                     → 打包 Vue 应用
```

---

## 🔧 配置指南

### GitHub Token 配置

发布功能需要 GitHub Personal Access Token：

1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 创建 Token，勾选 `repo` 权限（完整仓库访问）
3. 在网站设置中填入 Token

> ⚠️ Token 使用 AES-256-GCM 加密存储，密钥基于浏览器指纹

### Giscus 评论配置

1. 在你的仓库启用 [GitHub Discussions](https://docs.github.com/en/discussions)
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app/) 获取配置参数
4. 修改 `components/GiscusComments.vue` 中的配置

### Umami 阅读统计（云端，可选）

本项目按 **RyuChan** 的思路：让 Umami tracker 负责“记账”，站内通过 **Share Token API** 读数展示“阅读量 / 阅读人数”。由于本站是静态部署 + query 导航，会把每篇文章映射成 `/notes/<文件路径>` 的虚拟路径来做到“按篇统计”。

1. 在 Umami Cloud 创建 Website，然后在“Tracking code”里复制 `websiteId`（也就是脚本里 `data-website-id` 那串）。  
2. 在该 Website 打开 Share，创建 Share Link，复制 `shareId`（Share URL 最后一段）。  
3. 在项目根目录创建 `.env`（或 `.env.local`）并填写：

   ```bash
   VITE_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
   VITE_UMAMI_WEBSITE_ID=<你的websiteId>
   VITE_UMAMI_BASE_URL=https://cloud.umami.is
   VITE_UMAMI_SHARE_ID=<你的shareId>
   VITE_UMAMI_TIMEZONE=Asia/Shanghai
   ```

### 自定义壁纸和音乐

    将图片放入`public/image/wallpapers/` 目录， `.mp3` 文件放入 `public/music/` 目录

---

## 📝 内容管理

### 文件夹组织

```
notes/
├── zh/                    # 中文文章
├── en/                    # 英文文章
│   
├── VUE学习笔记/            # 系列教程（中文）
└── 
```

### 使用发布工作台

1. 点击左上角 `写作` 按钮打开发布工作台
2. 支持以下功能：
   - 📝 直接撰写 Markdown
   - 📁 导入本地 `.md` 文件
   - 🖼️ 拖拽/粘贴图片自动上传
   - 🏷️ 添加标签和作者信息
   - 📂 选择发布目录
   - 👁️ 实时预览

---

## 🔐 安全与数据

### Token 安全策略

| 措施                       | 说明                                                          |
| -------------------------- | ------------------------------------------------------------- |
| **AES-256-GCM 加密** | 业界标准对称加密算法                                          |
| **浏览器指纹密钥**   | 密钥基于 userAgent + 屏幕分辨率 + 时区 + 语言派生，设备特异性 |
| **不参与备份**       | Token 明确排除在所有备份操作之外                              |
| **仅用于 API 调用**  | Token 仅发送至 GitHub API，不会发送到其他服务器               |

### localStorage 存储内容

| 数据类型 | 键名前缀                   | 说明                 |
| -------- | -------------------------- | -------------------- |
| 用户偏好 | `app-store`              | 主题、字体、壁纸设置 |
| 文章交互 | `article-store`          | 收藏、点赞           |
| 仓库配置 | `github_*`               | 仓库信息、作者名     |
| 本地备份 | `backup_*`               | 备份数据             |
| Token    | `encrypted_github_token` | 加密后的 Token       |

> ⚠️ **警告**: 清除浏览器数据会丢失这些内容，请定期使用备份功能！

### 发布机制

```
仓库所有者 (有写入权限)        贡献者 (未申请写入权限)
       │                            │
       ▼                            ▼
  直接提交到 main          自动 Fork 仓库
       │                            │
       ▼                            ▼
  触发 GitHub Actions       同步 Fork 到最新
       │                            │
       ▼                            ▼
  自动构建部署              提交到 Fork
                                   │
                                   ▼
                            创建 Pull Request
                                   │
                                   ▼
                            等待仓库所有者审核合并
```

---

## 🤝 贡献指南

### 贡献内容（笔记/文章）

**方式一：网页端发布**

1. 访问 [Sakura Notes](https://soft-zihan.github.io/SakuraBlog/)
2. 配置你的 GitHub Token
3. 使用发布工作台撰写并发布
4. 系统会自动为你创建 PR

**方式二：直接提交 PR**

1. Fork 本仓库
2. 在 `notes/` 目录下创建 `.md` 文件
3. 提交 PR 到 `main` 分支

### 贡献代码

1. **Fork & Clone**

   ```bash
   git clone https://github.com/你的用户名/SakuraBlog.git
   cd SakuraBlog
   npm install
   ```
2. **创建功能分支**

   ```bash
   git checkout -b feature/你的功能名
   ```
3. **开发与测试**

   ```bash
   npm run dev  # 启动开发服务器
   ```
4. **提交代码**

   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin feature/你的功能名
   ```
5. **创建 Pull Request**

### Commit 规范

| 类型         | 说明                   |
| ------------ | ---------------------- |
| `feat`     | 新功能                 |
| `fix`      | Bug 修复               |
| `docs`     | 文档更新               |
| `style`    | 代码格式（不影响功能） |
| `refactor` | 重构                   |
| `perf`     | 性能优化               |
| `chore`    | 构建/工具变更          |

---

## 📜 更新日志

### v1.1

- 🐛 修复非仓库所有者提交时的 404 错误
- 🔧 优化权限检查逻辑，提前判断是否需要 Fork + PR
- 🔐 新增 Token AES-256-GCM 加密存储
- 🍴 智能 Fork + PR 系统，自动同步上游
- 💾 本地备份系统，支持导入导出
- 👁️ 发布工作台实时预览
- 🧪 学习实验室 7 阶段完整路径
- 🌸 可拖拽樱花花瓣系统
- 🎨 双主题模式（日樱/夜樱）
- 🔍 全文搜索功能
- 💬 Giscus 评论集成
- 🎵 音乐播放器

### v1.0.0

- 🎉 初始版本发布
- 📝 Markdown 笔记系统
- 🌐 中英双语支持
- 📱 响应式设计

---

## 🔬 技术实现解析

这一节把“为什么它能工作”讲清楚：关键链路、数据形态、以及为什么这样设计更适合纯静态部署。

### 1) 笔记树索引：从 `notes/` 到可被前端读取的数据

- **目标**：让前端在运行时能够快速拿到“有哪些文件/目录、每个文件的标题/标签/时间”等结构化信息，而不需要后端。
- **实现方式**：构建前置脚本扫描 `notes/`，生成索引 JSON，并把笔记镜像复制到 `public/notes/`，供浏览器 `fetch()` 读取。
- **关键脚本**：`scripts/generate-tree.ts`
- **产物**：`public/data/files.json`、`public/notes/**`
- **加载策略**：
  - `files.json` 允许浏览器正常缓存（避免每次加载都加时间戳强制绕过）
  - 可选用 localStorage 保存上次成功的 `files.json`，二次访问/硬刷新时先回填 UI，再后台拉最新数据

### 2) 源码查看器：静态站内“读源码”的实现

- **目标**：在网站里查看本项目的 Vue 组件/工具函数源码，并配合“预置笔记”做讲解。
- **实现方式**：
  - 构建前置脚本把需要展示的源码复制/生成到 `public/raw/`（避免线上直接访问 `src/`）。
  - 前端按“虚拟文件系统”读取这些 raw 文本，并用预置的 notes 对关键文件做注释与导航。
- **关键脚本**：`scripts/generate-raw.ts`
- **关键组件**：`src/components/lab/SourceCodeViewer.vue`
- **预置笔记数据**：`public/data/source-notes-preset.zh.json` 与 `public/data/source-notes-preset.en.json`（可选 `match/matchRegex` 锚点，减少代码变动导致的笔记错位）

### 3) Markdown 渲染：目录、代码高亮与交互

- **目标**：在纯前端渲染 Markdown，同时具备目录（ToC）、代码高亮、链接/图片等基础能力。
- **实现方式**：在客户端把 Markdown 解析为 HTML，再叠加目录生成与必要的安全处理（避免注入）。
- **相关模块**：`src/composables/useContentRenderer.ts`、`src/utils/sanitize.ts`

### 4) 全文搜索：为什么要“先生成索引”

- **目标**：不依赖后端、在浏览器内快速全文检索，并能高亮命中片段。
- **实现方式**：使用 MiniSearch 在客户端建立索引；先用标题/摘要索引快速可用，后台并发拉取全文补齐索引，并缓存完整索引以加速二次打开。
- **相关模块**：`src/composables/useSearch.ts`、`src/stores/articleStore.ts`

### 5) 发布工作台：纯静态环境下的“写作/上传/发布”

- **目标**：不跑服务端也能在网页端发布文章（含图片）。
- **实现方式**：通过 GitHub API 在浏览器端完成写入；当用户无写权限时走 Fork + PR，避免直接写上游仓库。
- **相关模块**：`src/composables/useGitHubPublish.ts`

### 6) Token 加密与备份：在浏览器侧做“安全的最低保障”

- **目标**：Token 不以明文落地；备份时避免把 Token 带走；尽量减少误泄漏风险。
- **实现方式**：AES-256-GCM 加密 + 基于浏览器指纹派生密钥；备份流程明确排除 Token。
- **相关模块**：`src/composables/useTokenSecurity.ts`、`src/composables/useBackup.ts`

---

## 🧩 静态部署的取舍

为了能在 GitHub Pages 这种纯静态托管里“零后端上线”，项目做了这些取舍：

- **把数据变成静态资源**：笔记索引、raw 源码、音乐/壁纸清单都在构建阶段生成到 `public/`，运行时只需要 `fetch()`。
- **写入能力转移到第三方 API**：发布/图片上传/云端备份依赖 GitHub API（用 Token 授权），站点自身不提供写接口。
- **权限与协作用 PR 兜底**：对无写权限用户，通过 Fork + PR 实现“可贡献但不可直接写上游”的协作模式。
- **主要限制**：
  - Token 存在于浏览器侧，即便加密也无法达到服务端级别的防护（XSS、防扩展窃取等需要额外策略）。
  - GitHub API 有速率限制与权限边界，且 PR 流程意味着“发布不一定即时生效”（需合并）。
  - 图片上传/大文件的体验受 GitHub 生态限制（大小、速度、可用性）。

---

## 🚀 改造成前后端项目（去除 Fork+PR 依赖）

如果你希望彻底摆脱“提交到 GitHub → PR 合并 → Actions 构建”的迂回链路，可以把“写入/鉴权/存储”收回到自己的后端，前端继续保持 SPA。

### 目标能力

- 网页端直接“保存/发布”文章，**即时生效**（无需 PR、无需等待 CI 合并）。
- 图片上传走自有存储（本地对象存储、OSS/S3、或任意 CDN）。
- 账号体系可选：GitHub OAuth、邮箱密码、或内网账号。
- 备份从“GitHub 仓库”升级为“数据库快照/对象存储版本”。

### 推荐的最小改造方案（保持现有目录习惯）

- **后端新增服务**（Node/NestJS、Go、Spring 都可）：
  - `POST /auth/*`：登录/刷新（可接 GitHub OAuth 或自建账号）
  - `GET /notes/tree`：返回目录树与元数据（替代 `public/data/files.json`）
  - `GET /notes/:id`：按需拉取 Markdown（替代 `public/notes/**`）
  - `POST /notes` / `PUT /notes/:id`：创建/更新文章
  - `POST /upload`：图片上传，返回可访问 URL
  - `POST /backup` / `GET /backup/:id`：备份与恢复
- **存储层**：
  - Markdown 内容：数据库（PostgreSQL/MySQL）或对象存储（按路径存）
  - 索引：数据库表（title/tags/time/path），或定时重建缓存
  - 图片：对象存储 + CDN
- **前端改动点**：
  - 把 “发布工作台” 的 GitHub API 写入替换为调用后端 API。
  - 保留 `notes/` 目录与构建脚本作为“导入工具”，但线上读写走后端。
  - 评论系统可继续用 Giscus，也可替换为自建评论 API。

### 迁移路径建议

1. 先把“图片上传”从 GitHub 切到后端（收益最大、改动可控）。
2. 再把“文章写入”切到后端（去除 Fork+PR 依赖的核心一步）。
3. 最后把“树索引/全文搜索索引”放到后端或由后端生成并缓存（改善大数据量性能）。

---

## 📄 License

[MIT License](LICENSE) © 2024-present

---

<div align="center">

**🌸 愿这个项目成为你整理知识、分享生活的小花园 🌸**

Made with ❤️ by [soft-zihan](https://github.com/soft-zihan)

</div>

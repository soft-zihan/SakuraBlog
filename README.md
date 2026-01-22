# 🌸 Sakura Notes

<div align="center">

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?logo=github)](https://soft-zihan.github.io/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/soft-zihan/soft-zihan.github.io)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTY)](https://deepwiki.com/soft-zihan/soft-zihan.github.io)

**A pure static personal blog system designed for GitHub Pages**

[🌐 Live Demo](https://soft-zihan.github.io/) · [📖 中文](README_zh.md) · [🐛 Report Issues](https://github.com/soft-zihan/soft-zihan.github.io/issues)

</div>

---

## 📑 Table of Contents

- [✨ Features Overview](#-features-overview)
- [🎯 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [🔧 Configuration Guide](#-configuration-guide)
- [📝 Content Management](#-content-management)
- [🔐 Security &amp; Data](#-security--data)
- [🤝 Contribution Guide](#-contribution-guide)
- [📜 Changelog](#-changelog)

---

## ✨ Features Overview

### 🎨 UI & Interaction

| Feature                                | Description                                                                                      |
| :------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Dual Theme Modes**             | "Day Sakura" (Light) + "Night Sakura" (Dark) themes, with wallpapers that switch accordingly.    |
| **Dynamic Sakura Background**    | Draggable petal system with physics effects, grid stacking, and mobile touch optimization.       |
| **Responsive Design**            | Perfectly adapted for both desktop and mobile devices.                                           |
| **Multilingual Support**         | Built-in Chinese/English (i18n) switching; preserves current tab and Lab position when toggling. |
| **Backend-less Personalization** | Uses `localStorage` to save preferences like fonts, font size, themes, and petal speed.        |

### 📚 Content System

| Feature                      | Description                                                                                   |
| :--------------------------- | :-------------------------------------------------------------------------------------------- |
| **Markdown Rendering** | Full Markdown support, automatic Table of Contents (ToC) generation, and syntax highlighting. |
| **Full-text Search**   | Fast search based on MiniSearch with hit highlighting.                                        |
| **Article Management** | Favorites, Likes, Tag filtering, and Reading History.                                         |
| **Comment System**     | Powered by[Giscus](https://github.com/giscus/giscus) via GitHub Discussions.                     |
| **Music Player**       | Built-in player with synchronized lyric display.                                              |

### 🛠️ Publishing Features

| Feature                        | Description                                                                                    |
| :----------------------------- | :--------------------------------------------------------------------------------------------- |
| **Publishing Workbench** | File import preview, renaming, folder selection, and tag/author metadata injection.            |
| **Real-time Preview**    | Live Markdown preview while editing.                                                           |
| **Auto Image Upload**    | Local images in Markdown are automatically uploaded to GitHub.                                 |
| **Smart Fork + PR**      | Users without write access can automatically Fork and submit PRs; auto-syncs with latest code. |

### 🧪 Learning Lab

| Feature                          | Description                                                            |
| :------------------------------- | :--------------------------------------------------------------------- |
| **7-Stage Path**           | A complete learning roadmap from Web basics to advanced Vue 3.         |
| **Interactive Components** | Visual teaching components with real-time code demonstrations.         |
| **Source Viewer**          | View the source code of the site's own components to learn by example. |

### 🔐 Security Features

| Feature                           | Description                                                                     |
| :-------------------------------- | :------------------------------------------------------------------------------ |
| **Encrypted Token Storage** | AES-256-GCM encryption with keys derived from browser fingerprints.             |
| **Local/Cloud Backup**      | Supports local backups (browser) and cloud backups (GitHub) with import/export. |
| **Privacy Protection**      | All data is stored locally; no data is uploaded to third-party servers.         |

---

## 🎯 Quick Start

### Option 1: Fork & Deploy (Recommended)

1. **Fork the Repository**
   - Click the `Fork` button in the top right corner.
2. **Enable GitHub Pages**
   - Go to `Settings` → `Pages`.
   - Set "Source" to `GitHub Actions`.
3. **Add Content**
   - Create `.md` files in `notes/zh/` or `notes/en/`.
   - Push your code; GitHub Actions will automatically build and deploy.
4. **Access Your Site**
   - `https://<your-username>.github.io/<repo-name>/`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/soft-zihan/soft-zihan.github.io.git
cd soft-zihan.github.io

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Option 3: Online Publishing

Visit [Sakura Notes](https://soft-zihan.github.io/) directly and click the Settings icon:

1. Enter your GitHub Token (requires `repo` scope).
2. Configure your target repository info.
3. Use the "Write" workbench to compose and publish; the system will automatically fork to your account.
4. A Pull Request will be created for you automatically.

---

## 📁 Project Structure

```
sakura-notes/
├── 📁 src/                  # Source code
│   ├── 📄 main.ts           # Vue app mount entry
│   ├── 📄 App.vue           # Root component (Layout & State)
│   ├── 📄 index.html        # HTML entry
│   ├── 📄 constants.ts      # i18n constants
│   ├── 📄 types.ts          # Global type definitions
│   │
│   ├── 📁 views/            # Page Views
│   │   └── ArticleReader.vue # Dedicated Article Reader & TOC
│   │
│   ├── 📁 components/       # Vue components
│   │   ├── AppHeader.vue      # Top navigation bar
│   │   ├── AppSidebar.vue     # Sidebar navigation
│   │   ├── ... (Feature components)
│   │   └── 📁 lab/            # Learning Lab system
│   │
│   ├── 📁 composables/      # Vue 3 Composables (Logic Reuse)
│   │   ├── useArticleMeta.ts  # Metadata extraction
│   │   ├── useContentRenderer.ts # Markdown rendering
│   │   ├── useFile.ts         # File operations
│   │   └── ...
│   │
│   └── 📁 stores/           # Pinia state management
│       ├── appStore.ts        # Global app settings
│       ├── articleStore.ts    # Article interactions
│       ├── learningStore.ts   # Learning progress
│       └── musicStore.ts      # Music player state
│
├── 📄 vite.config.ts      # Vite build configuration
└── 📄 tsconfig.json       # TypeScript configuration
```

---

## 🏗️ Technical Architecture

### Core Tech Stack

| Tech                   | Version | Purpose                              |
| :--------------------- | :------ | :----------------------------------- |
| **Vue 3**        | 3.5     | Frontend framework (Composition API) |
| **TypeScript**   | 5.4     | Type safety                          |
| **Vite**         | 4.4     | Build tool                           |
| **Pinia**        | 3.0     | State management                     |
| **Tailwind CSS** | 3.x     | Utility-first CSS                    |
| **Shiki**        | 1.22    | Code syntax highlighting             |
| **MiniSearch**   | 7.1     | Full-text search engine              |
| **Marked**       | 12.0    | Markdown parsing                     |

### Build Workflow

```bash
npm run build
# This triggers:
# 1. generate-tree.js  → Scans notes/ to create public/files.json
# 2. generate-raw.js   → Generates source files for the viewer
# 3. generate-music.js → Scans public/music/ for music.json
# 4. vite build        → Bundles the Vue application
```

---

## 🔧 Configuration Guide

### GitHub Token Configuration

The publishing feature requires a Personal Access Token:

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens).
2. Create a token with the `repo` scope.
3. Enter the token in the site's Settings panel.

> ⚠️ The token is stored using AES-256-GCM encryption with a key derived from your browser fingerprint.

### Giscus Comments

1. Enable [GitHub Discussions](https://docs.github.com/en/discussions) in your repo.
2. Install the [Giscus App](https://github.com/apps/giscus).
3. Get your configuration parameters from [giscus.app](https://giscus.app/).
4. Update the configuration in `components/GiscusComments.vue`.

---

## 🔐 Security & Data

### Token Security Strategy

- **AES-256-GCM**: Industry-standard symmetric encryption.
- **Fingerprint Key**: The key is derived from `userAgent` + screen resolution + timezone + language, making it device-specific.
- **Backup Exclusion**: Tokens are strictly excluded from all backup operations.
- **Direct API Use**: Tokens are only sent to the GitHub API, never to any third-party servers.

### localStorage Content

| Data Type    | Key Prefix                 | Description                       |
| :----------- | :------------------------- | :-------------------------------- |
| Preferences  | `app-store`              | Themes, fonts, wallpaper settings |
| Interactions | `article-store`          | Favorites, likes                  |
| Repo Config  | `github_*`               | Repository info, author name      |
| Token        | `encrypted_github_token` | Encrypted token                   |

> ⚠️ **Warning**: Clearing browser data will delete these settings. Please use the backup feature regularly!

---

## 🤝 Contribution Guide

### Contributing Content (Notes/Articles)

**Method 1: Web Interface**

1. Visit the live site and configure your Token.
2. Use the Workbench to write and publish.
3. The system will create a PR for you automatically.

**Method 2: Direct PR**

1. Fork the repo.
2. Add `.md` files to the `notes/` directory.
3. Submit a PR to the `main` branch.

### Commit Conventions

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `refactor`: Code refactoring
- `chore`: Build/tool changes

---

## 📜 Changelog

### v1.1

- 🐛 Fixed 404 error for non-owner submissions.
- 🔧 Optimized permission checks (Smart Fork + PR logic).
- 🔐 Added AES-256-GCM encryption for Tokens.
- 💾 Added local backup system (Import/Export).
- 👁️ Added real-time preview to the Publishing Workbench.
- 🧪 Completed 7-stage Learning Lab path.
- 🌸 Added draggable Sakura petal system.
- 🔍 Integrated full-text search.

### v1.0

- 🎉 Initial release.
- 📝 Basic Markdown note system.
- 🌐 Multi-language support.
- 📱 Responsive design.

---

## 📄 License

[MIT License](LICENSE) © 2024-present

---

<div align="center">

**🌸 May this project become your little garden for organizing knowledge and sharing your life 🌸**

Made with ❤️ by [soft-zihan](https://github.com/soft-zihan)

</div>

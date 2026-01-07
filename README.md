# 🌸 Sakura Notes (Static Vue Blog)

**v1.0**

This is a pure static personal blog system based on Vue 3 + Tailwind CSS, designed for GitHub Pages deployment.
It requires no complex backend server, adopting a **Metadata Indexing + Runtime Fetching** architecture for an extremely lightweight static blog experience.

[Live Demo](https://github.com/soft-zihan)

---

## ✨ Features

- **Pure Static Architecture**: Fully Client-Side Rendering (CSR), pre-generating metadata index via GitHub Actions.
- **Dynamic Fetching**: Markdown content is Lazy Loaded, ensuring fast initial load, suitable for hosting massive notes.
- **i18n Support**: Built-in English/Chinese switching.
- **Theming**: Supports "Day Sakura" (Light) and "Night Sakura" (Dark) modes.
- **Sakura Lab**: Built-in Vue interactive laboratory featuring visual educational components (Reactivity, Lifecycle).
- **Frontend Customization**: Uses `localStorage` to save user preferences for font (Serif/Sans), size, and theme.
- **Deep Interaction**:
  - **Temporary Highlight**: Select text to simulate a highlighter effect.
  - **Share Quote**: Directly copy selected text in Markdown quote format.
- **Responsive**: Optimized reading experience for wide screens with adaptive sidebars.

---

## 🛠 Architecture & Principles

This project uses a **Build-time Metadata** + **Runtime Content Fetching** strategy.

### 1. The Build Loop
When code is Pushed to GitHub, GitHub Actions performs:

1.  **Scanner**: A Node.js script (`generate-tree.js`) scans the `notes` and `VUE学习笔记` directories.
2.  **Indexer**: It generates `files.json`, containing paths, titles, and timestamps (metadata), keeping the index file very small.
3.  **Deploy**: All Markdown files are copied as-is to the `dist/` directory.

### 2. Runtime
When a user visits the site:
1.  Vue app starts and fetches `/files.json` for the lightweight directory structure.
2.  **On-Demand Load**: When a user clicks a note, the browser fetches the specific `/notes/xxx.md`.
3.  **Rendering**: `marked.js` renders the Markdown text to HTML in real-time.

---

## 🚀 How to Start

### 1. Deploy to GitHub Pages

1. **Fork** this repository.
2. Go to repository `Settings` -> `Pages`.
3. Select Source as **GitHub Actions**.
4. Push code to the `main` branch and wait for the Action to finish.

### 2. Writing Notes

1. Create `.md` files in the `notes` folder or `VUE学习笔记` (at root).
2. Push code, and the blog updates automatically.

---

Hope this project becomes your little garden for organizing knowledge and sharing life 🌸
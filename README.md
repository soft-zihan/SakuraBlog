# 🌸 Sakura Notes (Static Vue Blog)

**v1.0**

[中文文档 (Chinese)](./README_zh.md)

This is a pure static personal blog system based on Vue 3 + Tailwind CSS, designed for GitHub Pages deployment.
It requires no complex backend server, adopting a **Metadata Indexing + Runtime Fetching** architecture for an extremely lightweight static blog experience.

[Live Demo](https://github.com/soft-zihan)

---

## ✨ Features

- **Pure Static Architecture**: Fully Client-Side Rendering (CSR).
- **Gamified Learning**: Includes a "Vue Ninja" quiz game.
- **Dynamic Fetching**: Markdown content is Lazy Loaded.
- **Root Content**: Notes are served directly from the `notes/` directory.
- **Sakura/Snow Effects**: Toggleable particle system for aesthetics.
- **i18n Support**: Built-in English/Chinese switching.
- **Deep Interaction**:
  - **Temporary Highlight**: Select text to highlight.
  - **Smart Copy**: Copy selection as Markdown quote (`> text`) automatically.

---

## 🛠 Architecture

1.  **Scanner**: A Node.js script (`generate-tree.js`) scans the `notes/` directory.
2.  **Indexer**: It generates `files.json` containing the flat path structure relative to `notes/`.
3.  **Deployment**: The contents of your local `notes/` folder are deployed to `dist/notes/` on the server.
4.  **Runtime**: The Vue app fetches `files.json`, then fetches individual notes from `notes/{path}`.

---

## 🚀 How to Start

1. **Content**: Place all your Markdown notes inside the `notes/` folder at the root of the project. You can create subfolders there (e.g., `notes/Vue/Basic.md`).
2. **Deploy**: Push to GitHub. The Action will build the site and deploy.

---

## 🤝 Contributing

Contributions are welcome! If you have any improvements, new features, or bug fixes, please submit a **Pull Request**.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Enjoy writing! 🌸
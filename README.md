# 🌸 Sakura Notes (Static Vue Blog)
[中文文档 (Chinese)](https://github.com/soft-zihan/personal_blog/blob/main/README.md)
**v1.0**
A pure static personal blog system built with Vue 3 + Tailwind CSS, designed specifically for GitHub Pages deployment.

[Live Demo](https://soft-zihan.github.io/)

---

## ✨ Features

-   **Pure Static Architecture**: Fully client-side rendered (CSR), with metadata index pre-generated via GitHub Actions.
-   **Enhanced Images**:
    -   **Smart Pathing**: Supports `./` (same directory) and `../` (parent directory) image references.
    -   **Lightbox**: Built-in image viewer. Click any image to enlarge it in full-screen mode.
    -   **HTML Support**: Allows controlling image size using `<img src="..." width="100">`.
-   **Dynamic Fetching**: Markdown content is loaded on-demand (Lazy Load), ensuring extremely fast initial page load.
-   **Internationalization**: Built-in Chinese/English language switching (i18n).
-   **Theme Modes**: Supports both "Day Sakura" (light) and "Night Sakura" (dark) themes.
-   **Sakura Lab**: Built-in Vue interactive lab featuring visual teaching components (Reactivity, Lifecycle).
-   **Backend-free Personalization**: Uses `localStorage` to save user preferences for font, font size, and theme.

---

## 🛠 Principle & Architecture

1.  **Scanner**: A Node.js script scans the `notes/` directory to generate the content index.
2.  **Deploy**: All Markdown files and **image assets** are copied directly to the `dist/notes/` directory.
3.  **Runtime**: The Vue application intercepts image paths in Markdown and automatically completes them with the real server paths.

---

## 🚀 How to Contribute

We welcome your contributions! If you'd like to share notes or contribute code:

1.  Clone the repository.
2.  Push your changes directly to the `main` branch.
3.  Alternatively, you can submit a **Pull Request (PR)** to the main branch.

---

## 🚀 Self-Deployment

1.  **Fork** this repository.
2.  Create `.md` files inside the `notes` folder in the project root.
3.  Push your code. Select GitHub Actions for the source in your repository's Pages settings. Each push will trigger an automatic build and deploy to Pages.

Hope this project becomes your little garden for organizing knowledge and sharing life 🌸
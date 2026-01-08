# 06. Advanced: Static Generation Architecture 🌸

> You might be curious, since this is a Vue project, why is there no backend database? Where are the articles stored?

## 1. Static File Generation (SSG Prototype)

Unlike WordPress which requires a MySQL database, this blog is **file-system based**.

Before project deployment (Deploy), we run a Node.js script: `scripts/generate-tree.js`.

```javascript
// generate-tree.js pseudo code
const fs = require('fs');

// 1. Scan notes folder
const files = scanDir('notes');

// 2. Generate JSON index
fs.writeFileSync('public/files.json', JSON.stringify(files));
```

What this script does is: Convert your hard drive folder structure into a `files.json` file.

## 2. Runtime Fetching

When the blog runs in the browser:
1. `App.vue` requests `files.json` to get the map.
2. The user clicks an article.
3. `App.vue` goes to request the corresponding `.md` file based on the path in the map.
4. The browser gets the Markdown text and renders it into HTML using `marked.js`.

This is why this blog **needs no backend**, just a static file server (like GitHub Pages) is enough to run it.

## 3. Pros & Cons Analysis

*   **Pros**:
    *   **Extremely Fast**: No need to wait for database queries.
    *   **Free**: GitHub Pages hosting is completely free.
    *   **Secure**: No database means hackers cannot inject SQL.
*   **Cons**:
    *   **Weak SEO**: Because it is an SPA, Baidu crawlers might not catch the content (Google is fine).
    *   **No Comments**: Static pages cannot handle user-submitted comments (unless third-party services are used).

But as a personal knowledge base and a practice project for learning Vue, this architecture is perfect. Your only task: Translate the docs in notes/VUE学习笔记 to English and put them into notes/VUE Learning.
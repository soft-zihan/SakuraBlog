import type { TutorialStep } from './tutorialStepsLoader'

const SCRIPT_TAG = '<scr' + 'ipt type="module" src="./main.js"></scr' + 'ipt>'

export const STEPS: TutorialStep[] = [
  {
    id: 'foundation:intro',
    titleZh: '项目落地与目录结构',
    titleEn: 'Project folder & structure',
    goalZh: '先把网站的“骨架”落在文件上，后面每一步都能对齐到具体文件。',
    goalEn: 'Create the skeleton files so every next step maps to a real file.',
    tasksZh: ['新建一个文件夹（如 my-site）', '创建 3 个文件：index.html / styles.css / main.js', '用浏览器直接打开 index.html 看到空页面'],
    tasksEn: ['Create a folder (e.g. my-site)', 'Create 3 files: index.html / styles.css / main.js', 'Open index.html in browser and see a blank page'],
    checksZh: ['三个文件都在同一级目录', '打开页面不报错（F12 Console 没红字）'],
    checksEn: ['All files sit in the same folder', 'No console error on load'],
    blocks: [
      {
        labelZh: '目录示例',
        labelEn: 'Folder example',
        content: ['my-site/', '  index.html', '  styles.css', '  main.js'].join('\n')
      }
    ]
  },
  {
    id: 'foundation:html',
    titleZh: '写出最小可用的 HTML',
    titleEn: 'Write minimal HTML',
    goalZh: '把页面内容写出来，并把 CSS/JS 接上。',
    goalEn: 'Add real content and wire CSS/JS in.',
    tasksZh: ['补齐 head 的 meta 与 title', '在 body 放一个 header + main', '用 link 引入 styles.css', `用 ${SCRIPT_TAG} 引入 main.js`],
    tasksEn: ['Fill meta and title in head', 'Put a header + main in body', 'Link styles.css', `Load main.js via ${SCRIPT_TAG}`],
    checksZh: ['刷新后看到标题与段落', 'Console 无报错'],
    checksEn: ['You can see a title and paragraph', 'No console error'],
    blocks: [
      {
        labelZh: 'index.html（最小版本）',
        labelEn: 'index.html (minimum)',
        content: [
          '<!doctype html>',
          '<html lang="zh-CN">',
          '  <head>',
          '    <meta charset="UTF-8" />',
          '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
          '    <title>My Site</title>',
          '    <link rel="stylesheet" href="./styles.css" />',
          `    ${SCRIPT_TAG}`,
          '  </head>',
          '  <body>',
          '    <header class="site-header">',
          '      <h1>My Site</h1>',
          '      <p class="subtitle">从零开始搭站</p>',
          '    </header>',
          '    <main class="site-main">',
          '      <section class="card">',
          '        <h2>第一张卡片</h2>',
          '        <p>先把结构搭出来，再逐步加样式与交互。</p>',
          '      </section>',
          '    </main>',
          '  </body>',
          '</html>'
        ].join('\n')
      }
    ]
  },
  {
    id: 'foundation:deploy',
    titleZh: '部署心智：本地与线上一致',
    titleEn: 'Deploy mindset: local vs online',
    goalZh: '理解“路径/大小写/资源加载”是线上最常见的坑。',
    goalEn: 'Avoid the most common online pitfalls: paths and casing.',
    tasksZh: ['确保所有引用都用相对路径 ./', '把文件名与引用大小写保持一致', '准备一个 favicon 或先留空'],
    tasksEn: ['Use relative paths ./ for local assets', 'Keep file name casing consistent', 'Prepare a favicon (optional)'],
    checksZh: ['把整个文件夹复制到别处，页面仍能正常打开', '不依赖绝对路径'],
    checksEn: ['Copy the folder to another location and it still works', 'No absolute-path dependency'],
    blocks: [
      {
        labelZh: '路径检查清单',
        labelEn: 'Path checklist',
        content: ['✅ ./styles.css', '✅ ./main.js', '❌ C:\\Users\\...\\styles.css', '❌ /styles.css（部署到子路径时容易出问题）'].join('\n')
      }
    ]
  }
]

export const PREVIEW = {
  html: [
    '<header class="site-header">',
    '  <h1>My Site</h1>',
    '  <p class="subtitle">从零开始搭站</p>',
    '</header>',
    '<main class="site-main">',
    '  <section class="card">',
    '    <h2>第一张卡片</h2>',
    '    <p>先把结构搭出来，再逐步加样式与交互。</p>',
    '  </section>',
    '</main>'
  ].join('\n'),
  css: [
    ':root { --bg: #0b1020; --panel: rgba(255,255,255,0.08); --text: rgba(255,255,255,0.92); --muted: rgba(255,255,255,0.66); --border: rgba(255,255,255,0.16); }',
    'html, body { height: 100%; }',
    'body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: var(--text); background: radial-gradient(circle at 20% 10%, rgba(236,72,153,0.18), transparent 45%), radial-gradient(circle at 90% 0%, rgba(99,102,241,0.18), transparent 45%), var(--bg); }',
    '.site-header { padding: 22px 20px 10px; max-width: 980px; margin: 0 auto; }',
    '.site-header h1 { margin: 0; font-size: 22px; letter-spacing: -0.02em; }',
    '.subtitle { margin: 6px 0 0; color: var(--muted); }',
    '.site-main { max-width: 980px; margin: 0 auto; padding: 16px 20px 40px; }',
    '.card { border: 1px solid var(--border); background: var(--panel); border-radius: 16px; padding: 16px; box-shadow: 0 22px 70px rgba(0,0,0,0.30); }',
    '.card h2 { margin: 0 0 8px; font-size: 16px; }',
    '.card p { margin: 0; color: var(--muted); }'
  ].join('\n'),
  js: ''
}


export type ThreeFiles = {
  indexHtml: string
  stylesCss: string
  mainJs: string
}

export type StepperStep = {
  id?: string
  label?: string
  goal?: string
  guide?: string
  target?: 'index' | 'styles' | 'main'
  files: ThreeFiles
}

export const SCRIPT_TAG = '<scr' + 'ipt src="./main.js"></scr' + 'ipt>'

export const PRACTICE_INITIAL: Readonly<ThreeFiles> = Object.freeze({
  indexHtml: [
    '<!doctype html>',
    '<html lang="zh-CN">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '    <meta name="color-scheme" content="light dark" />',
    '',
    '    <!-- 目标：把下面的“动手写脚手架”补齐；示范代码会保留同样的提示注释 -->',
    '    <!-- 约定：动手写只会“挖空实现”，不会减少任何注释；请不要删注释 -->',
    '',
    '    <!-- 1 Head：写 title，并确保 link/script 保留（三文件联动入口） -->',
    '    <!-- 提示：title 会显示在浏览器标签页/收藏夹里 -->',
    '    <title></title>',
    '',
    '    <!-- 提示：link 加载 styles.css，script 加载 main.js -->',
    '    <link rel="stylesheet" href="./styles.css" />',
    `    ${SCRIPT_TAG}`,
    '  </head>',
    '  <body>',
    '    <!-- 2 Header：补齐 brand + actions（class/id 是协议，CSS/JS 会用到） -->',
    '    <div class="demo">',
    '',
    '      <!-- ===== Header（顶栏）===== -->',
    '      <header class="site-header">',
    '        <div class="brand">',
    '          <!-- brand 由 logo + 文案组成：保持这些 class，方便写 CSS 选择器 -->',
    '          <!-- 写 logo：<div class="logo">🌸</div>（class=logo 用于做“徽章”样式） -->',
    '          <!-- 写标题区（两行文字都保留 class，CSS 会用到）：',
    '               <div>',
    '                 <div class="title">My Site</div>',
    '                 <div class="subtitle">UI shell mini</div>',
    '               </div> -->',
    '        </div>',
    '        <div class="actions">',
    '          <!-- 写按钮：<button id="themeBtn" type="button">Toggle Theme</button>（JS 会 query #themeBtn） -->',
    '        </div>',
    '      </header>',
    '',
    '      <!-- ===== Main（主内容）===== -->',
    '      <main class="site-main">',
    '        <!-- 3 Main：补齐搜索框 #q + 列表容器 #list（class=grid 用于网格布局） -->',
    '        <div class="toolbar">',
    '          <!-- 写输入框：<input id="q" placeholder="Search..." />（JS 会读 #q.value） -->',
    '        </div>',
    '        <!-- 写列表容器：<section id="list" class="grid"></section>（JS 会把卡片渲染到这里） -->',
    '      </main>',
    '',
    '      <!-- ===== Footer（页脚，可选）===== -->',
    '      <!-- 可选：加一个 footer 或提示文字（先把结构/样式/交互跑通，再回来补文案） -->',
    '      <!-- 例：<footer class="site-footer">tips: 先把结构补齐，再写 styles.css / main.js</footer> -->',
    '',
    '      <!-- 留白：你可以在这里添加更多模块（例如：公告、侧栏、更多按钮等） -->',
    '',
    '',
    '    </div>',
    '  </body>',
    '</html>'
  ].join('\n'),
  stylesCss: [
    ':root {',
    '  /* 主题变量：面板/文本/边框/主色/阴影（后面都用 var(--*) 引用） */',
    '  --panel: rgba(255,255,255,0.72);',
    '  --panel-2: rgba(255,255,255,0.56);',
    '  --border: rgba(15,23,42,0.10);',
    '  --text: #0f172a;',
    '  --muted: rgba(15,23,42,0.60);',
    '  --primary: #ec4899;',
    '  --shadow: rgba(15,23,42,0.10);',
    '}',
    '',
    'html.dark {',
    '  /* 暗色主题变量覆盖：只覆盖“看起来不对”的那几项 */',
    '  --panel: rgba(15,23,42,0.52);',
    '  --panel-2: rgba(15,23,42,0.40);',
    '  --border: rgba(255,255,255,0.14);',
    '  --text: rgba(255,255,255,0.92);',
    '  --muted: rgba(255,255,255,0.65);',
    '  --shadow: rgba(0,0,0,0.45);',
    '}',
    '',
    '/* ===== Base（基础）===== */',
    'body {',
    '  margin: 0;',
    '  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;',
    '  color: var(--text);',
    '}',
    '',
    '/* ===== Layout（布局）===== */',
    '.demo {',
    '  /* 页面容器 .demo：max-width / margin / padding（目标：居中 + 留白） */',
    '  max-width: 980px;',
    '  margin: 0 auto;',
    '  padding: 18px 16px 24px;',
    '}',
    '',
    '/* CHECK：页面内容居中，左右有留白 */',
    '',
    '/* ===== Header（顶栏）===== */',
    '.site-header {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 12px;',
    '',
    '  /* 4 CSS：顶栏 .site-header（padding / 圆角 / 背景 / 边框 / 阴影 / blur） */',
    '  /* 提示：glass 质感 = 半透明背景 + 细边框 + 阴影 + backdrop-filter */',
    '}',
    '',
    '/* CHECK：顶栏是一行：左侧 brand，右侧 actions */',
    '',
    '/* 品牌区 .brand / .logo / .title / .subtitle */',
    '.brand {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 12px;',
    '}',
    '',
    '.logo {',
    '  width: 40px;',
    '  height: 40px;',
    '  border-radius: 999px;',
    '  display: grid;',
    '  place-items: center;',
    '',
    '  /* 可选：补齐 background / border 让 logo 更像“徽章” */',
    '}',
    '',
    '.title {',
    '  font-weight: 900;',
    '  letter-spacing: -0.02em;',
    '}',
    '',
    '.subtitle {',
    '  font-size: 12px;',
    '  color: var(--muted);',
    '  margin-top: 2px;',
    '}',
    '',
    '/* 5 CSS：控件细节（logo/button/input） */',
    '/* ===== Button（按钮）===== */',
    '.actions button {',
    '  cursor: pointer;',
    '',
    '  /* 按钮样式：补齐 padding / border / background / border-radius（看起来像控件） */',
    '}',
    '',
    '/* CHECK：按钮看起来像“可点击控件”（有边框/背景/圆角） */',
    '',
    '/* ===== Main（主内容）===== */',
    '.site-main {',
    '  padding: 14px 0 18px;',
    '}',
    '',
    '.toolbar { margin: 14px 0 12px; }',
    '',
    '.toolbar input {',
    '  width: min(420px, 100%);',
    '',
    '  /* 搜索框：补齐 padding / border / background / border-radius（加上 outline/focus 更像输入框） */',
    '}',
    '',
    '.grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(3, minmax(0, 1fr));',
    '  gap: 12px;',
    '',
    '  /* 留白：后面会加 card/tag 样式 */',
    '}',
    '',
    '/* CHECK：后续渲染卡片后，应呈现 3 列网格（小屏变 1 列） */',
    '',
    '/* 8 CSS：卡片与 tag（补齐 .card / .tags / .tag；写完 JS 渲染后再回来） */',
    '/* 提示：card=面板；tags=可换行 flex；tag=圆角 pill 小标签 */',
    '/* ===== Footer（页脚）===== */',
    '.site-footer {',
    '  margin-top: 14px;',
    '  font-size: 12px;',
    '  color: var(--muted);',
    '}',
    '',
    '@media (max-width: 860px) {',
    '  /* 响应式：网格变 1 列 */',
    '  .grid { grid-template-columns: 1fr; }',
    '}'
  ].join('\n'),
  mainJs: [
    'const THEME_KEY = "my-site:theme";',
    '',
    '/* ===== Theme（主题切换）===== */',
    '/* 6 JS：主题切换（applyTheme + localStorage + #themeBtn 点击） */',
    'function applyTheme(isDark) {',
    '  document.documentElement.classList.toggle("dark", !!isDark);',
    '}',
    '',
    '/* 启动时：从 localStorage 读取并应用（THEME_KEY 存 "dark" 或 "light"；为空当作 light） */',
    '/* 例：const saved = window.localStorage.getItem(THEME_KEY); */',
    '/* 例：applyTheme(saved === "dark"); */',
    'applyTheme(false);',
    '',
    '/* CHECK：当 <html> 有/没有 dark 类时，页面颜色应切换（配合 CSS 变量） */',
    '',
    '/* 绑定按钮：点击切换 + 写入 localStorage（写完后：点击切换，刷新也保持） */',
    'const themeBtn = document.querySelector("#themeBtn");',
    'if (themeBtn) {',
    '  themeBtn.addEventListener("click", () => {',
    '    /* 先算 nextIsDark：根据当前 html 是否有 dark 类 */',
    '    /* 再 applyTheme(nextIsDark) */',
    '    /* 最后 localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light") */',
    '  });',
    '}',
    '',
    '/* CHECK：点击按钮能切换主题，并且刷新后保持 */',
    '',
    '/* ===== Data（数据）===== */',
    '/* 7 JS：数据 + render()（把 data 渲染成卡片网格） */',
    'const data = [',
    '  /* 先写 3 条数据，确保结构一致：{ id, title, tags } */',
    '];',
    '',
    'const $q = document.querySelector("#q");',
    'const $list = document.querySelector("#list");',
    '',
    'function norm(s) { return String(s || "").trim().toLowerCase(); }',
    '',
    '/* ===== Render（渲染）===== */',
    '/* 把 items 渲染成卡片网格，含 tags（items 为空时清空；有数据时输出 article.card） */',
    'function render(items) {',
    '  if (!$list) return;',
    '  if (!Array.isArray(items) || items.length === 0) {',
    '    $list.innerHTML = "";',
    '    return;',
    '  }',
    '  /* 把 items 映射成 HTML 字符串 */',
    '  /* 每一项渲染成 article.card，并包含 tags */',
    '  /* 最终 join("") 赋值给 $list.innerHTML */',
    '}',
    '',
    'render(data);',
    '',
    '/* CHECK：页面上能看到卡片列表（来自 data） */',
    '',
    '/* ===== Filter（过滤）===== */',
    '/* 9 JS：输入过滤（input -> filter -> render；用 norm() 归一更稳定） */',
    'if ($q) {',
    '  $q.addEventListener("input", () => {',
    '    /* 取输入值 q = norm($q.value) */',
    '    /* 若 q 为空：render(data) */',
    '    /* 否则：过滤 title + tags 拼接后的文本，render(filtered) */',
    '  });',
    '}',
    '',
    '/* CHECK：输入框输入后，列表会实时过滤 */'
  ].join('\n')
})

export const PRACTICE_COMPLETE: Readonly<ThreeFiles> = Object.freeze({
  indexHtml: [
    '<!doctype html>',
    '<html lang="zh-CN">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '    <meta name="color-scheme" content="light dark" />',
    '',
    '    <!-- 目标：把下面的“动手写脚手架”补齐；示范代码会保留同样的提示注释 -->',
    '    <!-- 约定：动手写只会“挖空实现”，不会减少任何注释；请不要删注释 -->',
    '',
    '    <!-- 1 Head：写 title，并确保 link/script 保留（三文件联动入口） -->',
    '    <!-- 提示：title 会显示在浏览器标签页/收藏夹里 -->',
    '    <title>My Site</title>',
    '',
    '    <!-- 提示：link 加载 styles.css，script 加载 main.js -->',
    '    <link rel="stylesheet" href="./styles.css" />',
    `    ${SCRIPT_TAG}`,
    '  </head>',
    '  <body>',
    '    <!-- 2 Header：补齐 brand + actions（class/id 是协议，CSS/JS 会用到） -->',
    '    <div class="demo">',
    '',
    '      <!-- ===== Header（顶栏）===== -->',
    '      <header class="site-header">',
    '        <div class="brand">',
    '          <!-- brand 由 logo + 文案组成：保持这些 class，方便写 CSS 选择器 -->',
    '          <!-- 写 logo：<div class="logo">🌸</div>（class=logo 用于做“徽章”样式） -->',
    '          <div class="logo">🌸</div>',
    '          <!-- 写标题区（两行文字都保留 class，CSS 会用到）：',
    '               <div>',
    '                 <div class="title">My Site</div>',
    '                 <div class="subtitle">UI shell mini</div>',
    '               </div> -->',
    '          <div>',
    '            <div class="title">My Site</div>',
    '            <div class="subtitle">UI shell mini</div>',
    '          </div>',
    '        </div>',
    '        <div class="actions">',
    '          <!-- 写按钮：<button id="themeBtn" type="button">Toggle Theme</button>（JS 会 query #themeBtn） -->',
    '          <button id="themeBtn" type="button">Toggle Theme</button>',
    '        </div>',
    '      </header>',
    '',
    '      <!-- ===== Main（主内容）===== -->',
    '      <main class="site-main">',
    '        <!-- 3 Main：补齐搜索框 #q + 列表容器 #list（class=grid 用于网格布局） -->',
    '        <div class="toolbar">',
    '          <!-- 写输入框：<input id="q" placeholder="Search..." />（JS 会读 #q.value） -->',
    '          <input id="q" placeholder="Search..." />',
    '        </div>',
    '        <!-- 写列表容器：<section id="list" class="grid"></section>（JS 会把卡片渲染到这里） -->',
    '        <section id="list" class="grid"></section>',
    '      </main>',
    '',
    '      <!-- ===== Footer（页脚，可选）===== -->',
    '      <!-- 可选：加一个 footer 或提示文字（先把结构/样式/交互跑通，再回来补文案） -->',
    '      <!-- 例：<footer class="site-footer">tips: 先把结构补齐，再写 styles.css / main.js</footer> -->',
    '',
    '      <!-- 留白：你可以在这里添加更多模块（例如：公告、侧栏、更多按钮等） -->',
    '',
    '',
    '    </div>',
    '  </body>',
    '</html>'
  ].join('\n'),
  stylesCss: [
    ':root {',
    '  /* 主题变量：面板/文本/边框/主色/阴影（后面都用 var(--*) 引用） */',
    '  --panel: rgba(255,255,255,0.72);',
    '  --panel-2: rgba(255,255,255,0.56);',
    '  --border: rgba(15,23,42,0.10);',
    '  --text: #0f172a;',
    '  --muted: rgba(15,23,42,0.60);',
    '  --primary: #ec4899;',
    '  --shadow: rgba(15,23,42,0.10);',
    '}',
    '',
    'html.dark {',
    '  /* 暗色主题变量覆盖：只覆盖“看起来不对”的那几项 */',
    '  --panel: rgba(15,23,42,0.52);',
    '  --panel-2: rgba(15,23,42,0.40);',
    '  --border: rgba(255,255,255,0.14);',
    '  --text: rgba(255,255,255,0.92);',
    '  --muted: rgba(255,255,255,0.65);',
    '  --shadow: rgba(0,0,0,0.45);',
    '}',
    '',
    '/* ===== Base（基础）===== */',
    'body {',
    '  margin: 0;',
    '  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;',
    '  color: var(--text);',
    '}',
    '',
    '/* ===== Layout（布局）===== */',
    '.demo {',
    '  /* 页面容器 .demo：max-width / margin / padding（目标：居中 + 留白） */',
    '  max-width: 980px;',
    '  margin: 0 auto;',
    '  padding: 18px 16px 24px;',
    '}',
    '',
    '/* CHECK：页面内容居中，左右有留白 */',
    '',
    '/* ===== Header（顶栏）===== */',
    '.site-header {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 12px;',
    '',
    '  /* 4 CSS：顶栏 .site-header（padding / 圆角 / 背景 / 边框 / 阴影 / blur） */',
    '  /* 提示：glass 质感 = 半透明背景 + 细边框 + 阴影 + backdrop-filter */',
    '  padding: 14px 16px;',
    '  border-radius: 18px;',
    '  background: var(--panel);',
    '  border: 1px solid var(--border);',
    '  box-shadow: 0 18px 50px var(--shadow);',
    '  backdrop-filter: blur(12px);',
    '}',
    '',
    '/* CHECK：顶栏是一行：左侧 brand，右侧 actions */',
    '',
    '/* 品牌区 .brand / .logo / .title / .subtitle */',
    '.brand {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 12px;',
    '}',
    '',
    '.logo {',
    '  width: 40px;',
    '  height: 40px;',
    '  border-radius: 999px;',
    '  display: grid;',
    '  place-items: center;',
    '',
    '  /* 可选：补齐 background / border 让 logo 更像“徽章” */',
    '  background: rgba(236,72,153,0.10);',
    '  border: 1px solid rgba(236,72,153,0.25);',
    '}',
    '',
    '.title {',
    '  font-weight: 900;',
    '  letter-spacing: -0.02em;',
    '}',
    '',
    '.subtitle {',
    '  font-size: 12px;',
    '  color: var(--muted);',
    '  margin-top: 2px;',
    '}',
    '',
    '/* 5 CSS：控件细节（logo/button/input） */',
    '/* ===== Button（按钮）===== */',
    '.actions button {',
    '  cursor: pointer;',
    '',
    '  /* 按钮样式：补齐 padding / border / background / border-radius（看起来像控件） */',
    '  border: 1px solid var(--border);',
    '  background: rgba(255,255,255,0.25);',
    '  color: var(--text);',
    '  padding: 10px 12px;',
    '  border-radius: 14px;',
    '}',
    '',
    'html.dark .actions button { background: rgba(255,255,255,0.06); }',
    '',
    '/* CHECK：按钮看起来像“可点击控件”（有边框/背景/圆角） */',
    '',
    '/* ===== Main（主内容）===== */',
    '.site-main {',
    '  padding: 14px 0 18px;',
    '}',
    '',
    '.toolbar { margin: 14px 0 12px; }',
    '',
    '.toolbar input {',
    '  width: min(420px, 100%);',
    '',
    '  /* 搜索框：补齐 padding / border / background / border-radius（加上 outline/focus 更像输入框） */',
    '  padding: 12px 14px;',
    '  border-radius: 16px;',
    '  border: 1px solid var(--border);',
    '  background: var(--panel-2);',
    '  color: var(--text);',
    '  outline: none;',
    '}',
    '',
    '.toolbar input:focus { border-color: rgba(236,72,153,0.45); box-shadow: 0 0 0 4px rgba(236,72,153,0.12); }',
    '',
    '.grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(3, minmax(0, 1fr));',
    '  gap: 12px;',
    '',
    '  /* 留白：后面会加 card/tag 样式 */',
    '}',
    '',
    '/* CHECK：后续渲染卡片后，应呈现 3 列网格（小屏变 1 列） */',
    '',
    '/* 8 CSS：卡片与 tag（补齐 .card / .tags / .tag；写完 JS 渲染后再回来） */',
    '/* 提示：card=面板；tags=可换行 flex；tag=圆角 pill 小标签 */',
    '.card {',
    '  border: 1px solid var(--border);',
    '  background: var(--panel);',
    '  border-radius: 18px;',
    '  padding: 14px;',
    '  box-shadow: 0 16px 40px var(--shadow);',
    '}',
    '',
    '.card h2 { margin: 0 0 8px; font-size: 16px; letter-spacing: -0.01em; }',
    '.tags { display: flex; flex-wrap: wrap; gap: 8px; }',
    '.tag { font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 6px 10px; background: rgba(255,255,255,0.18); }',
    'html.dark .tag { background: rgba(255,255,255,0.05); }',
    '',
    '/* ===== Footer（页脚）===== */',
    '.site-footer {',
    '  margin-top: 14px;',
    '  font-size: 12px;',
    '  color: var(--muted);',
    '}',
    '',
    '@media (max-width: 860px) {',
    '  /* 响应式：网格变 1 列 */',
    '  .grid { grid-template-columns: 1fr; }',
    '}'
  ].join('\n'),
  mainJs: [
    'const THEME_KEY = "my-site:theme";',
    '',
    '/* ===== Theme（主题切换）===== */',
    '/* 6 JS：主题切换（applyTheme + localStorage + #themeBtn 点击） */',
    'function applyTheme(isDark) {',
    '  document.documentElement.classList.toggle("dark", !!isDark);',
    '}',
    '',
    '/* 启动时：从 localStorage 读取并应用（THEME_KEY 存 "dark" 或 "light"；为空当作 light） */',
    '/* 例：const saved = window.localStorage.getItem(THEME_KEY); */',
    '/* 例：applyTheme(saved === "dark"); */',
    'const saved = window.localStorage.getItem(THEME_KEY);',
    'applyTheme(saved === "dark");',
    '',
    '/* CHECK：当 <html> 有/没有 dark 类时，页面颜色应切换（配合 CSS 变量） */',
    '',
    '/* 绑定按钮：点击切换 + 写入 localStorage（写完后：点击切换，刷新也保持） */',
    'const themeBtn = document.querySelector("#themeBtn");',
    'if (themeBtn) {',
    '  themeBtn.addEventListener("click", () => {',
    '    /* 先算 nextIsDark：根据当前 html 是否有 dark 类 */',
    '    const nextIsDark = !document.documentElement.classList.contains("dark");',
    '    /* 再 applyTheme(nextIsDark) */',
    '    applyTheme(nextIsDark);',
    '    /* 最后 localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light") */',
    '    window.localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");',
    '  });',
    '}',
    '',
    '/* CHECK：点击按钮能切换主题，并且刷新后保持 */',
    '',
    '/* ===== Data（数据）===== */',
    '/* 7 JS：数据 + render()（把 data 渲染成卡片网格） */',
    'const data = [',
    '  /* 先写 3 条数据，确保结构一致：{ id, title, tags } */',
    '  { id: "a", title: "实验室看板", tags: ["learn", "ui"] },',
    '  { id: "b", title: "源码展示", tags: ["code"] },',
    '  { id: "c", title: "搜索弹窗", tags: ["search", "kbd"] }',
    '];',
    '',
    'const $q = document.querySelector("#q");',
    'const $list = document.querySelector("#list");',
    '',
    'function norm(s) { return String(s || "").trim().toLowerCase(); }',
    '',
    '/* ===== Render（渲染）===== */',
    '/* 把 items 渲染成卡片网格，含 tags（items 为空时清空；有数据时输出 article.card） */',
    'function render(items) {',
    '  if (!$list) return;',
    '  if (!Array.isArray(items) || items.length === 0) {',
    '    $list.innerHTML = "";',
    '    return;',
    '  }',
    '  /* 把 items 映射成 HTML 字符串 */',
    '  const html = items.map((it) => {',
    '  /* 每一项渲染成 article.card，并包含 tags */',
    '    const tags = (it.tags || []).map((t) => `<span class="tag">${t}</span>`).join("");',
    '    return `<article class="card"><h2>${it.title}</h2><div class="tags">${tags}</div></article>`;',
    '  }).join("");',
    '  /* 最终 join("") 赋值给 $list.innerHTML */',
    '  $list.innerHTML = html;',
    '}',
    '',
    'render(data);',
    '',
    '/* CHECK：页面上能看到卡片列表（来自 data） */',
    '',
    '/* ===== Filter（过滤）===== */',
    '/* 9 JS：输入过滤（input -> filter -> render；用 norm() 归一更稳定） */',
    'if ($q) {',
    '  $q.addEventListener("input", () => {',
    '    /* 取输入值 q = norm($q.value) */',
    '    const q = norm($q.value);',
    '    /* 若 q 为空：render(data) */',
    '    if (!q) {',
    '      render(data);',
    '      return;',
    '    }',
    '    /* 否则：过滤 title + tags 拼接后的文本，render(filtered) */',
    '    const filtered = data.filter((it) => norm(`${it.title} ${(it.tags || []).join(" ")}`).includes(q));',
    '    render(filtered);',
    '  });',
    '}',
    '',
    '/* CHECK：输入框输入后，列表会实时过滤 */'
  ].join('\n')
})

const SAMPLE_INDEX_HTML_LINES = [
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
  '    <div class="demo">',
  '      <header class="site-header">',
  '        <div class="brand">',
  '          <div class="logo">🌸</div>',
  '          <div>',
  '            <div class="title">My Site</div>',
  '            <div class="subtitle">UI shell mini</div>',
  '          </div>',
  '        </div>',
  '        <div class="actions">',
  '          <button id="themeBtn" type="button">Toggle Theme</button>',
  '        </div>',
  '      </header>',
  '',
  '      <main class="site-main">',
  '        <div class="toolbar">',
  '          <input id="q" placeholder="Search..." />',
  '        </div>',
  '        <section id="list" class="grid"></section>',
  '      </main>',
  '    </div>',
  '  </body>',
  '</html>'
]

const SAMPLE_STYLES_CSS_LINES = [
  ':root {',
  '  --panel: rgba(255,255,255,0.72);',
  '  --panel-2: rgba(255,255,255,0.56);',
  '  --border: rgba(15,23,42,0.10);',
  '  --text: #0f172a;',
  '  --muted: rgba(15,23,42,0.60);',
  '  --primary: #ec4899;',
  '  --shadow: rgba(15,23,42,0.10);',
  '}',
  '',
  'html.dark {',
  '  --panel: rgba(15,23,42,0.52);',
  '  --panel-2: rgba(15,23,42,0.40);',
  '  --border: rgba(255,255,255,0.14);',
  '  --text: rgba(255,255,255,0.92);',
  '  --muted: rgba(255,255,255,0.65);',
  '  --shadow: rgba(0,0,0,0.45);',
  '}',
  '',
  '.demo {',
  '  color: var(--text);',
  '  max-width: 980px;',
  '  margin: 0 auto;',
  '}',
  '',
  '.site-header {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  gap: 12px;',
  '  padding: 14px 16px;',
  '  border-radius: 18px;',
  '  background: var(--panel);',
  '  border: 1px solid var(--border);',
  '  box-shadow: 0 18px 50px var(--shadow);',
  '  backdrop-filter: blur(12px);',
  '}',
  '',
  '.brand { display: flex; align-items: center; gap: 12px; }',
  '.logo { width: 40px; height: 40px; border-radius: 999px; display: grid; place-items: center; background: rgba(236,72,153,0.10); border: 1px solid rgba(236,72,153,0.25); }',
  '.title { font-weight: 900; letter-spacing: -0.02em; }',
  '.subtitle { font-size: 12px; color: var(--muted); margin-top: 2px; }',
  '',
  '.actions button {',
  '  border: 1px solid var(--border);',
  '  background: rgba(255,255,255,0.25);',
  '  color: var(--text);',
  '  padding: 10px 12px;',
  '  border-radius: 14px;',
  '  cursor: pointer;',
  '}',
  '',
  'html.dark .actions button { background: rgba(255,255,255,0.06); }',
  '',
  '.site-main { padding: 16px 0 28px; }',
  '.toolbar { margin: 14px 0 12px; }',
  '.toolbar input {',
  '  width: min(420px, 100%);',
  '  padding: 12px 14px;',
  '  border-radius: 16px;',
  '  border: 1px solid var(--border);',
  '  background: var(--panel-2);',
  '  color: var(--text);',
  '  outline: none;',
  '}',
  '.toolbar input:focus { border-color: rgba(236,72,153,0.45); box-shadow: 0 0 0 4px rgba(236,72,153,0.12); }',
  '',
  '.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }',
  '.card { border: 1px solid var(--border); background: var(--panel); border-radius: 18px; padding: 14px; box-shadow: 0 16px 40px var(--shadow); }',
  '.card h2 { margin: 0 0 8px; font-size: 16px; letter-spacing: -0.01em; }',
  '.tags { display: flex; flex-wrap: wrap; gap: 8px; }',
  '.tag { font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 6px 10px; background: rgba(255,255,255,0.18); }',
  'html.dark .tag { background: rgba(255,255,255,0.05); }',
  '',
  '@media (max-width: 860px) {',
  '  .grid { grid-template-columns: 1fr; }',
  '}'
]

const SAMPLE_MAIN_JS_LINES = [
  'const THEME_KEY = "my-site:theme";',
  '',
  'function applyTheme(isDark) {',
  '  document.documentElement.classList.toggle("dark", !!isDark);',
  '}',
  '',
  'applyTheme(window.localStorage.getItem(THEME_KEY) === "dark");',
  '',
  'const themeBtn = document.querySelector("#themeBtn");',
  'if (themeBtn) {',
  '  themeBtn.addEventListener("click", () => {',
  '    const nextIsDark = !document.documentElement.classList.contains("dark");',
  '    applyTheme(nextIsDark);',
  '    window.localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");',
  '  });',
  '}',
  '',
  'const data = [',
  '  { id: "a", title: "实验室看板", tags: ["learn", "ui"] },',
  '  { id: "b", title: "源码展示", tags: ["code"] },',
  '  { id: "c", title: "搜索弹窗", tags: ["search", "kbd"] }',
  '];',
  '',
  'const $q = document.querySelector("#q");',
  'const $list = document.querySelector("#list");',
  '',
  'function norm(s) { return String(s || "").trim().toLowerCase(); }',
  '',
  'function render(items) {',
  '  if (!$list) return;',
  '  $list.innerHTML = items.map((it) => {',
  '    const tags = it.tags.map((t) => `<span class="tag">${t}</span>`).join("");',
  '    return `<article class="card"><h2>${it.title}</h2><div class="tags">${tags}</div></article>`;',
  '  }).join("");',
  '}',
  '',
  'render(data);',
  '',
  'if ($q) {',
  '  $q.addEventListener("input", () => {',
  '    const q = norm($q.value);',
  '    const filtered = !q ? data : data.filter((it) => norm(`${it.title} ${it.tags.join(" ")}`).includes(q));',
  '    render(filtered);',
  '  });',
  '}'
]

export const SAMPLE_INITIAL: Readonly<ThreeFiles> = Object.freeze({
  indexHtml: SAMPLE_INDEX_HTML_LINES.join('\n'),
  stylesCss: SAMPLE_STYLES_CSS_LINES.join('\n'),
  mainJs: SAMPLE_MAIN_JS_LINES.join('\n')
})

export function buildSampleStepperSteps(lang: 'en' | 'zh'): StepperStep[] {
  const isZh = lang === 'zh'

  function normalizeLf(s: string) {
    return String(s || '').replace(/\r\n/g, '\n')
  }

  function combineParts(head: string, tail: string) {
    const a = normalizeLf(head).replace(/\n*$/, '\n')
    const b = normalizeLf(tail).replace(/^\n*/, '')
    return `${a}${b}`
  }

  function extractBlockInclusive(text: string, startMarker: string, endMarker: string) {
    const src = normalizeLf(text)
    const start = src.indexOf(startMarker)
    const end = src.indexOf(endMarker, start < 0 ? 0 : start)
    if (start < 0 || end < 0 || end < start) return src
    return src.slice(start, end + endMarker.length)
  }

  function replaceBlockInclusive(text: string, startMarker: string, endMarker: string, replacement: string) {
    const src = normalizeLf(text)
    const start = src.indexOf(startMarker)
    const end = src.indexOf(endMarker, start < 0 ? 0 : start)
    if (start < 0 || end < 0 || end < start) return src
    return `${src.slice(0, start)}${replacement}${src.slice(end + endMarker.length)}`
  }

  function extractCssRule(text: string, selector: string) {
    const src = normalizeLf(text)
    const startMarker = `${selector} {`
    const start = src.indexOf(startMarker)
    if (start < 0) return src
    const end = src.indexOf('\n}', start)
    if (end < 0) return src
    return src.slice(start, end + 2)
  }

  function replaceCssRule(text: string, selector: string, replacementRule: string) {
    const src = normalizeLf(text)
    const startMarker = `${selector} {`
    const start = src.indexOf(startMarker)
    if (start < 0) return src
    const end = src.indexOf('\n}', start)
    if (end < 0) return src
    return `${src.slice(0, start)}${replacementRule}${src.slice(end + 2)}`
  }

  const step0: ThreeFiles = {
    indexHtml: PRACTICE_INITIAL.indexHtml,
    stylesCss: PRACTICE_INITIAL.stylesCss,
    mainJs: PRACTICE_INITIAL.mainJs
  }

  const initialHtml = normalizeLf(PRACTICE_INITIAL.indexHtml)
  const completeHtml = normalizeLf(PRACTICE_COMPLETE.indexHtml)
  const headerStart = '      <header class="site-header">'
  const headerEnd = '      </header>'
  const mainStart = '      <main class="site-main">'
  const mainEnd = '      </main>'
  const completeHeader = extractBlockInclusive(completeHtml, headerStart, headerEnd)
  const completeMain = extractBlockInclusive(completeHtml, mainStart, mainEnd)

  const htmlStep1 = normalizeLf(initialHtml).replace('<title></title>', '<title>My Site</title>')
  const htmlStep2 = replaceBlockInclusive(htmlStep1, headerStart, headerEnd, completeHeader)
  const htmlStep3 = replaceBlockInclusive(htmlStep2, mainStart, mainEnd, completeMain)

  const step1: ThreeFiles = { ...step0, indexHtml: htmlStep1 }
  const step2: ThreeFiles = { ...step0, indexHtml: htmlStep2 }
  const step3: ThreeFiles = { ...step0, indexHtml: PRACTICE_COMPLETE.indexHtml }

  const completeCss = normalizeLf(PRACTICE_COMPLETE.stylesCss)
  const initialCss = normalizeLf(PRACTICE_INITIAL.stylesCss)
  const cssStep4 = replaceCssRule(initialCss, '.site-header', extractCssRule(completeCss, '.site-header'))
  let cssStep5 = cssStep4
  cssStep5 = replaceCssRule(cssStep5, '.logo', extractCssRule(completeCss, '.logo'))
  cssStep5 = replaceCssRule(cssStep5, '.actions button', extractCssRule(completeCss, '.actions button'))
  cssStep5 = replaceCssRule(cssStep5, '.toolbar input', extractCssRule(completeCss, '.toolbar input'))

  const step4: ThreeFiles = { ...step3, stylesCss: cssStep4 }
  const step5: ThreeFiles = { ...step4, stylesCss: cssStep5 }

  const dataMarker = '/* ===== Data（数据）===== */'
  const filterMarker = '/* ===== Filter（过滤）===== */'
  const completeJs = normalizeLf(PRACTICE_COMPLETE.mainJs)
  const initialJs = normalizeLf(PRACTICE_INITIAL.mainJs)

  const themeHead = completeJs.slice(0, Math.max(0, completeJs.indexOf(dataMarker)))
  const afterThemeTail = initialJs.slice(Math.max(0, initialJs.indexOf(dataMarker)))
  const jsThemeOnly = combineParts(themeHead, afterThemeTail)

  const dataRenderHead = completeJs.slice(0, Math.max(0, completeJs.indexOf(filterMarker)))
  const filterTail = initialJs.slice(Math.max(0, initialJs.indexOf(filterMarker)))
  const jsThemeAndRender = combineParts(dataRenderHead, filterTail)

  const step6: ThreeFiles = { ...step5, mainJs: jsThemeOnly }
  const step7: ThreeFiles = { ...step6, mainJs: jsThemeAndRender }
  const step8: ThreeFiles = { ...step7, stylesCss: PRACTICE_COMPLETE.stylesCss }
  const step9: ThreeFiles = { ...step8, mainJs: PRACTICE_COMPLETE.mainJs }

  const steps: StepperStep[] = [
    { label: isZh ? '开始：动手写初始状态（与逐步演示第 1 步一致）' : 'Start: same as hands-on initial state', files: step0 },
    {
      label: isZh ? '1) HTML：Head（title + 引入）' : '1) HTML: head (title + imports)',
      guide: isZh ? '先把 title 写出来，并保留 link/script 引入（入口）' : 'Write title and keep link/script imports (entry points)',
      files: step1
    },
    {
      label: isZh ? '2) HTML：Header（brand + actions）' : '2) HTML: header (brand + actions)',
      guide: isZh ? '补齐 header：logo/标题区/按钮（id=themeBtn）' : 'Fill header: logo/title/button (id=themeBtn)',
      files: step2
    },
    {
      label: isZh ? '3) HTML：Main（search + list）' : '3) HTML: main (search + list)',
      guide: isZh ? '补齐 main：输入框 #q + 列表容器 #list.grid' : 'Fill main: input #q + list container #list.grid',
      files: step3
    },
    {
      label: isZh ? '4) CSS：顶栏面板感（glass header）' : '4) CSS: glass header panel',
      guide: isZh ? '先让 header 像“玻璃面板”：背景/边框/阴影/blur' : 'Make header look like a glass panel: bg/border/shadow/blur',
      files: step4
    },
    {
      label: isZh ? '5) CSS：控件细节（logo/button/input）' : '5) CSS: controls (logo/button/input)',
      guide: isZh ? '补齐徽章/按钮/输入框的边框、背景、focus 体验' : 'Finish badge/button/input borders, backgrounds, focus',
      files: step5
    },
    {
      label: isZh ? '6) JS：主题切换（localStorage + 按钮）' : '6) JS: theme toggle (localStorage + button)',
      guide: isZh ? '实现：读取/写入 localStorage + 点击按钮切换 .dark' : 'Implement: localStorage read/write + toggle .dark on click',
      files: step6
    },
    {
      label: isZh ? '7) JS：渲染列表（data + render）' : '7) JS: render list (data + render)',
      guide: isZh ? '准备 data，并在 render() 里输出 card + tags' : 'Prepare data and render cards + tags in render()',
      files: step7
    },
    {
      label: isZh ? '8) CSS：卡片与 tag（让内容区成型）' : '8) CSS: cards and tags',
      guide: isZh ? '补齐 .card/.tag，让渲染出来的列表更像“内容区”' : 'Add .card/.tag so the list looks like content',
      files: step8
    },
    {
      label: isZh ? '9) JS：输入过滤（search）' : '9) JS: filter on input',
      guide: isZh ? '监听 input：filter(data) -> render(filtered)' : 'Listen to input: filter(data) -> render(filtered)',
      files: step9
    }
  ]

  const finalized: StepperStep[] = []
  for (let i = 0; i < steps.length; i++) {
    const prev = finalized[i - 1]?.files
    const current = steps[i]
    const nextFiles = current.files
    const prevFiles = prev
    const diffIndex = prevFiles ? prevFiles.indexHtml !== nextFiles.indexHtml : false
    const diffStyles = prevFiles ? prevFiles.stylesCss !== nextFiles.stylesCss : false
    const diffMain = prevFiles ? prevFiles.mainJs !== nextFiles.mainJs : false
    const diffCount = Number(diffIndex) + Number(diffStyles) + Number(diffMain)
    const target = diffCount === 1 ? (diffIndex ? 'index' : diffStyles ? 'styles' : 'main') : undefined
    const id = String(current.id || '').trim() || `demo:${String(i).padStart(3, '0')}`
    finalized.push({ ...current, id, target })
  }

  return finalized
}

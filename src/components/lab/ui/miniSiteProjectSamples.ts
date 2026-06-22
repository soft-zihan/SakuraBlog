export type MiniSiteLang = 'en' | 'zh'
export type MiniSiteStep = 'html' | 'css' | 'js'
export type MiniSiteFileId = 'index.html' | 'styles.css' | 'main.js'
export type MiniSiteFiles = Record<MiniSiteFileId, string>

export function miniHtmlHint(indent = '    ') {
  return `${indent}<!--
${indent}  目标：先复刻“壳子”，再谈业务
${indent}
${indent}  ① 页面由 4 块组成（都在同一层级，方便你对照示范）：
${indent}     - Sidebar（左侧栏）：导航 + 切换按钮 + 小列表
${indent}     - Topbar（顶栏）：面包屑 + 右上角两个 action 按钮
${indent}     - Content（内容区）：hero / explore / about / footer
${indent}     - Right panel + Toast（右侧面板与提示条）：一开始是占位，JS 只做开关
${indent}
${indent}  ② 交互靠 <html> 上的 data-* 状态位驱动（见 main.js 的注释 ①~⑥）
${indent}-->`
}

export function miniCssHint() {
  return `/* CSS：目标是“看起来像本站”，而不是只把布局摆出来
  ① 先看变量：primary/bg/text/panel/border/shadow（亮/暗两套）
  ② 再看布局：appFrame / sidebar / topbar / content / rightPanel
  ③ 最后看层次：glass（blur+border+shadow）/ hover / 动效 / 响应式

  TODO 清单（按优先级）：
  1) 变量：颜色/阴影/圆角体系（对齐示范）
  2) 三栏布局：sidebar/topbar/content/right panel 的尺寸与边界
  3) 按钮：iconBtn/actionBtn/ghostBtn 的 hover/active/边框
  4) 面板：card 的背景/边框/阴影/hover
  5) 背景：渐变/光斑（可选）
*/`
}

export function buildMiniJs(mode: 'starter' | 'demo') {
  const showToastBody =
    mode === 'demo'
      ? [
          '  if (!toast || !toastText) return',
          "  toastText.textContent = String(text || '')",
          '  toast.hidden = false',
          '  if (toastTimer) window.clearTimeout(toastTimer)',
          '  toastTimer = window.setTimeout(() => {',
          '    toastTimer = 0',
          '    toast.hidden = true',
          '  }, 1200)'
        ].join('\n')
      : ['  if (!toast || !toastText) return'].join('\n')

  const initSidebarBody =
    mode === 'demo'
      ? [
          "  const btns = ['#topbarSidebar', '#sidebarToggle'].map((s) => $(s)).filter(Boolean)",
          '  function toggle() {',
          "    toggleDataset('data-sidebar', 'open', 'closed')",
          "    showToast(document.documentElement.getAttribute('data-sidebar') === 'closed' ? 'Sidebar: closed' : 'Sidebar: open')",
          '  }',
          "  for (const b of btns) b.addEventListener('click', toggle)"
        ].join('\n')
      : ["  const btns = ['#topbarSidebar', '#sidebarToggle'].map((s) => $(s)).filter(Boolean)", '  void btns'].join('\n')

  const initRightBody =
    mode === 'demo'
      ? [
          "  const panel = $('#rightPanel')",
          "  const openBtn = $('#actionRight')",
          "  const closeBtn = $('#closeRight')",
          '  if (!panel) return',
          '',
          '  function open() {',
          '    panel.hidden = false',
          "    setDataset('data-right', 'open')",
          "    showToast('Right panel: open')",
          '  }',
          '',
          '  function close() {',
          "    setDataset('data-right', 'closed')",
          "    showToast('Right panel: closed')",
          '    window.setTimeout(() => {',
          '      panel.hidden = true',
          '    }, 320)',
          '  }',
          '',
          "  openBtn?.addEventListener('click', open)",
          "  closeBtn?.addEventListener('click', close)"
        ].join('\n')
      : [
          "  const panel = $('#rightPanel')",
          "  const openBtn = $('#actionRight')",
          "  const closeBtn = $('#closeRight')",
          '  void panel',
          '  void openBtn',
          '  void closeBtn'
        ].join('\n')

  const initThemeBody =
    mode === 'demo'
      ? [
          "  const themeBtn = $('#actionTheme')",
          '  function toggleTheme() {',
          "    toggleDataset('data-theme', 'light', 'dark')",
          "    showToast(document.documentElement.getAttribute('data-theme') === 'dark' ? 'Theme: dark' : 'Theme: light')",
          '  }',
          "  themeBtn?.addEventListener('click', toggleTheme)"
        ].join('\n')
      : ["  const themeBtn = $('#actionTheme')", '  void themeBtn'].join('\n')

  const initLangBody =
    mode === 'demo'
      ? ["  const btn = $('#langToggle')", "  btn?.addEventListener('click', () => showToast('Lang'))"].join('\n')
      : ["  const btn = $('#langToggle')", '  void btn'].join('\n')

  return [
    `// JS：只做“壳子交互”，不做真实业务逻辑`,
    `// 目标：用 html[data-*] 当“状态机”，让 UI 看起来能用（不接真实数据）`,
    `//`,
    `// ① 状态位约定（统一写在 <html> 上）：`,
    `//    - data-sidebar: open / closed（侧边栏）`,
    `//    - data-right: open / closed（右侧面板）`,
    `//    - data-theme: light / dark（主题）`,
    `//`,
    `// ② 工具函数（只操作 <html>）：`,
    `//    - $(selector): 选择元素`,
    `//    - setDataset(key, value): 设置 html[key]=value`,
    `//    - toggleDataset(key, a, b): 在 a/b 间切换`,
    `//`,
    `// ③ Toast（轻提示）：`,
    `//    - showToast(text): 显示 toast 1.2s 后自动隐藏`,
    `//`,
    `// ④ Sidebar（侧边栏折叠）：`,
    `//    - 绑定 #topbarSidebar / #sidebarToggle`,
    `//    - 点击切换 data-sidebar，并 toast 一句状态`,
    `//`,
    `// ⑤ Right panel（右侧面板）：`,
    `//    - open(): data-right=open + panel.hidden=false`,
    `//    - close(): data-right=closed + 动画后 panel.hidden=true`,
    `//`,
    `// ⑥ Theme（主题切换）：`,
    `//    - 绑定 #actionTheme`,
    `//    - 切换 data-theme，并 toast 一句状态`,
    ``,
    `const $ = (sel, root = document) => root.querySelector(sel)`,
    ``,
    `function setDataset(key, value) {`,
    `  // ②.1 统一写到 document.documentElement 上（html）`,
    `  // ②.2 key 形如 'data-theme' / 'data-sidebar' / 'data-right'`,
    `  document.documentElement.setAttribute(key, value)`,
    `}`,
    ``,
    `function toggleDataset(key, a, b) {`,
    `  // ②.3 读取当前值并在 a/b 间切换`,
    `  const cur = document.documentElement.getAttribute(key)`,
    `  setDataset(key, cur === a ? b : a)`,
    `}`,
    ``,
    `const toast = $('#toast')`,
    `const toastText = $('#toastText')`,
    `let toastTimer = 0`,
    ``,
    `function showToast(text) {`,
    `  // ③.1 文本写入：toastText.textContent = text`,
    `  // ③.2 显示：toast.hidden = false`,
    `  // ③.3 定时隐藏：1.2s 后 toast.hidden = true`,
    `  // TODO：动手写时按 ③.1~③.3 完成实现（示范会保留同样注释）`,
    showToastBody,
    `}`,
    ``,
    `function initSidebarToggle() {`,
    `  // ④.1 找到两个入口按钮（顶栏/侧边栏）`,
    `  // ④.2 点击时切换 data-sidebar，并 toast 当前状态`,
    `  // TODO：动手写时先只做开关与 toast，不要做复杂动画`,
    initSidebarBody,
    `}`,
    ``,
    `function initRightPanel() {`,
    `  // ⑤.1 open: panel.hidden=false + data-right=open`,
    `  // ⑤.2 close: data-right=closed + 动画结束后 panel.hidden=true`,
    `  // TODO：动手写时先保证 panel.hidden 与 data-right 同步`,
    initRightBody,
    `}`,
    ``,
    `function initThemeToggle() {`,
    `  // ⑥.1 点击切换 data-theme`,
    `  // ⑥.2 toast 当前主题`,
    `  // TODO：动手写时只做 light/dark 切换，先不做持久化`,
    initThemeBody,
    `}`,
    ``,
    `function initLangToggle() {`,
    initLangBody,
    `}`,
    ``,
    `initSidebarToggle()`,
    `initRightPanel()`,
    `initThemeToggle()`,
    `initLangToggle()`
  ].join('\n')
}

export function buildMiniSiteDefaultIndexHtml(args: { lang: MiniSiteLang; step: MiniSiteStep }) {
  const isZh = args.lang === 'zh'
  const linkCss = args.step === 'css' || args.step === 'js'
  const linkJs = args.step === 'js'
  const htmlLang = isZh ? 'zh-CN' : 'en'
  const subtitle = isZh ? '一个带笔记的源码阅读器' : 'A note-driven code reader'
  const scriptTag = linkJs ? `<scr` + `ipt defer src="./main.js"></scr` + `ipt>` : ''
  return `<!doctype html>
<html lang="${htmlLang}" data-theme="light" data-sidebar="open" data-right="closed">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sakura Notes (UI Shell)</title>
    ${linkCss ? '<link rel="stylesheet" href="./styles.css" />' : ''}
  </head>
  <body id="top">
${miniHtmlHint()}
    <div class="appFrame">
      <aside id="sidebar" class="sidebar" aria-label="${isZh ? '左侧栏' : 'Sidebar'}">
        <div class="sidebarHeader">
          <div class="sidebarTopRow">
            <button id="langToggle" class="chipBtn" type="button">${isZh ? '中 / EN' : 'EN / 中'}</button>
            <button id="sidebarToggle" class="iconBtn" type="button" aria-label="${isZh ? '折叠侧边栏' : 'Toggle sidebar'}">‹</button>
          </div>

          <a class="brandRow" href="#top">
            <div class="avatar" aria-hidden="true">🌸</div>
            <div class="brandText">
              <div class="brandTitle">Sakura Notes</div>
              <div class="brandSub">${subtitle}</div>
            </div>
          </a>

          <div class="modeTabs" role="tablist" aria-label="${isZh ? '模式切换' : 'View mode'}">
            <button class="modeTab" type="button">⏰ ${isZh ? '最新' : 'Latest'}</button>
            <button class="modeTab" type="button">📁 ${isZh ? '归档' : 'Files'}</button>
            <button class="modeTab isActive" type="button">🧪 ${isZh ? '实验室' : 'Lab'}</button>
          </div>
        </div>

        <div class="sidebarBody">
          <nav class="nav" aria-label="${isZh ? '导航区' : 'Navigation'}">
            <div class="groupTitle">${isZh ? '导航' : 'Navigation'}</div>
            <button class="navItem" type="button">🏠 ${isZh ? '首页' : 'Home'}</button>
            <button class="navItem" type="button">📝 ${isZh ? '笔记' : 'Notes'}</button>
            <button class="navItem" type="button">📁 ${isZh ? '归档' : 'Archive'}</button>
            <button class="navItem isActive" type="button">🧪 ${isZh ? '实验室' : 'Lab'}</button>

            <div class="sidePills" aria-label="${isZh ? '筛选' : 'Filters'}">
              <button class="sidePill" type="button">${isZh ? '最近' : 'Recent'}</button>
              <button class="sidePill" type="button">${isZh ? '收藏' : 'Saved'}</button>
              <button class="sidePill" type="button">${isZh ? '标签' : 'Tags'}</button>
            </div>

            <div class="groupTitle">${isZh ? '推荐阅读' : 'Highlights'}</div>
            <div class="sideList">
              <a class="sideNote isActive" href="#about">
                <div class="noteNo">01</div>
                <div class="noteMain">
                  <div class="noteTitle">${isZh ? '为什么要先复刻“壳子”' : 'Why replicate the shell first'}</div>
                  <div class="noteMeta">
                    <span>UI</span><span class="metaDot">•</span><span>${isZh ? '布局' : 'layout'}</span><span class="metaDot">•</span><span>${isZh ? '交互' : 'interactions'}</span>
                  </div>
                </div>
              </a>
              <a class="sideNote" href="#explore">
                <div class="noteNo">02</div>
                <div class="noteMain">
                  <div class="noteTitle">${isZh ? '玻璃拟态与层次' : 'Glassmorphism and hierarchy'}</div>
                  <div class="noteMeta">
                    <span>CSS</span><span class="metaDot">•</span><span>${isZh ? '动效' : 'motion'}</span>
                  </div>
                </div>
              </a>
              <a class="sideNote" href="#top">
                <div class="noteNo">03</div>
                <div class="noteMain">
                  <div class="noteTitle">${isZh ? '状态驱动的壳子交互' : 'State-driven shell interactions'}</div>
                  <div class="noteMeta">
                    <span>JS</span><span class="metaDot">•</span><span>${isZh ? '开关' : 'toggles'}</span>
                  </div>
                </div>
              </a>
            </div>
          </nav>
        </div>

        <div class="sidebarFooter">
          <button class="ghostBtn" type="button">${isZh ? '🔎 搜索' : '🔎 Search'}</button>
          <button class="ghostBtn" type="button">${isZh ? '⬇️ 下载' : '⬇️ Download'}</button>
          <button class="ghostBtn" type="button">${isZh ? '⚙️ 设置' : '⚙️ Settings'}</button>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <button id="topbarSidebar" class="iconBtn" type="button" aria-label="${isZh ? '切换侧边栏' : 'Toggle sidebar'}">☰</button>

          <div class="crumbs" aria-label="${isZh ? '面包屑' : 'Breadcrumbs'}">
            <a class="crumbHome" href="#top">🏠</a>
            <span class="crumbSep">›</span>
            <span class="crumbChip">🧪 ${isZh ? '实验室' : 'Lab'}</span>
            <span class="crumbSep">›</span>
            <span class="crumbCurrent">${isZh ? '可视化学习中心' : 'Learning Center'}</span>
          </div>

          <div class="actions">
            <button class="actionBtn" id="actionTheme" type="button" title="${isZh ? '主题' : 'Theme'}">🎨</button>
            <button class="actionBtn" id="actionRight" type="button" title="${isZh ? '右侧面板' : 'Right panel'}">➜</button>
          </div>
        </header>

        <main class="content">
          <div class="page" aria-label="${isZh ? '内容区' : 'Content'}">
            <section class="heroCover">
              <div class="heroCenter">
                <div class="heroMark" aria-hidden="true">🌸</div>
                <div class="heroKicker">Sakura Notes</div>
                <h1 class="heroTitle">${isZh ? '复刻本站 UI 空壳' : 'Recreate the UI Shell'}</h1>
                <p class="heroDesc">
                  ${
                    isZh
                      ? '这里放“博客内容”只是占位：重点是三栏框架、玻璃拟态、动效与面板/弹窗的交互手感。'
                      : 'Content here is placeholder; focus on the frame, glass UI, motions, and panel/modal interactions.'
                  }
                </p>
                <div class="heroChips">
                  <span class="chip">${isZh ? '侧边栏可折叠' : 'Collapsible sidebar'}</span>
                  <span class="chip">${isZh ? '顶栏操作区' : 'Action topbar'}</span>
                  <span class="chip">${isZh ? '右侧面板' : 'Right panel'}</span>
                </div>
                <div class="heroBtns">
                  <button class="primaryBtn" type="button">${isZh ? '开始探索' : 'Explore'}</button>
                  <button class="secondaryBtn actionOptional" type="button">${isZh ? '查看 About' : 'About'}</button>
                  <button class="scrollHint" type="button" aria-label="scroll">↓</button>
                </div>
              </div>
            </section>

            <section class="panel" id="explore">
              <div class="panelHeader">
                <h2 class="panelTitle">${isZh ? '精选卡片' : 'Featured Cards'}</h2>
                <div class="searchInline">
                  <input class="searchInput" placeholder="${isZh ? '搜索（占位）' : 'Search (placeholder)'}" />
                  <button class="searchBtn" type="button">${isZh ? '搜索' : 'Search'}</button>
                </div>
              </div>
              <div class="cardGrid">
                <article class="card">
                  <div class="cardTop">
                    <h3 class="cardTitle">${isZh ? '从壳子开始' : 'Start from the shell'}</h3>
                    <span class="cardBadge2">UI</span>
                  </div>
                  <p class="cardDesc">${isZh ? '先把骨架搭对，后面换成 Vue 才顺。' : 'Get the frame right; upgrading to Vue becomes smooth.'}</p>
                  <div class="cardMeta">
                    <span class="tag">${isZh ? '布局' : 'layout'}</span>
                    <span class="tag">${isZh ? '状态' : 'state'}</span>
                  </div>
                </article>
                <article class="card">
                  <div class="cardTop">
                    <h3 class="cardTitle">${isZh ? '玻璃拟态' : 'Glass UI'}</h3>
                    <span class="cardBadge2">CSS</span>
                  </div>
                  <p class="cardDesc">${isZh ? 'blur + border + shadow 的层次感，比纯渐变更像本站。' : 'blur + border + shadow creates the real site feel.'}</p>
                  <div class="cardMeta">
                    <span class="tag">blur</span>
                    <span class="tag">shadow</span>
                  </div>
                </article>
                <article class="card">
                  <div class="cardTop">
                    <h3 class="cardTitle">${isZh ? '按钮与交互' : 'Buttons & interactions'}</h3>
                    <span class="cardBadge2">JS</span>
                  </div>
                  <p class="cardDesc">${isZh ? '点 ☰ / ➜ / 🎨 只是开关状态，UI 动画由 CSS 响应。' : 'Click toggles state; CSS drives the motion.'}</p>
                  <div class="cardMeta">
                    <span class="tag">${isZh ? '开关' : 'toggle'}</span>
                    <span class="tag">${isZh ? '动效' : 'motion'}</span>
                  </div>
                </article>
              </div>
            </section>

            <section class="panel" id="about">
              <div class="prose">
                <h2>${isZh ? 'About（占位）' : 'About (placeholder)'}</h2>
                <p>${isZh ? '你可以把这块当成“博客正文区”。先让它有结构，再慢慢把内容换成真实数据。' : 'Treat this as the blog body. Start with structure, then replace content with real data later.'}</p>
                <p>${isZh ? '下一步：把同一套结构组件化（Vue），并复用同样的按钮外观与状态开关。' : 'Next: componentize the same structure in Vue and keep the same button look & state switches.'}</p>
              </div>
            </section>

            <footer class="footer">
              <div class="footerInner">
                <div class="footerBrand">Sakura Notes</div>
                <div class="footerMeta">${isZh ? 'UI Shell Demo · 本区为占位内容' : 'UI Shell Demo · placeholder content'}</div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      <aside id="rightPanel" class="rightPanel" hidden aria-label="${isZh ? '右侧面板' : 'Right panel'}">
        <div class="rightHeader">
          <div class="rightTitle">${isZh ? '面板（占位）' : 'Panel (placeholder)'}</div>
          <button id="closeRight" class="dockBtn" type="button" aria-label="${isZh ? '关闭' : 'Close'}">✕</button>
        </div>
        <div class="rightBody">
          <div class="miniCard">
            <div class="miniTitle">${isZh ? '快速操作' : 'Quick actions'}</div>
            <button class="miniBtn" type="button">${isZh ? '🔍 打开搜索（占位）' : '🔍 Open search (placeholder)'}</button>
            <button class="miniBtn" type="button">${isZh ? '⚙️ 打开设置（占位）' : '⚙️ Open settings (placeholder)'}</button>
            <a class="miniLink" href="#top">${isZh ? '回到顶部' : 'Back to top'}</a>
          </div>
          <div class="miniCard">
            <div class="miniTitle">${isZh ? '提示' : 'Hint'}</div>
            <div>${isZh ? '右侧面板本身也是“壳子的一部分”：先有形，再补逻辑。' : 'The right panel is part of the shell: shape first, logic later.'}</div>
          </div>
        </div>
      </aside>

      <div id="toast" class="toast" hidden>
        <div class="toastInner">
          <span class="toastIcon" aria-hidden="true">🌸</span>
          <span id="toastText">Toast</span>
        </div>
      </div>
      ${scriptTag}
    </div>
  </body>
</html>`
}

export function buildMiniSiteFullCss() {
  return `${miniCssHint()}

:root{
  --primary-50: rgba(244, 63, 94, 0.06);
  --primary-100: rgba(244, 63, 94, 0.14);
  --primary-200: rgba(244, 63, 94, 0.26);
  --primary-400: rgba(244, 63, 94, 0.55);
  --primary-600: rgba(244, 63, 94, 0.92);
  --primary-900: rgba(136, 19, 55, 0.95);
  --bg0: #ffffff;
  --bg1: #f8fafc;
  --text: #0f172a;
  --muted: #475569;
  --border: rgba(148,163,184,.45);
  --panel: rgba(255,255,255,.78);
  --panelSolid: #ffffff;
  --shadow: 0 18px 60px rgba(15,23,42,.12);
  --ring: rgba(244, 63, 94, 0.26);
  --sidebarW: 300px;
  color-scheme: light;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}
[data-theme="dark"]{
  --bg0: #030712;
  --bg1: #0b1220;
  --text: #e5e7eb;
  --muted: #a1a1aa;
  --border: rgba(148,163,184,.18);
  --panel: rgba(2,6,23,.66);
  --panelSolid: #0b1220;
  --shadow: 0 20px 70px rgba(0,0,0,.42);
  color-scheme: dark;
}
html,body{height:100%}
body{
  margin:0;
  line-height:1.45;
  color:var(--text);
  background:
    radial-gradient(900px 520px at 15% 10%, rgba(244,63,94,.18), transparent 60%),
    radial-gradient(800px 460px at 85% 12%, rgba(99,102,241,.18), transparent 60%),
    linear-gradient(180deg, var(--bg0), var(--bg1) 65%, var(--bg0));
}
.srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

.appFrame{
  position:relative;
  min-height:100vh;
  display:flex;
  overflow:hidden;
  background: transparent;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
[data-theme="dark"] .appFrame{
  border-color: rgba(148,163,184,.12);
}

.bgDecor{display:none;position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.bgDecor::before{
  content:"";
  position:absolute;
  inset:-40px;
  background:
    radial-gradient(1200px 680px at 65% 30%, rgba(255,166,107,.70), rgba(255,166,107,0) 62%),
    radial-gradient(920px 560px at 72% 58%, rgba(244,63,94,.44), rgba(244,63,94,0) 60%),
    radial-gradient(1000px 700px at 86% 18%, rgba(99,102,241,.30), rgba(99,102,241,0) 62%),
    linear-gradient(180deg, rgba(15,23,42,.10), rgba(15,23,42,0) 44%, rgba(15,23,42,.16));
  opacity:.85;
  filter:saturate(1.15) contrast(1.05);
  transform: scale(1.02);
}
.blob{position:absolute;border-radius:999px;filter: blur(48px);opacity:.55;transform: translateZ(0);will-change: transform}
.blobA{width:820px;height:820px;top:-260px;right:-260px;background: radial-gradient(circle at 30% 30%, rgba(99,102,241,.38), rgba(244,63,94,.18), transparent 70%);animation: float 10s ease-in-out infinite}
.blobB{width:620px;height:620px;top:220px;left:-260px;background: radial-gradient(circle at 30% 30%, rgba(244,63,94,.26), rgba(99,102,241,.14), transparent 70%);animation: pulse 8s ease-in-out infinite}
.dots{position:absolute;inset:0;opacity:.035;background-image: radial-gradient(rgba(136,19,55,.85) 1px, transparent 1px);background-size: 32px 32px}
[data-theme="dark"] .dots{opacity:.06}

@keyframes float{
  0%,100%{transform: translate3d(0,0,0) scale(1)}
  50%{transform: translate3d(-12px, 16px, 0) scale(1.03)}
}
@keyframes pulse{
  0%,100%{transform: translate3d(0,0,0) scale(1); opacity:.55}
  50%{transform: translate3d(10px, -10px, 0) scale(1.04); opacity:.48}
}
@keyframes shimmer{
  0%{background-position: 0% 0%}
  100%{background-position: 200% 0%}
}

.sidebar{
  position:relative;
  z-index:1;
  width: var(--sidebarW);
  flex: 0 0 auto;
  display:flex;
  flex-direction:column;
  background: var(--panel);
  border-right: 1px solid rgba(255,255,255,.60);
  backdrop-filter: blur(18px);
  transition: width .3s ease, opacity .3s ease;
}
[data-theme="dark"] .sidebar{border-right-color: rgba(148,163,184,.14)}
[data-sidebar="closed"] .sidebar{width:0;opacity:0;overflow:hidden;pointer-events:none}

.sidebarHeader{
  padding:18px 18px 14px;
  border-bottom: 1px solid rgba(255,255,255,.60);
  background: linear-gradient(180deg, rgba(244,63,94,.08), transparent);
}
[data-theme="dark"] .sidebarHeader{border-bottom-color: rgba(148,163,184,.14)}
.sidebarTopRow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.chipBtn{
  font-size:12px;
  font-weight:800;
  padding:6px 10px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.55);
  color: var(--text);
  cursor:pointer;
}
[data-theme="dark"] .chipBtn{background: rgba(2,6,23,.40); border-color: rgba(148,163,184,.14)}
.modeTabs{display:flex;gap:8px;margin-top:12px}
.modeTab{
  flex:1;
  padding:8px 10px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.40);
  color: var(--text);
  font-weight:900;
  font-size:12px;
  cursor:pointer;
  transition: transform .15s ease, background .2s ease, border-color .2s ease;
}
[data-theme="dark"] .modeTab{background: rgba(2,6,23,.26); border-color: rgba(148,163,184,.14)}
.modeTab:hover{transform: translateY(-1px); outline:3px solid var(--ring)}
.modeTab.isActive{background: rgba(255,255,255,.70); border-color: rgba(244,63,94,.28)}
[data-theme="dark"] .modeTab.isActive{background: rgba(2,6,23,.46); border-color: rgba(244,63,94,.22)}
.brandRow{display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit}
.avatar{
  width:54px;height:54px;border-radius:999px;
  display:grid;place-items:center;
  font-size:22px;
  background: radial-gradient(circle at 30% 30%, rgba(244,63,94,.22), rgba(99,102,241,.14));
  border: 1px solid rgba(255,255,255,.75);
  box-shadow: 0 16px 45px rgba(15,23,42,.14);
  transition: transform .2s ease;
}
.brandRow:hover .avatar{transform: scale(1.04)}
.brandTitle{font-weight:900;letter-spacing:.01em}
.brandSub{font-size:12px;color:var(--muted);margin-top:2px}
.sidebarBody{padding:14px 10px 10px;overflow:auto}
.groupTitle{font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color: rgba(100,116,139,.90);padding:8px 10px 6px}
[data-theme="dark"] .groupTitle{color: rgba(148,163,184,.70)}
.navItem{
  width:100%;
  text-align:left;
  padding:10px 12px;
  margin:6px 8px;
  border-radius:14px;
  border:1px solid transparent;
  background: transparent;
  color: rgba(30,41,59,.86);
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:800;
  font-size:12px;
  transition: background .2s ease, border-color .2s ease, transform .15s ease;
}
[data-theme="dark"] .navItem{color: rgba(226,232,240,.86)}
.navItem:hover{background: rgba(255,255,255,.55); border-color: rgba(255,255,255,.65); transform: translateY(-1px)}
[data-theme="dark"] .navItem:hover{background: rgba(2,6,23,.35); border-color: rgba(148,163,184,.14)}
.navItem.isActive{
  background: linear-gradient(90deg, rgba(244,63,94,.10), rgba(99,102,241,.08));
  border-color: rgba(244,63,94,.28);
  color: var(--text);
}
.sidePills{display:flex;gap:8px;flex-wrap:wrap;padding:6px 10px 0}
.sidePill{
  font-size:11px;
  font-weight:900;
  padding:6px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.55);
  color: var(--muted);
  cursor:pointer;
}
[data-theme="dark"] .sidePill{background: rgba(2,6,23,.34); border-color: rgba(148,163,184,.14)}
.sidePill:hover{outline:3px solid var(--ring)}
.sideList{padding:10px 8px 0;display:grid;gap:10px}
.sideNote{
  text-decoration:none;
  color: inherit;
  display:flex;
  gap:12px;
  align-items:flex-start;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.52);
  padding: 12px;
  box-shadow: 0 14px 40px rgba(15,23,42,.08);
  transition: transform .15s ease, box-shadow .15s ease, border-color .2s ease;
}
[data-theme="dark"] .sideNote{background: rgba(2,6,23,.36); border-color: rgba(148,163,184,.14)}
.sideNote:hover{transform: translateY(-2px); box-shadow: 0 22px 70px rgba(15,23,42,.14)}
.sideNote.isActive{border-color: rgba(244,63,94,.26); background: linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))}
[data-theme="dark"] .sideNote.isActive{background: linear-gradient(180deg, rgba(2,6,23,.44), rgba(2,6,23,.32))}
.noteNo{
  font-weight:1000;
  font-size:12px;
  letter-spacing:.12em;
  color: rgba(244,63,94,.86);
  padding-top: 2px;
  flex: 0 0 auto;
}
.noteMain{min-width:0}
.noteTitle{font-weight:900;font-size:12px;line-height:1.2}
.noteMeta{margin-top:6px;font-size:11px;color: var(--muted);display:flex;gap:6px;flex-wrap:wrap}
.metaDot{opacity:.7}
.sidebarFooter{
  padding:12px 14px 16px;
  border-top: 1px solid rgba(255,255,255,.60);
  display:flex;
  gap:10px;
  gap:10px;
  flex-wrap:wrap;
}
[data-theme="dark"] .sidebarFooter{border-top-color: rgba(148,163,184,.14)}
.ghostBtn{
  padding:8px 10px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.55);
  font-weight:900;
  font-size:12px;
  color: var(--text);
  cursor:pointer;
}
[data-theme="dark"] .ghostBtn{background: rgba(2,6,23,.40); border-color: rgba(148,163,184,.14)}
.ghostBtn:hover{outline:3px solid var(--ring)}

.main{
  position:relative;
  z-index:1;
  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
}
.topbar{
  position:sticky;
  top:0;
  z-index:10;
  height:64px;
  display:flex;
  align-items:center;
  gap:12px;
  padding:0 16px;
  background: rgba(255,255,255,.70);
  border-bottom: 1px solid rgba(255,255,255,.60);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 30px rgba(15,23,42,.08);
}
[data-theme="dark"] .topbar{background: rgba(3,7,18,.62); border-bottom-color: rgba(148,163,184,.14)}

.iconBtn{
  width:32px;
  height:32px;
  border-radius: 8px;
  border:none;
  background: transparent;
  color: rgba(100,116,139,.95);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition: transform .12s ease, background .2s ease, color .2s ease;
}
[data-theme="dark"] .iconBtn{color: rgba(156,163,175,.95)}
.iconBtn:active{transform: scale(.96)}
.iconBtn:hover{background: var(--primary-50); color: var(--text)}
[data-theme="dark"] .iconBtn:hover{background: rgba(31,41,55,.65); color: rgba(229,231,235,.92)}

.crumbs{flex:1;min-width:0;display:flex;align-items:center;gap:8px;overflow:hidden}
.crumbHome{text-decoration:none;color: rgba(244,63,94,.85)}
.crumbSep{color: rgba(148,163,184,.80)}
.crumbChip{
  font-size:12px;
  font-weight:900;
  padding:6px 10px;
  border-radius:12px;
  background: rgba(99,102,241,.10);
  border: 1px solid rgba(99,102,241,.18);
  color: rgba(67,56,202,.90);
  white-space:nowrap;
  flex: 0 0 auto;
}
[data-theme="dark"] .crumbChip{color: rgba(199,210,254,.92); background: rgba(99,102,241,.16); border-color: rgba(99,102,241,.22)}
.crumbCurrent{font-size:12px;color: var(--muted);font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.actions{display:flex;gap:8px}
.actionBtn{
  width:32px;
  height:32px;
  border-radius: 8px;
  border:none;
  background: transparent;
  color: rgba(100,116,139,.95);
  cursor:pointer;
  transition: transform .12s ease, background .2s ease, color .2s ease;
}
[data-theme="dark"] .actionBtn{color: rgba(156,163,175,.95)}
.actionBtn:hover{background: var(--primary-50)}
[data-theme="dark"] .actionBtn:hover{background: rgba(31,41,55,.65)}
.actionBtn:active{transform: scale(.96)}

.content{
  flex:1;
  overflow:auto;
  padding:16px;
}
.page{
  height: 100%;
  min-height: 520px;
  border-radius: 22px;
  border: 1px dashed rgba(148,163,184,.55);
  background: transparent;
}
[data-theme="dark"] .page{background: transparent; border-color: rgba(148,163,184,.28)}
.heroCover{
  position:relative;
  min-height: unset;
  display:block;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,.60);
  background: transparent;
  overflow:hidden;
}
[data-theme="dark"] .heroCover{border-bottom-color: rgba(148,163,184,.14); background: transparent}
.heroCover::before{
  content:"";
  position:absolute;
  inset:0;
  display:none;
}
.heroCenter{
  position:relative;
  z-index:1;
  width: min(980px, calc(100vw - 40px));
  margin: 0 auto;
  text-align:left;
  border-radius: 0;
  border: none;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  padding: 6px 0 8px;
}
.heroCenter::after{
  content:"";
  display:block;
  height: 0;
  border-bottom: 1px dashed rgba(148,163,184,.55);
  margin-top: 14px;
  opacity: .7;
}
[data-theme="dark"] .heroCenter::after{border-bottom-color: rgba(148,163,184,.22)}
.heroMark{
  display:none;
}
.heroKicker{font-weight:900;color: rgba(244,63,94,.86);letter-spacing:.08em;text-transform:uppercase;font-size:12px}
.heroTitle{margin:10px 0 0;font-size:34px;letter-spacing:-.03em}
.heroDesc{margin:10px auto 0;color: var(--muted);font-size:13px;max-width:64ch}
.heroChips{margin-top:12px;display:flex;gap:10px;justify-content:flex-start;flex-wrap:wrap}
.chip{
  font-size:11px;
  font-weight:900;
  padding:6px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.55);
  color: var(--muted);
}
[data-theme="dark"] .chip{background: rgba(2,6,23,.40); border-color: rgba(148,163,184,.14)}
.heroBtns{margin-top:16px;display:flex;gap:10px;justify-content:flex-start;flex-wrap:wrap}
.primaryBtn,.secondaryBtn{
  border-radius:16px;
  padding:10px 14px;
  font-weight:900;
  font-size:12px;
  cursor:pointer;
  border:1px solid rgba(255,255,255,.70);
}
.primaryBtn{
  background: linear-gradient(90deg, rgba(244,63,94,.92), rgba(99,102,241,.82));
  color:#fff;
  box-shadow: 0 16px 45px rgba(99,102,241,.20);
}
.secondaryBtn{
  background: rgba(255,255,255,.65);
  color: var(--text);
}
[data-theme="dark"] .secondaryBtn{background: rgba(2,6,23,.46); border-color: rgba(148,163,184,.14)}
.primaryBtn:hover,.secondaryBtn:hover{outline:3px solid var(--ring)}
.scrollHint{
  display:none;
}
@keyframes hint{0%,100%{transform: translateY(0)}50%{transform: translateY(4px)}}

.panel{
  margin: 16px 20px 0;
  margin-top:16px;
  border-radius: 26px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.58);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
  padding:16px;
}
[data-theme="dark"] .panel{background: rgba(2,6,23,.40); border-color: rgba(148,163,184,.14)}
.panelHeader{display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap}
.panelTitle{margin:0;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color: var(--muted);font-weight:900}
.searchInline{display:flex;gap:10px;align-items:center}
.searchInput{
  border:1px solid rgba(255,255,255,.65);
  border-radius:16px;
  padding:10px 12px;
  min-width:240px;
  background: var(--panelSolid);
  color: var(--text);
  outline:none;
}
[data-theme="dark"] .searchInput{background: #0f172a; border-color: rgba(148,163,184,.14)}
.searchInput:focus{outline:3px solid var(--ring)}
.searchBtn{
  border:1px solid rgba(255,255,255,.65);
  border-radius:16px;
  padding:10px 12px;
  background: rgba(255,255,255,.55);
  color: var(--text);
  font-weight:900;
  font-size:12px;
  cursor:pointer;
}
[data-theme="dark"] .searchBtn{background: rgba(2,6,23,.42); border-color: rgba(148,163,184,.14)}
.searchBtn:hover{outline:3px solid var(--ring)}

.cardGrid{margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.card{
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.60);
  padding:14px;
  box-shadow: 0 14px 40px rgba(15,23,42,.10);
  transition: transform .15s ease, box-shadow .15s ease;
}
[data-theme="dark"] .card{background: rgba(2,6,23,.44); border-color: rgba(148,163,184,.14)}
.card:hover{transform: translateY(-2px); box-shadow: 0 22px 70px rgba(15,23,42,.14)}
.cardTop{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cardTitle{margin:0;font-size:14px}
.cardBadge2{
  font-size:10px;
  font-weight:900;
  padding:4px 10px;
  border-radius:999px;
  border:1px solid rgba(99,102,241,.20);
  background: rgba(99,102,241,.10);
  color: rgba(67,56,202,.90);
}
[data-theme="dark"] .cardBadge2{color: rgba(199,210,254,.92)}
.cardDesc{margin:10px 0 0;color: var(--muted);font-size:12px}
.cardMeta{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap}
.tag{
  font-size:11px;
  border:1px solid rgba(255,255,255,.70);
  border-radius:999px;
  padding:3px 10px;
  color: var(--muted);
  background: rgba(255,255,255,.45);
}
[data-theme="dark"] .tag{background: rgba(2,6,23,.32); border-color: rgba(148,163,184,.14)}

.prose{color: var(--muted);font-size:13px;max-width:82ch;line-height:1.75}
.footer{padding:18px 20px;border-top:1px solid rgba(255,255,255,.60)}
[data-theme="dark"] .footer{border-top-color: rgba(148,163,184,.14)}
.footerInner{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.footerBrand{font-weight:900}
.footerMeta{font-size:12px;color: var(--muted)}

.rightPanel{
  position:fixed;
  top:0;
  right:0;
  height:100vh;
  width: 360px;
  z-index:30;
  background: rgba(255,255,255,.92);
  border-left: 1px solid rgba(255,255,255,.60);
  backdrop-filter: blur(18px);
  box-shadow: -12px 0 60px rgba(15,23,42,.12);
  transform: translate3d(120%,0,0);
  opacity: 0;
  transition: transform .3s ease, opacity .3s ease;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  justify-content:flex-start;
  padding: 0;
}
[data-theme="dark"] .rightPanel{border-left-color: rgba(148,163,184,.14); background: rgba(3,7,18,.82)}
.dockBtn{
  width: 36px;
  height: 36px;
  border-radius: 14px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.55);
  color: var(--muted);
  cursor:pointer;
  font-weight:900;
}
[data-theme="dark"] .dockBtn{background: rgba(2,6,23,.42); border-color: rgba(148,163,184,.14)}
.dockBtn:hover{outline:3px solid var(--ring)}
.rightHeader{padding:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(255,255,255,.60)}
[data-theme="dark"] .rightHeader{border-bottom-color: rgba(148,163,184,.14)}
.rightTitle{font-weight:900}
.rightBody{padding:16px;overflow:auto;display:grid;gap:12px}
.miniCard{
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.55);
  padding: 14px;
  color: var(--muted);
  font-weight:800;
  font-size:12px;
}
[data-theme="dark"] .miniCard{background: rgba(2,6,23,.42); border-color: rgba(148,163,184,.14)}
.miniTitle{color: var(--text); font-weight:900; margin-bottom:10px}
.miniLink{
  display:block;
  padding:10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.50);
  color: var(--text);
  text-decoration:none;
  font-weight:900;
  margin-top:10px;
}
[data-theme="dark"] .miniLink{background: rgba(2,6,23,.34); border-color: rgba(148,163,184,.14)}
.miniLink:hover{outline:3px solid var(--ring)}
.miniBtn{
  width:100%;
  margin-top:10px;
  padding:10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.50);
  color: var(--text);
  font-weight:900;
  cursor:pointer;
  text-align:left;
}
[data-theme="dark"] .miniBtn{background: rgba(2,6,23,.34); border-color: rgba(148,163,184,.14)}
.miniBtn:hover{outline:3px solid var(--ring)}
[data-right="open"] .rightPanel{transform: translate3d(0,0,0); opacity: 1}

.toast{
  position:fixed;
  top:24px;
  left:50%;
  transform: translateX(-50%);
  z-index:9999;
  pointer-events:none;
}
.toastInner{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.75);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 120px rgba(15,23,42,.18);
  font-weight:700;
  font-size: 12px;
}
[data-theme="dark"] .toastInner{background: rgba(2,6,23,.70); border-color: rgba(148,163,184,.14)}
.toastIcon{color: rgba(244,63,94,.88)}

.modalOverlay{
  position:fixed;
  inset:0;
  z-index:40;
  background: rgba(15,23,42,.28);
  backdrop-filter: blur(8px);
  display:grid;
  place-items:center;
}
[data-theme="dark"] .modalOverlay{background: rgba(0,0,0,.52)}
.modal{
  width: min(720px, calc(100vw - 28px));
  border-radius: 26px;
  border:1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.70);
  box-shadow: 0 30px 120px rgba(15,23,42,.26);
  overflow:hidden;
  transform: translate3d(0,8px,0) scale(.98);
  animation: modalIn .18s ease-out forwards;
}
[data-theme="dark"] .modal{background: rgba(2,6,23,.78); border-color: rgba(148,163,184,.14)}
@keyframes modalIn{to{transform: translate3d(0,0,0) scale(1)}}
.modalHeader{
  padding:14px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(255,255,255,.60);
}
[data-theme="dark"] .modalHeader{border-bottom-color: rgba(148,163,184,.14)}
.modalTitle{font-weight:900}
.modalBody{padding:16px;color: var(--muted);font-size:13px;line-height:1.7}
.modalList{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.modalItem{
  border-radius: 18px;
  border:1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.55);
  padding:12px 14px;
}
[data-theme="dark"] .modalItem{background: rgba(2,6,23,.42); border-color: rgba(148,163,184,.14)}
.kbd{
  font-size:11px;
  font-weight:900;
  padding:2px 8px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.55);
  color: var(--text);
}
[data-theme="dark"] .kbd{background: rgba(2,6,23,.42); border-color: rgba(148,163,184,.14); color: rgba(229,231,235,.92)}

.backToTop{
  position:fixed;
  right:16px;
  bottom:16px;
  z-index:15;
  border:1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.58);
  color: var(--text);
  border-radius:999px;
  padding:10px 12px;
  font-weight:900;
  cursor:pointer;
  box-shadow: 0 20px 60px rgba(15,23,42,.16);
}
[data-theme="dark"] .backToTop{background: rgba(2,6,23,.52); border-color: rgba(148,163,184,.14)}
.backToTop:hover{outline:3px solid var(--ring)}

[hidden]{display:none !important}

[data-theme="dark"] .actionOptional{}

@media (max-width:560px){
  .actionOptional{display:none}
  .crumbCurrent{display:none}
  .heroCover{min-height: 420px}
  .panel{margin-left:14px;margin-right:14px}
}

@media (max-width:1100px){.cardGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:720px){
  .sidebar{position:fixed;top:0;left:0;height:100vh}
  [data-sidebar="closed"] .sidebar{transform: translateX(-12px)}
  .searchInput{min-width:0;width: min(320px, 70vw)}
  .cardGrid{grid-template-columns:1fr}
}`
}

export function buildMiniSiteStarterFiles(lang: MiniSiteLang): MiniSiteFiles {
  const zh = lang === 'zh'
  const baseHtmlLang = zh ? 'zh-CN' : 'en'
  const scriptOpen = '<scr' + 'ipt'
  const scriptClose = '</scr' + 'ipt>'
  const html = `<!doctype html>
<html lang="${baseHtmlLang}" data-theme="light" data-sidebar="open" data-right="closed">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sakura Notes (Starter)</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body id="top">
${miniHtmlHint()}
    <div class="appFrame">
      <aside id="sidebar" class="sidebar" aria-label="${zh ? '左侧栏' : 'Sidebar'}">
        <div class="sidebarHeader">
          <div class="sidebarTopRow">
            <button id="langToggle" class="chipBtn" type="button">${zh ? '中 / EN' : 'EN / 中'}</button>
            <button id="sidebarToggle" class="iconBtn" type="button" aria-label="${zh ? '折叠侧边栏' : 'Toggle sidebar'}">‹</button>
          </div>

          <a class="brandRow" href="#top">
            <div class="avatar" aria-hidden="true">🌸</div>
            <div class="brandText">
              <div class="brandTitle">Sakura Notes</div>
              <div class="brandSub">${zh ? '从壳子开始（可改成你的站）' : 'Start from the shell (customize it)'}</div>
            </div>
          </a>

          <div class="modeTabs" role="tablist" aria-label="${zh ? '模式切换' : 'View mode'}">
            <button class="modeTab" type="button">⏰ ${zh ? '最新' : 'Latest'}</button>
            <button class="modeTab" type="button">📁 ${zh ? '归档' : 'Files'}</button>
            <button class="modeTab isActive" type="button">🧪 ${zh ? '实验室' : 'Lab'}</button>
          </div>
        </div>

        <div class="sidebarBody">
          <nav class="nav" aria-label="${zh ? '导航区' : 'Navigation'}">
            <div class="groupTitle">${zh ? '导航' : 'Navigation'}</div>
            <button class="navItem isActive" type="button">🧪 ${zh ? '实验室' : 'Lab'}</button>
            <button class="navItem" type="button">📝 ${zh ? '笔记' : 'Notes'}</button>
            <button class="navItem" type="button">📁 ${zh ? '归档' : 'Archive'}</button>
            <button class="navItem" type="button">⚙️ ${zh ? '设置' : 'Settings'}</button>
          </nav>
        </div>

        <div class="sidebarFooter">
          <button class="ghostBtn" type="button">${zh ? '🔎 搜索' : '🔎 Search'}</button>
          <button class="ghostBtn" type="button">${zh ? '⬇️ 下载' : '⬇️ Download'}</button>
          <button class="ghostBtn" type="button">${zh ? '⚙️ 设置' : '⚙️ Settings'}</button>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <button id="topbarSidebar" class="iconBtn" type="button" aria-label="${zh ? '切换侧边栏' : 'Toggle sidebar'}">☰</button>
          <div class="crumbs" aria-label="${zh ? '面包屑' : 'Breadcrumbs'}">
            <a class="crumbHome" href="#top">🏠</a>
            <span class="crumbSep">›</span>
            <span class="crumbChip">🧪 ${zh ? '实验室' : 'Lab'}</span>
            <span class="crumbSep">›</span>
            <span class="crumbCurrent">${zh ? 'UI 空壳' : 'UI Shell'}</span>
          </div>
          <div class="actions">
            <button class="actionBtn" id="actionTheme" type="button" title="${zh ? '主题' : 'Theme'}">🎨</button>
            <button class="actionBtn" id="actionRight" type="button" title="${zh ? '右侧面板' : 'Right panel'}">➜</button>
          </div>
        </header>

        <main class="content">
          <div class="page" aria-label="${zh ? '内容区' : 'Content'}">
            <section class="starter">
              <h1 class="starterTitle">${zh ? 'UI 空壳（Starter）' : 'UI Shell (Starter)'}</h1>
              <p class="starterDesc">
                ${zh ? '这里应该是“你要写的内容”。先把骨架对齐，然后再逐步填充页面。' : 'This is where YOU build content. Align the shell first, then fill the page.'}
              </p>
              <div class="starterGrid">
                <div class="starterCard">
                  <div class="starterLabel">${zh ? '下一步' : 'Next'}</div>
                  <ul class="starterList">
                    <li>${zh ? '侧边栏：折叠/展开状态' : 'Sidebar: open/close state'}</li>
                    <li>${zh ? '顶栏：按钮 hover/圆角/间距' : 'Topbar: hover/radius/spacing'}</li>
                    <li>${zh ? '右侧面板：打开/关闭 + 动画' : 'Right panel: open/close + motion'}</li>
                  </ul>
                </div>
                <div class="starterCard">
                  <div class="starterLabel">${zh ? '内容区' : 'Content'}</div>
                  <div class="starterEmpty">
                    ${zh ? '从一个“文章卡片列表”开始写。' : 'Start with a simple “post card list”.'}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <aside id="rightPanel" class="rightPanel" hidden aria-label="${zh ? '右侧面板' : 'Right panel'}">
        <div class="rightHeader">
          <div class="rightTitle">${zh ? '面板（占位）' : 'Panel (placeholder)'}</div>
          <button id="closeRight" class="dockBtn" type="button" aria-label="${zh ? '关闭' : 'Close'}">✕</button>
        </div>
        <div class="rightBody">
          <div class="miniCard">
            <div class="miniTitle">${zh ? '建议' : 'Tip'}</div>
            <div>${zh ? '右侧面板不需要业务：先把结构与动效做像。' : 'No business logic needed; focus on structure and motion.'}</div>
          </div>
        </div>
      </aside>

      <div id="toast" class="toast" hidden>
        <div class="toastInner">
          <span class="toastIcon" aria-hidden="true">🌸</span>
          <span id="toastText">Toast</span>
        </div>
      </div>

      ${scriptOpen} defer src="./main.js">${scriptClose}
    </div>
  </body>
</html>
`

  const css = `${miniCssHint()}

:root{
  --bg:#ffffff;
  --panel:rgba(255,255,255,.78);
  --border:rgba(15,23,42,.14);
  --text:#0f172a;
  --muted:rgba(15,23,42,.62);
  --primary:#ec4899;
  --shadow:0 18px 60px rgba(15,23,42,.12);
  color-scheme:light;
}
html[data-theme="dark"]{
  --bg:#0b1220;
  --panel:rgba(2,6,23,.66);
  --border:rgba(148,163,184,.18);
  --text:#e2e8f0;
  --muted:rgba(226,232,240,.62);
  --primary:#fb7185;
  --shadow:0 18px 60px rgba(2,6,23,.45);
  color-scheme:dark;
}
*{box-sizing:border-box}
body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.5;background:var(--bg);color:var(--text)}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit}
.appFrame{height:100dvh;display:grid;grid-template-columns:280px 1fr}
.sidebar{border-right:1px solid var(--border);background:var(--panel);padding:14px 12px;display:flex;flex-direction:column;min-width:0}
.main{min-width:0;display:flex;flex-direction:column}
.topbar{height:56px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 14px;border-bottom:1px solid var(--border);background:var(--panel)}
.content{flex:1;min-height:0;overflow:auto;padding:16px}
.page{max-width:980px;margin:0 auto}
.iconBtn{width:34px;height:34px;border-radius:12px;border:1px solid var(--border);background:transparent;cursor:pointer}
.actionBtn{width:36px;height:36px;border-radius:14px;border:1px solid transparent;background:transparent;cursor:pointer}
.chipBtn{padding:8px 10px;border-radius:999px;border:1px solid var(--border);background:transparent;cursor:pointer;font-weight:800;font-size:12px}
.ghostBtn{flex:1;padding:10px 10px;border-radius:16px;border:1px solid var(--border);background:transparent;cursor:pointer;font-weight:800;font-size:12px}
.starter{padding:18px;border:1px dashed var(--border);border-radius:26px}
.starterTitle{margin:0;font-size:22px}
.starterDesc{margin:6px 0 16px;color:var(--muted)}
.starterGrid{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:760px){.starterGrid{grid-template-columns:1fr 1fr}}
.starterCard{padding:14px;border-radius:22px;border:1px solid var(--border)}
.starterLabel{font-weight:900;margin-bottom:8px}
.starterList{margin:0;padding-left:18px;color:var(--muted)}
.starterEmpty{padding:14px;border-radius:18px;border:1px dashed var(--border);color:var(--muted)}
.rightPanel{position:fixed;top:0;right:0;width:360px;height:100dvh;border-left:1px solid var(--border);background:var(--panel);display:flex;flex-direction:column}
.rightHeader{height:56px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 14px;border-bottom:1px solid var(--border)}
.rightBody{padding:14px;overflow:auto}
.dockBtn{width:34px;height:34px;border-radius:12px;border:1px solid var(--border);background:transparent;cursor:pointer}
.toast{position:fixed;left:16px;bottom:16px}
.toastInner{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:18px;border:1px solid var(--border);background:var(--panel)}
html[data-sidebar="closed"] .sidebar{display:none}
@media(max-width:720px){
  .appFrame{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;height:100dvh;width:280px;z-index:20}
}
`

  const js = buildMiniJs('starter')
  return { 'index.html': html, 'styles.css': css, 'main.js': js }
}

export const WIREFRAME_CSS = `:root{
  --bg:#ffffff;
  --text:#0f172a;
  --muted:rgba(15,23,42,.60);
  --border:rgba(148,163,184,.55);
  color-scheme:light;
  font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);line-height:1.45}
button{font:inherit}
[hidden]{display:none !important}
.appFrame{min-height:100dvh;display:grid;grid-template-columns:280px 1fr}
.sidebar{border-right:1px solid var(--border);padding:14px 12px;display:flex;flex-direction:column;gap:12px}
.sidebarHeader,.sidebarBody,.sidebarFooter{border:1px dashed var(--border);border-radius:18px;padding:12px}
.main{min-width:0;display:flex;flex-direction:column}
.topbar{height:56px;border-bottom:1px solid var(--border);padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.content{flex:1;overflow:auto;padding:16px}
.page{max-width:980px;margin:0 auto;border:1px dashed var(--border);border-radius:22px;min-height:520px;padding:16px}
.rightPanel{position:fixed;top:0;right:0;width:360px;height:100dvh;border-left:1px solid var(--border);background:rgba(255,255,255,.92)}
.toast{position:fixed;left:16px;bottom:16px;border:1px solid var(--border);border-radius:16px;padding:10px 12px;background:rgba(255,255,255,.92)}
html[data-sidebar="closed"] .sidebar{display:none}
@media(max-width:720px){
  .appFrame{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;height:100dvh;width:280px;z-index:20;background:#fff}
}
`

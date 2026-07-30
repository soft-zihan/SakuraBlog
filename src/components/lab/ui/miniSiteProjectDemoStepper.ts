import type { MiniSiteFileId, MiniSiteLang, MiniSiteStep } from './miniSiteProjectSamples'

export type DemoStep = {
  label: string
  files: Record<MiniSiteFileId, string>
}

function splitLines(input: string) {
  return String(input || '').replace(/\r\n/g, '\n').split('\n')
}

function findLine(lines: string[], needle: string, start = 0) {
  const n = String(needle || '')
  if (!n) return -1
  for (let i = Math.max(0, start); i < lines.length; i++) {
    if (lines[i]?.includes(n)) return i
  }
  return -1
}

function joinRange(lines: string[], start: number, endExclusive: number) {
  const s = Math.max(0, start)
  const e = Math.max(s, Math.min(lines.length, endExclusive))
  return lines.slice(s, e).join('\n')
}

function appendBlock(prev: string, block: string) {
  const a = String(prev || '')
  const b = String(block || '')
  if (!a) return b
  if (!b) return a
  if (a.endsWith('\n')) return `${a}${b}`
  return `${a}\n${b}`
}

function countNewlines(s: string, endExclusive: number) {
  let count = 0
  const upto = Math.max(0, Math.min(s.length, endExclusive))
  for (let i = 0; i < upto; i++) if (s.charCodeAt(i) === 10) count++
  return count
}

function normalizeLf(s: string) {
  return String(s || '').replace(/\r\n/g, '\n')
}

export type TextPatch = {
  startIndex: number
  deleteCount: number
  deleteText: string
  insertText: string
  fromLine: number
  toLine: number
  nextNormalized: string
}

export function computePatch(prev: string, next: string): TextPatch | null {
  const a = normalizeLf(prev)
  const b = normalizeLf(next)
  if (a === b) return null

  const minLen = Math.min(a.length, b.length)
  let startIndex = 0
  while (startIndex < minLen && a.charCodeAt(startIndex) === b.charCodeAt(startIndex)) startIndex++

  let endA = a.length
  let endB = b.length
  while (endA > startIndex && endB > startIndex && a.charCodeAt(endA - 1) === b.charCodeAt(endB - 1)) {
    endA--
    endB--
  }

  const deleteCount = Math.max(0, endA - startIndex)
  const deleteText = a.slice(startIndex, startIndex + deleteCount)
  const insertText = b.slice(startIndex, endB)
  const baseText = insertText || deleteText

  const baseLines = baseText ? baseText.split('\n').length : 1
  const fromLine = countNewlines(a, startIndex) + 1
  const toLine = Math.max(fromLine, fromLine + baseLines - 1)
  return { startIndex, deleteCount, deleteText, insertText, fromLine, toLine, nextNormalized: b }
}

export function buildMiniSiteDemoSteps(args: {
  lang: MiniSiteLang
  preset?: 'blank' | 'demo'
  step: MiniSiteStep
  isCombinedEditor: boolean
  defaultIndexHtml: string
  fullCss: string
  jsCode: string
}): DemoStep[] {
  if (args.preset !== 'demo') return []
  if (args.step !== 'js') return []
  if (args.isCombinedEditor) return []

  const isZh = args.lang === 'zh'
  const htmlLines = splitLines(args.defaultIndexHtml)
  const cssLines = splitLines(args.fullCss)
  const jsLines = splitLines(args.jsCode)

  const steps: DemoStep[] = []
  let state: Record<MiniSiteFileId, string> = { 'index.html': '', 'styles.css': '', 'main.js': '' }

  steps.push({
    label: isZh ? '开始：空白' : 'Start: blank',
    files: { ...state }
  })

  const iAppFrame = findLine(htmlLines, '<div class="appFrame">')
  const iSidebarStart = findLine(htmlLines, '<aside id="sidebar"')
  const iSidebarEnd = findLine(htmlLines, '</aside>', iSidebarStart)
  const iMainStart = findLine(htmlLines, '<div class="main">', Math.max(0, iSidebarEnd))
  const iTopbarEnd = findLine(htmlLines, '</header>', Math.max(0, iMainStart))
  const iContentStart = findLine(htmlLines, '<main class="content">', Math.max(0, iTopbarEnd))
  const iHeroStart = findLine(htmlLines, 'class="heroCover"', Math.max(0, iContentStart))
  const iHeroEnd = findLine(htmlLines, '</section>', Math.max(0, iHeroStart))
  const iExploreStart = findLine(htmlLines, 'id="explore"', Math.max(0, iHeroEnd))
  const iExploreEnd = findLine(htmlLines, '</section>', Math.max(0, iExploreStart))
  const iAboutStart = findLine(htmlLines, 'id="about"', Math.max(0, iExploreEnd))
  const iAboutEnd = findLine(htmlLines, '</section>', Math.max(0, iAboutStart))
  const iFooterStart = findLine(htmlLines, '<footer class="footer">', Math.max(0, iAboutEnd))
  const iFooterEnd = findLine(htmlLines, '</footer>', Math.max(0, iFooterStart))
  const iRightPanelStart = findLine(htmlLines, '<aside id="rightPanel"', Math.max(0, iFooterEnd))
  const iRightPanelEnd = findLine(htmlLines, '</aside>', Math.max(0, iRightPanelStart))
  const iToastStart = findLine(htmlLines, '<div id="toast"', Math.max(0, iRightPanelEnd))

  const htmlHead = joinRange(htmlLines, 0, Math.max(0, iAppFrame) + 1)
  const htmlSidebar = joinRange(htmlLines, Math.max(0, iSidebarStart), Math.max(0, iSidebarEnd) + 1)
  const htmlTopbar = joinRange(htmlLines, Math.max(0, iMainStart), Math.max(0, iTopbarEnd) + 1)
  const htmlHero = joinRange(htmlLines, Math.max(0, iContentStart), Math.max(0, iHeroEnd) + 1)
  const htmlExplore = joinRange(htmlLines, Math.max(0, iExploreStart) - 1, Math.max(0, iExploreEnd) + 1)
  const htmlAbout = joinRange(htmlLines, Math.max(0, iAboutStart) - 1, Math.max(0, iAboutEnd) + 1)
  const htmlFooterAndCloseMain = joinRange(htmlLines, Math.max(0, iFooterStart), Math.max(0, iFooterEnd) + 1)
  const htmlRightPanel = joinRange(htmlLines, Math.max(0, iRightPanelStart), Math.max(0, iRightPanelEnd) + 1)
  const htmlToastAndClose = joinRange(htmlLines, Math.max(0, iToastStart), htmlLines.length)

  const htmlBlocks: Array<{ label: string; block: string }> = [
    { label: isZh ? 'index.html：搭骨架（head + appFrame）' : 'index.html: scaffold (head + appFrame)', block: htmlHead },
    { label: isZh ? 'index.html：侧边栏（sidebar）' : 'index.html: sidebar', block: htmlSidebar },
    { label: isZh ? 'index.html：顶栏（topbar）' : 'index.html: topbar', block: htmlTopbar },
    { label: isZh ? 'index.html：首屏（hero）' : 'index.html: hero', block: htmlHero },
    { label: isZh ? 'index.html：卡片区（explore）' : 'index.html: explore panel', block: htmlExplore },
    { label: isZh ? 'index.html：正文区（about）' : 'index.html: about', block: htmlAbout },
    { label: isZh ? 'index.html：页脚（footer）' : 'index.html: footer', block: htmlFooterAndCloseMain },
    { label: isZh ? 'index.html：右侧面板（right panel）' : 'index.html: right panel', block: htmlRightPanel },
    { label: isZh ? 'index.html：toast + 收尾' : 'index.html: toast + closing', block: htmlToastAndClose }
  ]

  for (const b of htmlBlocks) {
    state = { ...state, 'index.html': appendBlock(state['index.html'], b.block) }
    steps.push({ label: b.label, files: { ...state } })
  }

  const iRoot = findLine(cssLines, ':root{')
  const iDark = findLine(cssLines, '[data-theme="dark"]', Math.max(0, iRoot))
  const iBody = findLine(cssLines, 'body{', Math.max(0, iDark))
  const iAppCss = findLine(cssLines, '.appFrame{', Math.max(0, iBody))
  const iTopbarCss = findLine(cssLines, '.topbar{', Math.max(0, iAppCss))
  const iHeroCss = findLine(cssLines, '.heroCover{', Math.max(0, iTopbarCss))
  const iPanelCss = findLine(cssLines, '.panel{', Math.max(0, iHeroCss))
  const iRightCss = findLine(cssLines, '.rightPanel{', Math.max(0, iPanelCss))
  const iMedia = findLine(cssLines, '@media (max-width', Math.max(0, iRightCss))

  const cssBlocks: Array<{ label: string; block: string }> = [
    { label: isZh ? 'styles.css：主题变量（浅色）' : 'styles.css: theme vars (light)', block: joinRange(cssLines, Math.max(0, iRoot), Math.max(0, iDark)) },
    { label: isZh ? 'styles.css：主题变量（暗色覆盖）' : 'styles.css: theme vars (dark)', block: joinRange(cssLines, Math.max(0, iDark), Math.max(0, iBody)) },
    { label: isZh ? 'styles.css：基础（body / 动效背景）' : 'styles.css: base (body)', block: joinRange(cssLines, Math.max(0, iBody), Math.max(0, iAppCss)) },
    { label: isZh ? 'styles.css：三栏布局（appFrame/sidebar/topbar）' : 'styles.css: layout (frame/sidebar/topbar)', block: joinRange(cssLines, Math.max(0, iAppCss), Math.max(0, iHeroCss)) },
    { label: isZh ? 'styles.css：首屏与内容（hero/page）' : 'styles.css: hero/content', block: joinRange(cssLines, Math.max(0, iHeroCss), Math.max(0, iPanelCss)) },
    { label: isZh ? 'styles.css：面板与卡片（panel/cards）' : 'styles.css: panels/cards', block: joinRange(cssLines, Math.max(0, iPanelCss), Math.max(0, iRightCss)) },
    { label: isZh ? 'styles.css：右侧面板与 toast' : 'styles.css: right panel/toast', block: joinRange(cssLines, Math.max(0, iRightCss), Math.max(0, iMedia)) },
    { label: isZh ? 'styles.css：响应式（media queries）' : 'styles.css: responsive', block: joinRange(cssLines, Math.max(0, iMedia), cssLines.length) }
  ]

  for (const b of cssBlocks) {
    state = { ...state, 'styles.css': appendBlock(state['styles.css'], b.block) }
    steps.push({ label: b.label, files: { ...state } })
  }

  const iToastJs = findLine(jsLines, 'const toast =', 0)
  const iSidebarJs = findLine(jsLines, 'function initSidebarToggle', Math.max(0, iToastJs))
  const iRightJs = findLine(jsLines, 'function initRightPanel', Math.max(0, iSidebarJs))
  const iThemeJs = findLine(jsLines, 'function initThemeToggle', Math.max(0, iRightJs))
  const iInitCalls = findLine(jsLines, 'initSidebarToggle()', Math.max(0, iThemeJs))

  const jsBlocks: Array<{ label: string; block: string }> = [
    { label: isZh ? 'main.js：工具函数（选择器/数据集）' : 'main.js: helpers', block: joinRange(jsLines, 0, Math.max(0, iToastJs)) },
    { label: isZh ? 'main.js：Toast（提示条）' : 'main.js: toast', block: joinRange(jsLines, Math.max(0, iToastJs), Math.max(0, iSidebarJs)) },
    { label: isZh ? 'main.js：侧边栏折叠开关' : 'main.js: sidebar toggle', block: joinRange(jsLines, Math.max(0, iSidebarJs), Math.max(0, iRightJs)) },
    { label: isZh ? 'main.js：右侧面板开关' : 'main.js: right panel toggle', block: joinRange(jsLines, Math.max(0, iRightJs), Math.max(0, iThemeJs)) },
    { label: isZh ? 'main.js：主题切换' : 'main.js: theme toggle', block: joinRange(jsLines, Math.max(0, iThemeJs), Math.max(0, iInitCalls)) },
    { label: isZh ? 'main.js：初始化绑定' : 'main.js: init', block: joinRange(jsLines, Math.max(0, iInitCalls), jsLines.length) }
  ]

  for (const b of jsBlocks) {
    state = { ...state, 'main.js': appendBlock(state['main.js'], b.block) }
    steps.push({ label: b.label, files: { ...state } })
  }

  return steps
}

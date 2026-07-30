type MermaidApi = {
  initialize?: (config: Record<string, unknown>) => void
  run?: (options: { nodes: Element[] }) => Promise<void> | void
}

let mermaidApi: MermaidApi | null = null
let lastTheme: 'default' | 'dark' | null = null

const getTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? 'dark' : 'default'
}

const normalizeMermaidBlocks = (container: HTMLElement) => {
  const codeBlocks = Array.from(
    container.querySelectorAll<HTMLElement>(
      'pre > code.language-mermaid, pre > code.lang-mermaid, pre > code[class*="language-mermaid"]'
    )
  )

  for (const code of codeBlocks) {
    const pre = code.parentElement
    if (!pre) continue
    if (pre.classList.contains('mermaid')) continue
    const graph = code.textContent ?? ''
    const next = document.createElement('pre')
    next.className = 'mermaid'
    next.textContent = graph
    pre.replaceWith(next)
  }
}

const collectRenderableNodes = (container: HTMLElement) => {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>('.mermaid'))
  return nodes.filter((n) => !n.getAttribute('data-processed'))
}

export const ensureMermaid = async () => {
  if (mermaidApi) return mermaidApi
  const mod: any = await import('mermaid')
  mermaidApi = (mod?.default || mod) as MermaidApi
  return mermaidApi
}

export const renderMermaidIn = async (container: HTMLElement) => {
  normalizeMermaidBlocks(container)
  const nodes = collectRenderableNodes(container)
  if (nodes.length === 0) return

  const mermaid = await ensureMermaid()
  if (!mermaid?.run) return

  const theme = getTheme()
  if (mermaid.initialize && theme !== lastTheme) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme
    })
    lastTheme = theme
  }

  await mermaid.run({ nodes })
}


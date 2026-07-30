import { watch, nextTick, type Ref } from 'vue'

export function useSearchJump(options: {
  getTarget: () => string
  clearTarget: () => void
  getFilePath: () => string
  renderedHtml: Ref<string>
  getScrollBehavior: () => ScrollBehavior
  getScrollContainer: () => HTMLElement | null
  getViewer: () => HTMLElement | null
}) {
  let timer: number | null = null
  let attempts = 0
  let lastPath = ''
  let lastTarget = ''

  const clearTimer = () => {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  const scrollElementIntoContainerCenter = (element: HTMLElement) => {
    const container = options.getScrollContainer()
    const behavior = options.getScrollBehavior()
    if (!container) {
      element.scrollIntoView({ behavior, block: 'center' })
      return
    }

    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const delta = elementRect.top - containerRect.top
    const targetTop = container.scrollTop + delta - container.clientHeight / 2 + elementRect.height / 2
    container.scrollTo({ top: Math.max(0, targetTop), behavior })
  }

  const tryJumpToTarget = (target: string): boolean => {
    const viewer = options.getViewer() || document.getElementById('markdown-viewer')
    if (!viewer) return false

    const candidates = (() => {
      const trimmed = target.trim()
      if (!trimmed) return []
      const tokens = trimmed.split(/\s+/).filter(Boolean)
      return tokens.length > 1 ? [trimmed, ...tokens] : [trimmed]
    })()

    if (candidates.length === 0) return false

    const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, null)
    let node: Node | null

    while ((node = walker.nextNode())) {
      const rawText = node.textContent || ''
      if (!rawText) continue

      const lowerText = rawText.toLowerCase()
      for (const cand of candidates) {
        const lowerCand = cand.toLowerCase()
        const index = lowerText.indexOf(lowerCand)
        if (index === -1) continue

        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, index + cand.length)

        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }

        const element = ((node as any).parentElement || (range.startContainer as any).parentElement) as HTMLElement | null
        if (element && (element as any).classList) {
          scrollElementIntoContainerCenter(element)
        }
        return true
      }
    }

    return false
  }

  const schedule = () => {
    clearTimer()
    timer = window.setTimeout(async () => {
      await nextTick()

      const target = options.getTarget().trim()
      const filePath = options.getFilePath()
      if (!target || !filePath) {
        clearTimer()
        attempts = 0
        lastPath = ''
        lastTarget = ''
        return
      }

      if (lastPath !== filePath || lastTarget !== target) {
        attempts = 0
        lastPath = filePath
        lastTarget = target
      }

      if (options.renderedHtml.value && !options.renderedHtml.value.toLowerCase().includes(target.toLowerCase())) {
        attempts += 1
        if (attempts >= 80) {
          options.clearTarget()
          clearTimer()
          attempts = 0
          return
        }
        schedule()
        return
      }

      const found = tryJumpToTarget(target)
      if (found) {
        options.clearTarget()
        clearTimer()
        attempts = 0
        return
      }

      attempts += 1
      if (attempts >= 80) {
        options.clearTarget()
        clearTimer()
        attempts = 0
        return
      }

      schedule()
    }, 120)
  }

  watch([options.getTarget, () => options.renderedHtml.value, options.getFilePath], () => {
    if (options.getTarget().trim()) schedule()
  })
}


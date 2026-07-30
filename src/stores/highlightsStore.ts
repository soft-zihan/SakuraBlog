import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BLOCK_HIGHLIGHT_SELECTOR, FORMAT_CLASS_MAP, HIGHLIGHT_SPAN_ATTR } from '../utils/highlightFormats'

type InlineAnchor = {
  quote: string
  prefix: string
  suffix: string
  occurrence: number
}

export type HighlightRecord =
  | {
      id: string
      v: 1
      type: 'inline'
      format: string
      createdAt: number
      anchor: InlineAnchor
    }
  | {
      id: string
      v: 1
      type: 'block'
      format: 'highlight-block'
      createdAt: number
      from: number
      to: number
    }

type HighlightStateV1 = {
  v: 1
  byPath: Record<string, HighlightRecord[]>
}

const createId = () => {
  const c = (globalThis as any).crypto as any
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

const buildTextIndex = (viewer: HTMLElement) => {
  const nodes: Array<{ node: Text; start: number; end: number }> = []
  const parts: string[] = []
  const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!(node instanceof Text)) return NodeFilter.FILTER_SKIP
      if (!node.nodeValue) return NodeFilter.FILTER_SKIP
      return NodeFilter.FILTER_ACCEPT
    }
  })
  let offset = 0
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const value = node.nodeValue || ''
    const start = offset
    offset += value.length
    const end = offset
    nodes.push({ node, start, end })
    parts.push(value)
  }
  return { text: parts.join(''), nodes }
}

const findNth = (text: string, needle: string, occurrence: number) => {
  if (!needle) return -1
  let from = 0
  let hit = 0
  while (true) {
    const idx = text.indexOf(needle, from)
    if (idx < 0) return -1
    hit++
    if (hit === occurrence) return idx
    from = idx + needle.length
  }
}

const resolveInlineAnchorToOffsets = (fullText: string, anchor: InlineAnchor) => {
  const composite = `${anchor.prefix}${anchor.quote}${anchor.suffix}`
  const compositeIdx = composite ? fullText.indexOf(composite) : -1
  if (compositeIdx >= 0) {
    const start = compositeIdx + anchor.prefix.length
    const end = start + anchor.quote.length
    if (start >= 0 && end >= start) return { start, end }
  }
  const idx = findNth(fullText, anchor.quote, Math.max(1, anchor.occurrence || 1))
  if (idx < 0) return null
  return { start: idx, end: idx + anchor.quote.length }
}

const offsetsToDomRange = (
  nodes: Array<{ node: Text; start: number; end: number }>,
  start: number,
  end: number
) => {
  if (start === end) return null
  const findPoint = (pos: number) => {
    for (const item of nodes) {
      if (pos >= item.start && pos <= item.end) {
        return { node: item.node, offset: Math.min(item.node.length, Math.max(0, pos - item.start)) }
      }
    }
    return null
  }
  const startPoint = findPoint(start)
  const endPoint = findPoint(end)
  if (!startPoint || !endPoint) return null
  const r = document.createRange()
  r.setStart(startPoint.node, startPoint.offset)
  r.setEnd(endPoint.node, endPoint.offset)
  if (r.collapsed) return null
  return r
}

const unwrapHighlights = (viewer: HTMLElement) => {
  for (const el of Array.from(viewer.querySelectorAll(`span[${HIGHLIGHT_SPAN_ATTR}]`))) {
    const parent = el.parentNode
    if (!parent) continue
    while (el.firstChild) parent.insertBefore(el.firstChild, el)
    parent.removeChild(el)
  }
  for (const el of Array.from(viewer.querySelectorAll(`.${FORMAT_CLASS_MAP['highlight-block']}`))) {
    el.classList.remove(FORMAT_CLASS_MAP['highlight-block'])
  }
}

const applyInlineFormatToRange = (range: Range, viewer: HTMLElement, className: string) => {
  const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!(node instanceof Text)) return NodeFilter.FILTER_SKIP
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    }
  })

  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)

  nodes.forEach((node) => {
    let start = 0
    let end = node.nodeValue?.length || 0
    if (node === range.startContainer) start = range.startOffset
    if (node === range.endContainer) end = range.endOffset
    if (start === end) return

    let target = node
    if (start > 0) target = target.splitText(start)
    if (end - start < target.length) target.splitText(end - start)

    const span = document.createElement('span')
    span.className = className || ''
    span.setAttribute(HIGHLIGHT_SPAN_ATTR, '1')
    target.parentNode?.insertBefore(span, target)
    span.appendChild(target)
  })
}

export const useHighlightsStore = defineStore(
  'highlights',
  () => {
    const state = ref<HighlightStateV1>({ v: 1, byPath: {} })

    const getByPath = (path: string) => state.value.byPath[path] || []

    const addInline = (path: string, format: string, anchor: InlineAnchor) => {
      if (!path) return
      if (!anchor.quote) return
      const list = state.value.byPath[path] || []
      const dedupKey = `inline|${format}|${anchor.prefix}|${anchor.quote}|${anchor.suffix}|${anchor.occurrence}`
      const exists = list.some((h) => {
        if (h.type !== 'inline') return false
        const a = h.anchor
        const k = `inline|${h.format}|${a.prefix}|${a.quote}|${a.suffix}|${a.occurrence}`
        return k === dedupKey
      })
      if (exists) return
      const next: HighlightRecord = {
        id: createId(),
        v: 1,
        type: 'inline',
        format,
        createdAt: Date.now(),
        anchor
      }
      state.value.byPath[path] = [...list, next]
    }

    const addBlock = (path: string, from: number, to: number) => {
      if (!path) return
      const start = Math.min(from, to)
      const end = Math.max(from, to)
      const list = state.value.byPath[path] || []
      const dedupKey = `block|${start}|${end}`
      const exists = list.some((h) => h.type === 'block' && `block|${h.from}|${h.to}` === dedupKey)
      if (exists) return
      const next: HighlightRecord = {
        id: createId(),
        v: 1,
        type: 'block',
        format: 'highlight-block',
        createdAt: Date.now(),
        from: start,
        to: end
      }
      state.value.byPath[path] = [...list, next]
    }

    const clearForPath = (path: string) => {
      if (!path) return
      if (!state.value.byPath[path]) return
      const next = { ...state.value.byPath }
      delete next[path]
      state.value.byPath = next
    }

    const applyToViewer = (path: string, viewer: HTMLElement) => {
      if (!path) return
      const highlights = getByPath(path)
      if (!highlights.length) return

      unwrapHighlights(viewer)

      const indexed = buildTextIndex(viewer)
      const blocks = Array.from(viewer.querySelectorAll(BLOCK_HIGHLIGHT_SELECTOR)) as HTMLElement[]

      for (const h of highlights) {
        if (h.type === 'block') {
          for (let i = h.from; i <= h.to; i++) {
            const el = blocks[i]
            if (el) el.classList.add(FORMAT_CLASS_MAP['highlight-block'])
          }
          continue
        }

        const cls = FORMAT_CLASS_MAP[h.format] || ''
        if (!cls) continue
        const offsets = resolveInlineAnchorToOffsets(indexed.text, h.anchor)
        if (!offsets) continue
        const r = offsetsToDomRange(indexed.nodes, offsets.start, offsets.end)
        if (!r) continue
        applyInlineFormatToRange(r, viewer, cls)
      }
    }

    return {
      state,
      getByPath,
      addInline,
      addBlock,
      clearForPath,
      applyToViewer
    }
  },
  {
    persist: {
      pick: ['state']
    }
  }
)

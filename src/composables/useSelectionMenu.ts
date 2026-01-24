import { ref, type Ref } from 'vue'
import { useToast } from './useToast'

export interface SelectionMenuState {
  show: boolean
  x: number
  y: number
  locked: boolean
}

// 状态 (State)
const selectionMenu = ref<SelectionMenuState>({ show: false, x: 0, y: 0, locked: false })
const lastSelectionRange = ref<Range | null>(null)
let activeViewerRef: Ref<HTMLElement | null> | null = null
let activeShowToast: ((msg: string) => void) | null = null

const getViewerElement = () => activeViewerRef?.value || null

// 格式化类型映射
const formatClassMap: Record<string, string> = {
  'highlight-yellow': 'bg-yellow-200 dark:bg-yellow-800/60 rounded px-0.5 transition-colors shadow-sm',
  'highlight-green': 'bg-green-200 dark:bg-green-800/60 rounded px-0.5 transition-colors shadow-sm',
  'highlight-blue': 'bg-blue-200 dark:bg-blue-800/60 rounded px-0.5 transition-colors shadow-sm',
  'highlight-pink': 'bg-pink-200 dark:bg-pink-800/60 rounded px-0.5 transition-colors shadow-sm',
  'underline-wavy': 'underline decoration-wavy decoration-sakura-500 underline-offset-4',
  'underline-double': 'underline decoration-double decoration-blue-500 underline-offset-4',
  'highlight-block': 'sakura-block-highlight'
}

/**
 * 获取 viewer 中的选区
 */
const getSelectionRangeInViewer = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  const viewer = getViewerElement()
  if (!viewer || !viewer.contains(range.startContainer) || !viewer.contains(range.endContainer)) return null
  return { range, viewer }
}

/**
 * 处理选择事件
 */
const handleSelection = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    if (!selectionMenu.value.locked) selectionMenu.value.show = false
    return
  }

  const range = (selection.isCollapsed && selectionMenu.value.locked && lastSelectionRange.value)
    ? lastSelectionRange.value
    : selection.getRangeAt(0)
  if (!range || range.collapsed) {
    if (!selectionMenu.value.locked) selectionMenu.value.show = false
    return
  }
  const viewer = getViewerElement()
  if (!viewer || !viewer.contains(range.startContainer) || !viewer.contains(range.endContainer)) {
    selectionMenu.value.show = false
    return
  }

  lastSelectionRange.value = range.cloneRange()

  const rect = (() => {
    const r = range.getBoundingClientRect()
    if (r && (r.width || r.height)) return r
    const rects = range.getClientRects()
    return rects.length > 0 ? rects[0] : null
  })()

  if (!rect) {
    selectionMenu.value.show = false
    return
  }

  selectionMenu.value = {
    show: true,
    x: rect.left + rect.width / 2,
    y: rect.top - 10,
    locked: true
  }
}

/**
 * 处理选择右键菜单
 */
const handleSelectionContextMenu = (e: MouseEvent) => {
  const selection = window.getSelection()
  let range: Range | null = null

  // 优先使用当前选区，如果没有则尝试使用最后保存的选区
  if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
    range = selection.getRangeAt(0)
    lastSelectionRange.value = range.cloneRange()
  } else if (lastSelectionRange.value) {
    range = lastSelectionRange.value
  }

  if (!range || range.collapsed) {
    selectionMenu.value.show = false
    return
  }

  const viewer = getViewerElement()
  if (!viewer || !viewer.contains(range.startContainer) || !viewer.contains(range.endContainer)) {
    selectionMenu.value.show = false
    return
  }

  e.preventDefault()
  selectionMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    locked: true
  }
}

/**
 * 处理选择变化
 */
const handleSelectionChange = () => {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) {
    // 无选区时隐藏菜单
    selectionMenu.value.show = false
    selectionMenu.value.locked = false
    return
  }
  const range = sel.getRangeAt(0)
  const viewer = getViewerElement()
  if (!viewer || !viewer.contains(range.startContainer) || !viewer.contains(range.endContainer)) {
    // 选区不在 viewer 中时隐藏菜单
    selectionMenu.value.show = false
    selectionMenu.value.locked = false
    return
  }
  // 选区收缩（用户取消选择）时隐藏菜单
  if (sel.isCollapsed) {
    selectionMenu.value.show = false
    selectionMenu.value.locked = false
    return
  }
  lastSelectionRange.value = range.cloneRange()
  handleSelection()
}

/**
 * 应用格式
 */
const applyFormat = (type: string, errorMsg: string) => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const info = getSelectionRangeInViewer()
  if (!info) return
  const { range, viewer } = info

  try {
    const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
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
      span.className = formatClassMap[type] || ''
      target.parentNode?.insertBefore(span, target)
      span.appendChild(target)
    })

    selection.removeAllRanges()
    selectionMenu.value.show = false
    selectionMenu.value.locked = false
  } catch (e) {
    const toast = activeShowToast || useToast().showToast
    toast(errorMsg)
  }
}

/**
 * 隐藏选择菜单
 */
const hideSelectionMenu = () => {
  selectionMenu.value.show = false
  selectionMenu.value.locked = false
}

/**
 * 锁定选择菜单
 */
const lockSelectionMenu = () => {
  selectionMenu.value.locked = true
}

/**
 * 文本选择菜单 composable
 */
export function useSelectionMenu(viewerRef?: Ref<HTMLElement | null>, showToast?: (msg: string) => void) {
  if (viewerRef) activeViewerRef = viewerRef
  if (showToast) activeShowToast = showToast
  return {
    selectionMenu,
    lastSelectionRange,
    handleSelection,
    handleSelectionContextMenu,
    handleSelectionChange,
    applyFormat,
    hideSelectionMenu,
    lockSelectionMenu
  }
}

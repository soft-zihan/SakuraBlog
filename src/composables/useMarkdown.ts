import { ref, computed, nextTick } from 'vue'
import { marked } from 'marked'
import type { FileNode, TocItem } from '../types'

export function useMarkdown() {
  const renderedHtml = ref('')
  const toc = ref<TocItem[]>([])
  const activeHeaderId = ref<string>('')
  let headingIdCount = new Map<string, number>()

  const normalizeHeadingText = (input: string) => {
    return input
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;|&#\d+;/gi, ' ')
      .replace(/[`*_]+/g, '')
  }

  const slugifyHeading = (input: string) => {
    const text = normalizeHeadingText(input).toLowerCase().trim()
    const slug = text
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'section'
  }

  const nextUniqueHeadingId = (raw: string) => {
    const base = slugifyHeading(raw)
    const current = headingIdCount.get(base) ?? 0
    const next = current + 1
    headingIdCount.set(base, next)
    return next === 1 ? base : `${base}-${next}`
  }
  
  // Setup marked renderer
  const setupMarkedRenderer = () => {
    const renderer = new marked.Renderer()
    renderer.heading = function(text, level, raw) {
      const id = nextUniqueHeadingId(String(raw ?? text))
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    marked.use({ renderer })
  }
  
  // Render markdown content
  const renderMarkdown = async (file: FileNode | null): Promise<string> => {
    if (!file?.content) {
      renderedHtml.value = ''
      return ''
    }
    
    if (file.isSource) return file.content

    let rawContent = file.content

    // Image Path Resolution
    if (file.path) {
      const parentDirParts = file.path.split('/')
      parentDirParts.pop()
      const parentDir = parentDirParts.join('/')
      const serverPrefix = 'notes/'
      
      const resolvePath = (relPath: string) => {
        if (relPath.startsWith('http') || relPath.startsWith('/') || relPath.startsWith('data:')) return relPath
        
        const parts = relPath.split('/')
        const parentParts = parentDir.split('/').filter(p => p)
        
        for (const part of parts) {
          if (part === '.') continue
          if (part === '..') {
            if (parentParts.length > 0) parentParts.pop()
          } else {
            parentParts.push(part)
          }
        }
        return `${serverPrefix}${parentParts.join('/')}`
      }

      rawContent = rawContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, relPath) => {
        return `![${alt}](${resolvePath(relPath)})`
      })

      rawContent = rawContent.replace(/src="([^"]+)"/g, (match, src) => {
        return `src="${resolvePath(src)}"`
      })
    }

    try {
      headingIdCount = new Map<string, number>()
      renderedHtml.value = await marked.parse(rawContent)
      return renderedHtml.value
    } catch (e) {
      console.error("Marked render error:", e)
      renderedHtml.value = `<div class="text-red-500 font-bold">Error rendering Markdown.</div><pre>${rawContent}</pre>`
      return renderedHtml.value
    }
  }
  
  // Generate TOC from content
  const generateToc = (content: string | undefined, isSource: boolean) => {
    if (!content || isSource) {
      toc.value = []
      return
    }
    
    const headers: TocItem[] = []
    const localCount = new Map<string, number>()
    const lines = content.split(/\r?\n/)
    let inCodeBlock = false
    
    lines.forEach(line => {
      if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock
      if (inCodeBlock) return
      
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const text = match[2].trim()
        const base = slugifyHeading(text)
        const current = localCount.get(base) ?? 0
        const next = current + 1
        localCount.set(base, next)
        const id = next === 1 ? base : `${base}-${next}`
        headers.push({ id, text: normalizeHeadingText(text).trim(), level: match[1].length })
      }
    })
    
    toc.value = headers
  }
  
  // Update active header on scroll
  const updateActiveHeader = (containerEl: HTMLElement | null) => {
    if (!containerEl) return
    const scrollPosition = containerEl.scrollTop
    
    let active = ''
    for (const item of toc.value) {
      const el = document.getElementById(item.id)
      if (el) {
        if (el.offsetTop - containerEl.offsetTop - 150 <= scrollPosition) {
          active = item.id
        }
      }
    }
    if (active) activeHeaderId.value = active
  }
  
  // Scroll to header
  const scrollToHeader = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeHeaderId.value = id
    }
  }
  
  // Active indicator position
  const activeIndicatorTop = computed(() => {
    if (!activeHeaderId.value) return 0
    const idx = toc.value.findIndex(t => t.id === activeHeaderId.value)
    return idx * 28
  })
  
  return {
    renderedHtml,
    toc,
    activeHeaderId,
    activeIndicatorTop,
    setupMarkedRenderer,
    renderMarkdown,
    generateToc,
    updateActiveHeader,
    scrollToHeader
  }
}

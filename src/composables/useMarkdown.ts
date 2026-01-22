import { ref, computed, nextTick } from 'vue'
import { marked } from 'marked'
import type { FileNode, TocItem } from '../types'

export function useMarkdown() {
  const renderedHtml = ref('')
  const toc = ref<TocItem[]>([])
  const activeHeaderId = ref<string>('')
  
  // Setup marked renderer
  const setupMarkedRenderer = () => {
    const renderer = new marked.Renderer()
    renderer.heading = function(text, level) {
      const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
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
    const lines = content.split(/\r?\n/)
    let inCodeBlock = false
    
    lines.forEach(line => {
      if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock
      if (inCodeBlock) return
      
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const text = match[2].trim()
        const id = text.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
        headers.push({ id, text, level: match[1].length })
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

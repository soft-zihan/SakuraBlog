import { ref, computed, nextTick, watch, onUnmounted, type Ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import type { FileNode, TocItem } from '../types'
import { stripMetaComment } from './useArticleMeta'
import { isSupportedInternalLink } from './useContentClick'
import { sanitizeHtml } from '../utils/sanitize'

/**
 * 内容渲染 composable
 * 负责 Markdown 渲染、TOC 生成、语法高亮等
 */
export function useContentRenderer(currentFile: Ref<FileNode | null>, isRawMode: Ref<boolean>, scrollContainer?: Ref<HTMLElement | null>) {
  const renderedHtml = ref('')
  const toc = ref<TocItem[]>([])
  const activeHeaderId = ref<string>('')
  let boundScrollContainer: HTMLElement | null = null
  const renderCache = new Map<string, { html: string, toc: TocItem[] }>()
  const renderCacheKeys: string[] = []
  let isRendering = false
  let rerenderRequested = false
  let headingIdCount = new Map<string, number>()
  // Optimization: cache header positions
  let headerPositionsCache: Map<string, number> | null = null
  let isScrollingToHeader = false

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

  const splitPathSuffix = (input: string) => {
    const trimmed = input.trim()
    const hashIndex = trimmed.indexOf('#')
    const queryIndex = trimmed.indexOf('?')
    const cutIndex = [hashIndex, queryIndex].filter(i => i >= 0).sort((a, b) => a - b)[0]
    if (cutIndex === undefined) return { base: trimmed, suffix: '' }
    return { base: trimmed.slice(0, cutIndex), suffix: trimmed.slice(cutIndex) }
  }

  const isPdfPath = (href?: string | null) => {
    if (!href) return false
    const { base } = splitPathSuffix(href)
    return base.toLowerCase().endsWith('.pdf')
  }

  const resolveContentPath = (relPath: string) => {
    const raw = relPath.trim()
    if (!raw) return relPath

    const { base, suffix } = splitPathSuffix(raw)

    // 保留原始路径用于特殊协议
    if (base.startsWith('http') || base.startsWith('//') || base.startsWith('data:') || base.startsWith('blob:')) return relPath

    // 处理 GitHub raw URL (已经是完整URL的情况)
    if (base.includes('githubusercontent.com') || base.includes('github.com')) return relPath

    if (!currentFile.value?.path) return relPath

    const parentDirParts = currentFile.value.path.split('/')
    parentDirParts.pop() // remove filename
    const parentDir = parentDirParts.join('/')
    // 使用绝对路径前缀确保移动端兼容性
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    // 对于 GitHub Pages，使用完整的绝对路径
    const isRelativeBase = baseUrl === './' || baseUrl === '.'
    const normalizedBase = isRelativeBase ? './' : (baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
    const baseHref = new URL(normalizedBase, window.location.href).href
    const serverPrefix = `${baseHref}notes/`

    // 移除开头的 ./ 但保留 ../
    let cleaned = base.replace(/^\.\//g, '')

    // 处理绝对路径 /notes/...
    if (cleaned.startsWith('/notes/')) return `${encodeURI(`${baseHref}notes/${cleaned.replace(/^\/notes\//, '')}`)}${suffix}`
    if (cleaned.startsWith('notes/')) return `${encodeURI(`${baseHref}${cleaned}`)}${suffix}`
    // 处理其他绝对路径 /image/... 等
    if (cleaned.startsWith('/')) return `${encodeURI(`${baseHref}${cleaned.replace(/^\/+/, '')}`)}${suffix}`

    // 处理相对路径 (包括 ../ 开头的)
    const parts = cleaned.split('/')
    const parentParts = parentDir.split('/').filter(p => p)

    for (const part of parts) {
      if (part === '.') continue
      if (part === '..') {
        if (parentParts.length > 0) parentParts.pop()
      } else {
        parentParts.push(part)
      }
    }
    return `${encodeURI(`${serverPrefix}${parentParts.join('/')}`)}${suffix}`
  }

  const renderPdfEmbed = (href: string, label?: string, title?: string) => {
    const display = (label || '').trim() || 'PDF'
    const iframeTitle = (title || display || 'PDF').replace(/"/g, '&quot;')
    const iframeSrc = href.includes('#')
      ? (href.includes('view=') ? href : `${href}&view=FitH`)
      : `${href}#view=FitH`

    return `
<div class="pdf-embed-wrapper">
  <div class="pdf-embed-toolbar">
    <span class="pdf-embed-title">📄 ${display}</span>
    <span class="pdf-embed-actions">
      <a href="${href}" target="_blank" rel="noopener noreferrer">打开</a>
      <a href="${href}" download>下载</a>
    </span>
  </div>
  <iframe class="pdf-embed" src="${iframeSrc}" title="${iframeTitle}" loading="lazy"></iframe>
</div>
    `.trim()
  }

  // Temp storage for TOC items during rendering
  let tempToc: TocItem[] = []

  /**
   * 配置 marked 渲染器
   */
  const setupMarkedRenderer = () => {
    const renderer = new marked.Renderer()
    renderer.heading = function(text, level, raw) {
      const id = nextUniqueHeadingId(String(raw ?? text))
      // Collect TOC item directly from renderer to ensure consistency
      tempToc.push({
        id,
        text: normalizeHeadingText(text).trim(),
        level
      })
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    renderer.code = function(code, language) {
      const lang = (language && hljs.getLanguage(language)) ? language : 'plaintext'
      const highlighted = hljs.highlight(code, { language: lang }).value
      return `<pre class="hljs"><code class="hljs language-${lang}">${highlighted}</code></pre>`
    }
    renderer.image = function(href, title, text) {
      if (href && isPdfPath(href)) {
        const resolved = resolveContentPath(href)
        return renderPdfEmbed(resolved, text, title || text)
      }
      const titleAttr = title ? ` title="${title}"` : ''
      const safeHref = href ? resolveContentPath(href) : ''
      return `<img src="${safeHref}" alt="${text}"${titleAttr}>`
    }
    // 自定义链接渲染：为内部链接添加 data-internal 属性，防止浏览器自动跳转
    renderer.link = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : ''
      if (href && isPdfPath(href)) {
        const resolved = resolveContentPath(href)
        return renderPdfEmbed(resolved, text, title || text)
      }
      if (isSupportedInternalLink(href)) {
        // 内部链接：使用 data-href 存储原始路径，href 设为 javascript:void(0) 防止跳转
        return `<a href="javascript:void(0)" data-internal-href="${href}"${titleAttr}>${text}</a>`
      }
      // 外部链接：正常渲染，新窗口打开
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
    }
    marked.use({ renderer })
  }

  /**
   * 更新渲染内容
   */
  const updateRenderedContent = async () => {
    if (isRendering) {
      rerenderRequested = true
      return
    }

    if (!currentFile.value?.content) {
      if (currentFile.value?.path && isPdfPath(currentFile.value.path)) {
        const href = resolveContentPath(`notes/${currentFile.value.path}`)
        renderedHtml.value = renderPdfEmbed(href, currentFile.value.name, currentFile.value.name)
        return
      }
      renderedHtml.value = ''
      return
    }

    // If it's source or raw mode, we don't render md
    if (currentFile.value.isSource || isRawMode.value) return

    const cacheKey = `${currentFile.value.path}|${currentFile.value.lastModified || ''}|${currentFile.value.content.length}|toc-v2`
    const cached = renderCache.get(cacheKey)
    if (cached !== undefined) {
      renderedHtml.value = cached.html
      toc.value = cached.toc
      // Force position cache invalidation
      headerPositionsCache = null
      nextTick(() => {
        updateActiveHeader()
      })
      return
    }

    let rawContent = stripMetaComment(currentFile.value.content)

    // Image Path Resolution
    if (currentFile.value.path) {
      const splitImageToken = (raw: string) => {
        let cleaned = raw.trim()
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
          cleaned = cleaned.slice(1, -1)
        }
        const [pathPart, ...rest] = cleaned.split(/\s+/)
        return { path: pathPart, tail: rest.join(' ') }
      }

      rawContent = rawContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, raw) => {
        const { path, tail } = splitImageToken(raw)
        const resolved = resolveContentPath(path)
        const finalToken = tail ? `${resolved} ${tail}` : resolved
        return `![${alt}](${finalToken})`
      })

      rawContent = rawContent.replace(/src="([^"]+)"/g, (match, src) => {
        const { path, tail } = splitImageToken(src)
        const resolved = resolveContentPath(path)
        const finalToken = tail ? `${resolved} ${tail}` : resolved
        return `src="${finalToken}"`
      })
    }

    isRendering = true
    rerenderRequested = false
    try {
      headingIdCount = new Map<string, number>()
      tempToc = [] // Reset temp TOC
      const parsed = await marked.parse(rawContent)
      const sanitized = sanitizeHtml(parsed)
      const finalHtml = sanitized || parsed
      renderedHtml.value = finalHtml
      
      // Update TOC from collected items
      toc.value = [...tempToc]
      
      renderCache.set(cacheKey, { html: finalHtml, toc: [...tempToc] })
      renderCacheKeys.push(cacheKey)
      if (renderCacheKeys.length > 25) {
        const keyToDelete = renderCacheKeys.shift()
        if (keyToDelete) renderCache.delete(keyToDelete)
      }
      
      // Force position cache invalidation
      headerPositionsCache = null
      
      // Trigger active header update
      nextTick(() => {
        updateActiveHeader()
      })
    } catch (e) {
      console.error("Marked render error:", e)
      const errorHtml = `<div class="text-red-500 font-bold">Error rendering Markdown. Please check console.</div><pre>${rawContent}</pre>`
      const sanitizedError = sanitizeHtml(errorHtml)
      renderedHtml.value = sanitizedError || errorHtml
      toc.value = []
    } finally {
      isRendering = false
      if (rerenderRequested) updateRenderedContent()
    }
  }

  /**
   * 生成目录 - Deprecated, now handled during rendering
   */
  const generateToc = () => {
    // Legacy function kept for interface compatibility, but logic moved to renderer
    // If needed we can trigger a re-render or just do nothing as updateRenderedContent handles it
  }

  /**
   * Update active header with optimization
   * Uses throttled scroll handling and cached positions
   */
  const updateActiveHeader = () => {
    // Skip update if we are auto-scrolling to avoid flickering
    if (isScrollingToHeader) return

    const container = scrollContainer?.value || null
    if (!container) return
    const scrollPosition = container.scrollTop
    
    // Invalidate position cache if null
    if (!headerPositionsCache) {
      headerPositionsCache = new Map()
      const containerRect = container.getBoundingClientRect()
      // Relative offset base
      const baseTop = containerRect.top - container.scrollTop
      
      for (const item of toc.value) {
        const el = document.getElementById(item.id)
        if (el) {
          const elRect = el.getBoundingClientRect()
          // Store relative top position to the container content area
          headerPositionsCache.set(item.id, elRect.top - baseTop)
        }
      }
    }

    const offset = 120
    let active = ''
    
    // Efficient lookup using cached positions
    for (const item of toc.value) {
      const top = headerPositionsCache.get(item.id)
      if (top !== undefined) {
        if (top <= scrollPosition + offset) {
          active = item.id
        } else {
          // Since TOC is ordered, we can break early if we passed the scroll point
          // Assuming document order matches TOC order (mostly true)
          // break 
        }
      }
    }
    
    if (active && active !== activeHeaderId.value) {
      activeHeaderId.value = active
    }
  }

  /**
   * 滚动到标题
   */
  const scrollToHeader = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      // Set flag to prevent scroll spy from overwriting active state during animation
      isScrollingToHeader = true
      activeHeaderId.value = id
      
      const container = scrollContainer?.value || null
      if (container) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      
      // Reset flag after animation (approximate duration)
      // Smooth scroll duration is browser dependent, 800ms is a safe bet
      setTimeout(() => {
        isScrollingToHeader = false
        // One final check to correct any drift
        updateActiveHeader()
      }, 800)
    }
  }

  /**
   * 激活指示器位置
   */
  const activeIndicatorTop = computed(() => {
    if (!activeHeaderId.value) return 0
    const idx = toc.value.findIndex(t => t.id === activeHeaderId.value)
    return idx * 28
  })

  if (scrollContainer) {
    watch(scrollContainer, (el) => {
      if (boundScrollContainer && boundScrollContainer !== el) {
        boundScrollContainer.removeEventListener('scroll', updateActiveHeader)
      }
      if (el && boundScrollContainer !== el) {
        el.addEventListener('scroll', updateActiveHeader)
      }
      boundScrollContainer = el
    }, { immediate: true })
  }

  onUnmounted(() => {
    if (boundScrollContainer) {
      boundScrollContainer.removeEventListener('scroll', updateActiveHeader)
    }
  })

  return {
    renderedHtml,
    toc,
    activeHeaderId,
    activeIndicatorTop,
    setupMarkedRenderer,
    updateRenderedContent,
    generateToc,
    updateActiveHeader,
    scrollToHeader
  }
}

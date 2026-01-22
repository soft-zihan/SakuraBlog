import { ref, computed, nextTick, type Ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import type { FileNode, TocItem } from '../types'
import { stripMetaComment } from './useArticleMeta'
import { isSupportedInternalLink } from './useContentClick'

/**
 * 内容渲染 composable
 * 负责 Markdown 渲染、TOC 生成、语法高亮等
 */
export function useContentRenderer(currentFile: Ref<FileNode | null>, isRawMode: Ref<boolean>) {
  const renderedHtml = ref('')
  const toc = ref<TocItem[]>([])
  const activeHeaderId = ref<string>('')

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

  /**
   * 配置 marked 渲染器
   */
  const setupMarkedRenderer = () => {
    const renderer = new marked.Renderer()
    renderer.heading = function(text, level) {
      const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
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

    try {
      renderedHtml.value = await marked.parse(rawContent)
    } catch (e) {
      console.error("Marked render error:", e)
      renderedHtml.value = `<div class="text-red-500 font-bold">Error rendering Markdown. Please check console.</div><pre>${rawContent}</pre>`
    }
  }

  /**
   * 生成目录
   */
  const generateToc = () => {
    if (!currentFile.value?.content || currentFile.value.isSource) {
      toc.value = []
      return
    }
    const headers: TocItem[] = []
    const lines = currentFile.value.content.split(/\r?\n/)
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

    nextTick(() => {
      const el = document.getElementById('scroll-container')
      if (el) {
        el.removeEventListener('scroll', updateActiveHeader)
        el.addEventListener('scroll', updateActiveHeader)
      }
    })
  }

  /**
   * 更新激活的标题
   */
  const updateActiveHeader = () => {
    const container = document.getElementById('scroll-container')
    if (!container) return
    const scrollPosition = container.scrollTop

    let active = ''
    for (const item of toc.value) {
      const el = document.getElementById(item.id)
      if (el) {
        if (el.offsetTop - container.offsetTop - 150 <= scrollPosition) {
          active = item.id
        }
      }
    }
    if (active) activeHeaderId.value = active
  }

  /**
   * 滚动到标题
   */
  const scrollToHeader = (id: string) => {
    const el = document.getElementById(id)
    const container = document.getElementById('scroll-container')
    if (el && container) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeHeaderId.value = id
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

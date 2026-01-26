import { computed, type Ref } from 'vue'
import type { FileNode } from '../types'

/**
 * 贡献者接口
 */
export interface Contributor {
  name: string
  url?: string
}

/**
 * 文章元数据接口
 */
export interface ArticleMeta {
  tags: string[]
  author: string
  authorUrl: string
  backgroundColor?: string
}

/**
 * 从文章内容中提取 meta（支持注释与 frontmatter）
 */
export function extractMetaFromContent(content: string): ArticleMeta {
  const meta: ArticleMeta = { tags: [], author: '', authorUrl: '' }
  if (!content) return meta

  // 优先从顶部注释提取
  const commentMatch = content.match(/^\s*<!--([\s\S]*?)-->/)
  if (commentMatch) {
    const block = commentMatch[1]
    const tagsMatch = block.match(/tags?\s*:\s*([^\n]+)/i)
    if (tagsMatch) {
      meta.tags = tagsMatch[1]
        .split(/[,，]/)
        .map(t => t.trim().replace(/['"]/g, ''))
        .filter(Boolean)
    }
    const authorMatch = block.match(/author\s*:\s*([^\n]+)/i)
    if (authorMatch) meta.author = authorMatch[1].trim()
    const authorUrlMatch = block.match(/authorUrl\s*:\s*([^\n]+)/i)
    if (authorUrlMatch) meta.authorUrl = authorUrlMatch[1].trim()
    const bgMatch = block.match(/(?:bg|background|bgColor|backgroundColor)\s*:\s*([^\n]+)/i)
    if (bgMatch) meta.backgroundColor = bgMatch[1].trim().replace(/['"]/g, '')
  }

  // 兼容旧 frontmatter
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
  if (fmMatch) {
    const frontmatter = fmMatch[1]
    const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/)
    if (tagsMatch) {
      const fmTags = tagsMatch[1]
        .split(/[,，]/)
        .map(t => t.trim().replace(/['"]/g, ''))
        .filter(t => t)
      meta.tags = Array.from(new Set([...meta.tags, ...fmTags]))
    }
    const singleTagMatch = frontmatter.match(/tags:\s*(\S+)/)
    if (singleTagMatch) {
      meta.tags = Array.from(new Set([...meta.tags, singleTagMatch[1].trim()]))
    }
    const authorMatch = frontmatter.match(/author:\s*(\S+)/)
    if (authorMatch && !meta.author) meta.author = authorMatch[1].trim()
    const authorUrlMatch = frontmatter.match(/authorUrl:\s*(\S+)/)
    if (authorUrlMatch && !meta.authorUrl) meta.authorUrl = authorUrlMatch[1].trim()
    const bgMatch = frontmatter.match(/(?:bg|background|bgColor|backgroundColor):\s*([^\n]+)/i)
    if (bgMatch && !meta.backgroundColor) meta.backgroundColor = bgMatch[1].trim().replace(/['"]/g, '')
  }

  return meta
}

/**
 * 移除内容中的 meta 注释
 */
export function stripMetaComment(content: string): string {
  return content.replace(/^\s*<!--[\s\S]*?-->\s*/, '')
}

const stripFrontmatter = (content: string): string => {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
}

const normalizeContentForStats = (content: string): string => {
  return stripFrontmatter(stripMetaComment(content || ''))
}

const countWords = (content: string): number => {
  if (!content) return 0
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

const countLines = (content: string): number => {
  if (!content) return 0
  return content.split('\n').length
}

/**
 * 从文章内容中提取 tags
 */
export function extractTagsFromContent(content: string): string[] {
  const meta = extractMetaFromContent(content)
  return meta.tags || []
}

/**
 * 从文件中提取 tags（优先使用 contentSnippet，回退到 content）
 */
export function extractTagsFromFile(file: FileNode): string[] {
  const text = file.contentSnippet || file.content || ''
  return extractTagsFromContent(text)
}

/**
 * 从文章内容中提取贡献者列表
 */
export function extractContributorsFromContent(content: string): Contributor[] {
  const contributors: Contributor[] = []
  if (!content) return contributors

  const commentMatch = content.match(/^\s*<!--([\s\S]*?)-->/)
  if (commentMatch) {
    const block = commentMatch[1]
    const contributorsMatch = block.match(/contributors?\s*:\s*([^\n]+)/i)
    if (contributorsMatch) {
      const raw = contributorsMatch[1].trim()
      // 尝试解析 JSON 格式
      if (raw.startsWith('[')) {
        try {
          const parsed = JSON.parse(raw)
          return parsed.map((c: any) => ({
            name: c.name || c,
            url: c.url || ''
          }))
        } catch {
          // ignore parse error
        }
      }
      // 简单逗号分隔格式
      return raw.split(',').map(n => ({ name: n.trim() })).filter(c => c.name)
    }
  }
  return contributors
}

/**
 * 构建包含贡献者的 meta 注释
 */
export function buildMetaCommentWithContributors(
  content: string,
  newContributor: { name: string; url: string }
): string {
  const existingMeta = extractMetaFromContent(content)
  const existingContributors = extractContributorsFromContent(content)

  // 添加新贡献者（去重）
  const contributorExists = existingContributors.some(c =>
    c.name === newContributor.name ||
    (c.url && c.url === newContributor.url)
  )

  if (!contributorExists && newContributor.name) {
    existingContributors.push(newContributor)
  }

  // 移除旧的 meta 注释
  const stripped = stripMetaComment(content)

  // 构建新的 meta 注释
  const lines: string[] = []
  if (existingMeta.tags.length) lines.push(`tags: ${existingMeta.tags.join(', ')}`)
  if (existingMeta.author) lines.push(`author: ${existingMeta.author}`)
  if (existingMeta.authorUrl) lines.push(`authorUrl: ${existingMeta.authorUrl}`)
  if (existingContributors.length) {
    const contributorsJson = JSON.stringify(existingContributors.map(c =>
      c.url ? { name: c.name, url: c.url } : { name: c.name }
    ))
    lines.push(`contributors: ${contributorsJson}`)
  }

  if (!lines.length) return stripped
  return `<!--\n${lines.join('\n')}\n-->\n\n${stripped}`
}

/**
 * 文章元数据 composable
 */
export function useArticleMeta(currentFile: Ref<FileNode | null>) {
  const currentMeta = computed(() => extractMetaFromContent(currentFile.value?.content || ''))
  const currentTags = computed(() => currentMeta.value.tags || [])
  const currentAuthorName = computed(() => currentMeta.value.author || '')
  const currentAuthorUrl = computed(() => currentMeta.value.authorUrl || '')
  const currentContributors = computed(() => {
    if (!currentFile.value?.content) return []
    return extractContributorsFromContent(currentFile.value.content)
  })
  const currentWordCount = computed(() => {
    const content = normalizeContentForStats(currentFile.value?.content || '')
    return countWords(content)
  })
  const currentLineCount = computed(() => {
    const content = normalizeContentForStats(currentFile.value?.content || '')
    return countLines(content)
  })

  return {
    currentMeta,
    currentTags,
    currentAuthorName,
    currentAuthorUrl,
    currentContributors,
    currentWordCount,
    currentLineCount
  }
}

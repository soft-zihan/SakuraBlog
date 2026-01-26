<template>
  <div class="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-green-200 dark:border-green-700 shadow-xl">
    <!-- Header -->
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🧩</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'Vue 3 Composables 组合式函数' : 'Vue 3 Composables' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '学习如何将逻辑抽离为可复用的组合式函数 — 以本站代码为例' : 'Learn to extract reusable logic as composables — using this site\'s code' }}
        </p>
      </div>
    </div>

    <!-- Why Composables -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6">
      <p class="text-sm font-bold text-green-700 dark:text-green-300 mb-2">💡 {{ isZh ? '为什么需要 Composables？' : 'Why Composables?' }}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div class="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span class="text-lg">📦</span>
          <p class="font-bold mt-1">{{ isZh ? '逻辑复用' : 'Logic Reuse' }}</p>
          <p>{{ isZh ? '一次编写，多处使用' : 'Write once, use everywhere' }}</p>
        </div>
        <div class="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span class="text-lg">🧹</span>
          <p class="font-bold mt-1">{{ isZh ? '组件简化' : 'Component Simplification' }}</p>
          <p>{{ isZh ? 'App.vue 从 1990 行减到 1150 行' : 'App.vue: 1990 → 1150 lines' }}</p>
        </div>
        <div class="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span class="text-lg">🧪</span>
          <p class="font-bold mt-1">{{ isZh ? '便于测试' : 'Testability' }}</p>
          <p>{{ isZh ? '独立单元，易于测试' : 'Independent units, easy to test' }}</p>
        </div>
      </div>
    </div>

    <!-- Sakura Notes Composables Overview -->
    <div class="mb-6">
      <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-3">
        🌸 {{ isZh ? '本站的 Composables 一览' : 'This Site\'s Composables' }}
      </h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="comp in composablesList"
          :key="comp.id"
          @click="selectedComposable = comp.id"
          class="p-3 rounded-lg border text-left transition-all"
          :class="selectedComposable === comp.id 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md' 
            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'"
        >
          <span class="text-lg">{{ comp.icon }}</span>
          <p class="font-mono text-xs font-bold text-green-600 dark:text-green-400 mt-1">{{ comp.name }}</p>
          <p class="text-[10px] text-gray-500 truncate">{{ isZh ? comp.descZh : comp.descEn }}</p>
        </button>
      </div>
    </div>

    <!-- Selected Composable Detail -->
    <div v-if="currentComposable" class="space-y-6">
      <!-- Composable Info Card -->
      <div class="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">{{ currentComposable.icon }}</span>
          <div>
            <h4 class="font-mono font-bold text-green-600 dark:text-green-400">{{ currentComposable.name }}.ts</h4>
            <p class="text-xs text-gray-500">{{ isZh ? currentComposable.descZh : currentComposable.descEn }}</p>
          </div>
          <div class="ml-auto text-right">
            <span class="text-xs text-gray-400">📍 composables/{{ currentComposable.name }}.ts</span>
          </div>
        </div>

        <!-- Structure Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Left: Structure Visualization -->
          <div class="space-y-3">
            <h5 class="text-sm font-bold text-gray-700 dark:text-gray-200">
              {{ isZh ? '📐 Composable 结构' : '📐 Composable Structure' }}
            </h5>
            
            <div class="space-y-2">
              <div 
                v-for="(section, idx) in currentComposable.sections" 
                :key="idx"
                class="p-3 rounded-lg border cursor-pointer transition-all"
                :class="activeSection === idx 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'"
                @click="activeSection = idx"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm">{{ section.icon }}</span>
                  <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ isZh ? section.titleZh : section.titleEn }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ isZh ? section.descZh : section.descEn }}</p>
              </div>
            </div>
          </div>

          <!-- Right: Code Display -->
          <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-400">{{ currentComposable.sections[activeSection]?.file || currentComposable.name + '.ts' }}</span>
              <span class="text-xs text-green-400">{{ isZh ? currentComposable.sections[activeSection]?.titleZh : currentComposable.sections[activeSection]?.titleEn }}</span>
            </div>
            <pre class="text-xs font-mono text-green-300 whitespace-pre-wrap leading-relaxed"><code>{{ currentComposable.sections[activeSection]?.code || '' }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Interactive Demo (for useSearch) -->
      <div v-if="selectedComposable === 'useSearch'" class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
        <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-3">
          🔬 {{ isZh ? '实时演示：调用 useSearch' : 'Live Demo: Calling useSearch' }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500 block mb-1">{{ isZh ? '模拟搜索查询' : 'Simulated Search Query' }}</label>
            <input 
              v-model="demoSearchQuery" 
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              :placeholder="isZh ? '输入关键词...' : 'Enter keywords...'"
            />
          </div>
          <div class="bg-gray-900 rounded-lg p-3">
            <p class="text-xs text-gray-400 mb-1">{{ isZh ? '内部状态变化' : 'Internal State Changes' }}</p>
            <pre class="text-xs font-mono text-green-300">searchQuery.value = "{{ demoSearchQuery }}"
isSearching.value = {{ demoSearchQuery ? 'true → false' : 'false' }}
searchResults.value = [{{ demoSearchQuery ? '...' : '' }}]</pre>
          </div>
        </div>
      </div>

      <!-- Comparison: Mixins vs Composables -->
      <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700">
        <h4 class="font-bold text-amber-700 dark:text-amber-300 mb-3">
          ⚖️ {{ isZh ? 'Vue 2 Mixins vs Vue 3 Composables' : 'Vue 2 Mixins vs Vue 3 Composables' }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
            <p class="font-bold text-red-600 dark:text-red-400 mb-2">❌ Mixins {{ isZh ? '问题' : 'Problems' }}</p>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• {{ isZh ? '来源不明确 (this.xxx 从哪来？)' : 'Unclear source (where does this.xxx come from?)' }}</li>
              <li>• {{ isZh ? '命名冲突 (多个 mixin 同名属性)' : 'Naming conflicts (same property name)' }}</li>
              <li>• {{ isZh ? '难以追踪依赖' : 'Hard to track dependencies' }}</li>
            </ul>
          </div>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
            <p class="font-bold text-green-600 dark:text-green-400 mb-2">✅ Composables {{ isZh ? '优势' : 'Benefits' }}</p>
            <ul class="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• {{ isZh ? '来源清晰 (const { x } = useXxx())' : 'Clear source (const { x } = useXxx())' }}</li>
              <li>• {{ isZh ? '可自定义命名，无冲突' : 'Custom naming, no conflicts' }}</li>
              <li>• {{ isZh ? 'TypeScript 完美支持' : 'Perfect TypeScript support' }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Best Practices -->
    <div class="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
      <h4 class="font-bold text-purple-700 dark:text-purple-300 mb-3">
        📝 {{ isZh ? 'Composable 最佳实践（来自本站）' : 'Composable Best Practices (From This Site)' }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <div>
            <p class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '命名以 use 开头' : 'Name starts with use' }}</p>
            <code class="text-purple-600 dark:text-purple-400">useSearch, useFile, useLightbox</code>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <div>
            <p class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '返回响应式状态' : 'Return reactive state' }}</p>
            <code class="text-purple-600 dark:text-purple-400">return { searchQuery, searchResults }</code>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <div>
            <p class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '接受参数定制行为' : 'Accept params for customization' }}</p>
            <code class="text-purple-600 dark:text-purple-400">useSearch(fetchFileContentFn)</code>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <div>
            <p class="font-bold text-gray-700 dark:text-gray-200">{{ isZh ? '封装副作用' : 'Encapsulate side effects' }}</p>
            <code class="text-purple-600 dark:text-purple-400">onMounted(() => initSearchIndex())</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

const selectedComposable = ref('useSearch')
const activeSection = ref(0)
const demoSearchQuery = ref('')

interface ComposableSection {
  icon: string
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
  file?: string
  code: string
}

interface ComposableInfo {
  id: string
  name: string
  icon: string
  descZh: string
  descEn: string
  sections: ComposableSection[]
}

const composablesList: ComposableInfo[] = [
  {
    id: 'useSearch',
    name: 'useSearch',
    icon: '🔍',
    descZh: '全文搜索功能',
    descEn: 'Full-text search',
    sections: [
      {
        icon: '📦',
        titleZh: '1. 状态定义',
        titleEn: '1. State Definition',
        descZh: '使用 ref 创建响应式状态',
        descEn: 'Create reactive state with ref',
        file: 'composables/useSearch.ts (L16-24)',
        code: `// 📍 composables/useSearch.ts
export function useSearch(fetchFileContentFn?) {
  // 响应式状态 - 搜索相关
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const showSearchModal = ref(false)
  
  // 索引相关状态
  const searchIndex = ref<MiniSearch | null>(null)
  const isFullIndexReady = ref(false)
  // ...
}`
      },
      {
        icon: '🔄',
        titleZh: '2. 生命周期集成',
        titleEn: '2. Lifecycle Integration',
        descZh: '在 onMounted 中初始化',
        descEn: 'Initialize in onMounted',
        file: 'composables/useSearch.ts (L27-45)',
        code: `// 初始化搜索索引
const initSearchIndex = async (
  fs: FileNode[], 
  lang: 'en' | 'zh' = 'zh'
) => {
  fileSystem.value = fs
  currentLang.value = lang
  
  // 创建 MiniSearch 实例
  const miniSearch = new MiniSearch({
    fields: ['name', 'content'],
    storeFields: ['name', 'path', 'content'],
    searchOptions: {
      boost: { name: 2 },  // 标题权重更高
      fuzzy: 0.2,         // 模糊搜索
      prefix: true        // 前缀匹配
    }
  })
  searchIndex.value = miniSearch
}`
      },
      {
        icon: '⚡',
        titleZh: '3. 方法封装',
        titleEn: '3. Methods',
        descZh: '搜索逻辑封装',
        descEn: 'Search logic encapsulation',
        file: 'composables/useSearch.ts (L150-180)',
        code: `// 执行搜索
const search = (query: string) => {
  searchQuery.value = query
  if (!searchIndex.value || !query.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  const results = searchIndex.value.search(query, {
    prefix: true,
    fuzzy: 0.2,
    boost: { name: 3 }
  })
  
  // 转换结果格式
  searchResults.value = results.map(r => ({
    id: r.id,
    path: r.path,
    name: r.name,
    excerpt: extractExcerpt(r.content, query),
    score: r.score
  }))
  isSearching.value = false
}`
      },
      {
        icon: '📤',
        titleZh: '4. 返回公共 API',
        titleEn: '4. Return Public API',
        descZh: '暴露给组件使用的接口',
        descEn: 'Interface exposed to components',
        file: 'composables/useSearch.ts (L250-265)',
        code: `// 返回公共 API
return {
  // 状态 (响应式)
  searchQuery,
  searchResults,
  isSearching,
  showSearchModal,
  isFullIndexReady,
  
  // 方法
  initSearchIndex,
  search,
  openSearchModal,
  closeSearchModal,
  
  // 工具
  highlightMatches
}`
      }
    ]
  },
  {
    id: 'useFile',
    name: 'useFile',
    icon: '📁',
    descZh: '文件系统操作',
    descEn: 'File system operations',
    sections: [
      {
        icon: '📦',
        titleZh: '1. 参数与状态',
        titleEn: '1. Params & State',
        descZh: '接受外部依赖作为参数',
        descEn: 'Accept external deps as params',
        file: 'composables/useFile.ts (L5-15)',
        code: `// 📍 composables/useFile.ts
export function useFile(
  fileSystem: Ref<FileNode[]>,  // 响应式文件系统
  lang: Ref<'en' | 'zh'>        // 响应式语言
) {
  // 内部状态
  const currentFile = ref<FileNode | null>(null)
  const currentFolder = ref<FileNode | null>(null)
  const expandedFolders = ref<string[]>([])
  const contentLoading = ref(false)
  // ...
}`
      },
      {
        icon: '🧮',
        titleZh: '2. 计算属性',
        titleEn: '2. Computed Properties',
        descZh: '基于语言过滤文件',
        descEn: 'Filter files by language',
        file: 'composables/useFile.ts (L17-35)',
        code: `// 根据语言获取根目录
const currentLangRoot = computed(() => {
  const root = fileSystem.value?.find(
    node => node.name === lang.value
  )
  return root ? root.children : []
})

// 过滤后的文件系统
const filteredFileSystem = computed(() => {
  return currentLangRoot.value || []
})

// 扁平化文件列表（按修改时间排序）
const filteredFlatFiles = computed(() => {
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = []
    for (const node of nodes) {
      if (node.type === NodeType.FILE) files.push(node)
      else if (node.children) 
        files = files.concat(flatten(node.children))
    }
    return files
  }
  return flatten(filteredFileSystem.value)
    .sort((a, b) => 
      new Date(b.lastModified || 0).getTime() - 
      new Date(a.lastModified || 0).getTime()
    )
})`
      },
      {
        icon: '🌐',
        titleZh: '3. 异步方法',
        titleEn: '3. Async Methods',
        descZh: '获取文件内容',
        descEn: 'Fetch file content',
        file: 'composables/useFile.ts (L70-90)',
        code: `// 获取文件内容
const fetchFileContent = async (
  file: FileNode
): Promise<string> => {
  let fetchPath = ''
  
  if (file.isSource && file.fetchPath) {
    // 源码文件特殊路径
    fetchPath = \`./\${file.fetchPath}\`
  } else {
    // 普通笔记文件
    fetchPath = \`./notes/\${file.path}\`
  }
  
  try {
    const res = await fetch(fetchPath)
    if (res.ok) return await res.text()
    return \`# Error \${res.status}\\n...\`
  } catch (e: any) {
    return \`# Error\\n\${e.message}\`
  }
}`
      }
    ]
  },
  {
    id: 'useWallpapers',
    name: 'useWallpapers',
    icon: '🖼️',
    descZh: '壁纸管理',
    descEn: 'Wallpaper management',
    sections: [
      {
        icon: '📦',
        titleZh: '状态与方法',
        titleEn: 'State & Methods',
        descZh: '壁纸切换逻辑',
        descEn: 'Wallpaper switching logic',
        file: 'composables/useWallpapers.ts',
        code: `// 📍 composables/useWallpapers.ts
export function useWallpapers() {
  const wallpapers = ref<WallpaperConfig[]>([])
  const isLoading = ref(false)
  
  // 加载壁纸配置
  const loadWallpapers = async () => {
    isLoading.value = true
    try {
      const res = await fetch('./wallpapers.json')
      wallpapers.value = await res.json()
    } finally {
      isLoading.value = false
    }
  }
  
  // 根据主题获取壁纸
  const getWallpapersByTheme = (isDark: boolean) => {
    return wallpapers.value.filter(w => 
      w.theme === (isDark ? 'dark' : 'light')
    )
  }
  
  return { wallpapers, loadWallpapers, getWallpapersByTheme }
}`
      }
    ]
  },
  {
    id: 'useLightbox',
    name: 'useLightbox',
    icon: '🔦',
    descZh: '图片灯箱',
    descEn: 'Image lightbox',
    sections: [
      {
        icon: '📦',
        titleZh: '简洁封装',
        titleEn: 'Simple Encapsulation',
        descZh: '最小化的 Composable 示例',
        descEn: 'Minimal composable example',
        file: 'composables/useLightbox.ts',
        code: `// 📍 composables/useLightbox.ts
// 最简洁的 Composable 示例
export function useLightbox() {
  const lightboxImage = ref<string | null>(null)
  
  const openLightbox = (src: string) => {
    lightboxImage.value = src
  }
  
  const closeLightbox = () => {
    lightboxImage.value = null
  }
  
  return {
    lightboxImage,
    openLightbox,
    closeLightbox
  }
}

// 使用方式 (App.vue):
// const { lightboxImage, openLightbox, closeLightbox } = useLightbox()`
      }
    ]
  },
  {
    id: 'useMarkdown',
    name: 'useMarkdown',
    icon: '📝',
    descZh: 'Markdown 渲染',
    descEn: 'Markdown rendering',
    sections: [
      {
        icon: '⚙️',
        titleZh: '配置与渲染',
        titleEn: 'Config & Render',
        descZh: '统一 Markdown 处理',
        descEn: 'Unified Markdown processing',
        file: 'composables/useMarkdown.ts',
        code: `// 📍 composables/useMarkdown.ts
import { marked } from 'marked'

export function useMarkdown() {
  const renderedHtml = ref('')

  // Setup marked renderer
  const setupMarkedRenderer = () => {
    const renderer = new marked.Renderer()
    renderer.heading = (text, level) => {
      const id = text.toLowerCase().replace(/[^\\w]+/g, '-')
      return \`<h\${level} id="\${id}">\${text}</h\${level}>\`
    }
    marked.use({ renderer })
  }
  
  // Render markdown content
  const renderMarkdown = async (file: FileNode) => {
    if (!file?.content) return ''
    renderedHtml.value = await marked.parse(file.content)
    return renderedHtml.value
  }
  
  return { renderedHtml, renderMarkdown }
}`
      }
    ]
  },
  {
    id: 'useContentClick',
    name: 'useContentClick',
    icon: '🖱️',
    descZh: '链接拦截处理',
    descEn: 'Link interception',
    sections: [
      {
        icon: '🎯',
        titleZh: '事件委托',
        titleEn: 'Event Delegation',
        descZh: '统一处理内容区点击',
        descEn: 'Unified content click handling',
        file: 'composables/useContentClick.ts',
        code: `// 📍 composables/useContentClick.ts
export function useContentClick(options: {
  onFileOpen: (file: FileNode) => void
  onExternalLink: (url: string) => void
}) {
  // 处理内容区域的点击事件
  const handleContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    
    if (!link) return
    
    const href = link.getAttribute('href')
    if (!href) return
    
    // 阻止默认行为
    e.preventDefault()
    
    // 判断链接类型
    if (href.startsWith('http')) {
      // 外部链接 - 新窗口打开
      options.onExternalLink(href)
    } else if (href.endsWith('.md')) {
      // 内部 Markdown 文件
      options.onFileOpen(findFileByPath(href))
    }
  }
  
  return { handleContentClick }
}`
      }
    ]
  },
  {
    id: 'useArticleMeta',
    name: 'useArticleMeta',
    icon: '🏷️',
    descZh: '文章元数据',
    descEn: 'Article metadata',
    sections: [
      {
        icon: '📊',
        titleZh: '元数据提取',
        titleEn: 'Metadata Extraction',
        descZh: '从 Markdown 提取标签/作者',
        descEn: 'Extract tags/author from Markdown',
        file: 'composables/useArticleMeta.ts',
        code: `// 📍 composables/useArticleMeta.ts
export function useArticleMeta() {
  // 从 Markdown 内容提取元数据
  const extractMeta = (content: string) => {
    const meta: ArticleMeta = {
      tags: [],
      author: '',
      contributors: [],
      wordCount: 0,
      readingTime: 0
    }
    
    // 提取 YAML frontmatter
    const frontmatterMatch = content.match(
      /^---\\n([\\s\\S]*?)\\n---/
    )
    if (frontmatterMatch) {
      const yaml = frontmatterMatch[1]
      // 解析 tags
      const tagsMatch = yaml.match(/tags:\\s*\\[(.*)\\]/)
      if (tagsMatch) {
        meta.tags = tagsMatch[1].split(',').map(t => t.trim())
      }
      // 解析 author
      const authorMatch = yaml.match(/author:\\s*(.*)/)
      if (authorMatch) {
        meta.author = authorMatch[1].trim()
      }
    }
    
    // 计算字数和阅读时间
    meta.wordCount = content.length
    meta.readingTime = Math.ceil(meta.wordCount / 500)
    
    return meta
  }
  
  return { extractMeta }
}`
      }
    ]
  },
  {
    id: 'useBackup',
    name: 'useBackup',
    icon: '💾',
    descZh: '数据备份',
    descEn: 'Data backup',
    sections: [
      {
        icon: '📥',
        titleZh: '导入导出',
        titleEn: 'Import/Export',
        descZh: '用户设置持久化',
        descEn: 'User settings persistence',
        file: 'composables/useBackup.ts',
        code: `// 📍 composables/useBackup.ts
export function useBackup() {
  // 导出所有用户数据
  const exportBackup = () => {
    const data = {
      settings: localStorage.getItem('app-settings'),
      favorites: localStorage.getItem('favorites'),
      highlights: localStorage.getItem('highlights'),
      timestamp: Date.now()
    }
    
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    )
    
    // 触发下载
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`sakura-backup-\${Date.now()}.json\`
    a.click()
  }
  
  // 导入备份
  const importBackup = async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (data.settings) 
      localStorage.setItem('app-settings', data.settings)
    if (data.favorites) 
      localStorage.setItem('favorites', data.favorites)
    // ...
  }
  
  return { exportBackup, importBackup }
}`
      }
    ]
  }
]

const currentComposable = computed(() => 
  composablesList.find(c => c.id === selectedComposable.value)
)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

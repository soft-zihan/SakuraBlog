<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        @keydown.esc="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="confirmClose"></div>
        
        <!-- Editor Container -->
        <div class="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <span class="text-2xl">✍️</span>
              <div>
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {{ lang === 'zh' ? '写作工作台' : 'Writing Studio' }}
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ lang === 'zh' ? 'Markdown 编辑器 · 实时预览' : 'Markdown Editor · Live Preview' }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- GitHub Token Status -->
              <div 
                class="flex items-center gap-1 px-2 py-1 rounded text-xs"
                :class="hasToken ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'"
              >
                <div class="w-2 h-2 rounded-full" :class="hasToken ? 'bg-green-500' : 'bg-yellow-500'"></div>
                {{ hasToken ? (lang === 'zh' ? 'GitHub 已连接' : 'GitHub Connected') : (lang === 'zh' ? '请在设置中配置' : 'Configure in Settings') }}
              </div>
              
              <button 
                @click="confirmClose"
                class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Title Input -->
          <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <input 
              v-model="title"
              type="text"
              :placeholder="lang === 'zh' ? '输入文章标题...' : 'Enter article title...'"
              class="w-full text-xl font-bold bg-transparent border-0 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
          </div>
          
          <!-- Editor Body -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Editor Panel -->
            <div class="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
              <!-- Toolbar -->
              <div class="flex items-center gap-1 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                <button 
                  v-for="btn in toolbarButtons" 
                  :key="btn.action"
                  @click="insertMarkdown(btn.action)"
                  class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 transition-colors"
                  :title="btn.title"
                >
                  <span v-html="btn.icon"></span>
                </button>
                
                <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                
                <!-- Image Upload -->
                <label class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 transition-colors cursor-pointer" :title="lang === 'zh' ? '上传图片' : 'Upload Image'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
                </label>
              </div>
              
              <!-- Textarea -->
              <textarea 
                ref="editorRef"
                v-model="content"
                :placeholder="lang === 'zh' ? '在这里写下你的想法...\n\n支持 Markdown 语法' : 'Write your thoughts here...\n\nMarkdown supported'"
                class="flex-1 w-full p-6 resize-none bg-transparent border-0 outline-none text-gray-800 dark:text-gray-100 font-mono text-sm leading-relaxed"
                @drop.prevent="handleDrop"
                @dragover.prevent
              ></textarea>
            </div>
            
            <!-- Preview Panel -->
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  {{ lang === 'zh' ? '预览' : 'Preview' }}
                </span>
              </div>
              <div 
                class="flex-1 p-6 overflow-y-auto prose prose-sakura dark:prose-invert max-w-none"
                v-html="previewHtml"
              ></div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ wordCount }} {{ lang === 'zh' ? '字' : 'words' }}</span>
              <span>{{ lineCount }} {{ lang === 'zh' ? '行' : 'lines' }}</span>
              <span v-if="images.length > 0">{{ images.length }} {{ lang === 'zh' ? '张图片' : 'images' }}</span>
            </div>
            
            <div class="flex items-center gap-3">
              <!-- 目录选择 -->
              <div class="relative">
                <button 
                  @click="showFolderBrowser = !showFolderBrowser"
                  class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>📁</span>
                  <span class="max-w-[200px] truncate">{{ targetFolder }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                <!-- 目录下拉列表 -->
                <div 
                  v-if="showFolderBrowser"
                  class="absolute bottom-full mb-2 left-0 w-80 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50"
                >
                  <div class="p-2 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                    {{ lang === 'zh' ? '选择或输入发布目录' : 'Select or enter publish folder' }}
                  </div>
                  
                  <!-- 新建路径输入 -->
                  <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div class="text-xs text-gray-400 mb-1">
                      {{ lang === 'zh' ? `新路径将添加到 ${getRootFolder()} 下` : `New path will be under ${getRootFolder()}` }}
                    </div>
                    <div class="flex gap-2">
                      <input 
                        v-model="customFolder"
                        type="text"
                        :placeholder="lang === 'zh' ? '子目录名 (如: 我的分类)' : 'Subfolder name (e.g. MyCategory)'"
                        class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900"
                        @keyup.enter="addCustomFolder"
                      />
                      <button 
                        @click="addCustomFolder"
                        class="px-2 py-1 text-xs bg-sakura-500 text-white rounded hover:bg-sakura-600"
                      >
                        {{ lang === 'zh' ? '添加' : 'Add' }}
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    v-for="folder in availableFolders"
                    :key="folder"
                    @click="targetFolder = folder; showFolderBrowser = false"
                    class="px-3 py-2 text-sm cursor-pointer hover:bg-sakura-50 dark:hover:bg-gray-700 transition-colors"
                    :class="targetFolder === folder ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600' : ''"
                  >
                    {{ folder }}
                  </div>
                </div>
              </div>
              
              <button 
                @click="saveDraft"
                class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '保存草稿' : 'Save Draft' }}
              </button>
              
              <button 
                @click="publish"
                :disabled="isPublishing || !title.trim() || !content.trim() || !hasToken"
                class="px-6 py-2 text-sm font-medium text-white bg-sakura-500 hover:bg-sakura-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="isPublishing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isPublishing ? (lang === 'zh' ? '发布中...' : 'Publishing...') : (lang === 'zh' ? '发布到 GitHub' : 'Publish to GitHub') }}
              </button>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div v-if="isPublishing" class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              class="h-full bg-sakura-500 transition-all duration-300"
              :style="{ width: publishProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { marked } from 'marked'
import { useGitHubPublish } from '../composables/useGitHubPublish'

const props = defineProps<{
  show: boolean
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'published', path: string): void
}>()

const { isPublishing, publishProgress, getToken, uploadFile, uploadImage } = useGitHubPublish()

const editorRef = ref<HTMLTextAreaElement | null>(null)
const title = ref('')
const content = ref('')
const targetFolder = ref('notes/zh')
const customFolder = ref('')
const images = ref<Array<{ id: string; file: File; preview: string }>>([])
const showFolderBrowser = ref(false)

// 从设置中读取配置
const repoOwner = ref('soft-zihan')
const repoName = ref('soft-zihan.github.io')

// 默认的发布目录列表（按语言）
const defaultFoldersByLang: Record<'zh' | 'en', string[]> = {
  zh: [
    'notes/zh',
    'notes/zh/Linux命令行',
    'notes/zh/Linux命令行/01_基础',
    'notes/zh/Linux命令行/02_核心',
    'notes/zh/Linux命令行/03_进阶',
    'notes/zh/Linux命令行/04_实战'
  ],
  en: [
    'notes/en',
    'notes/en/Linux Command Line',
    'notes/en/Linux Command Line/1 Basics',
    'notes/en/Linux Command Line/2 Intermediate',
    'notes/en/Linux Command Line/3 Tips and Tricks'
  ]
}

const customFoldersByLang = ref<Record<'zh' | 'en', string[]>>({
  zh: [],
  en: []
})

const availableFolders = computed(() => {
  const langKey = props.lang as 'zh' | 'en'
  const base = defaultFoldersByLang[langKey] || []
  const custom = customFoldersByLang.value[langKey] || []
  const merged = [...base, ...custom]
  return Array.from(new Set(merged))
})

// 根据语言获取根目录
const getRootFolder = () => props.lang === 'zh' ? 'notes/zh' : 'notes/en'

// 添加自定义路径 - 必须在当前语言的 notes 目录下
const addCustomFolder = () => {
  let folder = customFolder.value.trim()
  if (!folder) return
  
  const rootFolder = getRootFolder()
  const langKey = props.lang as 'zh' | 'en'
  
  // 统一分隔符
  folder = folder.replace(/\\/g, '/')
  // 禁止跨目录
  if (folder.includes('..') || folder.startsWith('/')) {
    alert(props.lang === 'zh' 
      ? '路径非法：禁止使用 .. 或以 / 开头' 
      : 'Invalid path: do not use .. or leading /')
    return
  }

  // 只允许在当前语言根目录下
  if (folder.startsWith('notes/')) {
    if (!folder.startsWith(rootFolder)) {
      alert(props.lang === 'zh' 
        ? `路径必须在 ${rootFolder} 目录下` 
        : `Path must be under ${rootFolder}`)
      return
    }
  } else {
    folder = `${rootFolder}/${folder}`
  }

  const normalized = folder.replace(/\/+$/g, '')
  const customList = customFoldersByLang.value[langKey] || []
  if (!customList.includes(normalized)) {
    customFoldersByLang.value[langKey] = [normalized, ...customList]
    localStorage.setItem(`custom_folders_${langKey}`, JSON.stringify(customFoldersByLang.value[langKey]))
  }

  targetFolder.value = normalized
  customFolder.value = ''
  showFolderBrowser.value = false
}

const hasToken = computed(() => !!localStorage.getItem('github_pat'))

const wordCount = computed(() => {
  const chinese = (content.value.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (content.value.match(/[a-zA-Z]+/g) || []).length
  return chinese + english
})

const lineCount = computed(() => content.value.split('\n').length)

const previewHtml = computed(() => {
  try {
    return marked.parse(content.value)
  } catch {
    return '<p class="text-red-500">Preview Error</p>'
  }
})

const toolbarButtons = [
  { action: 'bold', title: 'Bold (Ctrl+B)', icon: '<strong>B</strong>' },
  { action: 'italic', title: 'Italic (Ctrl+I)', icon: '<em>I</em>' },
  { action: 'heading', title: 'Heading', icon: 'H' },
  { action: 'link', title: 'Link', icon: '🔗' },
  { action: 'code', title: 'Code', icon: '`' },
  { action: 'codeblock', title: 'Code Block', icon: '```' },
  { action: 'list', title: 'List', icon: '•' },
  { action: 'quote', title: 'Quote', icon: '❝' }
]

const insertMarkdown = (action: string) => {
  const textarea = editorRef.value
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = content.value.substring(start, end)
  
  let insertion = ''
  let cursorOffset = 0
  
  switch (action) {
    case 'bold':
      insertion = `**${selected || '粗体文字'}**`
      cursorOffset = selected ? 0 : -2
      break
    case 'italic':
      insertion = `*${selected || '斜体文字'}*`
      cursorOffset = selected ? 0 : -1
      break
    case 'heading':
      insertion = `\n## ${selected || '标题'}\n`
      break
    case 'link':
      insertion = `[${selected || '链接文字'}](url)`
      cursorOffset = -1
      break
    case 'code':
      insertion = `\`${selected || 'code'}\``
      break
    case 'codeblock':
      insertion = `\n\`\`\`\n${selected || '// code'}\n\`\`\`\n`
      break
    case 'list':
      insertion = `\n- ${selected || '列表项'}\n`
      break
    case 'quote':
      insertion = `\n> ${selected || '引用内容'}\n`
      break
  }
  
  content.value = content.value.substring(0, start) + insertion + content.value.substring(end)
  
  setTimeout(() => {
    textarea.focus()
    const newPos = start + insertion.length + cursorOffset
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  const id = Date.now().toString()
  const preview = URL.createObjectURL(file)
  
  images.value.push({ id, file, preview })
  
  const placeholder = `![${file.name}](local-image:${id})`
  const textarea = editorRef.value
  if (textarea) {
    const pos = textarea.selectionStart
    content.value = content.value.substring(0, pos) + placeholder + content.value.substring(pos)
  }
  
  input.value = ''
}

const handleDrop = async (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (!files?.length) return
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const id = Date.now().toString()
      const preview = URL.createObjectURL(file)
      images.value.push({ id, file, preview })
      
      const placeholder = `![${file.name}](local-image:${id})`
      content.value += `\n${placeholder}`
    }
  }
}

const saveDraft = () => {
  localStorage.setItem('sakura_draft', JSON.stringify({
    title: title.value,
    content: content.value,
    targetFolder: targetFolder.value,
    savedAt: new Date().toISOString()
  }))
  alert(props.lang === 'zh' ? '草稿已保存' : 'Draft saved')
}

const loadDraft = () => {
  const draft = localStorage.getItem('sakura_draft')
  if (draft) {
    const { title: t, content: c, targetFolder: f } = JSON.parse(draft)
    title.value = t || ''
    content.value = c || ''
    const rootFolder = getRootFolder()
    targetFolder.value = (f && f.startsWith(rootFolder)) ? f : rootFolder
  }
}

const publish = async () => {
  const token = getToken()
  if (!token) {
    alert(props.lang === 'zh' ? '请先在设置中配置 GitHub Token' : 'Please configure GitHub Token in Settings')
    return
  }
  if (!title.value.trim() || !content.value.trim()) {
    alert(props.lang === 'zh' ? '请输入标题和内容' : 'Please enter title and content')
    return
  }
  
  isPublishing.value = true
  publishProgress.value = 10
  
  try {
    // 从设置读取作者信息
    const authorName = localStorage.getItem('author_name') || ''
    const authorUrl = localStorage.getItem('author_url') || ''
    
    let processedContent = content.value
    
    // 统一图片存放目录
    const imageFolder = 'notes/images'
    
    // 上传图片
    if (images.value.length > 0) {
      publishProgress.value = 20
      const totalImages = images.value.length
      for (let i = 0; i < totalImages; i++) {
        const img = images.value[i]
        const imageUrl = await uploadImage(
          { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
          img.file,
          imageFolder
        )
        if (imageUrl) {
          processedContent = processedContent.replace(
            new RegExp(`local-image:${img.id}`, 'g'),
            imageUrl
          )
        }
        publishProgress.value = 20 + Math.round((i + 1) / totalImages * 40)
      }
    } else {
      publishProgress.value = 60
    }
  
    // 只有在用户填写了作者链接时才添加 authorUrl
    let frontmatter = ''
    if (authorName || authorUrl) {
      const fmParts = []
      if (authorUrl) {
        fmParts.push(`authorUrl: ${authorUrl}`)
      }
      if (authorName) {
        fmParts.push(`tags: [${authorName}]`)
      }
      
      if (fmParts.length > 0) {
        frontmatter = `---\n${fmParts.join('\n')}\n---\n\n`
      }
    }
    
    // 如果内容已有 frontmatter，则合并
    let finalContent = processedContent
    if (frontmatter) {
      if (finalContent.startsWith('---')) {
        const endIndex = finalContent.indexOf('---', 3)
        if (endIndex > 0) {
          // 合并到现有 frontmatter
          const existingFm = finalContent.slice(4, endIndex).trim()
          const newFmContent = frontmatter.slice(4, -5).trim()
          finalContent = `---\n${existingFm}\n${newFmContent}\n---\n\n${finalContent.slice(endIndex + 4).trim()}`
        }
      } else {
        finalContent = frontmatter + finalContent
      }
    }
    
    // 生成文件名
    const fileName = title.value
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
      + '.md'
    
    // 确保目标文件夹不以斜杠开头或结尾，并限制在语言根目录
    const rootFolder = getRootFolder()
    const cleanFolder = targetFolder.value.replace(/^\/+|\/+$/g, '')
    if (!cleanFolder.startsWith(rootFolder) || cleanFolder.includes('..')) {
      alert(props.lang === 'zh' 
        ? `发布路径必须在 ${rootFolder} 目录下` 
        : `Publish path must be under ${rootFolder}`)
      return
    }
    const path = `${cleanFolder}/${fileName}`
    
    publishProgress.value = 80
    
    const result = await uploadFile(
      { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
      path,
      finalContent,
      `Add article: ${title.value}`
    )
    
    publishProgress.value = 100
    
    if (result.success) {
      emit('published', result.url || '')
      title.value = ''
      content.value = ''
      images.value = []
      localStorage.removeItem('sakura_draft')
      alert(props.lang === 'zh' ? '发布成功！' : 'Published successfully!')
    } else {
      alert(`${props.lang === 'zh' ? '发布失败' : 'Publish failed'}: ${result.message}`)
    }
  } catch (e: any) {
    alert(`${props.lang === 'zh' ? '发布出错' : 'Publish error'}: ${e.message || e}`)
  } finally {
    isPublishing.value = false
    publishProgress.value = 0
  }
}

const confirmClose = () => {
  if (content.value.trim() && !confirm(props.lang === 'zh' ? '确定要关闭吗？未保存的内容将丢失。' : 'Close editor? Unsaved changes will be lost.')) {
    return
  }
  emit('close')
}

onMounted(() => {
  loadDraft()
  repoOwner.value = localStorage.getItem('github_repo_owner') || 'soft-zihan'
  repoName.value = localStorage.getItem('github_repo_name') || 'soft-zihan.github.io'
  
  // 加载自定义文件夹
  (['zh', 'en'] as Array<'zh' | 'en'>).forEach((langKey) => {
    const customFolders = localStorage.getItem(`custom_folders_${langKey}`)
    if (customFolders) {
      try {
        const folders = JSON.parse(customFolders)
        customFoldersByLang.value[langKey] = Array.isArray(folders) ? folders : []
      } catch {}
    }
  })

  const rootFolder = getRootFolder()
  if (!targetFolder.value.startsWith(rootFolder)) {
    targetFolder.value = rootFolder
  }
})

watch(() => props.lang, () => {
  const rootFolder = getRootFolder()
  if (!targetFolder.value.startsWith(rootFolder)) {
    targetFolder.value = rootFolder
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.prose :deep(pre) {
  background: #1e1e1e;
  border-radius: 0.5rem;
}

.prose :deep(code) {
  color: #f43f72;
}
</style>

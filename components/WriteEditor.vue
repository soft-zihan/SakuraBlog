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
          <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
            <input 
              v-model="title"
              type="text"
              :placeholder="lang === 'zh' ? '输入文章标题...' : 'Enter article title...'"
              class="w-full text-xl font-bold bg-transparent border-0 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs text-gray-400">🏷️</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in publishTags"
                  :key="tag"
                  class="text-xs px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300 flex items-center gap-1"
                >
                  {{ tag }}
                  <button
                    class="text-[10px] text-sakura-400 hover:text-sakura-600"
                    @click="removeTag(tag)"
                  >✕</button>
                </span>
              </div>
              <input
                v-model="tagInput"
                type="text"
                :placeholder="lang === 'zh' ? '添加标签，回车确认' : 'Add tag, press Enter'"
                class="flex-1 min-w-[160px] text-sm bg-transparent border-0 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                @keydown.enter.prevent="addTagFromInput"
                @blur="addTagFromInput"
              />
              <span class="text-[10px] text-gray-400">{{ publishTags.length }}/5</span>
            </div>
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
              <div class="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                <span>📁</span>
                <span class="text-xs text-gray-400">{{ getRootFolder() }}/</span>
                <input
                  v-model="pathSuffix"
                  type="text"
                  list="folder-suffix-options"
                  :placeholder="lang === 'zh' ? '子目录 (可选)' : 'Subfolder (optional)'"
                  class="w-48 text-sm bg-transparent border-0 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                />
                <datalist id="folder-suffix-options">
                  <option v-for="opt in folderSuffixOptions" :key="opt" :value="opt"></option>
                </datalist>
              </div>
              
              <button 
                @click="saveDraft"
                class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '保存草稿' : 'Save Draft' }}
              </button>

              <button 
                @click="triggerMarkdownFiles"
                class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '导入 Markdown' : 'Import Markdown' }}
              </button>

              <button 
                @click="triggerMarkdownFolder"
                class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '导入文件夹' : 'Import Folder' }}
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

          <!-- Hidden Inputs: Markdown Import -->
          <input
            ref="markdownFileInput"
            type="file"
            class="hidden"
            accept=".md,.markdown"
            multiple
            @change="handleMarkdownFiles"
          />
          <input
            ref="markdownFolderInput"
            type="file"
            class="hidden"
            accept=".md,.markdown"
            multiple
            webkitdirectory
            directory
            @change="handleMarkdownFolder"
          />
        </div>

        <!-- Import Preview Modal -->
        <div v-if="showImportModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeImportModal"></div>
          <div class="relative w-full max-w-6xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {{ lang === 'zh' ? '导入预览' : 'Import Preview' }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ lang === 'zh' ? '本地链接的图片在预览时看不到，但是上传时会一并上传。' : 'Select files to upload and fill tags/author info' }}
                </p>
              </div>
              <button
                @click="closeImportModal"
                class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
              <!-- File List -->
              <div class="md:col-span-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col">
                <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>{{ lang === 'zh' ? '待上传文件' : 'Files' }}</span>
                  <span class="text-[10px]">{{ importSelected.length }}/{{ importMdFiles.length }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <button @click="selectAllImport" class="px-2 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {{ lang === 'zh' ? '全选' : 'All' }}
                  </button>
                  <button @click="clearImportSelection" class="px-2 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {{ lang === 'zh' ? '清空' : 'None' }}
                  </button>
                </div>
                <div class="flex-1 overflow-y-auto custom-scrollbar">
                  <div
                    v-for="item in importMdFiles"
                    :key="item.relPath"
                    class="flex items-start gap-2 px-3 py-2 text-xs border-b border-gray-100 dark:border-gray-800 hover:bg-sakura-50/60 dark:hover:bg-gray-800/50"
                  >
                    <input
                      type="checkbox"
                      class="mt-0.5"
                      :value="item.relPath"
                      v-model="importSelected"
                    />
                    <button
                      class="text-left flex-1 truncate"
                      @click="importPreviewPath = item.relPath"
                    >
                      <span class="font-medium text-gray-700 dark:text-gray-200">{{ item.relPath }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Preview & Meta -->
              <div class="md:col-span-2 flex flex-col gap-4 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    v-model="importAuthorName"
                    type="text"
                    :placeholder="lang === 'zh' ? '作者名（可选）' : 'Author name (optional)'"
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  />
                  <input
                    v-model="importAuthorUrl"
                    type="url"
                    :placeholder="lang === 'zh' ? '作者链接（可选）' : 'Author URL (optional)'"
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  />
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs text-gray-400">🏷️</span>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in importTags"
                      :key="tag"
                      class="text-xs px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300 flex items-center gap-1"
                    >
                      {{ tag }}
                      <button
                        class="text-[10px] text-sakura-400 hover:text-sakura-600"
                        @click="removeImportTag(tag)"
                      >✕</button>
                    </span>
                  </div>
                  <input
                    v-model="importTagInput"
                    type="text"
                    :placeholder="lang === 'zh' ? '添加标签，回车确认' : 'Add tag, press Enter'"
                    class="flex-1 min-w-[160px] text-sm bg-transparent border-0 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    @keydown.enter.prevent="addImportTagFromInput"
                    @blur="addImportTagFromInput"
                  />
                  <span class="text-[10px] text-gray-400">{{ importTags.length }}/5</span>
                </div>

                <div class="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col">
                  <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400">
                    {{ lang === 'zh' ? '预览' : 'Preview' }}
                  </div>
                  <div class="flex-1 p-4 overflow-y-auto prose prose-sakura dark:prose-invert max-w-none" v-html="importPreviewHtml"></div>
                </div>
              </div>
            </div>

            <div class="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ lang === 'zh' ? '目标目录：' : 'Target:' }}
                <span class="font-mono">{{ targetFolder }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div v-if="isImporting" class="text-xs text-gray-400">{{ importProgress }}%</div>
                <button
                  @click="publishImportedFiles"
                  :disabled="isImporting || !importSelected.length || !hasToken"
                  class="px-5 py-2 text-sm font-medium text-white bg-sakura-500 hover:bg-sakura-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {{ isImporting ? (lang === 'zh' ? '上传中...' : 'Uploading...') : (lang === 'zh' ? '开始上传' : 'Start Upload') }}
                </button>
              </div>
            </div>
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
const pathSuffix = ref('')
const images = ref<Array<{ id: string; file: File; preview: string }>>([])
const publishTags = ref<string[]>([])
const tagInput = ref('')
const markdownFileInput = ref<HTMLInputElement | null>(null)
const markdownFolderInput = ref<HTMLInputElement | null>(null)

const showImportModal = ref(false)
const importMode = ref<'file' | 'folder'>('file')
const importFiles = ref<File[]>([])
const importSelected = ref<string[]>([])
const importPreviewPath = ref('')
const importPreviewContent = ref('')
const importTags = ref<string[]>([])
const importTagInput = ref('')
const importAuthorName = ref('')
const importAuthorUrl = ref('')
const isImporting = ref(false)
const importProgress = ref(0)
const importError = ref('')

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

const folderSuffixOptions = computed(() => {
  const rootFolder = getRootFolder()
  return availableFolders.value
    .filter((f: string) => f.startsWith(rootFolder))
    .map((f: string) => f.replace(rootFolder, '').replace(/^\/+/, ''))
    .filter((f: string) => f.length > 0)
})

// 根据语言获取根目录
const getRootFolder = () => props.lang === 'zh' ? 'notes/zh' : 'notes/en'

const sanitizeSuffix = (suffix: string) => {
  let clean = suffix.trim().replace(/\\/g, '/')
  if (!clean) return ''
  clean = clean.replace(/^\/+/, '')
  if (clean.includes('..')) {
    alert(props.lang === 'zh' 
      ? '路径非法：禁止使用 ..' 
      : 'Invalid path: do not use ..')
    return ''
  }
  return clean.replace(/\/+$/g, '')
}

const syncTargetFolder = () => {
  const rootFolder = getRootFolder()
  const cleanSuffix = sanitizeSuffix(pathSuffix.value)
  targetFolder.value = cleanSuffix ? `${rootFolder}/${cleanSuffix}` : rootFolder
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

const stripMetaComment = (text: string) => text.replace(/^\s*<!--[\s\S]*?-->\s*/, '')

const importMdFiles = computed(() => {
  return importFiles.value
    .filter((f: File) => /\.(md|markdown)$/i.test(f.name))
    .map((file: File) => {
      const relPath = normalizePath(getFileRelPath(file, importMode.value))
      return { file, relPath }
    })
})

const importPreviewHtml = computed(() => {
  try {
    return marked.parse(stripMetaComment(importPreviewContent.value || ''))
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

const parseMetaComment = (text: string) => {
  const result = { tags: [] as string[], author: '', authorUrl: '' }
  const match = text.match(/^\s*<!--([\s\S]*?)-->/)
  if (!match) return result
  const block = match[1]
  const tagsMatch = block.match(/tags?\s*:\s*([^\n]+)/i)
  if (tagsMatch) {
    result.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean)
  }
  const authorMatch = block.match(/author\s*:\s*([^\n]+)/i)
  if (authorMatch) result.author = authorMatch[1].trim()
  const authorUrlMatch = block.match(/authorUrl\s*:\s*([^\n]+)/i)
  if (authorUrlMatch) result.authorUrl = authorUrlMatch[1].trim()
  return result
}

const buildMetaComment = (tags: string[], author: string, authorUrl: string) => {
  const lines: string[] = []
  if (tags.length) lines.push(`tags: ${tags.join(', ')}`)
  if (author) lines.push(`author: ${author}`)
  if (authorUrl) lines.push(`authorUrl: ${authorUrl}`)
  if (!lines.length) return ''
  return `<!--\n${lines.join('\n')}\n-->\n\n`
}

const applyMetaComment = (text: string, tags: string[], author: string, authorUrl: string) => {
  const stripped = text.replace(/^\s*<!--[\s\S]*?-->\s*/, '')
  const metaBlock = buildMetaComment(tags, author, authorUrl)
  return metaBlock + stripped
}

const buildTagsForPublish = (text: string) => {
  const existing = parseMetaComment(text).tags
  const selected = publishTags.value
  const merged = [...selected, ...existing.filter(t => !selected.includes(t))]
  return merged.slice(0, 5)
}

const normalizeTags = (raw: string) => {
  return raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
}

const addTagFromInput = () => {
  if (!tagInput.value.trim()) return
  const newTags = normalizeTags(tagInput.value)
  const merged = [...publishTags.value]
  for (const t of newTags) {
    if (merged.includes(t)) continue
    if (merged.length >= 5) {
      alert(props.lang === 'zh' ? '标签最多 5 个' : 'Up to 5 tags')
      break
    }
    merged.push(t)
  }
  publishTags.value = merged
  tagInput.value = ''
  localStorage.setItem(`publish_tags_${props.lang}`, JSON.stringify(publishTags.value))
}

const removeTag = (tag: string) => {
  publishTags.value = publishTags.value.filter((t: string) => t !== tag)
  localStorage.setItem(`publish_tags_${props.lang}`, JSON.stringify(publishTags.value))
}

const addImportTagFromInput = () => {
  if (!importTagInput.value.trim()) return
  const newTags = normalizeTags(importTagInput.value)
  const merged = [...importTags.value]
  for (const t of newTags) {
    if (merged.includes(t)) continue
    if (merged.length >= 5) {
      alert(props.lang === 'zh' ? '标签最多 5 个' : 'Up to 5 tags')
      break
    }
    merged.push(t)
  }
  importTags.value = merged
  importTagInput.value = ''
}

const removeImportTag = (tag: string) => {
  importTags.value = importTags.value.filter((t: string) => t !== tag)
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
    pathSuffix.value = targetFolder.value.replace(rootFolder, '').replace(/^\/+/, '')
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
          const token = `local-image:${img.id}`
          processedContent = processedContent
            .replace(new RegExp(token, 'g'), imageUrl)
            .replace(new RegExp(`src=["']${token}["']`, 'g'), `src="${imageUrl}"`)
        }
        publishProgress.value = 20 + Math.round((i + 1) / totalImages * 40)
      }
    } else {
      publishProgress.value = 60
    }
  
    // 使用注释写入 meta 信息，避免出现在正文
    const publishTags = buildTagsForPublish(processedContent)
    let finalContent = applyMetaComment(processedContent, publishTags, authorName, authorUrl)
    
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

const triggerMarkdownFiles = () => markdownFileInput.value?.click()
const triggerMarkdownFolder = () => markdownFolderInput.value?.click()

const handleMarkdownFiles = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  await openImportModal(Array.from(input.files), 'file')
  input.value = ''
}

const handleMarkdownFolder = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  await openImportModal(Array.from(input.files), 'folder')
  input.value = ''
}

function getFileRelPath(file: File, mode: 'file' | 'folder') {
  const rel = (mode === 'folder' && (file as any).webkitRelativePath)
    ? (file as any).webkitRelativePath
    : file.name
  return rel || file.name
}

function normalizePath(raw: string) {
  const cleaned = raw.replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = cleaned.split('/').filter(Boolean)
  const stack: string[] = []
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  return stack.join('/')
}

const openImportModal = async (files: File[], mode: 'file' | 'folder') => {
  importFiles.value = files
  importMode.value = mode
  const mdList = importMdFiles.value
  if (!mdList.length) {
    alert(props.lang === 'zh' ? '未检测到 Markdown 文件' : 'No Markdown files found')
    return
  }
  importSelected.value = mdList.map((m: { relPath: string }) => m.relPath)
  importPreviewPath.value = mdList[0]?.relPath || ''
  importPreviewContent.value = mdList[0] ? await mdList[0].file.text() : ''

  const savedTags = localStorage.getItem(`publish_tags_${props.lang}`)
  if (savedTags) {
    try {
      const tags = JSON.parse(savedTags)
      importTags.value = Array.isArray(tags) ? tags.slice(0, 5) : []
    } catch {
      importTags.value = []
    }
  } else {
    importTags.value = []
  }

  importAuthorName.value = localStorage.getItem('author_name') || ''
  importAuthorUrl.value = localStorage.getItem('author_url') || ''
  importProgress.value = 0
  importError.value = ''
  showImportModal.value = true
}

const closeImportModal = () => {
  if (isImporting.value) return
  showImportModal.value = false
}

const selectAllImport = () => {
  importSelected.value = importMdFiles.value.map((m: { relPath: string }) => m.relPath)
}

const clearImportSelection = () => {
  importSelected.value = []
}

const isHttpUrl = (p: string) => /^https?:\/\//i.test(p) || p.startsWith('//')
const isDataOrLocalToken = (p: string) => p.startsWith('data:') || p.startsWith('local-image:')

const extractImagePaths = (text: string) => {
  const paths: string[] = []
  for (const match of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    paths.push(match[1])
  }
  for (const match of text.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    paths.push(match[1])
  }
  return paths
}

const normalizeImageToken = (raw: string) => {
  let cleaned = raw.trim()
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1)
  }
  const [pathPart, ...rest] = cleaned.split(/\s+/)
  return { path: pathPart, tail: rest.join(' ') }
}

const resolveImagePath = (mdRelPath: string, imgPath: string) => {
  if (!imgPath || isHttpUrl(imgPath) || isDataOrLocalToken(imgPath)) return null
  if (imgPath.startsWith('/')) return null
  const mdDir = mdRelPath.split('/').slice(0, -1)
  const parts = imgPath.split('/')
  const stack = [...mdDir]
  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  return normalizePath(stack.join('/'))
}

const getImageBasename = (p: string) => {
  const cleaned = p.split('?')[0].split('#')[0]
  const parts = cleaned.split('/')
  return parts[parts.length - 1] || ''
}

const getImageKeyCandidates = (mdRelPath: string, raw: string) => {
  const { path } = normalizeImageToken(raw)
  const keys = [path]
  const resolved = resolveImagePath(mdRelPath, path)
  if (resolved) keys.push(resolved)
  const base = getImageBasename(path)
  if (base) keys.push(base)
  return keys
}

const replaceLocalImages = (text: string, mdRelPath: string, urlMap: Map<string, string>) => {
  const replacePath = (raw: string) => {
    const { path, tail } = normalizeImageToken(raw)
    const candidates = getImageKeyCandidates(mdRelPath, raw)
    const matched = candidates.find(key => urlMap.has(key))
    if (matched) {
      const url = urlMap.get(matched) as string
      return tail ? `${url} ${tail}` : url
    }
    return raw
  }

  let output = text.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (match, p1) => {
    const next = replacePath(p1)
    return match.replace(p1, next)
  })
  output = output.replace(/<img[^>]+src=["']([^"']+)["']/gi, (match, p1) => {
    const next = replacePath(p1)
    return match.replace(p1, next)
  })
  return output
}

const buildTagsForImport = (text: string, baseTags: string[]) => {
  const existing = parseMetaComment(text).tags
  const merged = [...baseTags, ...existing.filter(t => !baseTags.includes(t))]
  return merged.slice(0, 5)
}

const publishImportedFiles = async () => {
  const token = getToken()
  if (!token) {
    alert(props.lang === 'zh' ? '请先在设置中配置 GitHub Token' : 'Please configure GitHub Token in Settings')
    return
  }

  const rootFolder = getRootFolder()
  const cleanFolder = targetFolder.value.replace(/^\/+|\/+$/g, '')
  if (!cleanFolder.startsWith(rootFolder) || cleanFolder.includes('..')) {
    alert(props.lang === 'zh'
      ? `发布路径必须在 ${rootFolder} 目录下`
      : `Publish path must be under ${rootFolder}`)
    return
  }

  const selectedItems = importMdFiles.value.filter((m: { relPath: string }) => importSelected.value.includes(m.relPath))
  if (!selectedItems.length) {
    alert(props.lang === 'zh' ? '请先选择要上传的文件' : 'Please select files to upload')
    return
  }

  localStorage.setItem(`publish_tags_${props.lang}`, JSON.stringify(importTags.value))
  localStorage.setItem('author_name', importAuthorName.value)
  localStorage.setItem('author_url', importAuthorUrl.value)

  isImporting.value = true
  importProgress.value = 0
  importError.value = ''

  try {
    const imageFiles = importFiles.value.filter((f: File) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f.name))
    const imageMap = new Map<string, File>()
    const imageNameMap = new Map<string, File>()
    for (const file of imageFiles) {
      const rel = normalizePath(getFileRelPath(file, importMode.value))
      imageMap.set(rel, file)
      imageNameMap.set(file.name, file)
    }

    const contentMap = new Map<string, string>()
    const localImageRefs = new Set<string>()
    const remoteImageRefs = new Set<string>()

    for (const item of selectedItems) {
      const text = await item.file.text()
      contentMap.set(item.relPath, text)
      const paths = extractImagePaths(text)
      for (const raw of paths) {
        const { path } = normalizeImageToken(raw)
        if (!path || isDataOrLocalToken(path)) continue
        if (isHttpUrl(path)) {
          remoteImageRefs.add(path)
          continue
        }
        const resolved = resolveImagePath(item.relPath, path)
        if (resolved && imageMap.has(resolved)) {
          localImageRefs.add(resolved)
          continue
        }
        const base = getImageBasename(path)
        if (base && imageNameMap.has(base)) {
          localImageRefs.add(base)
        }
      }
    }

    const totalSteps = localImageRefs.size + remoteImageRefs.size + selectedItems.length
    let step = 0

    const imageUrlMap = new Map<string, string>()
    const imageFolder = 'notes/images'
    for (const imgPath of localImageRefs) {
      const file = imageMap.get(imgPath) || imageNameMap.get(imgPath)
      if (!file) continue
      const url = await uploadImage(
        { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
        file,
        imageFolder
      )
      if (url) {
        imageUrlMap.set(imgPath, url)
        const base = getImageBasename(imgPath)
        if (base) imageUrlMap.set(base, url)
      }
      step += 1
      importProgress.value = Math.round((step / totalSteps) * 100)
    }

    const fetchRemoteImageFile = async (rawUrl: string) => {
      try {
        const finalUrl = rawUrl.startsWith('//') ? `${window.location.protocol}${rawUrl}` : rawUrl
        const res = await fetch(finalUrl)
        if (!res.ok) return null
        const blob = await res.blob()
        const fileName = decodeURIComponent(new URL(finalUrl).pathname.split('/').pop() || `image-${Date.now()}`)
        const type = blob.type || 'image/png'
        return new File([blob], fileName, { type })
      } catch {
        return null
      }
    }

    for (const imgUrl of remoteImageRefs) {
      const file = await fetchRemoteImageFile(imgUrl)
      if (file) {
        const url = await uploadImage(
          { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
          file,
          imageFolder
        )
        if (url) imageUrlMap.set(imgUrl, url)
      }
      step += 1
      importProgress.value = Math.round((step / totalSteps) * 100)
    }

    for (const item of selectedItems) {
      let finalContent = contentMap.get(item.relPath) || ''
      finalContent = replaceLocalImages(finalContent, item.relPath, imageUrlMap)
      const tags = buildTagsForImport(finalContent, importTags.value)
      finalContent = applyMetaComment(finalContent, tags, importAuthorName.value, importAuthorUrl.value)

      const path = `${cleanFolder}/${item.relPath}`
      await uploadFile(
        { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
        path,
        finalContent,
        `Import article: ${item.relPath}`
      )

      step += 1
      importProgress.value = Math.round((step / totalSteps) * 100)
    }

    alert(props.lang === 'zh' ? '导入完成！' : 'Import completed!')
    showImportModal.value = false
  } catch (e: any) {
    importError.value = e?.message || String(e)
    alert(`${props.lang === 'zh' ? '导入失败' : 'Import failed'}: ${importError.value}`)
  } finally {
    isImporting.value = false
    importProgress.value = 0
  }
}

const uploadMarkdownFiles = async (files: File[], mode: 'file' | 'folder' = 'file') => {
  const token = getToken()
  if (!token) {
    alert(props.lang === 'zh' ? '请先在设置中配置 GitHub Token' : 'Please configure GitHub Token in Settings')
    return
  }

  const rootFolder = getRootFolder()
  const cleanFolder = targetFolder.value.replace(/^\/+|\/+$/g, '')
  if (!cleanFolder.startsWith(rootFolder) || cleanFolder.includes('..')) {
    alert(props.lang === 'zh' 
      ? `发布路径必须在 ${rootFolder} 目录下` 
      : `Publish path must be under ${rootFolder}`)
    return
  }

  const mdFiles = files.filter(f => /\.md|\.markdown$/i.test(f.name))
  if (!mdFiles.length) {
    alert(props.lang === 'zh' ? '未检测到 Markdown 文件' : 'No Markdown files found')
    return
  }

  isPublishing.value = true
  publishProgress.value = 10

  try {
    const total = mdFiles.length
    for (let i = 0; i < total; i++) {
      const file = mdFiles[i]
      const relPath = (mode === 'folder' && (file as any).webkitRelativePath)
        ? (file as any).webkitRelativePath
        : file.name

      const normalizedRel = relPath.replace(/^\/+/, '')
      const contentText = await file.text()
      const authorName = localStorage.getItem('author_name') || ''
      const authorUrl = localStorage.getItem('author_url') || ''
      const relFolder = normalizedRel.split('/').slice(0, -1).join('/')
      const publishTags = buildTagsForPublish(contentText)
      const finalContent = applyMetaComment(contentText, publishTags, authorName, authorUrl)

      const path = `${cleanFolder}/${normalizedRel}`
      await uploadFile(
        { owner: repoOwner.value, repo: repoName.value, branch: 'main', token },
        path,
        finalContent,
        `Add article: ${file.name}`
      )

      publishProgress.value = 10 + Math.round(((i + 1) / total) * 90)
    }

    alert(props.lang === 'zh' ? '批量上传完成' : 'Batch upload completed')
  } catch (e: any) {
    alert(`${props.lang === 'zh' ? '上传出错' : 'Upload error'}: ${e.message || e}`)
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

  const savedTags = localStorage.getItem(`publish_tags_${props.lang}`)
  if (savedTags) {
    try {
      const tags = JSON.parse(savedTags)
      publishTags.value = Array.isArray(tags) ? tags.slice(0, 5) : []
    } catch {}
  }
  
  // 加载自定义文件夹
  (['zh', 'en'] as Array<'zh' | 'en'>).forEach((langKey: 'zh' | 'en') => {
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
  pathSuffix.value = targetFolder.value.replace(rootFolder, '').replace(/^\/+/, '')
})

watch(() => props.lang, () => {
  const rootFolder = getRootFolder()
  if (!targetFolder.value.startsWith(rootFolder)) {
    targetFolder.value = rootFolder
  }
  pathSuffix.value = targetFolder.value.replace(rootFolder, '').replace(/^\/+/, '')

  const savedTags = localStorage.getItem(`publish_tags_${props.lang}`)
  if (savedTags) {
    try {
      const tags = JSON.parse(savedTags)
      publishTags.value = Array.isArray(tags) ? tags.slice(0, 5) : []
    } catch {}
  } else {
    publishTags.value = []
  }
})

watch(pathSuffix, () => syncTargetFolder())

watch(importPreviewPath, async () => {
  const item = importMdFiles.value.find((m: { relPath: string }) => m.relPath === importPreviewPath.value)
  importPreviewContent.value = item ? await item.file.text() : ''
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

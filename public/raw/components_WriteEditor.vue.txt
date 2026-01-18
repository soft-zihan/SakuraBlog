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
                {{ hasToken ? (lang === 'zh' ? 'GitHub 已连接' : 'GitHub Connected') : (lang === 'zh' ? '未配置 Token' : 'No Token') }}
              </div>
              
              <button 
                @click="showTokenModal = true"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                :title="lang === 'zh' ? '配置 GitHub Token' : 'Configure GitHub Token'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
              
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
              <select 
                v-model="targetFolder"
                class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="notes/zh">notes/zh (中文)</option>
                <option value="notes/en">notes/en (English)</option>
              </select>
              
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
        
        <!-- Token Configuration Modal -->
        <div 
          v-if="showTokenModal"
          class="absolute inset-0 flex items-center justify-center z-10"
        >
          <div class="absolute inset-0 bg-black/50" @click="showTokenModal = false"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '配置 GitHub Token' : 'Configure GitHub Token' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {{ lang === 'zh' 
                ? '需要一个有 repo 权限的 Personal Access Token 才能发布文章。' 
                : 'A Personal Access Token with repo permission is required to publish articles.' }}
            </p>
            <input 
              v-model="tokenInput"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxx"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 mb-4"
            />
            <div class="flex items-center gap-2 mb-4">
              <input v-model="repoOwner" type="text" placeholder="Owner" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              <span class="text-gray-400">/</span>
              <input v-model="repoName" type="text" placeholder="Repo" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div class="flex justify-end gap-2">
              <button 
                @click="showTokenModal = false"
                class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '取消' : 'Cancel' }}
              </button>
              <button 
                @click="saveToken"
                class="px-4 py-2 text-sm font-medium text-white bg-sakura-500 hover:bg-sakura-600 rounded-lg transition-colors"
              >
                {{ lang === 'zh' ? '保存' : 'Save' }}
              </button>
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

const { isPublishing, publishProgress, getToken, setToken, publishArticle } = useGitHubPublish()

const editorRef = ref<HTMLTextAreaElement | null>(null)
const title = ref('')
const content = ref('')
const targetFolder = ref('notes/zh')
const images = ref<Array<{ id: string; file: File; preview: string }>>([])
const showTokenModal = ref(false)
const tokenInput = ref('')
const repoOwner = ref('soft-zihan')
const repoName = ref('soft-zihan.github.io')

const hasToken = computed(() => !!getToken())

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
  
  // Restore focus and cursor
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
  
  // Insert placeholder in content
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
    targetFolder.value = f || 'notes/zh'
  }
}

const saveToken = () => {
  if (tokenInput.value) {
    setToken(tokenInput.value)
    localStorage.setItem('github_repo_owner', repoOwner.value)
    localStorage.setItem('github_repo_name', repoName.value)
  }
  showTokenModal.value = false
}

const publish = async () => {
  const token = getToken()
  if (!token || !title.value.trim() || !content.value.trim()) return
  
  const result = await publishArticle(
    {
      owner: repoOwner.value,
      repo: repoName.value,
      branch: 'main',
      token
    },
    title.value,
    content.value,
    targetFolder.value,
    images.value.map(img => ({ id: img.id, file: img.file }))
  )
  
  if (result.success) {
    emit('published', result.url || '')
    title.value = ''
    content.value = ''
    images.value = []
    localStorage.removeItem('sakura_draft')
  } else {
    alert(`${props.lang === 'zh' ? '发布失败' : 'Publish failed'}: ${result.message}`)
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

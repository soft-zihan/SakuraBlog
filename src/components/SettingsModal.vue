<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 p-0 rounded-3xl shadow-2xl max-w-lg w-[calc(100%-2rem)] md:w-full animate-fade-in border border-white/50 dark:border-gray-700 max-h-[calc(100dvh-2rem)] md:max-h-[90vh] flex flex-col relative overflow-hidden">
        <!-- Header (Fixed) -->
        <div class="p-4 md:p-6 pb-2 flex-shrink-0 flex items-center justify-between bg-white dark:bg-gray-800 z-20">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ t.settings_title }}</h3>
          <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

      <!-- Scrollable Content -->
      <div class="p-4 md:p-6 pt-0 overflow-y-auto custom-scrollbar flex-1">
        <!-- GitHub Configuration -->
      <div class="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GitHub {{ t.connection || '连接' }}</label>
        
        <!-- Token Status -->
        <div class="flex items-center gap-2 mb-3 p-2 rounded-lg" :class="hasToken ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'">
          <div class="w-2 h-2 rounded-full" :class="hasToken ? 'bg-green-500' : 'bg-yellow-500'"></div>
          <span class="text-sm" :class="hasToken ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
            {{ hasToken ? (t.github_connected || 'GitHub 已连接') : (t.github_not_connected || '未配置 Token') }}
          </span>
        </div>
        
        <!-- Token Input -->
        <div class="mb-3">
          <input 
            v-model="tokenInput"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            class="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <p class="text-xs text-gray-400 mt-1">{{ t.token_hint || '需要 repo 权限的 Personal Access Token' }}</p>
        </div>
        
        <!-- Author Name (GitHub Username) -->
        <div class="mb-3">
          <label class="block text-xs text-gray-500 mb-1">{{ t.author_name || '作者名称' }} (GitHub {{ t.username || '用户名' }})</label>
          <input 
            v-model="authorName"
            type="text"
            placeholder="your-github-username"
            class="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <p class="text-xs text-gray-400 mt-1">{{ t.author_hint || '用于云端备份和查看备份，链接将自动生成' }}</p>
        </div>
        
        <!-- Auto-generated links preview -->
        <div v-if="authorName.trim()" class="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500">
          <p class="mb-1">📎 {{ t.auto_links || '自动生成链接' }}:</p>
          <p class="truncate">👤 https://github.com/{{ authorName }}</p>
          <p class="truncate">📂 https://github.com/{{ authorName }}/soft-zihan.github.io</p>
        </div>
        
        <button 
          @click="saveGitHubConfig"
          class="w-full py-2 border rounded-xl text-sm transition-colors border-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-900)]/30"
        >
          {{ t.save_config || '保存配置' }}
        </button>
      </div>

      <!-- Backup & Restore -->
      <div class="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.backup_title || '数据备份' }}</label>
        
        <!-- Backup Target Selection -->
        <div class="flex gap-2 mb-3">
          <button 
            @click="backupTarget = 'local'" 
            class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            :class="backupTarget === 'local' ? 'border-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
          >
            <span>💾</span> {{ t.backup_local || '本地下载' }}
          </button>
          <button 
            @click="backupTarget = 'cloud'" 
            class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            :class="backupTarget === 'cloud' ? 'border-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
          >
            <span>☁️</span> {{ t.backup_cloud || '云端 (Fork)' }}
          </button>
        </div>
        
        <!-- Warning Notice -->
        <div class="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-600 dark:text-amber-400">
          ⚠️ {{ backupTarget === 'local' 
            ? (t.backup_warning_local || '备份文件将下载到本地，请妥善保管')
            : (t.backup_warning || '备份将存储在您的 Fork 仓库，不包含 Token') }}
        </div>
        
        <!-- Backup Button -->
        <button 
          @click="handleBackup"
          :disabled="isBackingUp || (backupTarget === 'cloud' && (!hasToken || !authorName.trim()))"
          class="w-full py-2 mb-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          :class="(backupTarget === 'local' || (hasToken && authorName.trim())) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'"
        >
          <span v-if="isBackingUp" class="animate-spin">⏳</span>
          <span v-else>{{ backupTarget === 'local' ? '📥' : '☁️' }}</span>
          {{ isBackingUp ? (t.backing_up || '备份中...') : (backupTarget === 'local' ? (t.download_backup || '下载备份') : (t.backup_now || '备份到 Fork')) }}
        </button>
        
        <p v-if="backupTarget === 'cloud' && !hasToken" class="text-xs text-amber-500 mb-2">
          {{ t.backup_need_token || '请先配置 GitHub Token' }}
        </p>
        <p v-else-if="backupTarget === 'cloud' && !authorName.trim()" class="text-xs text-amber-500 mb-2">
          {{ t.backup_need_author || '请先填写作者名称' }}
        </p>
        
        <!-- Import from file (only show for local) -->
        <div v-if="backupTarget === 'local'" class="mb-2">
          <button 
            @click="triggerFileImport"
            :disabled="isRestoring"
            class="w-full py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <span>📤</span> {{ t.import_backup || '导入备份文件' }}
          </button>
          <input 
            ref="fileInputRef"
            type="file" 
            accept=".json" 
            class="hidden" 
            @change="handleFileImport"
          />
        </div>
        
        <!-- Cloud Backup List Toggle (only for cloud) -->
        <button 
          v-if="backupTarget === 'cloud'"
          @click="viewCloudBackups"
          :disabled="!hasToken || !authorName.trim()"
          class="w-full py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          :class="hasToken && authorName.trim() ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'"
        >
          <span>🔗</span>
          {{ t.view_backups || '查看云端备份' }}
        </button>
        
        <!-- Fetch and Show Backup List Button -->
        <button 
          v-if="backupTarget === 'cloud'"
          @click="fetchAndShowBackupList"
          :disabled="!hasToken || !authorName.trim() || isFetchingBackups"
          class="w-full py-2 mt-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          :class="hasToken && authorName.trim() ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'"
        >
          <span v-if="isFetchingBackups" class="animate-spin">⏳</span>
          <span v-else>📋</span>
          {{ isFetchingBackups ? (t.loading || '加载中...') : (showBackupList ? (t.refresh_backups || '刷新备份列表') : (t.show_backups || '获取云端备份列表')) }}
        </button>
        
        <!-- Backup List (cloud only) -->
        <div v-if="showBackupList && backupTarget === 'cloud'" class="mt-3">
          <div v-if="backupList.length > 0" class="max-h-40 overflow-y-auto border rounded-xl border-gray-200 dark:border-gray-700">
            <div 
              v-for="backup in backupList" 
              :key="backup.name"
              class="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {{ parseBackupFilename(backup.name).author }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ parseBackupFilename(backup.name).date }}
                </p>
              </div>
              <div class="flex gap-1 ml-2">
                <button 
                  @click="handleRestore(backup)"
                  :disabled="isRestoring"
                  class="px-2 py-1 text-xs rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 disabled:opacity-50"
                >
                  {{ isRestoring ? '...' : (t.restore || '恢复') }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-sm text-gray-400 py-4 border rounded-xl border-gray-200 dark:border-gray-700">
            {{ t.no_backups || '暂无云端备份' }}
          </div>
        </div>
        
        <!-- Backup Message -->
        <p v-if="backupMessage" class="mt-2 text-xs" :class="backupSuccess ? 'text-green-500' : 'text-red-500'">
          {{ backupMessage }}
        </p>
      </div>

      <!-- Data & Security Info -->
      <div class="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <button 
          @click="showDataInfo = !showDataInfo"
          class="w-full flex items-center justify-between text-left"
        >
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t.data_info_title || '📋 数据与安全说明' }}</label>
          <span class="text-gray-400 text-sm">{{ showDataInfo ? '▲' : '▼' }}</span>
        </button>
        
        <div v-if="showDataInfo" class="mt-3 space-y-3 text-xs text-gray-500 dark:text-gray-400">
          <!-- Publishing Mechanism -->
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">🚀 {{ t.publish_mechanism || '发布修改原理' }}</h4>
            <ul class="space-y-1 list-disc list-inside">
              <li>{{ t.publish_info_2 || '用户提交时，会自动 Fork 仓库并提交 Pull Request' }}</li>
              <li>{{ t.publish_info_3 || 'Fork 会自动同步到最新版本避免冲突' }}</li>
              <li>{{ t.publish_info_4 || 'PR 需等待仓库管理员审核合并后自动重新部署' }}</li>
              <li>{{ t.publish_info_5 || '如果用户提交到自己的仓库，提交会直接合并到 main 分支并重新部署' }}</li>
            </ul>
          </div>
          
          <!-- Storage Policy -->
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h4 class="font-bold text-green-600 dark:text-green-400 mb-1">💾 {{ t.storage_policy || '持久化存储策略' }}</h4>
            <p class="mb-1">{{ t.storage_intro || '以下数据存储在浏览器 localStorage 中：' }}</p>
            <ul class="space-y-1 list-disc list-inside">
              <li>{{ t.storage_item_1 || '用户偏好设置（主题、字体、壁纸等）' }}</li>
              <li>{{ t.storage_item_2 || '文章收藏和点赞记录' }}</li>
              <li>{{ t.storage_item_3 || '作者信息和仓库配置' }}</li>
              <li>{{ t.storage_item_4 || '本地备份数据' }}</li>
            </ul>
            <p class="mt-2 text-amber-600 dark:text-amber-400">⚠️ {{ t.storage_warning || '清除浏览器数据会丢失这些内容，建议定期备份！' }}</p>
          </div>
          
          <!-- Token Security -->
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h4 class="font-bold text-purple-600 dark:text-purple-400 mb-1">🔐 {{ t.token_security || 'Token 安全策略' }}</h4>
            <ul class="space-y-1 list-disc list-inside">
              <li>{{ t.token_info_1 || 'Token 使用 AES-256-GCM 加密存储' }}</li>
              <li>{{ t.token_info_2 || '加密密钥基于浏览器指纹派生，其他设备无法解密' }}</li>
              <li>{{ t.token_info_3 || 'Token 不会被包含在任何备份中' }}</li>
              <li>{{ t.token_info_4 || 'Token 仅用于 GitHub API 调用，不会发送到其他服务器' }}</li>
              <li>{{ t.token_info_5 || '建议使用具有最小权限的 Fine-grained Token' }}</li>
            </ul>
          </div>
        </div>
      </div>

      <button @click="$emit('close')" class="w-full py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-xl font-bold shadow-lg transition-colors">{{ t.done }}</button>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBackup, type BackupFile } from '../composables/useBackup'
import { useArticleStore } from '../stores/articleStore'
import { useAppStore } from '../stores/appStore'
import { useTokenSecurity } from '../composables/useTokenSecurity'

const props = defineProps<{
  t: any;
  isDark: boolean;
  lang?: 'zh' | 'en';
  fileSystem?: any[];
  labFolder?: any;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const articleStore = useArticleStore()
const appStore = useAppStore()
const { saveToken, hasToken: checkHasToken, getToken } = useTokenSecurity()

// GitHub Configuration
const tokenInput = ref('')
const authorName = ref('')
const isSavingConfig = ref(false)

// 根据 authorName 自动计算仓库信息
const repoOwner = computed(() => 'soft-zihan')
const repoName = computed(() => 'soft-zihan.github.io')
const authorUrl = computed(() => authorName.value.trim() ? `https://github.com/${authorName.value.trim()}` : '')
const userForkRepo = computed(() => authorName.value.trim() ? `${authorName.value.trim()}/soft-zihan.github.io` : '')

const hasToken = ref(false)

// 初始化检查 token 状态
const updateTokenStatus = () => {
  hasToken.value = checkHasToken()
}

const saveGitHubConfig = async () => {
  isSavingConfig.value = true
  try {
    if (tokenInput.value) {
      await saveToken(tokenInput.value)
      tokenInput.value = '' // 清空输入框，不显示 token
    }
    if (authorName.value) {
      localStorage.setItem('author_name', authorName.value)
    }
    updateTokenStatus()
    backupMessage.value = '配置已保存（Token 已加密存储）'
    backupSuccess.value = true
    setTimeout(() => { backupMessage.value = '' }, 3000)
  } catch (e) {
    backupMessage.value = '保存失败'
    backupSuccess.value = false
  } finally {
    isSavingConfig.value = false
  }
}

// Backup functionality
const { 
  isBackingUp, 
  isRestoring, 
  backupList,
  backupToGitHub, 
  listBackups, 
  restoreFromGitHub, 
  deleteBackup,
  parseBackupFilename,
  getCloudBackupUrl,
  // 本地备份
  backupToLocal,
  importBackupFromFile
} = useBackup()

const showBackupList = ref(false)
const backupMessage = ref('')
const backupSuccess = ref(false)
const backupTarget = ref<'local' | 'cloud'>('local')
const fileInputRef = ref<HTMLInputElement | null>(null)
const showDataInfo = ref(false)
const isFetchingBackups = ref(false)

const handleBackup = async () => {
  let result
  if (backupTarget.value === 'local') {
    // 本地备份不需要作者名
    result = await backupToLocal()
  } else {
    // 云端备份需要作者名
    if (!authorName.value.trim()) {
      backupMessage.value = '云端备份请填写作者名称（GitHub用户名）'
      backupSuccess.value = false
      return
    }
    result = await backupToGitHub(repoOwner.value, repoName.value, authorName.value)
  }
  
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success && backupTarget.value === 'cloud') {
    await listBackups(repoOwner.value, repoName.value, authorName.value)
    showBackupList.value = true
  }
}

// 获取并显示云端备份列表
const fetchAndShowBackupList = async () => {
  if (!authorName.value.trim()) return
  
  isFetchingBackups.value = true
  backupMessage.value = ''
  
  try {
    await listBackups(repoOwner.value, repoName.value, authorName.value)
    showBackupList.value = true
    if (backupList.value.length === 0) {
      backupMessage.value = '未找到云端备份，请确认您的 Fork 仓库中存在 backup 分支和备份文件'
      backupSuccess.value = false
    }
  } catch (e: any) {
    backupMessage.value = e.message || '获取备份列表失败'
    backupSuccess.value = false
  } finally {
    isFetchingBackups.value = false
  }
}

const toggleBackupList = async () => {
  showBackupList.value = !showBackupList.value
  if (showBackupList.value && backupTarget.value === 'cloud' && authorName.value.trim()) {
    await listBackups(repoOwner.value, repoName.value, authorName.value)
  }
}

// 在新标签页打开云端备份目录
const viewCloudBackups = () => {
  if (!authorName.value.trim()) return
  const url = getCloudBackupUrl(authorName.value.trim())
  if (url) {
    window.open(url, '_blank')
  }
}

const handleRestore = async (backup: BackupFile) => {
  if (!confirm('确定要恢复此备份吗？当前设置将被覆盖。恢复后需要刷新页面。')) {
    return
  }
  
  backupMessage.value = '正在恢复备份...'
  backupSuccess.value = true
  
  const result = await restoreFromGitHub(authorName.value.trim(), repoName.value, backup.name)
  
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success) {
    if (confirm('恢复成功！是否立即刷新页面以应用更改？')) {
      window.location.reload()
    }
  }
}

const handleDelete = async (backup: BackupFile) => {
  if (!confirm(`确定要删除备份 "${parseBackupFilename(backup.name).author}" 吗？`)) {
    return
  }
  
  const result = await deleteBackup(authorName.value.trim(), repoName.value, backup.name, backup.sha)
  
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success) {
    await listBackups(repoOwner.value, repoName.value, authorName.value)
  }
}

const triggerFileImport = () => {
  fileInputRef.value?.click()
}

const handleFileImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  const result = await importBackupFromFile(file)
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  // 重置 input
  input.value = ''
  
  if (result.success) {
    if (confirm('导入成功！是否立即刷新页面以应用更改？')) {
      window.location.reload()
    }
  }
}

onMounted(() => {
  // 检查 token 状态（不加载明文）
  updateTokenStatus()
  
  // Load saved config (只加载作者名)
  authorName.value = localStorage.getItem('author_name') || ''
  
  // Preload cloud backup list if token exists and author name is set
  if (hasToken.value && authorName.value.trim()) {
    listBackups(repoOwner.value, repoName.value, authorName.value)
  }
})
</script>

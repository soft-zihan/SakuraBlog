import { ref } from 'vue'
import { useGitHubPublish } from './useGitHubPublish'
import { tokenSecurity } from './useTokenSecurity'

export interface BackupFile {
  name: string
  path: string
  sha: string
  size: number
  download_url: string
  created_at?: string
  isLocal?: boolean  // 是否为本地备份
  forkRepo?: string  // fork 仓库名称（用于云端备份）
}

export interface BackupResult {
  success: boolean
  message: string
  filename?: string
  forkRepo?: string  // fork 仓库名称
}

export type BackupTarget = 'local' | 'cloud'

// localStorage 中不需要备份的 key（敏感信息或临时数据）
const EXCLUDED_KEYS = [
  'github_pat',  // GitHub token 不备份（旧版）
  'github_pat_encrypted',  // 加密的 token 不备份
  'github_pat_iv',  // 加密 IV 不备份
  'github_pat_salt',  // 加密盐值不备份
  'local_backups',  // 本地备份列表不要循环备份
  // 临时/编辑状态数据（不需要持久化跨设备）
  'custom_folders_zh',  // 临时自定义文件夹
  'custom_folders_en',
  'publish_tags_zh',  // 发布标签缓存
  'publish_tags_en',
  'article_content',  // 文章编辑临时内容
  'article_title',
  'article_desc',
  'article_path',
]

export function useBackup() {
  const isBackingUp = ref(false)
  const isRestoring = ref(false)
  const backupError = ref('')
  const backupList = ref<BackupFile[]>([])
  const userForkRepo = ref('')  // 用户 fork 的仓库完整名称
  
  const { getCurrentUser } = useGitHubPublish()
  
  const getToken = async (): Promise<string | null> => {
    return tokenSecurity.getToken()
  }
  
  /**
   * 收集需要备份的 localStorage 数据
   */
  const collectBackupData = (): Record<string, any> => {
    const data: Record<string, any> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && !EXCLUDED_KEYS.includes(key)) {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            // 尝试解析 JSON
            try {
              data[key] = JSON.parse(value)
            } catch {
              // 如果不是 JSON，保存原始字符串
              data[key] = value
            }
          }
        } catch (e) {
          console.warn(`Failed to read localStorage key: ${key}`, e)
        }
      }
    }
    
    return data
  }
  
  /**
   * 生成备份文件名
   * @param authorName 可选，用于云端备份标识作者
   */
  const generateBackupFilename = (authorName?: string): string => {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, 19)
    if (authorName) {
      const safeName = authorName.replace(/[^\w\u4e00-\u9fa5]/g, '_') || 'anonymous'
      return `${safeName}_${timestamp}.json`
    }
    return `sakura_backup_${timestamp}.json`
  }
  
  /**
   * 获取当前用户名
   */
  const getUsername = async (token: string): Promise<string | null> => {
    return getCurrentUser(token)
  }

  /**
   * 检查 fork 是否存在
   */
  const checkForkExists = async (token: string, owner: string, repo: string, username: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        // 检查是否是从目标仓库 fork 的
        return data.fork && data.parent?.full_name === `${owner}/${repo}`
      }
      return false
    } catch {
      return false
    }
  }

  /**
   * 创建 fork
   */
  const createFork = async (token: string, owner: string, repo: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/forks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      if (response.ok || response.status === 202) {
        const data = await response.json()
        return data.full_name // 返回 "username/repo"
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * 等待 fork 准备就绪
   */
  const waitForFork = async (token: string, username: string, repo: string, maxWait = 30000): Promise<boolean> => {
    const startTime = Date.now()
    while (Date.now() - startTime < maxWait) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${username}/${repo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        )
        if (response.ok) {
          return true
        }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    return false
  }

  /**
   * 确保用户有 fork 且 backup 分支存在
   */
  const ensureUserForkWithBackupBranch = async (
    token: string,
    owner: string,
    repo: string
  ): Promise<{ success: boolean; forkOwner?: string; message?: string }> => {
    try {
      // 获取当前用户名
      const username = await getUsername(token)
      if (!username) {
        return { success: false, message: '无法获取用户信息' }
      }

      // 检查 fork 是否存在
      let forkExists = await checkForkExists(token, owner, repo, username)
      
      if (!forkExists) {
        // 创建 fork
        const forkResult = await createFork(token, owner, repo)
        if (!forkResult) {
          return { success: false, message: '无法创建 Fork' }
        }
        
        // 等待 fork 准备就绪
        const ready = await waitForFork(token, username, repo)
        if (!ready) {
          return { success: false, message: 'Fork 创建中，请稍后重试' }
        }
        forkExists = true
      }

      userForkRepo.value = `${username}/${repo}`
      
      // 在用户的 fork 中确保 backup 分支存在
      const branchReady = await ensureBackupBranchInFork(username, repo, token)
      if (!branchReady) {
        return { success: false, message: '无法创建 backup 分支' }
      }

      return { success: true, forkOwner: username }
    } catch (e: any) {
      return { success: false, message: e.message || '准备 Fork 失败' }
    }
  }

  /**
   * 确保 fork 中的 backup 分支存在
   */
  const ensureBackupBranchInFork = async (
    owner: string,
    repo: string,
    token: string
  ): Promise<boolean> => {
    try {
      // 检查 backup 分支是否存在
      const branchResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches/backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (branchResponse.ok) {
        return true // 分支已存在
      }
      
      // 获取 main 分支的最新 commit SHA
      const mainResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!mainResponse.ok) {
        // 尝试 master 分支
        const masterResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/master`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        )
        
        if (!masterResponse.ok) {
          throw new Error('Cannot find main or master branch')
        }
        
        const masterData = await masterResponse.json()
        const sha = masterData.object.sha
        
        // 创建 backup 分支
        const createResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ref: 'refs/heads/backup',
              sha: sha
            })
          }
        )
        
        return createResponse.ok
      }
      
      const mainData = await mainResponse.json()
      const sha = mainData.object.sha
      
      // 创建 backup 分支
      const createResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: 'refs/heads/backup',
            sha: sha
          })
        }
      )
      
      return createResponse.ok
    } catch (e) {
      console.error('Failed to ensure backup branch:', e)
      return false
    }
  }
  
  /**
   * 备份 localStorage 到用户 Fork 的 GitHub backup 分支
   * 不提交 PR 到上游仓库，仅保存在用户自己的 fork 中
   */
  const backupToGitHub = async (
    owner: string,
    repo: string,
    authorName: string
  ): Promise<BackupResult> => {
    const token = await getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    isBackingUp.value = true
    backupError.value = ''
    
    try {
      // 确保用户有 fork 且 backup 分支存在
      const forkResult = await ensureUserForkWithBackupBranch(token, owner, repo)
      if (!forkResult.success || !forkResult.forkOwner) {
        throw new Error(forkResult.message || '无法创建或访问 Fork')
      }
      
      const forkOwner = forkResult.forkOwner
      
      // 收集备份数据
      const backupData = collectBackupData()
      const filename = generateBackupFilename(authorName)
      const path = `backups/${filename}`
      
      // 添加元数据
      const fullBackupData = {
        _meta: {
          author: authorName,
          timestamp: new Date().toISOString(),
          version: '1.0',
          note: '此备份存储在您的 Fork 仓库中，不包含 GitHub Token'
        },
        data: backupData
      }
      
      const content = JSON.stringify(fullBackupData, null, 2)
      
      // 上传到用户的 Fork 仓库
      const response = await fetch(
        `https://api.github.com/repos/${forkOwner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Backup: ${authorName} - ${new Date().toLocaleString('zh-CN')}`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: 'backup'
          })
        }
      )
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '备份上传失败')
      }
      
      return {
        success: true,
        message: `备份成功！已保存到您的 Fork: ${forkOwner}/${repo}`,
        filename,
        forkRepo: `${forkOwner}/${repo}`
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '备份失败'
      }
    } finally {
      isBackingUp.value = false
    }
  }
  
  /**
   * 获取用户 Fork 中的备份文件列表
   * @param owner 上游仓库 owner（如 soft-zihan）
   * @param repo 仓库名（如 soft-zihan.github.io）
   * @param authorName 用户的 GitHub 用户名，用于直接定位 fork 仓库
   */
  const listBackups = async (
    owner: string,
    repo: string,
    authorName?: string
  ): Promise<BackupFile[]> => {
    const token = await getToken()
    if (!token) {
      return []
    }
    
    try {
      // 优先使用传入的 authorName，否则通过 token 获取用户名
      let username = authorName?.trim()
      if (!username) {
        username = await getUsername(token) || undefined
      }
      if (!username) {
        return []
      }

      // 检查 fork 是否存在
      const forkExists = await checkForkExists(token, owner, repo, username)
      if (!forkExists) {
        return [] // 用户没有 fork，没有云端备份
      }
      
      // 从用户的 fork 获取备份列表
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/backups?ref=backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 404) {
          return [] // 备份文件夹不存在
        }
        throw new Error('获取备份列表失败')
      }
      
      const files = await response.json()
      
      if (!Array.isArray(files)) {
        return []
      }
      
      // 过滤只保留 .json 文件，并按名称排序（时间降序）
      // 记录 forkRepo 以便后续操作
      userForkRepo.value = `${username}/${repo}`
      backupList.value = files
        .filter((f: any) => f.name.endsWith('.json'))
        .map((f: any) => ({
          name: f.name,
          path: f.path,
          sha: f.sha,
          size: f.size,
          download_url: f.download_url,
          forkRepo: `${username}/${repo}`
        }))
        .sort((a: BackupFile, b: BackupFile) => b.name.localeCompare(a.name))
      
      return backupList.value
    } catch (e) {
      console.error('Failed to list backups:', e)
      return []
    }
  }
  
  /**
   * 获取云端备份的 URL（基于作者名推算）
   */
  const getCloudBackupUrl = (authorName: string, repo: string = 'soft-zihan.github.io'): string => {
    if (!authorName.trim()) return ''
    return `https://github.com/${authorName.trim()}/${repo}/tree/backup/backups`
  }
  
  /**
   * 从用户 Fork 的 GitHub 恢复备份
   * @param authorName 用户的 GitHub 用户名（fork owner）
   */
  const restoreFromGitHub = async (
    authorName: string,
    repo: string,
    filename: string
  ): Promise<BackupResult> => {
    const token = await getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    if (!authorName?.trim()) {
      return { success: false, message: '请先设置作者名称（GitHub用户名）' }
    }
    
    isRestoring.value = true
    backupError.value = ''
    
    try {
      const username = authorName.trim()
      
      // 从用户的 fork 获取备份文件内容
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/backups/${filename}?ref=backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('备份文件不存在或无法访问')
      }
      
      const fileData = await response.json()
      
      // 解码 Base64 内容
      const content = decodeURIComponent(escape(atob(fileData.content)))
      const backupData = JSON.parse(content)
      
      if (!backupData.data) {
        throw new Error('备份文件格式不正确')
      }
      
      // 恢复数据到 localStorage
      const data = backupData.data
      let restoredCount = 0
      
      for (const [key, value] of Object.entries(data)) {
        if (!EXCLUDED_KEYS.includes(key)) {
          try {
            if (typeof value === 'string') {
              localStorage.setItem(key, value)
            } else {
              localStorage.setItem(key, JSON.stringify(value))
            }
            restoredCount++
          } catch (e) {
            console.warn(`Failed to restore key: ${key}`, e)
          }
        }
      }
      
      return {
        success: true,
        message: `恢复成功！已恢复 ${restoredCount} 项设置。刷新页面以应用更改。`,
        filename
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '恢复失败'
      }
    } finally {
      isRestoring.value = false
    }
  }
  
  /**
   * 删除用户 Fork 中的备份文件
   * @param authorName 用户的 GitHub 用户名（fork owner）
   */
  const deleteBackup = async (
    authorName: string,
    repo: string,
    filename: string,
    sha: string
  ): Promise<BackupResult> => {
    const token = await getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    if (!authorName?.trim()) {
      return { success: false, message: '请先设置作者名称（GitHub用户名）' }
    }
    
    try {
      const username = authorName.trim()
      
      // 从用户的 fork 删除备份文件
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/backups/${filename}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Delete backup: ${filename}`,
            sha: sha,
            branch: 'backup'
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      return {
        success: true,
        message: '备份已删除'
      }
    } catch (e: any) {
      return {
        success: false,
        message: e.message || '删除失败'
      }
    }
  }
  
  /**
   * 解析备份文件名获取信息
   */
  const parseBackupFilename = (filename: string): { author: string; date: string } => {
    // 格式: authorName_YYYY-MM-DD_HH-MM-SS.json
    const match = filename.match(/^(.+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.json$/)
    if (match) {
      return {
        author: match[1],
        date: `${match[2]} ${match[3].replace(/-/g, ':')}`
      }
    }
    return {
      author: '未知',
      date: filename
    }
  }

  // ==================== 本地备份功能 ====================
  
  /**
   * 备份到本地（直接下载文件）
   * 本地备份不需要作者名，直接备份现有数据
   */
  const backupToLocal = async (): Promise<BackupResult> => {
    isBackingUp.value = true
    backupError.value = ''
    
    try {
      const backupData = collectBackupData()
      const filename = generateBackupFilename()
      
      const fullBackupData = {
        _meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          note: '本地备份，不包含 GitHub Token'
        },
        data: backupData
      }
      
      const content = JSON.stringify(fullBackupData, null, 2)
      
      // 直接下载文件
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return {
        success: true,
        message: '备份文件已下载！',
        filename
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '本地备份失败'
      }
    } finally {
      isBackingUp.value = false
    }
  }

  /**
   * 从文件导入备份
   */
  const importBackupFromFile = async (file: File): Promise<BackupResult> => {
    isRestoring.value = true
    backupError.value = ''
    
    try {
      const content = await file.text()
      const backupData = JSON.parse(content)
      
      if (!backupData.data) {
        throw new Error('备份文件格式不正确')
      }
      
      // 恢复数据
      const data = backupData.data
      let restoredCount = 0
      
      for (const [key, value] of Object.entries(data)) {
        if (!EXCLUDED_KEYS.includes(key)) {
          try {
            if (typeof value === 'string') {
              localStorage.setItem(key, value)
            } else {
              localStorage.setItem(key, JSON.stringify(value))
            }
            restoredCount++
          } catch (e) {
            console.warn(`Failed to restore key: ${key}`, e)
          }
        }
      }
      
      return {
        success: true,
        message: `恢复成功！已恢复 ${restoredCount} 项设置。刷新页面以应用更改。`
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '导入失败'
      }
    } finally {
      isRestoring.value = false
    }
  }
  
  return {
    isBackingUp,
    isRestoring,
    backupError,
    backupList,
    userForkRepo,
    backupToGitHub,
    listBackups,
    restoreFromGitHub,
    deleteBackup,
    parseBackupFilename,
    collectBackupData,
    getCloudBackupUrl,
    // 本地备份
    backupToLocal,
    importBackupFromFile
  }
}

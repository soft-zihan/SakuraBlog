import { ref } from 'vue'
import { tokenSecurity } from './useTokenSecurity'

export interface GitHubPublishOptions {
  owner: string
  repo: string
  branch: string
  token: string
}

export interface PublishResult {
  success: boolean
  message: string
  url?: string
  isPR?: boolean  // 是否通过 PR 方式提交
}

export function useGitHubPublish() {
  const isPublishing = ref(false)
  const publishError = ref('')
  const publishProgress = ref(0)
  
  // Get or set GitHub token (使用加密存储)
  const getToken = async (): Promise<string | null> => {
    return tokenSecurity.getToken()
  }
  
  // 同步获取（用于检查是否存在）
  const hasToken = (): boolean => {
    return tokenSecurity.hasToken()
  }
  
  const setToken = async (token: string): Promise<boolean> => {
    return tokenSecurity.saveToken(token)
  }
  
  const clearToken = () => {
    tokenSecurity.clearToken()
  }

  // 获取当前用户信息
  const getCurrentUser = async (token: string): Promise<string | null> => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        return data.login
      }
      return null
    } catch {
      return null
    }
  }

  // 检查用户是否有仓库写入权限
  const checkWriteAccess = async (options: GitHubPublishOptions): Promise<boolean> => {
    const { owner, repo, token } = options
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        // permissions.push 为 true 表示有写入权限
        return data.permissions?.push === true
      }
      return false
    } catch {
      return false
    }
  }

  // 检查 fork 是否存在
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

  // 创建 fork
  const createFork = async (options: GitHubPublishOptions): Promise<string | null> => {
    const { owner, repo, token } = options
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

  // 等待 fork 准备就绪
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

  // 缓存 fork 状态的 key
  const getForkCacheKey = (owner: string, repo: string, username: string) => 
    `fork_status_${owner}_${repo}_${username}`

  // 检查缓存的 fork 状态
  const getCachedForkStatus = (owner: string, repo: string, username: string): boolean | null => {
    const cached = sessionStorage.getItem(getForkCacheKey(owner, repo, username))
    if (cached) {
      const { exists, timestamp } = JSON.parse(cached)
      // 缓存有效期 30 分钟
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        return exists
      }
    }
    return null
  }

  // 缓存 fork 状态
  const setCachedForkStatus = (owner: string, repo: string, username: string, exists: boolean) => {
    sessionStorage.setItem(
      getForkCacheKey(owner, repo, username),
      JSON.stringify({ exists, timestamp: Date.now() })
    )
  }

  // 同步 fork 到最新（带重试）
  const syncFork = async (token: string, username: string, repo: string, branch: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/merge-upstream`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ branch })
        }
      )
      // 200 = 同步成功, 409 = 已经是最新
      return response.ok || response.status === 409
    } catch {
      return false
    }
  }

  // 强制同步 fork 并等待完成
  const ensureForkSynced = async (token: string, username: string, repo: string, branch: string): Promise<boolean> => {
    // 尝试同步 fork
    const synced = await syncFork(token, username, repo, branch)
    if (!synced) {
      console.warn('Fork sync failed, will try to continue anyway')
    }
    // 等待一小段时间让 GitHub 处理同步
    await new Promise(resolve => setTimeout(resolve, 1000))
    return synced
  }

  // 创建 Pull Request
  const createPullRequest = async (
    options: GitHubPublishOptions,
    forkOwner: string,
    title: string,
    body: string,
    headBranch: string = 'main'
  ): Promise<PublishResult> => {
    const { owner, repo, branch, token } = options
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            body,
            head: `${forkOwner}:${headBranch}`,
            base: branch
          })
        }
      )
      
      if (response.ok || response.status === 201) {
        const data = await response.json()
        return {
          success: true,
          message: 'Pull Request 创建成功！等待仓库管理员审核。',
          url: data.html_url,
          isPR: true
        }
      }
      
      const error = await response.json()
      // 如果 PR 已存在，也认为是成功
      if (error.errors?.some((e: any) => e.message?.includes('already exists'))) {
        return {
          success: true,
          message: 'Pull Request 已存在，请等待仓库管理员审核。',
          isPR: true
        }
      }
      
      throw new Error(error.message || 'Failed to create PR')
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Failed to create PR'
      }
    }
  }
  
  // Upload a file to GitHub (with Fork + PR fallback)
  const uploadFile = async (
    options: GitHubPublishOptions,
    path: string,
    content: string,
    message: string
  ): Promise<PublishResult> => {
    const { owner, repo, branch, token } = options
    
    try {
      // 先检查是否有写入权限，没有权限直接走 PR 流程
      const hasAccess = await checkWriteAccess(options)
      if (!hasAccess) {
        console.log('No write access, using Fork + PR mode')
        return await uploadFileViaPR(options, path, content, message)
      }
      
      // 有权限，尝试直接提交
      let sha: string | undefined
      const getResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (getResponse.ok) {
        const data = await getResponse.json()
        sha = data.sha
      }
      
      // 尝试直接创建或更新文件
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch,
            sha
          })
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          message: '已提交到 ' + branch,
          url: result.content?.html_url
        }
      }
      
      // 如果是 403/404 权限错误，尝试 Fork + PR 模式
      if (response.status === 403 || response.status === 404) {
        console.log('Direct commit failed, falling back to Fork + PR mode')
        return await uploadFileViaPR(options, path, content, message)
      }
      
      const error = await response.json()
      throw new Error(error.message || 'Failed to publish')
    } catch (e: any) {
      // 如果是权限相关错误，尝试 Fork + PR
      if (e.message?.includes('Resource not accessible') || 
          e.message?.includes('permission') ||
          e.message?.includes('403') ||
          e.message?.includes('404') ||
          e.message?.includes('Not Found')) {
        return await uploadFileViaPR(options, path, content, message)
      }
      return {
        success: false,
        message: e.message || 'Unknown error'
      }
    }
  }

  // 通过 Fork + PR 方式上传文件
  const uploadFileViaPR = async (
    options: GitHubPublishOptions,
    path: string,
    content: string,
    message: string
  ): Promise<PublishResult> => {
    const { owner, repo, branch, token } = options
    
    try {
      // 获取当前用户名
      const username = await getCurrentUser(token)
      if (!username) {
        return { success: false, message: 'Failed to get user info' }
      }
      
      // 先检查缓存的 fork 状态
      let forkExists = getCachedForkStatus(owner, repo, username)
      
      // 如果缓存中没有，则查询 API
      if (forkExists === null) {
        forkExists = await checkForkExists(token, owner, repo, username)
        setCachedForkStatus(owner, repo, username, forkExists)
      }
      
      if (!forkExists) {
        const forkResult = await createFork(options)
        if (!forkResult) {
          return { success: false, message: 'Failed to create fork' }
        }
        // 等待 fork 准备就绪
        const ready = await waitForFork(token, username, repo)
        if (!ready) {
          return { success: false, message: 'Fork creation timeout' }
        }
        // 更新缓存
        setCachedForkStatus(owner, repo, username, true)
      }
      
      // 同步 fork 到最新（确保不会因版本落后而失败）
      await ensureForkSynced(token, username, repo, branch)
      
      // 在 fork 中创建/更新文件
      let sha: string | undefined
      const getResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (getResponse.ok) {
        const data = await getResponse.json()
        sha = data.sha
      }
      
      const uploadResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch,
            sha
          })
        }
      )
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.message || 'Failed to upload to fork')
      }
      
      // 创建 PR
      const prResult = await createPullRequest(
        options,
        username,
        `📝 ${message}`,
        `此 PR 由 Sakura Notes 发布台自动创建。\n\n**文件路径:** \`${path}\`\n**提交者:** @${username}`,
        branch
      )
      
      return prResult
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'PR creation failed'
      }
    }
  }
  
  // Upload image and return URL (with Fork support)
  const uploadImage = async (
    options: GitHubPublishOptions,
    file: File,
    folder: string = 'notes/images'
  ): Promise<string | null> => {
    const { owner, repo, branch, token } = options
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const path = `${folder}/${fileName}`
    
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      // 检查是否有写入权限
      const hasAccess = await checkWriteAccess(options)
      
      // 确定目标仓库
      let targetOwner = owner
      let targetRepo = repo
      
      if (!hasAccess) {
        // 需要使用 fork
        const username = await getCurrentUser(token)
        if (!username) throw new Error('Failed to get user info')
        
        const forkExists = await checkForkExists(token, owner, repo, username)
        if (!forkExists) {
          const forkResult = await createFork(options)
          if (!forkResult) throw new Error('Failed to create fork')
          await waitForFork(token, username, repo)
        }
        
        await syncFork(token, username, repo, branch)
        targetOwner = username
        targetRepo = repo
      }
      
      const response = await fetch(
        `https://api.github.com/repos/${targetOwner}/${targetRepo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Upload image: ${fileName}`,
            content: base64,
            branch
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const result = await response.json()
      // 返回原始仓库的 raw URL（即使图片上传到了 fork）
      // 因为 PR 合并后图片才会在原仓库可用
      // 对于 fork，返回 fork 的 raw URL
      return result.content?.download_url || null
    } catch (e) {
      console.error('Image upload failed:', e)
      return null
    }
  }
  
  // Publish a full article
  const publishArticle = async (
    options: GitHubPublishOptions,
    title: string,
    content: string,
    folder: string = 'notes/zh',
    images: Array<{ id: string; file: File }> = []
  ): Promise<PublishResult> => {
    isPublishing.value = true
    publishError.value = ''
    publishProgress.value = 0
    
    try {
      let processedContent = content
      
      // Upload images first
      if (images.length > 0) {
        const totalSteps = images.length + 1
        
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          publishProgress.value = ((i + 1) / totalSteps) * 80
          
          const imageUrl = await uploadImage(options, img.file)
          if (imageUrl) {
            processedContent = processedContent.replace(
              new RegExp(`local-image:${img.id}`, 'g'),
              imageUrl
            )
          }
        }
      }
      
      publishProgress.value = 90
      
      const fileName = title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '')
        + '.md'
      
      const path = `${folder}/${fileName}`
      
      const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
---

`
      const finalContent = frontmatter + processedContent
      
      const result = await uploadFile(
        options,
        path,
        finalContent,
        `Add article: ${title}`
      )
      
      // 如果是直接提交（非 PR），触发工作流
      if (result.success && !result.isPR) {
        await triggerWorkflow(options)
      }
      
      publishProgress.value = 100
      return result
    } catch (e: any) {
      publishError.value = e.message
      return {
        success: false,
        message: e.message || 'Publish failed'
      }
    } finally {
      isPublishing.value = false
    }
  }
  
  // 触发 GitHub Action 工作流
  const triggerWorkflow = async (options: GitHubPublishOptions): Promise<boolean> => {
    const { owner, repo, token } = options
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/deploy.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: 'main'
          })
        }
      )
      
      if (response.status === 204 || response.ok) {
        console.log('GitHub Action triggered successfully')
        return true
      }
      
      console.log('Workflow dispatch not available, relying on push trigger')
      return true
    } catch (e) {
      console.warn('Failed to trigger workflow:', e)
      return false
    }
  }
  
  return {
    isPublishing,
    publishError,
    publishProgress,
    getToken,
    setToken,
    clearToken,
    hasToken,
    uploadFile,
    uploadImage,
    publishArticle,
    triggerWorkflow,
    checkWriteAccess,
    getCurrentUser
  }
}

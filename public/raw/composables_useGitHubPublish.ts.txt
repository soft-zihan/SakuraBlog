import { ref } from 'vue'

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
}

export function useGitHubPublish() {
  const isPublishing = ref(false)
  const publishError = ref('')
  const publishProgress = ref(0)
  
  // Get or set GitHub token
  const getToken = (): string | null => {
    return localStorage.getItem('github_pat')
  }
  
  const setToken = (token: string) => {
    localStorage.setItem('github_pat', token)
  }
  
  const clearToken = () => {
    localStorage.removeItem('github_pat')
  }
  
  // Upload a file to GitHub
  const uploadFile = async (
    options: GitHubPublishOptions,
    path: string,
    content: string,
    message: string
  ): Promise<PublishResult> => {
    const { owner, repo, branch, token } = options
    
    try {
      // Get current file SHA if exists (for update)
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
      
      // Create or update file
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
            content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
            branch,
            sha
          })
        }
      )
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to publish')
      }
      
      const result = await response.json()
      return {
        success: true,
        message: 'Published successfully!',
        url: result.content?.html_url
      }
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Unknown error'
      }
    }
  }
  
  // Upload image and return URL
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
          // Remove data:xxx;base64, prefix
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
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
      // Return raw URL for markdown
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
            // Replace placeholder with actual URL
            processedContent = processedContent.replace(
              new RegExp(`local-image:${img.id}`, 'g'),
              imageUrl
            )
          }
        }
      }
      
      publishProgress.value = 90
      
      // Generate filename from title
      const fileName = title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '')
        + '.md'
      
      const path = `${folder}/${fileName}`
      
      // Add frontmatter
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
      
      // 如果发布成功，自动触发 GitHub Action 重新部署
      if (result.success) {
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
            ref: 'main' // 或 'master'，取决于你的默认分支
          })
        }
      )
      
      // 204 No Content 表示成功
      if (response.status === 204 || response.ok) {
        console.log('GitHub Action triggered successfully')
        return true
      }
      
      // 如果 workflow_dispatch 不可用，则依靠 push 触发
      console.log('Workflow dispatch not available, relying on push trigger')
      return true
    } catch (e) {
      console.warn('Failed to trigger workflow:', e)
      // 失败不影响主流程，push 会自动触发 action
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
    uploadFile,
    uploadImage,
    publishArticle,
    triggerWorkflow
  }
}

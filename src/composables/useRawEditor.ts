import { ref, type Ref } from 'vue'
import type { FileNode } from '../types'
import { useGitHubPublish } from './useGitHubPublish'
import { buildMetaCommentWithContributors } from './useArticleMeta'

/**
 * Raw 模式编辑 composable
 * 负责源码编辑、GitHub 提交等功能
 */
export function useRawEditor(
  currentFile: Ref<FileNode | null>,
  isRawMode: Ref<boolean>,
  updateRenderedContent: () => Promise<void>,
  showToast: (msg: string) => void,
  lang: Ref<'en' | 'zh'>
) {
  const { getToken } = useGitHubPublish()
  
  const isEditingRaw = ref(false)
  const editedRawContent = ref('')
  const isSavingRaw = ref(false)
  const showSettings = ref(false) // 用于打开设置面板
  const isPreviewMode = ref(false) // 编辑时是否显示预览

  /**
   * 开始编辑
   */
  const startEditingRaw = () => {
    if (currentFile.value?.content) {
      editedRawContent.value = currentFile.value.content
      isEditingRaw.value = true
    }
  }

  /**
   * 取消编辑
   */
  const cancelEditingRaw = () => {
    isEditingRaw.value = false
    editedRawContent.value = ''
    isPreviewMode.value = false
  }

  /**
   * 切换预览模式
   */
  const togglePreviewMode = () => {
    isPreviewMode.value = !isPreviewMode.value
  }

  /**
   * 更新 main 分支上的文件
   */
  const updateFileOnMain = async (
    options: { owner: string; repo: string; base: string; token: string },
    filePath: string,
    content: string,
    title: string
  ): Promise<{ success: boolean; message: string; url?: string }> => {
    const { owner, repo, base, token } = options
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }

    try {
      let sha: string | undefined
      const fileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${base}`,
        { headers }
      )
      if (fileRes.ok) {
        const fileData = await fileRes.json()
        sha = fileData.sha
      }

      const updateRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `Update article: ${title}`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: base,
            sha
          })
        }
      )
      if (!updateRes.ok) {
        const err = await updateRes.json()
        throw new Error(err.message || 'Failed to update file on main')
      }

      const updateData = await updateRes.json()
      return { success: true, message: 'Updated on main', url: updateData.content?.html_url }
    } catch (e: any) {
      return { success: false, message: e.message || 'Update failed' }
    }
  }

  /**
   * 保存 Raw 内容到 GitHub
   */
  const saveRawContent = async () => {
    const token = await getToken()
    if (!token) {
      alert(lang.value === 'zh' ? '请先在设置中配置 GitHub Token' : 'Please configure GitHub Token in Settings')
      showSettings.value = true
      return
    }

    if (!currentFile.value) return

    isSavingRaw.value = true

    try {
      // 获取当前用户信息（用于贡献者名单）
      const contributorName = localStorage.getItem('author_name') || ''
      const contributorUrl = localStorage.getItem('author_url') || ''

      // 添加贡献者信息到内容
      let finalContent = editedRawContent.value
      if (contributorName) {
        finalContent = buildMetaCommentWithContributors(finalContent, { name: contributorName, url: contributorUrl })
      }

      // 构建文件路径
      const filePath = `notes/${currentFile.value.path}`
      const repoOwner = localStorage.getItem('github_repo_owner') || 'soft-zihan'
      const repoName = localStorage.getItem('github_repo_name') || 'soft-zihan.github.io'

      const result = await updateFileOnMain(
        { owner: repoOwner, repo: repoName, base: 'main', token },
        filePath,
        finalContent,
        currentFile.value.name
      )

      if (result.success) {
        // 更新本地内容
        currentFile.value.content = finalContent
        isEditingRaw.value = false
        editedRawContent.value = ''

        // 如果是渲染模式，重新渲染
        if (!isRawMode.value) {
          await updateRenderedContent()
        }

        if (result.url) {
          alert(`${lang.value === 'zh' ? '已提交到 main：' : 'Updated on main: '}${result.url}`)
        } else {
          showToast(lang.value === 'zh' ? '已提交到 main！' : 'Updated on main!')
        }
      } else {
        alert(`${lang.value === 'zh' ? '提交失败' : 'Publish failed'}: ${result.message}`)
      }
    } catch (e: any) {
      alert(`${lang.value === 'zh' ? '提交出错' : 'Publish error'}: ${e.message || e}`)
    } finally {
      isSavingRaw.value = false
    }
  }

  return {
    isEditingRaw,
    editedRawContent,
    isSavingRaw,
    showSettings,
    isPreviewMode,
    startEditingRaw,
    cancelEditingRaw,
    saveRawContent,
    togglePreviewMode
  }
}

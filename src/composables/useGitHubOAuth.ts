import { ref } from 'vue'
import { useTokenSecurity } from './useTokenSecurity'
import { safeLocalStorage } from '@/utils/storage'

const OAUTH_STATE_KEY = 'github_oauth_state'
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
const OAUTH_WORKER_URL = import.meta.env.VITE_GITHUB_OAUTH_WORKER_URL
const REDIRECT_URI = `${window.location.origin}${window.location.pathname}oauth/callback`

export function useGitHubOAuth() {
  const isLoggingIn = ref(false)
  const loginError = ref('')
  const { saveToken, getToken, hasToken, clearToken } = useTokenSecurity()

  /**
   * 发起 GitHub OAuth 登录
   */
  const initiateLogin = () => {
    if (!GITHUB_CLIENT_ID) {
      loginError.value = 'OAuth 未配置，请联系管理员'
      return
    }

    // 生成随机 state 防止 CSRF
    const state = generateRandomState()
    sessionStorage.setItem(OAUTH_STATE_KEY, state)

    // 构建 GitHub OAuth URL
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', 'repo user workflow')
    authUrl.searchParams.set('state', state)

    // 跳转到 GitHub
    window.location.href = authUrl.toString()
  }

  /**
   * 处理 OAuth 回调
   */
  const handleCallback = async (code: string, state: string): Promise<boolean> => {
    // 验证 state 防止 CSRF
    const savedState = sessionStorage.getItem(OAUTH_STATE_KEY)
    sessionStorage.removeItem(OAUTH_STATE_KEY)
    
    if (!savedState || state !== savedState) {
      loginError.value = 'OAuth state 验证失败，可能存在 CSRF 攻击'
      return false
    }

    if (!OAUTH_WORKER_URL) {
      loginError.value = 'OAuth 服务未配置'
      return false
    }

    isLoggingIn.value = true
    loginError.value = ''

    try {
      // 通过 Worker 交换 token
      const response = await fetch(`${OAUTH_WORKER_URL}/oauth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.access_token) {
        throw new Error('未获取到 access_token')
      }

      // 使用现有加密模块存储 token
      await saveToken(data.access_token)
      
      // 自动填充作者名
      if (data.username) {
        safeLocalStorage.setItem('author_name', data.username)
      }

      return true
    } catch (e: any) {
      console.error('OAuth callback error:', e)
      loginError.value = e.message || '登录失败'
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  /**
   * 退出登录
   */
  const logout = () => {
    clearToken()
    safeLocalStorage.removeItem('author_name')
  }

  /**
   * 检测 Token 过期并处理
   * 在 GitHub API 返回 401 时调用
   */
  const handleTokenExpired = () => {
    console.warn('GitHub Token 已过期或无效')
    clearToken()
    loginError.value = 'GitHub Token 已过期，请重新登录'
  }

  /**
   * 检查 OAuth 服务是否可用
   */
  const isOAuthAvailable = (): boolean => {
    return !!(GITHUB_CLIENT_ID && OAUTH_WORKER_URL)
  }

  return {
    isLoggingIn,
    loginError,
    initiateLogin,
    handleCallback,
    logout,
    handleTokenExpired,
    isOAuthAvailable,
    getToken,
    hasToken
  }
}

/**
 * 生成随机 state 字符串
 */
function generateRandomState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

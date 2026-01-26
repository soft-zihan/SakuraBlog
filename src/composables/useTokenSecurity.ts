/**
 * Token 安全存储模块
 * 使用 Web Crypto API 进行加密存储
 * 
 * 安全策略：
 * 1. Token 使用 AES-GCM 加密后存储
 * 2. 加密密钥基于浏览器指纹和用户特定盐值生成
 * 3. Token 永不以明文形式存储
 * 4. Token 不会被备份（排除在备份数据外）
 * 5. 清除浏览器数据会同时清除 Token
 */

const TOKEN_STORAGE_KEY = 'github_pat_encrypted'
const TOKEN_IV_KEY = 'github_pat_iv'
const TOKEN_SALT_KEY = 'github_pat_salt'

// 生成浏览器指纹（用于派生加密密钥）
const generateBrowserFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    screen.width.toString(),
    screen.height.toString(),
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || '4',
  ]
  return components.join('|')
}

// 将字符串转为 ArrayBuffer
const stringToBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str)
}

// 将 ArrayBuffer 转为 Base64 字符串
const bufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// 将 Base64 字符串转为 ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// 派生加密密钥
const deriveKey = async (salt: Uint8Array): Promise<CryptoKey> => {
  const fingerprint = generateBrowserFingerprint()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(fingerprint) as BufferSource,
    'PBKDF2',
    false,
    ['deriveKey']
  )
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// 加密 Token
const encryptToken = async (token: string): Promise<{ encrypted: string; iv: string; salt: string }> => {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(salt)
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    stringToBuffer(token) as BufferSource
  )
  
  return {
    encrypted: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt)
  }
}

// 解密 Token
const decryptToken = async (encrypted: string, ivBase64: string, saltBase64: string): Promise<string | null> => {
  try {
    const salt = new Uint8Array(base64ToBuffer(saltBase64))
    const iv = new Uint8Array(base64ToBuffer(ivBase64))
    const key = await deriveKey(salt)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      base64ToBuffer(encrypted)
    )
    
    return new TextDecoder().decode(decrypted)
  } catch (e) {
    console.error('Token decryption failed:', e)
    return null
  }
}

export function useTokenSecurity() {
  /**
   * 安全存储 Token
   */
  const saveToken = async (token: string): Promise<boolean> => {
    try {
      // 如果是空值，直接清除
      if (!token) {
        clearToken()
        return true
      }
      
      const { encrypted, iv, salt } = await encryptToken(token)
      localStorage.setItem(TOKEN_STORAGE_KEY, encrypted)
      localStorage.setItem(TOKEN_IV_KEY, iv)
      localStorage.setItem(TOKEN_SALT_KEY, salt)
      
      // 移除可能存在的旧版明文存储
      localStorage.removeItem('github_pat')
      
      return true
    } catch (e) {
      console.error('Failed to save token:', e)
      return false
    }
  }
  
  /**
   * 获取 Token
   */
  const getToken = async (): Promise<string | null> => {
    try {
      // 先检查旧版明文存储（兼容迁移）
      const legacyToken = localStorage.getItem('github_pat')
      if (legacyToken) {
        // 迁移到加密存储
        await saveToken(legacyToken)
        localStorage.removeItem('github_pat')
        return legacyToken
      }
      
      const encrypted = localStorage.getItem(TOKEN_STORAGE_KEY)
      const iv = localStorage.getItem(TOKEN_IV_KEY)
      const salt = localStorage.getItem(TOKEN_SALT_KEY)
      
      if (!encrypted || !iv || !salt) {
        return null
      }
      
      return await decryptToken(encrypted, iv, salt)
    } catch (e) {
      console.error('Failed to get token:', e)
      return null
    }
  }
  
  /**
   * 同步获取 Token（用于兼容现有代码）
   * 注意：这会先尝试获取缓存的 token
   */
  const getTokenSync = (): string | null => {
    // 先检查旧版
    const legacyToken = localStorage.getItem('github_pat')
    if (legacyToken) {
      return legacyToken
    }
    
    // 检查是否有加密存储
    const encrypted = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (encrypted) {
      // 返回一个占位符，实际使用时需要异步获取
      return '__ENCRYPTED__'
    }
    
    return null
  }
  
  /**
   * 检查是否有 Token
   */
  const hasToken = (): boolean => {
    return !!(
      localStorage.getItem(TOKEN_STORAGE_KEY) || 
      localStorage.getItem('github_pat')
    )
  }
  
  /**
   * 清除 Token
   */
  const clearToken = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(TOKEN_IV_KEY)
    localStorage.removeItem(TOKEN_SALT_KEY)
    localStorage.removeItem('github_pat') // 清除旧版
  }
  
  /**
   * 验证 Token 是否有效（通过 GitHub API）
   */
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
  
  return {
    saveToken,
    getToken,
    getTokenSync,
    hasToken,
    clearToken,
    validateToken
  }
}

// 导出便捷函数用于非组件代码
export const tokenSecurity = {
  async getToken(): Promise<string | null> {
    const { getToken } = useTokenSecurity()
    return getToken()
  },
  
  async saveToken(token: string): Promise<boolean> {
    const { saveToken } = useTokenSecurity()
    return saveToken(token)
  },
  
  hasToken(): boolean {
    const { hasToken } = useTokenSecurity()
    return hasToken()
  },
  
  clearToken(): void {
    const { clearToken } = useTokenSecurity()
    clearToken()
  }
}

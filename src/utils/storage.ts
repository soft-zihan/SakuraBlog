const memoryStorage = new Map<string, string>()

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return memoryStorage.get(key) ?? null
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      memoryStorage.set(key, value)
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch {
      memoryStorage.delete(key)
    }
  },
  key(index: number): string | null {
    try {
      return window.localStorage.key(index)
    } catch {
      const keys = Array.from(memoryStorage.keys())
      return keys[index] ?? null
    }
  },
  length(): number {
    try {
      return window.localStorage.length
    } catch {
      return memoryStorage.size
    }
  }
}

export function safeGetJson<T>(key: string): T | null {
  const raw = safeLocalStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function safeSetJson(key: string, value: unknown): void {
  safeLocalStorage.setItem(key, JSON.stringify(value))
}

export function createSafeStorageLike(): { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void } {
  return {
    getItem: (key: string) => safeLocalStorage.getItem(key),
    setItem: (key: string, value: string) => safeLocalStorage.setItem(key, value)
  }
}

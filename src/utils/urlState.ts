export type SakuraUrlState = {
  targetPath: string | null
  sourcePath: string | null
  lab: string | null
  tab: string | null
}

export const getSakuraUrlState = (search?: string): SakuraUrlState => {
  const raw = typeof search === 'string' ? search : window.location.search
  const params = new URLSearchParams(raw)
  return {
    targetPath: params.get('path'),
    sourcePath: params.get('source'),
    lab: params.get('lab'),
    tab: params.get('tab')
  }
}

export const decodeUrlParam = (val: string | null): string | null => {
  if (!val) return null
  try {
    return decodeURIComponent(val)
  } catch {
    return val
  }
}


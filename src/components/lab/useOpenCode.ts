type OpenCodeDetail = {
  path: string
  range?: string
  anchor?: string
  find?: string
  focus?: string
}

const parseToken = (token?: string): Omit<OpenCodeDetail, 'path'> => {
  const raw = (token || '').trim()
  const isLineRange = !!raw && /^L?\d+(-L?\d+)?$/i.test(raw)
  const isFind = raw.toLowerCase().startsWith('find:')
  const range = isLineRange ? raw : undefined
  const anchor = !isLineRange && !isFind && raw ? raw : undefined
  const find = isFind ? raw.slice('find:'.length).trim() : undefined
  return { range, anchor, find }
}

export const openCode = (path: string, token?: string) => {
  openCodeDetail({ path, ...parseToken(token) })
}

export const openCodeWithFocus = (path: string, token: string | undefined, focus: string) => {
  openCodeDetail({ path, ...parseToken(token), focus })
}

export const openCodeDetail = (detail: OpenCodeDetail) => {
  window.dispatchEvent(new CustomEvent('sakura-open-code', { detail }))
}

export const useOpenCode = () => ({ openCode })

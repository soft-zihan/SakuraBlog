export type StageGuideCodeRef = {
  path: string
  range?: string
  anchor?: string
  find?: string
}

const stripSuffix = (raw: string) => {
  const idxParen = raw.indexOf('(')
  const idxParenZh = raw.indexOf('（')
  const idx = idxParen === -1 ? idxParenZh : (idxParenZh === -1 ? idxParen : Math.min(idxParen, idxParenZh))
  return (idx === -1 ? raw : raw.slice(0, idx)).trim()
}

export function parseStageGuideCodeRef(text: string): StageGuideCodeRef | null {
  const trimmed = (text || '').trim()
  if (!trimmed) return null

  const zhPrefix = '对照源码：'
  const enPrefix = 'Source:'
  const enPrefixAlt = 'Source reference:'

  let rawRef: string | null = null
  if (trimmed.startsWith(zhPrefix)) rawRef = trimmed.slice(zhPrefix.length).trim()
  else if (trimmed.startsWith(enPrefixAlt)) rawRef = trimmed.slice(enPrefixAlt.length).trim()
  else if (trimmed.startsWith(enPrefix)) rawRef = trimmed.slice(enPrefix.length).trim()

  if (!rawRef) return null

  const withoutSuffix = stripSuffix(rawRef)
  const [beforeFind, findPart] = withoutSuffix.split('?find=')
  const find = findPart ? decodeURIComponent(findPart.trim()) : undefined

  const hashIdx = beforeFind.indexOf('#')
  const path = (hashIdx === -1 ? beforeFind : beforeFind.slice(0, hashIdx)).trim().replace(/^\/+/, '')
  const hash = hashIdx === -1 ? undefined : beforeFind.slice(hashIdx + 1).trim()

  if (!path) return null

  if (hash && /^L?\d+(-L?\d+)?$/i.test(hash)) return { path, range: hash, find }
  if (hash) return { path, anchor: hash, find }
  return { path, find }
}


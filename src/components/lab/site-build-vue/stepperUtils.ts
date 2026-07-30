export type TextPatch = {
  startIndex: number
  deleteCount: number
  insertText: string
  fromLine: number
  toLine: number
  nextNormalized: string
}

type LineDiffOp = { type: 'equal' | 'insert' | 'delete'; line: string }

type LineHunk = { aStartLine: number; aDeleteLines: number; insertLines: string[] }

export type GuideEntry = { id?: string; commentLine: string; anchorLine?: string }

function normalizeLf(s: string) {
  return String(s || '').replace(/\r\n/g, '\n')
}

function splitLines(text: string) {
  const s = normalizeLf(text)
  if (!s) return ['']
  return s.split('\n')
}

function myersLineDiff(aLines: string[], bLines: string[]): LineDiffOp[] {
  const N = aLines.length
  const M = bLines.length
  const max = N + M
  const offset = max
  let v = new Array<number>(2 * max + 1).fill(0)
  v[offset + 1] = 0
  const trace: Array<number[]> = []

  for (let d = 0; d <= max; d++) {
    const vCopy = v.slice()
    trace.push(vCopy)
    for (let k = -d; k <= d; k += 2) {
      const kIndex = offset + k
      let x: number
      if (k === -d || (k !== d && v[kIndex - 1] < v[kIndex + 1])) x = v[kIndex + 1]
      else x = v[kIndex - 1] + 1
      let y = x - k
      while (x < N && y < M && aLines[x] === bLines[y]) {
        x++
        y++
      }
      v[kIndex] = x
      if (x >= N && y >= M) {
        const ops: LineDiffOp[] = []
        let x2 = N
        let y2 = M
        for (let d2 = d; d2 >= 0; d2--) {
          const v2 = trace[d2]!
          const k2 = x2 - y2
          const k2Index = offset + k2
          let prevK: number
          if (k2 === -d2 || (k2 !== d2 && v2[k2Index - 1] < v2[k2Index + 1])) prevK = k2 + 1
          else prevK = k2 - 1
          const prevX = v2[offset + prevK]!
          const prevY = prevX - prevK
          while (x2 > prevX && y2 > prevY) {
            ops.push({ type: 'equal', line: aLines[x2 - 1]! })
            x2--
            y2--
          }
          if (d2 === 0) break
          if (x2 === prevX) {
            ops.push({ type: 'insert', line: bLines[y2 - 1]! })
            y2--
          } else {
            ops.push({ type: 'delete', line: aLines[x2 - 1]! })
            x2--
          }
        }
        ops.reverse()
        return ops
      }
    }
  }
  return []
}

function computeLineHunks(prevText: string, nextText: string): LineHunk[] {
  const aLines = splitLines(prevText)
  const bLines = splitLines(nextText)
  const ops = myersLineDiff(aLines, bLines)
  const hunks: LineHunk[] = []
  let aPos = 0
  let current: LineHunk | null = null

  const flush = () => {
    if (!current) return
    if (current.aDeleteLines > 0 || current.insertLines.length > 0) hunks.push(current)
    current = null
  }

  for (const op of ops) {
    if (op.type === 'equal') {
      flush()
      aPos++
      continue
    }
    if (!current) current = { aStartLine: aPos + 1, aDeleteLines: 0, insertLines: [] }
    if (op.type === 'delete') {
      current.aDeleteLines++
      aPos++
      continue
    }
    current.insertLines.push(op.line)
  }
  flush()
  return hunks
}

function indexAtLineStart(text: string, lineNumber: number) {
  const s = normalizeLf(text)
  const ln = Math.max(1, Math.floor(lineNumber))
  if (ln === 1) return 0
  let idx = 0
  let cur = 1
  while (cur < ln && idx < s.length) {
    const nextNl = s.indexOf('\n', idx)
    if (nextNl < 0) return s.length
    idx = nextNl + 1
    cur++
  }
  return idx
}

function buildPatchFromLineChange(currentText: string, startLine: number, deleteLines: number, insertText: string): TextPatch | null {
  const cur = normalizeLf(currentText)
  const startIndex = indexAtLineStart(cur, startLine)
  const endIndex = indexAtLineStart(cur, startLine + Math.max(0, Math.floor(deleteLines)))
  const deleteCount = Math.max(0, endIndex - startIndex)
  let finalInsertText = insertText
  if (finalInsertText && endIndex < cur.length && !finalInsertText.endsWith('\n')) finalInsertText += '\n'
  const nextNormalized = `${cur.slice(0, startIndex)}${finalInsertText}${cur.slice(startIndex + deleteCount)}`
  const effectiveInsert = finalInsertText ? (finalInsertText.endsWith('\n') ? finalInsertText.slice(0, -1) : finalInsertText) : ''
  const insertedLineCount = effectiveInsert ? effectiveInsert.split('\n').length : 0
  const fromLine = Math.max(1, Math.floor(startLine))
  const toLine = insertedLineCount > 0 ? Math.max(fromLine, fromLine + insertedLineCount - 1) : fromLine
  if (deleteCount === 0 && !finalInsertText) return null
  return { startIndex, deleteCount, insertText: finalInsertText, fromLine, toLine, nextNormalized }
}

export function buildPatchesFromHunks(prevText: string, nextText: string): TextPatch[] {
  const hunks = computeLineHunks(prevText, nextText)
  if (hunks.length === 0) return []
  let current = normalizeLf(prevText)
  let lineDelta = 0
  const patches: TextPatch[] = []
  for (const h of hunks) {
    const startLine = h.aStartLine + lineDelta
    const insertText = h.insertLines.join('\n')
    const patch = buildPatchFromLineChange(current, startLine, h.aDeleteLines, insertText)
    if (!patch) continue
    patches.push(patch)
    current = patch.nextNormalized
    lineDelta += h.insertLines.length - h.aDeleteLines
  }
  return patches
}

function snippetFromInsert(insertText: string) {
  const raw = String(insertText || '').replace(/\r\n/g, '\n')
  const first = raw
    .split('\n')
    .map((s) => s.trim())
    .find((s) => !!s)
  const s = first || ''
  if (s.length <= 72) return s
  return `${s.slice(0, 69)}…`
}

function normalizeGuideText(raw: string) {
  const s = String(raw || '').trim().replace(/\s+/g, ' ')
  if (!s) return ''
  return s.replace(/^(index\.html|styles\.css|main\.js)\s*[:：]\s*/i, '')
}

function normalizeGuideId(raw: string) {
  const s = String(raw || '').trim()
  if (!s) return ''
  return s.replace(/\s+/g, '_').replace(/[()]/g, '')
}

function buildGuideComment(
  target: 'index' | 'styles' | 'main',
  guideId: string,
  guideText: string,
  indent: string,
  insertText: string,
  lang: 'en' | 'zh'
) {
  const text = normalizeGuideText(guideText)
  if (!text) return ''
  const snippet = snippetFromInsert(insertText)
  const eg = lang === 'zh' ? '例：' : 'e.g. '
  const body = snippet ? `${text} | ${eg}${snippet}` : text
  const id = normalizeGuideId(guideId)
  const head = id ? `GUIDE(step=${id}): ` : 'GUIDE: '
  if (target === 'index') return `${indent}<!-- ${head}${body} -->\n`
  if (target === 'styles') return `${indent}/* ${head}${body} */\n`
  return `${indent}// ${head}${body}\n`
}

function isGuideLine(target: 'index' | 'styles' | 'main', line: string) {
  const s = String(line || '').trim()
  if (!s) return false
  if (target === 'index') return s.startsWith('<!-- GUIDE')
  if (target === 'styles') return s.startsWith('/* GUIDE')
  return s.startsWith('// GUIDE')
}

function guideIdFromLine(line: string) {
  const s = String(line || '').trim()
  const m = s.match(/GUIDE\(step=([^)]+)\)\s*:/i)
  const id = normalizeGuideId(m?.[1] || '')
  return id || undefined
}

export function extractGuideEntries(target: 'index' | 'styles' | 'main', input: string) {
  const src = normalizeLf(input)
  if (!src) return [] as GuideEntry[]
  const lines = src.split('\n')
  const entries: GuideEntry[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!isGuideLine(target, line)) continue
    let anchorLine: string | undefined
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]
      const nextTrim = String(next || '').trim()
      if (!nextTrim) continue
      if (isGuideLine(target, next)) continue
      anchorLine = next
      break
    }
    entries.push({ id: guideIdFromLine(line), commentLine: line, anchorLine })
  }
  return entries
}

export function mergeGuideEntries(target: 'index' | 'styles' | 'main', baseText: string, entries: GuideEntry[]) {
  const src = normalizeLf(baseText)
  if (entries.length === 0) return src
  const lines = src ? src.split('\n') : []

  const hasLine = new Set(lines)
  const hasId = new Set<string>()
  for (const line of lines) {
    if (!isGuideLine(target, line)) continue
    const id = guideIdFromLine(line)
    if (id) hasId.add(id)
  }
  let searchFrom = 0
  for (const e of entries) {
    const commentLine = e.commentLine
    const id = normalizeGuideId(e.id || '') || guideIdFromLine(commentLine) || ''
    if (id && hasId.has(id)) continue
    if (!commentLine || hasLine.has(commentLine)) continue

    let insertAt = -1
    const anchor = e.anchorLine
    if (anchor) {
      for (let i = searchFrom; i < lines.length; i++) {
        if (lines[i] === anchor) {
          insertAt = i
          break
        }
      }
      if (insertAt < 0) {
        const anchorTrim = String(anchor || '').trim()
        if (anchorTrim) {
          for (let i = searchFrom; i < lines.length; i++) {
            if (String(lines[i] || '').trim() === anchorTrim) {
              insertAt = i
              break
            }
          }
        }
      }
    }
    if (insertAt < 0) insertAt = lines.length
    lines.splice(insertAt, 0, commentLine)
    hasLine.add(commentLine)
    if (id) hasId.add(id)
    searchFrom = Math.min(lines.length, insertAt + 1)
  }
  return lines.join('\n')
}

export function insertGuideAfterPatches(
  target: 'index' | 'styles' | 'main',
  baseText: string,
  firstPatch: TextPatch | null,
  guideText: string,
  guideId: string,
  lang: 'en' | 'zh'
) {
  const id = normalizeGuideId(guideId)
  if (!id || !firstPatch) return normalizeLf(baseText)
  const text = normalizeLf(baseText)
  const lines = text ? text.split('\n') : []
  for (const line of lines) {
    if (!isGuideLine(target, line)) continue
    if (guideIdFromLine(line) === id) return text
  }
  const lineStart = indexAtLineStart(text, firstPatch.fromLine)
  const nextNl = text.indexOf('\n', lineStart)
  const line = text.slice(lineStart, nextNl >= 0 ? nextNl : text.length)
  const indent = line.match(/^\s*/)?.[0] || ''
  const commentLine = buildGuideComment(target, id, guideText, indent, firstPatch.insertText, lang)
  if (!commentLine) return text
  return `${text.slice(0, lineStart)}${commentLine}${text.slice(lineStart)}`
}


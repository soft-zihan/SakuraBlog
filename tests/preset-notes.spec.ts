import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

type PresetNote = {
  line?: number
  content?: string
  match?: string
  matchRegex?: string
  occurrence?: number
  offset?: number
}

type PresetMeta = {
  version: string
  format: string
  basePath: string
}

type PerFilePreset = {
  version: string
  intro?: string
  notes: PresetNote[]
}

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'public', 'data')

const loadPresetMeta = (lang: 'en' | 'zh'): PresetMeta => {
  const p = path.join(dataDir, `source-notes-preset.${lang}.json`)
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw) as PresetMeta
}

const splitLines = (text: string): string[] => text.replace(/\r\n/g, '\n').split('\n')

const countIncludesMatches = (lines: string[], needle: string): number => {
  if (!needle) return 0
  let hit = 0
  for (const line of lines) {
    if (line.includes(needle)) hit++
  }
  return hit
}

const countRegexMatches = (lines: string[], pattern: string): number => {
  if (!pattern) return 0
  const re = new RegExp(pattern)
  let hit = 0
  for (const line of lines) {
    if (re.test(line)) hit++
  }
  return hit
}

const resolveNthMatchLine = (note: PresetNote, lines: string[]): number | null => {
  const occurrence = Math.max(1, Number(note.occurrence ?? 1))
  const offset = Number(note.offset ?? 0)

  let idx = -1
  if (note.matchRegex) {
    const re = new RegExp(note.matchRegex)
    let hit = 0
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hit++
        if (hit === occurrence) {
          idx = i
          break
        }
      }
    }
  } else if (note.match) {
    let hit = 0
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(note.match)) {
        hit++
        if (hit === occurrence) {
          idx = i
          break
        }
      }
    }
  } else if (typeof note.line === 'number' && Number.isFinite(note.line)) {
    const line = Math.floor(note.line + offset)
    if (line >= 1 && line <= lines.length) return line
    return null
  }

  if (idx < 0) return null
  const line = idx + 1 + offset
  if (line < 1 || line > lines.length) return null
  return line
}

const walkFiles = (dir: string): string[] => {
  const out: string[] = []
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop() as string
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, entry.name)
      if (entry.isDirectory()) stack.push(p)
      else if (entry.isFile()) out.push(p)
    }
  }
  return out
}

const validatePresetNotes = (lang: 'en' | 'zh') => {
  const meta = loadPresetMeta(lang)
  expect(typeof meta.version).toBe('string')
  expect(meta.version.length).toBeGreaterThan(0)
  expect(meta.format).toBe('per-file')
  expect(typeof meta.basePath).toBe('string')

  const baseDir = path.join(dataDir, 'source-notes-preset', lang)
  expect(fs.existsSync(baseDir)).toBe(true)

  const presetFiles = walkFiles(baseDir).filter(p => p.endsWith('.notes.json'))
  expect(presetFiles.length).toBeGreaterThan(0)

  for (const presetPath of presetFiles) {
    const rel = path.relative(baseDir, presetPath)
    const sourceRel = rel.replace(/\.notes\.json$/i, '')
    const sourceAbs = path.join(rootDir, sourceRel)
    expect(fs.existsSync(sourceAbs)).toBe(true)

    const preset = JSON.parse(fs.readFileSync(presetPath, 'utf-8')) as PerFilePreset
    expect(typeof preset.version).toBe('string')
    expect(preset.version.length).toBeGreaterThan(0)
    expect(Array.isArray(preset.notes)).toBe(true)

    const fileLines = splitLines(fs.readFileSync(sourceAbs, 'utf-8'))

    for (const note of preset.notes) {
      const content = (note.content ?? '').trim()
      expect(content.length).toBeGreaterThan(0)

      const hasAnchor = Boolean(note.matchRegex || note.match)
      expect(hasAnchor).toBe(true)

      const occurrence = Math.max(1, Number(note.occurrence ?? 1))

      if (note.matchRegex) {
        let matchCount = 0
        try {
          matchCount = countRegexMatches(fileLines, note.matchRegex)
        } catch (e) {
          expect(e).toBeNull()
        }
        expect(matchCount).toBeGreaterThanOrEqual(occurrence)
        if (matchCount !== 1) expect(typeof note.occurrence).toBe('number')
      } else if (note.match) {
        const matchCount = countIncludesMatches(fileLines, note.match)
        expect(matchCount).toBeGreaterThanOrEqual(occurrence)
        if (matchCount !== 1) expect(typeof note.occurrence).toBe('number')
      }

      const resolved = resolveNthMatchLine(note, fileLines)
      expect(resolved).not.toBeNull()
    }
  }
}

describe('Preset source notes: anchor stability', () => {
  it('en preset notes resolve with explicit anchors', () => {
    validatePresetNotes('en')
  })

  it('zh preset notes resolve with explicit anchors', () => {
    validatePresetNotes('zh')
  })
})

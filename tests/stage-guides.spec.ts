import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { STAGE_GUIDES } from '../src/labs/stageGuides'
import { parseStageGuideCodeRef } from '../src/labs/stageGuideRefs'

const EXPECTED_STAGE_IDS = [
  'foundation',
  'css-layout',
  'js-basics',
  'js-advanced',
  'engineering',
  'vue-core',
  'vue-advanced',
  'challenge'
] as const

type StageId = (typeof EXPECTED_STAGE_IDS)[number]

function assertNonEmptyStrings(items: string[], label: string) {
  expect(Array.isArray(items), `${label} should be an array`).toBe(true)
  expect(items.length, `${label} should not be empty`).toBeGreaterThan(0)
  for (const it of items) {
    expect(typeof it, `${label} item should be string`).toBe('string')
    expect(it.trim().length, `${label} item should not be blank`).toBeGreaterThan(0)
    expect(it, `${label} item should be trimmed`).toBe(it.trim())
  }
}

describe('Stage guides', () => {
  it('covers all expected stages with non-empty key sections', () => {
    const guideKeys = Object.keys(STAGE_GUIDES).sort()
    expect(guideKeys).toEqual([...EXPECTED_STAGE_IDS].sort())

    for (const stageId of EXPECTED_STAGE_IDS) {
      const guide = STAGE_GUIDES[stageId as StageId]

      expect(guide.titleZh.trim().length).toBeGreaterThan(0)
      expect(guide.titleEn.trim().length).toBeGreaterThan(0)
      expect(guide.leadZh.trim().length).toBeGreaterThan(0)
      expect(guide.leadEn.trim().length).toBeGreaterThan(0)

      assertNonEmptyStrings(guide.prerequisitesZh, `${stageId}.prerequisitesZh`)
      assertNonEmptyStrings(guide.prerequisitesEn, `${stageId}.prerequisitesEn`)
      assertNonEmptyStrings(guide.syntaxPointsZh, `${stageId}.syntaxPointsZh`)
      assertNonEmptyStrings(guide.syntaxPointsEn, `${stageId}.syntaxPointsEn`)
      assertNonEmptyStrings(guide.commonPitfallsZh, `${stageId}.commonPitfallsZh`)
      assertNonEmptyStrings(guide.commonPitfallsEn, `${stageId}.commonPitfallsEn`)
      assertNonEmptyStrings(guide.extensionsZh, `${stageId}.extensionsZh`)
      assertNonEmptyStrings(guide.extensionsEn, `${stageId}.extensionsEn`)
    }
  })

  it('StageLearningGuide.vue references extensions section', () => {
    const repoRoot = process.cwd()
    const filePath = path.join(repoRoot, 'src', 'components', 'lab', 'stages', 'StageLearningGuide.vue')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain('extensionsZh')
    expect(content).toContain('extensionsEn')
    expect(content).toContain('parseStageGuideCodeRef')
    expect(content).toContain('扩展（可选）')
    expect(content).toContain('Extensions (optional)')
  })

  it('code references in extensions resolve to real files and tokens', () => {
    const repoRoot = process.cwd()

    const parseRange = (raw: string) => {
      const match = raw.match(/L?(\d+)(?:-L?(\d+))?/i)
      if (!match) return null
      const startLine = Number(match[1])
      const endLine = match[2] ? Number(match[2]) : startLine
      if (!Number.isFinite(startLine) || !Number.isFinite(endLine)) return null
      return { startLine, endLine }
    }

    for (const stageId of EXPECTED_STAGE_IDS) {
      const guide = STAGE_GUIDES[stageId as StageId]
      const items = [...guide.extensionsZh, ...guide.extensionsEn]
      for (const text of items) {
        const ref = parseStageGuideCodeRef(text)
        if (!ref) continue

        const abs = path.join(repoRoot, ref.path)
        expect(fs.existsSync(abs), `missing file for ref: ${text}`).toBe(true)
        expect(fs.statSync(abs).isFile(), `ref should point to file: ${text}`).toBe(true)

        const content = fs.readFileSync(abs, 'utf-8')

        if (ref.find) {
          expect(
            content.toLowerCase().includes(ref.find.toLowerCase()),
            `find token not found in file: ${text}`
          ).toBe(true)
        }

        if (ref.anchor) {
          expect(
            content.includes(ref.anchor),
            `anchor token not found in file: ${text}`
          ).toBe(true)
        }

        if (ref.range) {
          const parsed = parseRange(ref.range)
          expect(parsed, `invalid range token: ${text}`).not.toBeNull()
          const lineCount = content.split(/\r?\n/).length
          expect(parsed!.startLine).toBeGreaterThan(0)
          expect(parsed!.endLine).toBeGreaterThan(0)
          expect(parsed!.startLine).toBeLessThanOrEqual(lineCount)
          expect(parsed!.endLine).toBeLessThanOrEqual(lineCount)
        }
      }
    }
  })
})

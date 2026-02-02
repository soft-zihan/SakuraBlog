export type PresetNote = {
  line?: number
  content?: string
  match?: string
  matchRegex?: string
  occurrence?: number
  offset?: number
}

const findLineIndexByIncludes = (fileLines: string[], match: string, occurrence: number): number => {
  if (!match) return -1
  let hit = 0
  for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i].includes(match)) {
      hit++
      if (hit === occurrence) return i
    }
  }
  return -1
}

const findLineIndexByRegex = (fileLines: string[], matchRegex: string, occurrence: number): number => {
  if (!matchRegex) return -1
  let re: RegExp
  try {
    re = new RegExp(matchRegex)
  } catch {
    return -1
  }
  let hit = 0
  for (let i = 0; i < fileLines.length; i++) {
    if (re.test(fileLines[i])) {
      hit++
      if (hit === occurrence) return i
    }
  }
  return -1
}

export const resolvePresetNoteLine = (note: PresetNote, fileLines: string[]): number | null => {
  const occurrence = Math.max(1, Number(note.occurrence || 1))
  const offset = Number(note.offset || 0)
  let idx = -1

  if (note.matchRegex) idx = findLineIndexByRegex(fileLines, note.matchRegex, occurrence)
  else if (note.match) idx = findLineIndexByIncludes(fileLines, note.match, occurrence)

  if (idx >= 0) {
    const line = idx + 1 + offset
    if (line >= 1 && line <= fileLines.length) return line
    return null
  }

  if (typeof note.line === 'number' && Number.isFinite(note.line)) {
    const line = Math.floor(note.line + offset)
    if (line >= 1 && line <= fileLines.length) return line
  }
  return null
}

export const buildPresetNoteMap = (notes: PresetNote[] | undefined, fileLines: string[]): Map<number, string> => {
  const map = new Map<number, string>()
  if (!notes?.length) return map

  for (const note of notes) {
    const line = resolvePresetNoteLine(note, fileLines)
    if (!line) continue

    const content = (note.content || '').trim()
    if (!content) continue

    const existing = map.get(line)
    map.set(line, existing ? `${existing}\n\n${content}` : content)
  }
  return map
}

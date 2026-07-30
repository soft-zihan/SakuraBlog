import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

const presetRootDir = path.join(rootDir, 'public', 'data', 'source-notes-preset')
const metaRootDir = path.join(rootDir, 'public', 'data')

const readJsonFile = (filePath: string): any => {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
}

const collectFiles = (dir: string, out: string[] = []) => {
  if (!fs.existsSync(dir)) return out
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectFiles(full, out)
      continue
    }
    out.push(full)
  }
  return out
}

const removeTopLevelVersion = (filePath: string) => {
  const data = readJsonFile(filePath)
  if (!data || typeof data !== 'object') return false
  if (!Object.prototype.hasOwnProperty.call(data, 'version')) return false
  delete data.version
  writeJsonFile(filePath, data)
  return true
}

const languages = fs.existsSync(presetRootDir)
  ? fs
      .readdirSync(presetRootDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
  : []

const results: Array<{
  presetLang: string
  metaFileChanged: boolean
  scannedPerFileNotes: number
  changedPerFileNotes: number
}> = []

for (const presetLang of languages) {
  const perFileDir = path.join(presetRootDir, presetLang)
  const metaFile = path.join(metaRootDir, `source-notes-preset.${presetLang}.json`)

  const metaChanged = fs.existsSync(metaFile) ? removeTopLevelVersion(metaFile) : false

  const files = collectFiles(perFileDir).filter(p => p.endsWith('.notes.json'))
  let changed = 0
  for (const filePath of files) {
    if (removeTopLevelVersion(filePath)) changed++
  }

  results.push({
    presetLang,
    metaFileChanged: metaChanged,
    scannedPerFileNotes: files.length,
    changedPerFileNotes: changed
  })
}

console.log(JSON.stringify({ languages: results }, null, 2))

const readFlag = (): boolean => {
  try {
    const w = window as any
    if (w.__sakuraPerfEnabled === true) return true
    const params = new URLSearchParams(window.location.search)
    if (params.get('perf') === '1') return true
    return window.localStorage.getItem('sakura:perf:v1') === '1'
  } catch {
    return false
  }
}

let cached: { enabled: boolean; at: number } | null = null

const enabled = (): boolean => {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (cached && now - cached.at < 1000) return cached.enabled
  const val = readFlag()
  cached = { enabled: val, at: now }
  return val
}

const safeMark = (name: string) => {
  if (!enabled()) return
  try {
    performance.mark(name)
  } catch {}
}

const safeMeasure = (name: string, start: string, end?: string) => {
  if (!enabled()) return
  try {
    if (end) performance.measure(name, start, end)
    else performance.measure(name, start)
  } catch {}
}

const safeLog = () => {
  if (!enabled()) return
  try {
    const marks = performance.getEntriesByType('mark')
    const measures = performance.getEntriesByType('measure')
    console.groupCollapsed(`[perf] marks=${marks.length} measures=${measures.length}`)
    console.table(
      measures
        .slice()
        .sort((a, b) => a.startTime - b.startTime)
        .map((m) => ({
          name: m.name,
          start: Math.round(m.startTime),
          duration: Math.round(m.duration)
        }))
    )
    console.groupEnd()
  } catch {}
}

export const perf = {
  enabled,
  mark: safeMark,
  measure: safeMeasure,
  log: safeLog
}

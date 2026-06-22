export const isLiteMode = (): boolean => {
  try {
    return window.localStorage.getItem('sakura:liteMode:v1') === '1'
  } catch {
    return false
  }
}

export const shouldWarmup = (): boolean => {
  if (isLiteMode()) return false
  const conn: any = (navigator as any).connection
  if (conn?.saveData) return false
  const t = String(conn?.effectiveType || '')
  if (t === 'slow-2g' || t === '2g') return false
  return true
}

export const runWhenIdle = (fn: () => void, timeout = 1500) => {
  const w = window as any
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(() => fn(), { timeout })
    return
  }
  window.setTimeout(fn, 0)
}

export const runWhenIdleWarmup = (fn: () => void, timeout = 1500) => {
  runWhenIdle(() => {
    if (!shouldWarmup()) return
    fn()
  }, timeout)
}

export const runWarmupTasks = (tasks: Array<() => Promise<unknown>>, timeout = 1500) => {
  let i = 0
  const next = () => {
    if (i >= tasks.length) return
    const task = tasks[i++]
    runWhenIdleWarmup(() => {
      Promise.resolve()
        .then(task)
        .catch(() => {})
        .finally(() => next())
    }, timeout)
  }
  next()
}


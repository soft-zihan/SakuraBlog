import { onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { THEME_COLORS } from '../constants'

export function useTheme() {
  const appStore = useAppStore()
  let started = false

  const applyDarkClass = (dark: boolean) => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const setDark = (dark: boolean) => {
    if (appStore.isDark !== dark) {
      appStore.setDark(dark)
    }
    applyDarkClass(dark)
  }

  const toggleTheme = (val: boolean) => {
    appStore.userSettings.themeMode = 'manual'
    setDark(val)
  }

  const updateThemeColor = () => {
    const colorId = appStore.userSettings.themeColor || 'sakura'
    const theme = THEME_COLORS[colorId] || THEME_COLORS.sakura
    const root = document.documentElement

    Object.entries(theme.palette).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, String(value))
    })

    root.style.setProperty('--primary-color', theme.preview)

    const hexToRgba = (hex: string, alpha: number) => {
      const h = hex.replace('#', '')
      const r = parseInt(h.substring(0, 2), 16)
      const g = parseInt(h.substring(2, 4), 16)
      const b = parseInt(h.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    if (theme.palette[900]) {
      root.style.setProperty('--primary-900-30', hexToRgba(theme.palette[900], 0.3))
    }
    if (theme.palette[100]) {
      root.style.setProperty('--primary-100-50', hexToRgba(theme.palette[100], 0.5))
    }

    root.setAttribute('data-theme-color', colorId)
  }

  const parseTimeToMinutes = (val: string) => {
    const raw = (val || '').trim()
    const m = raw.match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return null
    const h = Number(m[1])
    const min = Number(m[2])
    if (!Number.isFinite(h) || !Number.isFinite(min)) return null
    if (h < 0 || h > 23 || min < 0 || min > 59) return null
    return h * 60 + min
  }

  const getNowMinutes = () => {
    const d = new Date()
    return d.getHours() * 60 + d.getMinutes()
  }

  const computeIsDarkByTime = (lightMin: number, darkMin: number, nowMin: number) => {
    if (lightMin === darkMin) return nowMin >= darkMin
    if (darkMin > lightMin) {
      return nowMin >= darkMin || nowMin < lightMin
    }
    return nowMin >= darkMin && nowMin < lightMin
  }

  const computeNextSwitchDelayMs = (lightMin: number, darkMin: number) => {
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()
    const lightAt = todayStart + lightMin * 60_000
    const darkAt = todayStart + darkMin * 60_000
    const nowAt = now.getTime()

    const candidates: number[] = []
    candidates.push(lightAt >= nowAt ? lightAt : lightAt + 24 * 60 * 60_000)
    candidates.push(darkAt >= nowAt ? darkAt : darkAt + 24 * 60 * 60_000)
    const nextAt = Math.min(...candidates)
    return Math.max(1_000, nextAt - nowAt + 1_000)
  }

  const initTheme = () => {
    if (started) return
    started = true

    watch(() => appStore.userSettings.themeColor, updateThemeColor, { immediate: true })

    let cleanup: (() => void) | null = null

    const applyMode = () => {
      cleanup?.()
      cleanup = null

      const mode = appStore.userSettings.themeMode || 'manual'
      if (mode === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => setDark(e.matches)
        setDark(mq.matches)
        mq.addEventListener('change', handler)
        cleanup = () => mq.removeEventListener('change', handler)
        return
      }

      if (mode === 'time') {
        const lightMin = parseTimeToMinutes(appStore.userSettings.themeTimeLight) ?? 7 * 60
        const darkMin = parseTimeToMinutes(appStore.userSettings.themeTimeDark) ?? 19 * 60
        let timer: number | null = null

        const applyTime = () => {
          const isDarkNow = computeIsDarkByTime(lightMin, darkMin, getNowMinutes())
          setDark(isDarkNow)
          const delay = computeNextSwitchDelayMs(lightMin, darkMin)
          if (timer) window.clearTimeout(timer)
          timer = window.setTimeout(applyTime, delay)
        }

        const onVisible = () => {
          if (!document.hidden) applyTime()
        }

        applyTime()
        document.addEventListener('visibilitychange', onVisible)

        cleanup = () => {
          if (timer) window.clearTimeout(timer)
          document.removeEventListener('visibilitychange', onVisible)
        }
        return
      }

      applyDarkClass(appStore.isDark)
    }

    watch(
      () => [appStore.userSettings.themeMode, appStore.userSettings.themeTimeLight, appStore.userSettings.themeTimeDark],
      applyMode,
      { immediate: true }
    )

    watch(
      () => appStore.isDark,
      (val) => {
        if ((appStore.userSettings.themeMode || 'manual') === 'manual') {
          applyDarkClass(val)
        }
      },
      { immediate: true }
    )

    onBeforeUnmount(() => cleanup?.())
  }

  return {
    toggleTheme,
    updateThemeColor,
    initTheme
  }
}

import { watch, onUnmounted, type Ref } from 'vue'
import type { StageId } from '@/stores/learningStore'

type Options = {
  scrollRoot: Ref<HTMLElement | null>
  stageOrder: Ref<StageId[]>
  activeStageId: Ref<StageId>
  getStageEl: (stageId: StageId) => HTMLElement | null
  scrollToStage: (stageId: StageId) => void
  overscrollThresholdPx?: number
}

export const useStagePaging = (opts: Options) => {
  const threshold = opts.overscrollThresholdPx ?? 180
  let overscrollAccum = 0
  let overscrollDir: 'up' | 'down' | null = null
  let touchStartY = 0
  let touchActive = false

  const resetOverscroll = () => {
    overscrollAccum = 0
    overscrollDir = null
  }

  const getNextStageId = (cur: StageId): StageId | null => {
    const idx = opts.stageOrder.value.indexOf(cur)
    if (idx < 0) return null
    return opts.stageOrder.value[idx + 1] || null
  }

  const getPrevStageId = (cur: StageId): StageId | null => {
    const idx = opts.stageOrder.value.indexOf(cur)
    if (idx < 0) return null
    return opts.stageOrder.value[idx - 1] || null
  }

  const isAtStageTop = (stageId: StageId) => {
    const root = opts.scrollRoot.value
    const el = opts.getStageEl(stageId)
    if (!root || !el) return false
    const rootRect = root.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    return rect.top >= rootRect.top - 2
  }

  const isAtStageBottom = (stageId: StageId) => {
    const root = opts.scrollRoot.value
    const el = opts.getStageEl(stageId)
    if (!root || !el) return false
    const rootRect = root.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    return rect.bottom <= rootRect.bottom + 2
  }

  const handleWheel = (e: WheelEvent) => {
    const cur = opts.activeStageId.value
    const nextId = getNextStageId(cur)
    const prevId = getPrevStageId(cur)

    if (e.deltaY > 0 && nextId && isAtStageBottom(cur)) {
      if (overscrollDir !== 'down') {
        overscrollDir = 'down'
        overscrollAccum = 0
      }
      overscrollAccum += e.deltaY
      if (overscrollAccum >= threshold) {
        e.preventDefault()
        opts.scrollToStage(nextId)
        resetOverscroll()
      }
      return
    }

    if (e.deltaY < 0 && prevId && isAtStageTop(cur)) {
      if (overscrollDir !== 'up') {
        overscrollDir = 'up'
        overscrollAccum = 0
      }
      overscrollAccum += Math.abs(e.deltaY)
      if (overscrollAccum >= threshold) {
        e.preventDefault()
        opts.scrollToStage(prevId)
        resetOverscroll()
      }
      return
    }

    resetOverscroll()
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches[0]) return
    touchActive = true
    touchStartY = e.touches[0].clientY
    resetOverscroll()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchActive) return
    const t = e.touches[0]
    if (!t) return

    const cur = opts.activeStageId.value
    const nextId = getNextStageId(cur)
    const prevId = getPrevStageId(cur)
    const dy = touchStartY - t.clientY

    if (dy > 0 && nextId && isAtStageBottom(cur)) {
      overscrollDir = 'down'
      overscrollAccum = Math.max(overscrollAccum, dy)
      if (overscrollAccum >= threshold) {
        opts.scrollToStage(nextId)
        resetOverscroll()
        touchStartY = t.clientY
      }
      return
    }

    if (dy < 0 && prevId && isAtStageTop(cur)) {
      overscrollDir = 'up'
      overscrollAccum = Math.max(overscrollAccum, Math.abs(dy))
      if (overscrollAccum >= threshold) {
        opts.scrollToStage(prevId)
        resetOverscroll()
        touchStartY = t.clientY
      }
      return
    }
  }

  const handleTouchEnd = () => {
    touchActive = false
    resetOverscroll()
  }

  const attach = (el: HTMLElement) => {
    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true })
  }

  const detach = (el: HTMLElement) => {
    el.removeEventListener('wheel', handleWheel as any)
    el.removeEventListener('touchstart', handleTouchStart as any)
    el.removeEventListener('touchmove', handleTouchMove as any)
    el.removeEventListener('touchend', handleTouchEnd as any)
    el.removeEventListener('touchcancel', handleTouchEnd as any)
  }

  watch(
    () => opts.scrollRoot.value,
    (el, prev) => {
      if (prev) detach(prev)
      if (el) attach(el)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    const el = opts.scrollRoot.value
    if (el) detach(el)
  })

  return {
    resetOverscroll
  }
}


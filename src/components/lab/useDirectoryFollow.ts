import { ref, watch, nextTick, onUnmounted, type Ref } from 'vue'
import type { StageId } from '@/stores/learningStore'

type UpdateSource = 'scroll' | 'program'

type Options = {
  scrollRoot: Ref<HTMLElement | null>
  stageIdByLabId: Ref<Record<string, StageId>>
  setActiveStageId: (stageId: StageId) => void
  setActiveLabId: (labId: string | null) => void
}

export const useDirectoryFollow = (opts: Options) => {
  let scrollRaf = 0
  let refreshRaf = 0
  let mutationObserver: MutationObserver | null = null
  let stageEls: HTMLElement[] = []
  let labEls: HTMLElement[] = []

  const updateSource = ref<UpdateSource>('program')

  const refreshAnchors = (root: HTMLElement) => {
    stageEls = Array.from(root.querySelectorAll<HTMLElement>('[id^="stage-"]'))
    labEls = Array.from(root.querySelectorAll<HTMLElement>('[id^="lab-"]'))
  }

  const pickStage = (focusY: number) => {
    const candidates = stageEls
      .map(el => {
        const rect = el.getBoundingClientRect()
        const contains = rect.top <= focusY && rect.bottom >= focusY
        const dist = contains ? 0 : Math.min(Math.abs(rect.top - focusY), Math.abs(rect.bottom - focusY))
        return { id: el.id.replace(/^stage-/, ''), dist }
      })
      .sort((a, b) => a.dist - b.dist)

    return (candidates[0]?.id || null) as StageId | null
  }

  const pickLab = (focusY: number) => {
    for (const el of labEls) {
      const rect = el.getBoundingClientRect()
      const contains = rect.top <= focusY && rect.bottom >= focusY
      if (!contains) continue
      const id = el.id.replace(/^lab-/, '')
      if (!opts.stageIdByLabId.value[id]) continue
      return id
    }
    return null
  }

  const updateActive = (root: HTMLElement, source: UpdateSource) => {
    const rect = root.getBoundingClientRect()
    const focusY = rect.top + rect.height * 0.25

    updateSource.value = source

    const labId = pickLab(focusY)
    if (labId) {
      opts.setActiveLabId(labId)
      opts.setActiveStageId(opts.stageIdByLabId.value[labId])
      return
    }

    const stageId = pickStage(focusY)
    if (stageId) opts.setActiveStageId(stageId)
  }

  const scheduleRefresh = (root: HTMLElement) => {
    if (refreshRaf) return
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0
      refreshAnchors(root)
      updateActive(root, 'scroll')
    })
  }

  const onScroll = () => {
    const root = opts.scrollRoot.value
    if (!root) return
    if (scrollRaf) return
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0
      const root = opts.scrollRoot.value
      if (!root) return
      updateActive(root, 'scroll')
    })
  }

  watch(
    () => opts.scrollRoot.value,
    async (el, prev) => {
      if (prev) prev.removeEventListener('scroll', onScroll as any)
      if (mutationObserver) {
        mutationObserver.disconnect()
        mutationObserver = null
      }
      if (el) {
        el.addEventListener('scroll', onScroll, { passive: true })
        await nextTick()
        refreshAnchors(el)
        updateActive(el, 'program')
        mutationObserver = new MutationObserver(() => scheduleRefresh(el))
        mutationObserver.observe(el, { childList: true, subtree: true })
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    const root = opts.scrollRoot.value
    if (root) root.removeEventListener('scroll', onScroll as any)
    if (mutationObserver) mutationObserver.disconnect()
    if (scrollRaf) cancelAnimationFrame(scrollRaf)
    if (refreshRaf) cancelAnimationFrame(refreshRaf)
  })

  const markProgramUpdate = () => {
    updateSource.value = 'program'
  }

  return {
    updateSource,
    markProgramUpdate
  }
}

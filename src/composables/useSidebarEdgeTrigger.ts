import { ref, onUnmounted, type Ref } from 'vue'

interface UseSidebarEdgeTriggerOptions {
  /** 触发区域宽度(px) */
  triggerWidth?: number
  /** 延迟收起时间(ms) */
  collapseDelay?: number
  /** 是否禁用(移动端/阅读模式等) */
  disabled?: Ref<boolean>
}

export function useSidebarEdgeTrigger(options: UseSidebarEdgeTriggerOptions = {}) {
  const {
    triggerWidth = 30,
    collapseDelay = 400,
    disabled = ref(false)
  } = options

  const isHoveringTrigger = ref(false)
  const isHoveringSidebar = ref(false)
  const shouldAutoExpand = ref(false)
  const collapseTimer = ref<number | null>(null)

  /** 清除延迟收起定时器 */
  function clearCollapseTimer() {
    if (collapseTimer.value !== null) {
      clearTimeout(collapseTimer.value)
      collapseTimer.value = null
    }
  }

  /** 启动延迟收起 */
  function startCollapseDelay() {
    clearCollapseTimer()
    collapseTimer.value = window.setTimeout(() => {
      shouldAutoExpand.value = false
      isHoveringTrigger.value = false
      isHoveringSidebar.value = false
      collapseTimer.value = null
    }, collapseDelay)
  }

  /** 鼠标进入触发区域 */
  function onEnterTrigger() {
    if (disabled.value) return
    clearCollapseTimer()
    isHoveringTrigger.value = true
    shouldAutoExpand.value = true
  }

  /** 鼠标离开触发区域 */
  function onLeaveTrigger() {
    if (disabled.value) return
    isHoveringTrigger.value = false
    
    // 如果鼠标还在侧边栏内,不启动延迟
    if (!isHoveringSidebar.value) {
      startCollapseDelay()
    }
  }

  /** 鼠标进入侧边栏 */
  function onEnterSidebar() {
    if (disabled.value) return
    clearCollapseTimer()
    isHoveringSidebar.value = true
    shouldAutoExpand.value = true
  }

  /** 鼠标离开侧边栏 */
  function onLeaveSidebar() {
    if (disabled.value) return
    isHoveringSidebar.value = false
    
    // 如果鼠标还在触发区域内,不启动延迟
    if (!isHoveringTrigger.value) {
      startCollapseDelay()
    }
  }

  /** 强制收起侧边栏(用于手动关闭按钮) */
  function forceCollapse() {
    clearCollapseTimer()
    shouldAutoExpand.value = false
    isHoveringTrigger.value = false
    isHoveringSidebar.value = false
    collapseTimer.value = null
  }

  /** 组件卸载时清理 */
  function cleanup() {
    clearCollapseTimer()
  }

  onUnmounted(cleanup)

  return {
    shouldAutoExpand,
    onEnterTrigger,
    onLeaveTrigger,
    onEnterSidebar,
    onLeaveSidebar,
    forceCollapse
  }
}

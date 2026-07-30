<template>
  <div 
    class="w-24 flex-shrink-0 bg-[#1e1e1e] border-l border-gray-700 overflow-hidden relative cursor-pointer select-none"
    ref="minimapContainer"
    @click="handleClick"
    @mousedown="startDrag"
  >
    <!-- Minimap Content -->
    <div class="minimap-content" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left' }">
      <div 
        v-for="(line, idx) in lines" 
        :key="'mini-' + idx"
        class="h-[3px] mx-1 my-[1px] rounded-sm overflow-hidden"
        :class="getLineClass(idx + 1)"
      >
        <div 
          class="h-full"
          :style="{ width: Math.min(line.length * 0.5, 100) + '%', backgroundColor: getLineColor(line) }"
        ></div>
      </div>
    </div>
    <!-- Viewport Indicator -->
    <div 
      class="absolute left-0 right-0 bg-white/10 border border-white/20 pointer-events-none transition-transform"
      :style="viewportStyleReactive"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  lines: string[]
  codeContainer: HTMLElement | null
  hasNote?: (line: number) => boolean
}>()

const minimapContainer = ref<HTMLElement | null>(null)
let isDragging = false
const tick = ref(0)

const scale = computed(() => {
  const totalLines = props.lines.length
  if (totalLines < 100) return 1
  if (totalLines < 500) return 0.8
  return 0.6
})

const viewportStyleReactive = computed(() => {
  tick.value
  if (!props.codeContainer) return {}
  const container = props.codeContainer
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  const totalLines = props.lines.length
  const lineHeight = 4
  const minimapHeight = totalLines * lineHeight * scale.value
  
  const ratio = clientHeight / scrollHeight
  const top = (scrollTop / scrollHeight) * minimapHeight
  const height = Math.max(20, ratio * minimapHeight)
  
  return {
    top: `${top}px`,
    height: `${height}px`
  }
})

const forceUpdate = () => {
  tick.value++
}

const handleScroll = () => {
  forceUpdate()
}

watch(() => props.codeContainer, (el, oldEl) => {
  if (oldEl) oldEl.removeEventListener('scroll', handleScroll)
  if (el) el.addEventListener('scroll', handleScroll, { passive: true })
  forceUpdate()
}, { immediate: true })

watch(() => props.lines.length, () => {
  forceUpdate()
})

onMounted(() => {
  window.addEventListener('resize', forceUpdate, { passive: true })
  forceUpdate()
})

onUnmounted(() => {
  window.removeEventListener('resize', forceUpdate)
})


const handleClick = (e: MouseEvent) => {
  if (!props.codeContainer || !minimapContainer.value) return
  
  const rect = minimapContainer.value.getBoundingClientRect()
  const clickY = e.clientY - rect.top
  const totalLines = props.lines.length
  const lineHeight = 4 * scale.value
  const minimapHeight = totalLines * lineHeight
  
  const ratio = clickY / minimapHeight
  const scrollTarget = ratio * props.codeContainer.scrollHeight
  
  props.codeContainer.scrollTo({
    top: scrollTarget - props.codeContainer.clientHeight / 2,
    behavior: 'smooth'
  })
}

const startDrag = (e: MouseEvent) => {
  isDragging = true
  handleClick(e)
  
  const onMove = (e: MouseEvent) => {
    if (isDragging) {
      handleClick(e)
    }
  }
  
  const onUp = () => {
    isDragging = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const getLineClass = (line: number) => {
  if (props.hasNote && props.hasNote(line)) {
    return 'bg-[var(--primary-500)]/30'
  }
  return ''
}

const getLineColor = (line: string) => {
  const trimmed = line.trim()
  
  if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return '#6a9955'
  }
  
  if (/^(import|export|const|let|var|function|class|if|else|for|while|return|async|await)/.test(trimmed)) {
    return '#569cd6'
  }
  
  if (trimmed.includes('"') || trimmed.includes("'") || trimmed.includes('`')) {
    return '#ce9178'
  }
  
  return '#9cdcfe'
}
</script>

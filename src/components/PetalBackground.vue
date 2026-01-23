<template>
  <!-- Container: pointer-events-none by default, never blocks page interaction -->
  <div 
    class="fixed inset-0 pointer-events-none overflow-hidden"
    :class="layer === 'front' ? 'z-[1000]' : 'z-[1]'"
  >
    <!-- Vortex interaction layer: only visible when active -->
    <div 
      v-if="vortexState.active"
      class="absolute pointer-events-auto"
      :style="{
        left: vortexState.x - vortexState.radius + 'px',
        top: vortexState.y - vortexState.radius + 'px',
        width: vortexState.radius * 2 + 'px',
        height: vortexState.radius * 2 + 'px',
        zIndex: 8
      }"
      @pointermove="handleLongPressMove"
      @pointerup="handleLongPressEnd"
      @pointercancel="handleLongPressEnd"
    />
    
    <!-- Petals - always clickable -->
    <div 
      v-for="p in petals" 
      :key="p.id" 
      class="absolute select-none cursor-grab active:cursor-grabbing will-change-transform pointer-events-auto"
      :style="{
        transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.scale})`,
        opacity: p.opacity,
        width: p.size + 'px',
        height: (p.size * 1.3) + 'px',
        background: isDark ? 'linear-gradient(120deg, #be1245 0%, #f43f72 100%)' : 'linear-gradient(120deg, #ffd7e6 0%, #ffc4d6 100%)',
        borderRadius: '150% 0 150% 0',
        boxShadow: isDark ? '0 0 2px rgba(244, 63, 114, 0.2)' : '1px 1px 2px rgba(0,0,0,0.05)',
        transition: p.isDragging ? 'none' : 'opacity 0.3s',
        touchAction: 'none',
        zIndex: p.isDragging ? 20 : 5
      }"
      @pointerdown="onPointerDown(p, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { createPetal, updatePetals, vortexState, startLongPress, updateLongPress, endLongPress, longPressTimer, type Petal } from './petal/usePetals';

const props = defineProps<{
  speed: 'off' | 'slow' | 'fast';
  isDark: boolean;
  layer?: 'front' | 'back';
}>();

const layer = computed(() => props.layer || 'back');

const isDark = ref(props.isDark);
watch(() => props.isDark, (v) => isDark.value = v);

const petals = ref<Petal[]>([]);
let animationFrameId: number;

// Drag state + window listeners for stability
const draggedPetalId = ref<number | null>(null);

const onPointerDown = (p: Petal, e: PointerEvent) => {
  // Prevent parent listener from firing
  e.stopPropagation();
  
  draggedPetalId.value = p.id;
  p.isDragging = true;
  p.isLanded = false;
  p.opacity = 1;
  (e.target as Element).setPointerCapture?.(e.pointerId);
  p.dragOffsetX = e.clientX - p.x;
  p.dragOffsetY = e.clientY - p.y;
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
};

const onPointerMove = (e: PointerEvent) => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (!p) return;
  e.preventDefault();
  p.x = e.clientX - p.dragOffsetX;
  p.y = e.clientY - p.dragOffsetY;
};

const onPointerUp = () => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (p) p.isDragging = false;
  draggedPetalId.value = null;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
};

// Long press for vortex effect - use document listener to avoid blocking
const handleDocumentPointerDown = (e: PointerEvent) => {
  const target = e.target as HTMLElement;
  
  // Don't start long press if:
  // 1. Clicking on a petal (has cursor-grab class)
  // 2. Clicking on an interactive element (button, link, input, etc.)
  // 3. Already dragging
  if (
    draggedPetalId.value !== null ||
    target.closest('.cursor-grab') ||
    target.closest('button, a, input, textarea, select, [role="button"], [tabindex]')
  ) {
    return;
  }
  
  startLongPress(e.clientX, e.clientY);
};

const handleLongPressMove = (e: PointerEvent) => {
  updateLongPress(e.clientX, e.clientY);
};

const handleLongPressEnd = () => {
  endLongPress();
};

// Global window listeners for long press tracking
const handleWindowPointerMove = (e: PointerEvent) => {
  if (vortexState.value.active || longPressTimer) {
    updateLongPress(e.clientX, e.clientY);
  }
};

const handleWindowPointerUp = () => {
  endLongPress();
};

const update = (time?: number) => {
  const currentSpeedMult = props.speed === 'fast' ? 2.5 : 1.0;
  updatePetals(petals.value, {
    speedMultiplier: currentSpeedMult,
    isDark: isDark.value
  });
  animationFrameId = requestAnimationFrame(update);
};

onMounted(() => {
  for (let i = 0; i < 15; i++) {
    petals.value.push(createPetal(Math.random() * window.innerHeight * 0.8));
  }
  animationFrameId = requestAnimationFrame(update);
  
  // Add document listener for long press detection
  document.addEventListener('pointerdown', handleDocumentPointerDown, { passive: true });
  // Add global listeners for long press tracking
  window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
  window.addEventListener('pointerup', handleWindowPointerUp, { passive: true });
  window.addEventListener('pointercancel', handleWindowPointerUp, { passive: true });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  document.removeEventListener('pointerdown', handleDocumentPointerDown);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointermove', handleWindowPointerMove);
  window.removeEventListener('pointerup', handleWindowPointerUp);
  window.removeEventListener('pointercancel', handleWindowPointerUp);
});
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
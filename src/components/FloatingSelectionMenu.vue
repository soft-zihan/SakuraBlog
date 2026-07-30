<template>
  <div 
    v-show="selectionMenu.show" 
    class="fixed z-50 flex bg-gray-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-xl transform -translate-x-1/2 -translate-y-full mb-2 p-1.5 gap-0.5 border border-white/10"
    :style="{ top: selectionMenu.y + 'px', left: selectionMenu.x + 'px' }"
    @mousedown.prevent
  >
    <!-- Highlight Options -->
    <button @click="$emit('apply-format', 'highlight-yellow')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Yellow Highlight">
      <span class="w-4 h-4 bg-yellow-400 rounded-full inline-block ring-2 ring-yellow-300/50"></span>
    </button>
    <button @click="$emit('apply-format', 'highlight-green')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Green Highlight">
      <span class="w-4 h-4 bg-green-400 rounded-full inline-block ring-2 ring-green-300/50"></span>
    </button>
    <button @click="$emit('apply-format', 'highlight-blue')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Blue Highlight">
      <span class="w-4 h-4 bg-blue-400 rounded-full inline-block ring-2 ring-blue-300/50"></span>
    </button>
    <button @click="$emit('apply-format', 'highlight-pink')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Pink Highlight">
      <span class="w-4 h-4 bg-pink-400 rounded-full inline-block ring-2 ring-pink-300/50"></span>
    </button>
    
    <div class="w-px bg-white/20 mx-0.5"></div>
    
    <!-- Underline Styles -->
    <button @click="$emit('apply-format', 'underline-wavy')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Wavy Underline">
       <span class="underline decoration-wavy decoration-[var(--primary-400)] underline-offset-2">〰</span>
    </button>
    <button @click="$emit('apply-format', 'underline-double')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Double Underline">
       <span class="underline decoration-double decoration-blue-400 underline-offset-2">≡</span>
    </button>

    <div class="w-px bg-white/20 mx-0.5"></div>

    <!-- Block Highlight -->
    <button @click="$emit('apply-format', 'highlight-block')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Block Highlight">
      <span class="px-2 py-0.5 border border-yellow-300 rounded bg-yellow-200/40">▭</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectionMenu: {
    show: boolean;
    x: number;
    y: number;
    locked: boolean;
  }
}>();

defineEmits<{
  (e: 'apply-format', format: string): void;
}>();
</script>

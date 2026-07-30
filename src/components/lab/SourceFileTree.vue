<template>
  <div class="space-y-0.5">
    <template v-for="node in nodes" :key="node.path">
      <!-- Directory -->
      <div v-if="node.type === 'directory'">
        <div 
          @click="toggleFolder(node.path)"
          class="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span class="text-xs transition-transform" :class="{ 'rotate-90': isExpanded(node.path) }">▶</span>
          <span class="text-sm">📁</span>
          <span class="text-xs text-gray-700 dark:text-gray-300 truncate">{{ node.name }}</span>
        </div>
        <div v-if="isExpanded(node.path) && node.children" class="ml-3 border-l border-gray-200 dark:border-gray-700">
          <SourceFileTree 
            :nodes="node.children" 
            :selected-path="selectedPath"
            :expanded-folders="expandedFolders"
            @select="emit('select', $event)"
            @toggle="emit('toggle', $event)"
          />
        </div>
      </div>
      <!-- File -->
      <div 
        v-else
        @click="emit('select', node)"
        class="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ml-4"
        :class="selectedPath === node.path 
          ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300' 
          : 'hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        <span class="text-sm">{{ getFileIcon(node.name) }}</span>
        <span class="text-xs truncate" :class="selectedPath === node.path ? 'font-medium' : 'text-gray-600 dark:text-gray-400'">
          {{ node.name }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SourceFile {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: SourceFile[]
}

const props = defineProps<{
  nodes: SourceFile[]
  selectedPath?: string
  expandedFolders?: string[]
}>()

const emit = defineEmits<{
  (e: 'select', file: SourceFile): void
  (e: 'toggle', path: string): void
}>()

// Local expanded state
const localExpanded = ref<Set<string>>(new Set(['', 'components', 'composables', 'stores']))

const isExpanded = (path: string) => {
  return localExpanded.value.has(path)
}

const toggleFolder = (path: string) => {
  if (localExpanded.value.has(path)) {
    localExpanded.value.delete(path)
  } else {
    localExpanded.value.add(path)
  }
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'vue': return '💚'
    case 'ts':
    case 'tsx': return '🔷'
    case 'js':
    case 'jsx': return '🟨'
    case 'css': return '🎨'
    case 'html': return '🌐'
    case 'json': return '📋'
    case 'md': return '📝'
    default: return '📄'
  }
}
</script>

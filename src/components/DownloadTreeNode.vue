<template>
  <div>
    <!-- Node Row -->
    <div 
      class="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-colors"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      @click="handleClick"
    >
      <!-- Checkbox (custom mode) -->
      <input 
        v-if="showCheckbox"
        type="checkbox"
        :checked="isSelected"
        :indeterminate="isIndeterminate"
        @click.stop
        @change="$emit('toggle', node)"
        class="w-4 h-4 rounded border-gray-300 text-sakura-500 focus:ring-sakura-500"
      />
      
      <!-- Expand/Collapse Arrow -->
      <span 
        v-if="node.children"
        class="text-gray-400 transition-transform duration-200 w-4"
        :class="{ 'rotate-90': isExpanded }"
      >
        ▶
      </span>
      <span v-else class="w-4"></span>
      
      <!-- Icon -->
      <span class="text-base">{{ node.children ? (isExpanded ? '📂' : '📁') : getFileIcon(node.name) }}</span>
      
      <!-- Name -->
      <span 
        class="flex-1 text-sm truncate"
        :class="isSelected ? 'text-sakura-600 dark:text-sakura-400 font-medium' : 'text-gray-700 dark:text-gray-300'"
      >
        {{ node.name }}
      </span>
      
      <!-- File count for folders -->
      <span v-if="node.children" class="text-xs text-gray-400 dark:text-gray-500">
        {{ getFileCount(node) }}
      </span>
    </div>
    
    <!-- Children -->
    <template v-if="node.children && isExpanded">
      <DownloadTreeNode
        v-for="child in node.children"
        :key="child.path || child.name"
        :node="child"
        :depth="depth + 1"
        :selected-paths="selectedPaths"
        :show-checkbox="showCheckbox"
        :expanded-paths="expandedPaths"
        @toggle="$emit('toggle', $event)"
        @expand="$emit('expand', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  node: any
  depth: number
  selectedPaths: Set<string>
  showCheckbox: boolean
  expandedPaths: Set<string>
}>()

const emit = defineEmits<{
  (e: 'toggle', node: any): void
  (e: 'expand', path: string): void
}>()

// Check if expanded
const isExpanded = computed(() => {
  return props.expandedPaths.has(props.node.path || props.node.name)
})

// Check if selected
const isSelected = computed(() => {
  if (!props.node.children) {
    return props.selectedPaths.has(props.node.path)
  }
  // For folders, check if all children are selected
  const childPaths = getAllFilePaths(props.node)
  return childPaths.length > 0 && childPaths.every(p => props.selectedPaths.has(p))
})

// Check if partially selected (for folders)
const isIndeterminate = computed(() => {
  if (!props.node.children) return false
  const childPaths = getAllFilePaths(props.node)
  const selectedCount = childPaths.filter(p => props.selectedPaths.has(p)).length
  return selectedCount > 0 && selectedCount < childPaths.length
})

// Get all file paths in a node
const getAllFilePaths = (node: any): string[] => {
  if (!node.children) return node.path ? [node.path] : []
  return node.children.flatMap((child: any) => getAllFilePaths(child))
}

// Get file count for folder
const getFileCount = (node: any): string => {
  const count = getAllFilePaths(node).length
  return `${count}`
}

// Get file icon based on extension
const getFileIcon = (name: string): string => {
  if (name.endsWith('.md')) return '📝'
  if (name.endsWith('.pdf')) return '📕'
  if (name.endsWith('.vue')) return '💚'
  if (name.endsWith('.ts') || name.endsWith('.js')) return '📜'
  if (name.endsWith('.json')) return '📋'
  return '📄'
}

// Handle click
const handleClick = () => {
  if (props.node.children) {
    emit('expand', props.node.path || props.node.name)
  } else if (props.showCheckbox) {
    emit('toggle', props.node)
  }
}
</script>

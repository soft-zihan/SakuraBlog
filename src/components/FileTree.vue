<template>
  <ul class="pl-2">
    <li v-for="node in nodes" :key="node.path" class="select-none mb-0.5">
      <!-- Folder -->
      <div 
        v-if="node.type === 'directory'" 
        class="mb-1"
      >
        <div 
          class="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors group"
          :class="currentPath === node.path ? 'bg-sakura-100 text-sakura-800 font-bold' : 'hover:bg-sakura-50 text-gray-700'"
          @dblclick.stop="$emit('toggle-folder', node.path)"
        >
          <!-- Toggle Arrow -->
          <span 
            @click.stop="$emit('toggle-folder', node.path)"
            class="text-[10px] w-5 h-5 flex items-center justify-center transform transition-transform duration-200 cursor-pointer text-sakura-400 hover:text-sakura-600 rounded hover:bg-sakura-100" 
            :class="{ 'rotate-90': isOpen(node.path) }"
          >▶</span>
          
          <!-- Folder Name (opens directory view) -->
           <div 
             @click="$emit('select-folder', node)"
             @dblclick.stop="$emit('toggle-folder', node.path)"
             class="flex-1 flex items-center gap-2 cursor-pointer"
           >
            <span class="text-lg text-sakura-300">📁</span>
            <span class="truncate text-sm">{{ node.name }}</span>
          </div>
        </div>
        
        <!-- Recursive Children -->
        <div v-show="isOpen(node.path)" class="border-l border-sakura-200 ml-2.5 pl-0.5 mt-0.5">
          <FileTree 
            v-if="node.children" 
            :nodes="node.children" 
            :expanded-paths="expandedPaths"
            :current-path="currentPath"
            @toggle-folder="$emit('toggle-folder', $event)"
            @select-file="$emit('select-file', $event)"
            @select-folder="$emit('select-folder', $event)"
          />
        </div>
      </div>

      <!-- File -->
      <div 
        v-else 
        @click="$emit('select-file', node)"
        class="flex items-center gap-2 px-2 py-1.5 ml-5 rounded-lg cursor-pointer transition-all duration-200 text-sm group"
        :class="currentPath === node.path ? 'bg-sakura-400 text-white shadow-md' : 'hover:bg-sakura-50 text-gray-600'"
      >
        <span class="text-lg group-hover:scale-110 transition-transform">{{ currentPath === node.path ? '🌸' : getFileIcon(node) }}</span>
        <span class="truncate">{{ node.name }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { FileNode } from '../types';

defineOptions({
  name: 'FileTree'
});

const props = defineProps<{
  nodes: FileNode[];
  expandedPaths: string[];
  currentPath: string;
}>();

const emit = defineEmits(['toggle-folder', 'select-file', 'select-folder']);

const isOpen = (path: string) => props.expandedPaths.includes(path);

const isPdfFile = (node: FileNode) => node.path.toLowerCase().endsWith('.pdf')

const getFileIcon = (node: FileNode) => {
  if (node.isSource) return '💻'
  if (isPdfFile(node)) return '📕'
  return '📄'
}
</script>
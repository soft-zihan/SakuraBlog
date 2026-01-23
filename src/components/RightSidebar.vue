<template>
  <Transition name="slide-left">
    <div 
      v-if="isOpen"
      class="w-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col items-center py-6 gap-6 overflow-y-auto no-scrollbar"
      @click.stop
    >
      <ActionDockGroup
        layout="vertical"
        :lang="lang"
        :t="t"
        :current-file="currentFile"
        :is-raw-mode="isRawMode"
        :is-pdf="isPdf"
        :view-mode="viewMode"
        :dual-column-mode="dualColumnMode"
        :is-playing="musicStore.isPlaying"
        :download-toast="true"
        @update:isRawMode="emit('update:isRawMode', $event)"
        @copy-link="emit('copy-link')"
        @download="emit('download')"
        @toggle-dual-column="emit('toggle-dual-column')"
        @open-search="emit('open-search')"
        @open-music="emit('open-music')"
        @open-write="emit('open-write')"
        @toggle-theme-panel="emit('toggle-theme-panel')"
        @open-download="emit('open-download')"
        @open-settings="emit('open-settings')"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FileNode } from '../types';
import { I18N } from '../constants';
import { useMusicStore } from '../stores/musicStore';
import ActionDockGroup from './ActionDockGroup.vue';

const props = defineProps<{
  isOpen: boolean;
  lang: 'en' | 'zh';
  currentFile: FileNode | null;
  isRawMode: boolean;
  viewMode: string;
  dualColumnMode: boolean;
}>();

const emit = defineEmits([
  'open-search', 
  'open-settings', 
  'open-music', 
  'open-write',
  'open-download',
  'update:isRawMode',
  'copy-link',
  'download',
  'toggle-dual-column',
  'toggle-theme-panel'
]);
const musicStore = useMusicStore();
const t = computed(() => I18N[props.lang]);
const isPdf = computed(() => !!props.currentFile?.path && props.currentFile.path.toLowerCase().endsWith('.pdf'));
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

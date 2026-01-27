<template>
  <header 
    class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/60 dark:border-gray-800/60 shrink-0 z-20 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out hover:bg-white/80 dark:hover:bg-gray-900/80 overflow-hidden"
    style="will-change: transform;"
    :class="[
      isMobile ? 'px-3' : 'h-16 px-6',
      isMobile
        ? (headerHidden && !themeOpen ? 'max-h-0 py-0 border-b-0 shadow-none' : 'max-h-24 py-2')
        : '',
      { 'translate-y-0': !headerHidden || themeOpen, '-translate-y-full': headerHidden && !themeOpen }
    ]"
  >
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="h-full flex items-center justify-between">
      <!-- Left Sidebar Toggle (Desktop) -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="mr-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-50)] dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        :title="lang === 'zh' ? '切换侧边栏' : 'Toggle Sidebar'"
      >
        <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m10 15 3-3-3-3"/></svg>
      </button>

      <!-- Breadcrumbs -->
      <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-2 shrink-0 cursor-pointer hover:scale-110 transition-transform" @click="$emit('reset')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
           <span class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-gray-500 dark:text-gray-400">{{ t.lab_dashboard }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span v-if="Number(index) > 0" class="mx-2 text-[var(--primary-300)] dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer transition-colors px-2 py-1 rounded-md"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)]/50 dark:bg-[var(--primary-900)]/30' : 'text-gray-500 dark:text-gray-400 hover:text-[var(--primary-500)] hover:bg-[var(--primary-50)]/50 dark:hover:bg-gray-800'"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <ActionDockGroup
        layout="horizontal"
        :lang="lang as 'en' | 'zh'"
        :t="t"
        :current-file="currentFile"
        :is-raw-mode="isRawMode"
        :is-pdf="isPdf"
        :view-mode="viewMode"
        :dual-column-mode="dualColumnMode"
        :is-playing="musicStore.isPlaying"
        @update:isRawMode="$emit('update:isRawMode', $event)"
        @copy-link="$emit('copy-link')"
        @download="$emit('download')"
        @toggle-dual-column="$emit('toggle-dual-column')"
        @open-search="$emit('open-search')"
        @open-music="$emit('open-music')"
        @open-write="$emit('open-write')"
        @toggle-theme-panel="toggleThemePanel"
        @open-download="$emit('open-download')"
        @open-settings="$emit('open-settings')"
      />
    </div>

    <!-- Mobile Layout -->
    <div v-else class="flex items-center h-full px-3 gap-2">
      <!-- Breadcrumbs (Scrollable) -->
      <div class="flex-1 flex items-center text-xs overflow-x-auto no-scrollbar whitespace-nowrap mask-linear px-2">
        <span class="text-[var(--primary-300)] dark:text-[var(--primary-500)] mr-1 shrink-0 cursor-pointer" @click="$emit('reset')">🏠</span>
        
        <template v-if="viewMode === 'lab' && currentTool">
           <span class="mx-1 text-[var(--primary-300)] dark:text-gray-600">›</span>
           <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded text-[10px]">{{ t.tab_lab }}</span>
        </template>
        <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
          <span class="mx-1 text-[var(--primary-300)] dark:text-gray-600">›</span>
          <span 
            @click="$emit('navigate', item.path)"
            class="cursor-pointer px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 truncate max-w-[100px]"
            :class="index === breadcrumbs.length - 1 ? 'font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]' : ''"
          >
            {{ item.name }}
          </span>
        </template>
      </div>

      <!-- Right Sidebar Toggle Button -->
      <button 
        @click="$emit('toggle-right-sidebar')" 
        class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 active:scale-95 transition-transform"
      >
        <svg v-if="!rightSidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <ThemePanel
      v-model:open="themeOpenModel"
      :lang="lang"
      :t="t"
      :is-dark="isDark"
      :petal-speed="petalSpeed"
      @toggle-theme="$emit('toggle-theme')"
      @update:petal-speed="$emit('update:petal-speed', $event)"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import type { BreadcrumbItem, FileNode } from '@/types';
import { useMusicStore } from '@/stores/musicStore';
import { useAppStore } from '@/stores/appStore';
import ActionDockGroup from './ActionDockGroup.vue';
import ThemePanel from './ThemePanel.vue';

const musicStore = useMusicStore();
const appStore = useAppStore();
const { sidebarOpen, rightSidebarOpen } = storeToRefs(appStore);

const props = defineProps<{
  lang: string;
  t: any;
  breadcrumbs: BreadcrumbItem[];
  viewMode: string;
  currentTool: string | null;
  currentFile: FileNode | null;
  getArticleViews: (path: string) => number;
  showParticles: boolean;
  isRawMode: boolean;
  isDark: boolean;
  petalSpeed: 'off' | 'slow' | 'fast';
  headerHidden?: boolean;
  dualColumnMode?: boolean;
}>();

const emit = defineEmits([
  'reset', 
  'navigate', 
  'update:showParticles', 
  'update:isRawMode',
  'copy-link',
  'download',
  'open-settings',
  'open-search',
  'open-music',
  'open-write',
  'open-download',
  'toggle-theme',
  'update:petal-speed',
  'toggle-dual-column',
  'open-theme-panel',
  'toggle-sidebar',
  'toggle-right-sidebar'
]);

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const isPdf = computed(() => !!props.currentFile?.path && props.currentFile.path.toLowerCase().endsWith('.pdf'))

const themeOpen = ref(false);

const setThemePanelOpen = (open: boolean) => {
  themeOpen.value = open;
  emit('open-theme-panel', open);
};

const toggleThemePanel = () => {
  setThemePanelOpen(!themeOpen.value);
};

const getPetalSpeedLabel = (speed: 'off' | 'slow' | 'fast') => {
  if (props.lang === 'zh') {
    return speed === 'slow' ? '秒速五厘米' : speed === 'fast' ? '秒速十厘米' : '风停了~'
  }
  return speed === 'slow' ? '5cm/s' : speed === 'fast' ? '10cm/s' : 'Off'
}

const handlePetalToggle = () => {
  const speeds: Array<'off' | 'slow' | 'fast'> = ['off', 'slow', 'fast'];
  const currentIndex = speeds.indexOf(props.petalSpeed);
  const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
  emit('update:petal-speed', nextSpeed);
  appStore.showToast(getPetalSpeedLabel(nextSpeed));
};

const themeOpenModel = computed({
  get: () => themeOpen.value,
  set: (open: boolean) => setThemePanelOpen(open)
});

defineExpose({
  toggleThemePanel,
  setThemePanelOpen
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-spin-fast {
  animation: spin-fast 4s linear infinite;
}
</style>

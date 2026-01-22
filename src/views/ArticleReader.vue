<template>
  <div class="flex-1 flex overflow-hidden z-10 relative">
    <div 
      id="scroll-container" 
      class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full"
    >
      <div 
         class="w-full mx-auto bg-white/85 dark:bg-gray-900/85 p-8 md:p-12 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative"
         :class="[fontSizeClass, articleStyleClass, appStore.sidebarOpen ? 'max-w-4xl xl:max-w-5xl' : 'max-w-5xl xl:max-w-7xl']"
         :style="articleContainerStyle"
      >
         <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
           <div class="flex flex-col items-center gap-4">
              <div class="animate-spin text-4xl">🌸</div>
              <div class="text-sm font-bold animate-pulse" :style="loadingTextStyle">Fetching Content...</div>
           </div>
         </div>

         <!-- Header with Like/Favorite buttons -->
         <div class="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6 bg-black/5 dark:bg-black/30 rounded-xl p-6 backdrop-blur-sm">
             <div class="flex justify-between items-start gap-4">
               <div class="flex flex-wrap items-center gap-3 flex-1">
                 <span v-if="currentAuthorName || currentAuthorUrl" class="text-sm text-gray-400 flex items-center gap-1">
                   <span>👤</span>
                    <a
                     v-if="currentAuthorUrl"
                     :href="currentAuthorUrl"
                     target="_blank"
                     rel="noopener"
                     class="hover:underline"
                     :style="authorLinkStyle"
                   >
                     {{ currentAuthorName || currentAuthorUrl }}
                   </a>
                   <span v-else>{{ currentAuthorName }}</span>
                 </span>
               </div>
               <span v-if="file.isSource" class="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded text-xs font-mono">Read Only</span>
             </div>
             <!-- Article Actions -->
             <div class="flex items-center gap-4 mt-4 flex-wrap" v-if="!file.isSource">
               <button 
                 @click="handleLike"
                 class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                 :class="articleStore.isLiked(file.path) ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-50'"
               >
                 <span>{{ articleStore.isLiked(file.path) ? '❤️' : '🤍' }}</span>
                 <span class="font-bold">{{ articleStore.getLikes(file.path) }}</span>
               </button>
               <button 
                 @click="articleStore.toggleFavorite(file.path)"
                 class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                 :class="articleStore.isFavorite(file.path) ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-amber-50'"
               >
                 <span>{{ articleStore.isFavorite(file.path) ? '⭐' : '☆' }}</span>
                 <span>{{ t.favorite }}</span>
               </button>
               
               <div class="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
                  <input 
                    type="color" 
                    v-model="appStore.userSettings.articleBackgroundColor"
                    class="w-5 h-5 rounded-full overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
                    :title="lang === 'zh' ? '文章背景色' : 'Article Background Color'"
                  />
                  <button 
                    v-if="appStore.userSettings.articleBackgroundColor"
                    @click="appStore.userSettings.articleBackgroundColor = ''"
                    class="text-xs text-gray-400 hover:text-red-500"
                    title="Reset"
                  >✕</button>
               </div>

              <span class="text-xs text-gray-400 flex items-center gap-1">
                <span class="text-sm">🧑‍🎓</span>
                {{ getArticleViews(file.path) }} {{ lang === 'zh' ? '人阅读' : 'views' }}
              </span>
             <span class="text-xs text-gray-400 flex items-center gap-1">
               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 8l-4-4V4a2 2 0 012-2h12a2 2 0 01-2 2H7z"/>
               </svg>
               {{ getArticleComments(file.path) }} {{ lang === 'zh' ? '条评论' : 'comments' }}
             </span>
               <span class="text-xs text-gray-400">
                📝 {{ currentWordCount }} {{ t.words }}
               </span>
               <span class="text-xs text-gray-400 flex items-center gap-1">
                 🕐 {{ t.updated }}: {{ formatDate(file.lastModified) }}
               </span>
               <span v-if="currentTags.length" class="text-xs text-gray-400 flex items-center gap-1">
                 🏷️
                 <span class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in currentTags"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-full"
                    :style="tagBadgeStyle"
                  >
                     {{ tag }}
                   </span>
                 </span>
               </span>
             </div>
         </div>

        <!-- Markdown Content -->
        <div 
          v-if="!file.isSource && !isRawMode"
          id="markdown-viewer"
          v-html="renderedHtml" 
          class="markdown-body"
          @click="handleContentClickEvent"
          @mousedown="selectionMenuComposable.lockSelectionMenu()"
          @mouseup="handleSelectionEvent"
          @touchend="handleSelectionEvent"
          @contextmenu="handleSelectionContextMenuEvent"
        ></div>

        <!-- Source Code / Raw Mode (Editable) -->
        <div v-else class="relative group">
           <!-- Edit Mode Toolbar -->
           <div class="flex items-center justify-between mb-3 bg-[#252526] px-4 py-2 rounded-t-xl border border-gray-700 border-b-0">
             <div class="flex items-center gap-2">
               <span class="text-xs text-gray-400 font-mono">{{ isRawMode ? 'Markdown' : 'Source' }}</span>
               <span v-if="rawEditor.isEditingRaw.value" class="text-xs text-yellow-400 px-2 py-0.5 bg-yellow-900/30 rounded">{{ lang === 'zh' ? '编辑中' : 'Editing' }}</span>
             </div>
             <div class="flex items-center gap-2">
                <button @click="rawEditor.saveRawContent()" class="text-xs text-green-400 hover:text-green-300 transition-colors" v-if="rawEditor.isEditingRaw.value">
                  {{ lang === 'zh' ? '保存' : 'Save' }}
                </button>
                <button @click="rawEditor.toggleEditRaw()" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  {{ rawEditor.isEditingRaw.value ? (lang === 'zh' ? '取消' : 'Cancel') : (lang === 'zh' ? '编辑' : 'Edit') }}
                </button>
             </div>
           </div>
           
           <textarea 
             v-if="rawEditor.isEditingRaw.value"
             v-model="rawEditor.rawContent.value"
             class="w-full h-[600px] bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
           ></textarea>
           <pre v-else class="bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl overflow-x-auto"><code>{{ file.content }}</code></pre>
        </div>

        <!-- Giscus Comments -->
        <GiscusComments 
          v-if="!file.isSource" 
          class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800"
          :key="file.path" 
          @update-comment-count="emit('update-comment-count', $event)"
        />
        
        <!-- Selection Menu -->
        <div 
          v-show="selectionMenu.show" 
          class="fixed z-50 flex bg-gray-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-xl transform -translate-x-1/2 -translate-y-full mb-2 p-1.5 gap-0.5 border border-white/10"
          :style="{ top: selectionMenu.y + 'px', left: selectionMenu.x + 'px' }"
          @mousedown.prevent
        >
          <button @click="applyFormatHandler('highlight-yellow')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Yellow Highlight">
            <span class="w-4 h-4 bg-yellow-400 rounded-full inline-block ring-2 ring-yellow-300/50"></span>
          </button>
          <!-- ... other buttons ... -->
        </div>
      </div>
    </div>

    <!-- Right Sidebar (TOC) -->
    <aside 
      v-if="!file.isSource && !isRawMode"
      class="hidden xl:flex w-72 2xl:w-80 flex-col gap-6 p-6 border-l border-white/30 dark:border-gray-700/30 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md overflow-y-auto custom-scrollbar z-20"
      :class="appStore.rightSidebarOpen ? 'fixed right-0 top-16 bottom-0 z-50 bg-white dark:bg-gray-900 shadow-xl' : ''"
    >
      
      <!-- Table of Contents -->
      <div v-if="toc.length > 0">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" :style="tocTitleStyle">
          <span>📑</span> {{ t.on_this_page }}
        </h3>
        <nav 
          class="space-y-1 relative border-l-2 pl-4 cursor-pointer select-none" 
          :style="tocBorderStyle"
          ref="tocNavRef"
          @mousedown="handleTocDragStart"
          @touchstart="handleTocDragStart"
        >
           <!-- Active Indicator -->
          <div 
            class="absolute left-[-2px] w-[2px] transition-all duration-300"
            :style="{
              top: activeIndicatorTop + 'px',
              height: activeIndicatorHeight + 'px',
              ...tocIndicatorStyle
            }"
            v-if="activeHeaderId"
          ></div>
          <a 
            v-for="item in toc" 
            :key="item.id"
            :ref="(el) => setTocItemRef(el, item.id)"
            :href="`#${item.id}`"
            class="block text-sm py-1.5 transition-all duration-200 leading-tight pr-2"
            :class="[
              item.level === 1 ? 'font-bold mb-2 mt-4' : 'font-normal',
              item.level > 1 ? `ml-${(item.level-1)*3} text-xs` : '',
              activeHeaderId === item.id ? 'translate-x-1 font-medium scale-105 origin-left' : ''
            ]"
            :style="getTocItemStyle(item)"
            @click.prevent="scrollToHeader(item.id)"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>

      <!-- Decorative / Meta Info -->
      <div class="mt-auto bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/60 dark:border-gray-700 shadow-sm backdrop-blur-sm">
         <div class="text-[10px] uppercase font-bold mb-2" :style="tocMetaTitleStyle">{{ t.note_details }}</div>
         <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
           <div class="flex justify-between"><span>{{ t.words }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentWordCount }}</span></div>
           <div class="flex justify-between"><span>{{ t.lines }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentLineCount }}</span></div>
           <div class="flex justify-between"><span>{{ t.format }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ file.isSource ? 'Code' : 'Markdown' }}</span></div>
         </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, ref, watch, onMounted } from 'vue';
import type { FileNode } from '../types';
import { useAppStore } from '../stores/appStore';
import { useArticleStore } from '../stores/articleStore';
import { useArticleMeta } from '../composables/useArticleMeta';
import { useContentRenderer } from '../composables/useContentRenderer';
import { useRawEditor } from '../composables/useRawEditor';
import { useLightbox } from '../composables/useLightbox';
import { useSelectionMenu } from '../composables/useSelectionMenu';
import { useContentClick } from '../composables/useContentClick';
import GiscusComments from '../components/GiscusComments.vue';

const props = defineProps<{
  file: FileNode;
  loading?: boolean;
  isRawMode: boolean;
  lang: string;
  t: any;
  getArticleViews: (path: string) => number;
  getArticleComments: (path: string) => number;
  onContentClick: (e: MouseEvent) => void;
}>();

const appStore = useAppStore();
const articleStore = useArticleStore();

const currentFile = toRef(props, 'file');
const isRawMode = toRef(props, 'isRawMode');

// Article Meta
const { currentMeta, currentTags, currentAuthorName, currentAuthorUrl, currentWordCount, currentLineCount } = useArticleMeta(currentFile);

// Renderer
const { renderedHtml, toc, activeHeaderId, updateRenderedContent, scrollToHeader, setupMarkedRenderer, generateToc } = useContentRenderer(currentFile, isRawMode);

onMounted(() => {
  setupMarkedRenderer();
  updateRenderedContent();
  generateToc();
});

watch([currentFile, isRawMode], () => {
  updateRenderedContent();
  generateToc();
});

// Raw Editor
const showToast = (msg: string) => appStore.showToast(msg);
const rawEditor = useRawEditor(currentFile, isRawMode, updateRenderedContent, showToast, computed(() => props.lang));

// Selection Menu
const selectionMenuComposable = useSelectionMenu(showToast);
const { selectionMenu, handleSelection, handleSelectionContextMenu, applyFormat } = selectionMenuComposable;

const handleSelectionEvent = (e: MouseEvent | TouchEvent) => handleSelection(e);
const handleSelectionContextMenuEvent = (e: MouseEvent) => handleSelectionContextMenu(e);
const applyFormatHandler = (format: string) => applyFormat(format);

// Content Click
const handleContentClickEvent = (e: MouseEvent) => {
  selectionMenuComposable.hideSelectionMenu();
  props.onContentClick(e);
};

// Utils
const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';
const handleLike = () => {
  if (articleStore.toggleLike(props.file.path)) {
    // maybe show toast
  }
};

// TOC Slider Logic
const tocNavRef = ref<HTMLElement | null>(null);
const isTocDragging = ref(false);
const tocItemRefs = ref<Record<string, HTMLElement>>({});

const setTocItemRef = (el: any, id: string) => {
  if (el) tocItemRefs.value[id] = el;
};

const activeIndicatorTop = computed(() => {
  if (!activeHeaderId.value) return 0;
  const el = tocItemRefs.value[activeHeaderId.value];
  return el ? el.offsetTop : 0;
});

const activeIndicatorHeight = computed(() => {
  if (!activeHeaderId.value) return 24;
  const el = tocItemRefs.value[activeHeaderId.value];
  return el ? el.offsetHeight : 24;
});

const handleTocDrag = (e: MouseEvent | TouchEvent) => {
  if (!isTocDragging.value || !tocNavRef.value) return;
  if ('touches' in e) e.preventDefault();
  
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  const navRect = tocNavRef.value.getBoundingClientRect();
  const relativeY = clientY - navRect.top;
  
  let closestId = '';
  let minDiff = Infinity;
  
  for (const item of toc.value) {
    const el = tocItemRefs.value[item.id];
    if (el) {
      const elMiddle = el.offsetTop + el.offsetHeight / 2;
      const diff = Math.abs(relativeY - elMiddle);
      if (diff < minDiff) {
        minDiff = diff;
        closestId = item.id;
      }
    }
  }
  
  if (closestId) {
    scrollToHeader(closestId);
  }
};

const handleTocDragEnd = () => {
  isTocDragging.value = false;
  document.body.style.userSelect = '';
  document.removeEventListener('mousemove', handleTocDrag);
  document.removeEventListener('touchmove', handleTocDrag);
  document.removeEventListener('mouseup', handleTocDragEnd);
  document.removeEventListener('touchend', handleTocDragEnd);
};

const handleTocDragStart = (e: MouseEvent | TouchEvent) => {
  if (toc.value.length === 0) return;
  isTocDragging.value = true;
  document.body.style.userSelect = 'none';
  document.addEventListener('mousemove', handleTocDrag);
  document.addEventListener('touchmove', handleTocDrag, { passive: false });
  document.addEventListener('mouseup', handleTocDragEnd);
  document.addEventListener('touchend', handleTocDragEnd);
  handleTocDrag(e);
};

// Computed Styles
const fontSizeClass = computed(() => {
  switch(appStore.userSettings.fontSize) {
    case 'small': return 'text-sm lg:text-base leading-relaxed';
    case 'large': return 'text-xl lg:text-2xl leading-loose';
    default: return 'text-base lg:text-lg leading-loose';
  }
});

const articleContainerStyle = computed(() => {
  const style: Record<string, string> = {
    borderColor: appStore.isDark ? 'rgba(255,255,255,0.08)' : 'var(--primary-100)'
  };
  if (currentMeta.value.backgroundColor) {
    style.backgroundColor = currentMeta.value.backgroundColor;
  } else if (appStore.userSettings.articleBackgroundColor) {
    style.backgroundColor = appStore.userSettings.articleBackgroundColor;
  }
  return style;
});

const articleStyleClass = computed(() => {
  const style = appStore.userSettings.articleStyle;
  return style ? `article-style-${style}` : '';
});

const loadingTextStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-500)'
}));

const authorLinkStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}));

const tagBadgeStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'var(--primary-900-30)' : 'var(--primary-100)',
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}));

const tocTitleStyle = computed(() => ({
  color: appStore.isDark ? 'var(--primary-300)' : 'var(--primary-600)'
}));

const tocBorderStyle = computed(() => ({
  borderColor: appStore.isDark ? 'rgba(255,255,255,0.1)' : 'var(--primary-100)'
}));

const tocIndicatorStyle = computed(() => ({
  backgroundColor: appStore.isDark ? 'var(--primary-400)' : 'var(--primary-500)',
  boxShadow: `0 0 8px ${appStore.isDark ? 'var(--primary-400)' : 'var(--primary-500)'}`
}));

const tocMetaTitleStyle = computed(() => ({
  color: appStore.isDark ? 'rgba(255,255,255,0.4)' : 'var(--primary-400)'
}));

const getTocItemStyle = (item: any) => ({
  color: activeHeaderId.value === item.id 
    ? (appStore.isDark ? 'var(--primary-400)' : 'var(--primary-600)') 
    : (appStore.isDark ? 'rgba(255,255,255,0.6)' : 'var(--primary-800)')
});
</script>

<template>
  <div class="flex-1 overflow-hidden z-10 relative">
    <div
      v-if="false"
      ref="mobilePagerRef"
      class="flex h-full overflow-x-auto overflow-y-hidden"
      style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
      @scroll.passive="handleMobilePagerScroll"
    >
      <div class="flex h-full">
        <div
          ref="localScrollContainerRef"
          class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full basis-full shrink-0"
          style="scroll-snap-align: start;"
          :style="{ padding: 'var(--reader-page-padding, 1.5rem)' }"
        >
          <div 
             class="w-full mx-auto bg-white/85 dark:bg-gray-900/85 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative"
             :class="[fontSizeClass, articleStyleClass]"
             :style="[{ padding: 'var(--reader-card-padding, 2.5rem)' }, articleContainerStyle]"
          >
         <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
           <div class="flex flex-col items-center gap-4">
              <div class="animate-spin text-4xl">🌸</div>
              <div class="text-sm font-bold animate-pulse" :style="loadingTextStyle">Fetching Content...</div>
           </div>
         </div>

         <ArticleInfoBar
           :lang="lang"
           :is-source="!!file.isSource"
           :author-name="currentAuthorName"
           :author-url="currentAuthorUrl"
           :author-link-style="authorLinkStyle"
           :liked="articleStore.isLiked(file.path)"
           :likes="articleStore.getLikes(file.path)"
           :on-like="handleLike"
           :favorite="articleStore.isFavorite(file.path)"
           :favorite-text="t.favorite"
           :on-toggle-favorite="() => articleStore.toggleFavorite(file.path)"
           v-model:backgroundColor="articleBackgroundColor"
           :on-reset-background-color="resetArticleBackgroundColor"
           :views="getArticleViews(file.path)"
           :views-label="lang === 'zh' ? '人阅读' : 'views'"
           :comments="getArticleComments(file.path)"
           :comments-label="lang === 'zh' ? '条评论' : 'comments'"
           :word-count="currentWordCount"
           :words-label="t.words"
           :updated-label="t.updated"
           :updated-date="formatDate(file.lastModified)"
           :tags="currentTags"
           :tag-badge-style="tagBadgeStyle"
           :show-toc-button="false"
           :on-open-toc="() => {}"
         />

        <!-- Markdown Content -->
        <div 
          v-if="!file.isSource && !isRawMode"
          id="markdown-viewer"
          ref="markdownViewerRef"
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
                <button @click="rawEditor.isEditingRaw.value ? rawEditor.cancelEditingRaw() : rawEditor.startEditingRaw()" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  {{ rawEditor.isEditingRaw.value ? (lang === 'zh' ? '取消' : 'Cancel') : (lang === 'zh' ? '编辑' : 'Edit') }}
                </button>
             </div>
           </div>
           
           <textarea 
             v-if="rawEditor.isEditingRaw.value"
             v-model="rawEditor.editedRawContent.value"
             class="w-full h-[600px] bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
           ></textarea>
           <pre v-else class="bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl overflow-x-auto"><code>{{ file.content }}</code></pre>
        </div>

        <!-- Prev/Next Buttons -->
        <div v-if="!file.isSource && !isRawMode" class="mt-12 flex justify-between gap-4">
          <button 
            v-if="prevFile"
            @click="navigateTo(prevFile)"
            class="flex-1 max-w-[45%] text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-700)] transition-all group"
          >
            <div class="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <span>←</span>
              <span>{{ t.previous || (lang === 'zh' ? '上一篇' : 'Previous') }}</span>
            </div>
            <div class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] truncate">
              {{ (prevFile?.name || '').replace('.md', '') }}
            </div>
          </button>
          <div v-else class="flex-1"></div>
          <button 
            v-if="nextFile"
            @click="navigateTo(nextFile)"
            class="flex-1 max-w-[45%] text-right p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-700)] transition-all group"
          >
            <div class="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
              <span>{{ t.next || (lang === 'zh' ? '下一篇' : 'Next') }}</span>
              <span>→</span>
            </div>
            <div class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] truncate">
              {{ (nextFile?.name || '').replace('.md', '') }}
            </div>
          </button>
          <div v-else class="flex-1"></div>
        </div>

        <!-- Giscus Comments -->
        <GiscusComments 
          v-if="!file.isSource" 
          class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800"
          :key="file.path" 
          :lang="lang"
          :is-dark="appStore.isDark"
          :path="file.path"
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
        <div
          class="h-full overflow-y-auto p-4 w-full basis-full shrink-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md"
          style="scroll-snap-align: start;"
        >
          <div class="max-w-md mx-auto bg-white/85 dark:bg-gray-900/85 p-4 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] backdrop-blur-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <button
                type="button"
                class="px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/60 dark:border-gray-700/60 text-sm text-gray-700 dark:text-gray-200"
                @click="scrollToArticlePage()"
              >
                ← {{ lang === 'zh' ? '返回' : 'Back' }}
              </button>
              <div class="text-sm font-bold flex items-center gap-2" :style="tocTitleStyle">
                <span>📑</span>
                <span>{{ t.on_this_page }}</span>
              </div>
              <div class="w-[72px]"></div>
            </div>

            <div v-if="toc.length > 0">
              <nav
                class="space-y-1 relative border-l-2 pl-4 cursor-pointer select-none"
                :style="tocBorderStyle"
              >
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
                  :href="`#${item.id}`"
                  class="block text-sm py-1.5 transition-all duration-200 leading-tight pr-2"
                  :class="[
                    item.level === 1 ? 'font-bold mb-2 mt-4' : 'font-normal',
                    item.level > 1 ? `ml-${(item.level-1)*3} text-xs` : '',
                    activeHeaderId === item.id ? 'translate-x-1 font-medium scale-105 origin-left' : ''
                  ]"
                  :style="getTocItemStyle(item)"
                  @click.prevent="handleMobileTocClick(item.id)"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>

            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              {{ lang === 'zh' ? '暂无目录' : 'No TOC' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex h-full">
      <div 
        ref="localScrollContainerRef"
        class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full"
        :style="{ padding: 'var(--reader-page-padding, 1.5rem)' }"
      >
        <div 
           class="w-full mx-auto bg-white/85 dark:bg-gray-900/85 rounded-[2rem] shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-white/60 dark:border-gray-700/60 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative"
           :class="[fontSizeClass, articleStyleClass, appStore.sidebarOpen ? 'max-w-4xl xl:max-w-5xl' : 'max-w-5xl xl:max-w-7xl']"
           :style="[{ padding: 'var(--reader-card-padding, 2.5rem)' }, articleContainerStyle]"
        >
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
            <div class="flex flex-col items-center gap-4">
               <div class="animate-spin text-4xl">🌸</div>
               <div class="text-sm font-bold animate-pulse" :style="loadingTextStyle">Fetching Content...</div>
            </div>
          </div>

          <ArticleInfoBar
            :lang="lang"
            :is-source="!!file.isSource"
            :author-name="currentAuthorName"
            :author-url="currentAuthorUrl"
            :author-link-style="authorLinkStyle"
            :liked="articleStore.isLiked(file.path)"
            :likes="articleStore.getLikes(file.path)"
            :on-like="handleLike"
            :favorite="articleStore.isFavorite(file.path)"
            :favorite-text="t.favorite"
            :on-toggle-favorite="() => articleStore.toggleFavorite(file.path)"
            v-model:backgroundColor="articleBackgroundColor"
            :on-reset-background-color="resetArticleBackgroundColor"
            :views="getArticleViews(file.path)"
            :views-label="lang === 'zh' ? '人阅读' : 'views'"
            :comments="getArticleComments(file.path)"
            :comments-label="lang === 'zh' ? '条评论' : 'comments'"
            :word-count="currentWordCount"
            :words-label="t.words"
            :updated-label="t.updated"
            :updated-date="formatDate(file.lastModified)"
            :tags="currentTags"
            :tag-badge-style="tagBadgeStyle"
            :show-toc-button="false"
            :on-open-toc="() => {}"
          />

         <!-- Markdown Content -->
         <div 
           v-if="!file.isSource && !isRawMode"
           id="markdown-viewer"
           ref="markdownViewerRef"
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
                 <button @click="rawEditor.isEditingRaw.value ? rawEditor.cancelEditingRaw() : rawEditor.startEditingRaw()" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                   {{ rawEditor.isEditingRaw.value ? (lang === 'zh' ? '取消' : 'Cancel') : (lang === 'zh' ? '编辑' : 'Edit') }}
                 </button>
              </div>
            </div>
            
            <textarea 
              v-if="rawEditor.isEditingRaw.value"
              v-model="rawEditor.editedRawContent.value"
              class="w-full h-[600px] bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
            ></textarea>
            <pre v-else class="bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 rounded-b-xl overflow-x-auto"><code>{{ file.content }}</code></pre>
         </div>

         <!-- Prev/Next Buttons -->
         <div v-if="!file.isSource && !isRawMode" class="mt-12 flex justify-between gap-4">
           <button 
             v-if="prevFile"
             @click="navigateTo(prevFile)"
             class="flex-1 max-w-[45%] text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-700)] transition-all group"
           >
             <div class="text-xs text-gray-400 mb-1 flex items-center gap-1">
               <span>←</span>
               <span>{{ t.previous || (lang === 'zh' ? '上一篇' : 'Previous') }}</span>
             </div>
             <div class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] truncate">
               {{ prevFile.name.replace('.md', '') }}
             </div>
           </button>
           <div v-else class="flex-1"></div>
           <button 
             v-if="nextFile"
             @click="navigateTo(nextFile)"
             class="flex-1 max-w-[45%] text-right p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30 hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-700)] transition-all group"
           >
             <div class="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1">
               <span>{{ t.next || (lang === 'zh' ? '下一篇' : 'Next') }}</span>
               <span>→</span>
             </div>
             <div class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] truncate">
               {{ nextFile.name.replace('.md', '') }}
             </div>
           </button>
           <div v-else class="flex-1"></div>
         </div>

         <!-- Giscus Comments -->
         <GiscusComments 
           v-if="!file.isSource" 
           class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800"
           :key="file.path" 
           :lang="lang"
           :is-dark="appStore.isDark"
           :path="file.path"
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
        class="hidden lg:flex w-72 2xl:w-80 flex-col gap-6 p-6 border-l border-white/30 dark:border-gray-700/30 backdrop-blur-md overflow-y-auto custom-scrollbar z-20 lg:static lg:h-auto lg:shadow-none lg:bg-white/20 lg:dark:bg-gray-900/20"
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

    <div
      v-if="!file.isSource && !isRawMode && !(isMobile && isMobileTocPage)"
      class="fixed bottom-4 xl:right-[19rem] 2xl:right-[21rem] z-50 flex flex-col gap-2"
      :class="floatingNavRightClass"
    >
      <button
        type="button"
        class="w-11 h-11 rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!prevFile"
        @click="prevFile && navigateTo(prevFile)"
        :aria-label="lang === 'zh' ? '上一篇' : 'Previous'"
        :title="lang === 'zh' ? '上一篇' : 'Previous'"
      >
        ←
      </button>
      <button
        type="button"
        class="w-11 h-11 rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!nextFile"
        @click="nextFile && navigateTo(nextFile)"
        :aria-label="lang === 'zh' ? '下一篇' : 'Next'"
        :title="lang === 'zh' ? '下一篇' : 'Next'"
      >
        →
      </button>
      <button
        type="button"
        class="w-11 h-11 rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
        @click="scrollToBottom()"
        :aria-label="lang === 'zh' ? '到底' : 'Bottom'"
        :title="lang === 'zh' ? '到底' : 'Bottom'"
      >
        ⬇
      </button>
      <button
        type="button"
        class="w-11 h-11 rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
        @click="scrollToTop()"
        :aria-label="lang === 'zh' ? '返回顶部' : 'Top'"
        :title="lang === 'zh' ? '返回顶部' : 'Top'"
      >
        ⬆
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue';
import type { FileNode } from '../types';
import { useAppStore } from '../stores/appStore';
import { useArticleStore } from '../stores/articleStore';
import { useArticleNavStore } from '../stores/articleNavStore';
import { useArticleMeta } from '../composables/useArticleMeta';
import { useContentRenderer } from '../composables/useContentRenderer';
import { useRawEditor } from '../composables/useRawEditor';
import { useLightbox } from '../composables/useLightbox';
import { useSelectionMenu } from '../composables/useSelectionMenu';
import { useContentClick } from '../composables/useContentClick';
import { useSearchJump } from '../composables/useSearchJump';
import GiscusComments from '../components/GiscusComments.vue';
import ArticleInfoBar from '../components/ArticleInfoBar.vue';

const props = defineProps<{
  file: FileNode;
  loading?: boolean;
  isRawMode: boolean;
  lang: 'en' | 'zh';
  t: any;
  getArticleViews: (path: string) => number;
  getArticleComments: (path: string) => number;
  onContentClick: (e: MouseEvent) => void;
}>();

const emit = defineEmits([
  'update-comment-count', 
  'open-file',
  'open-search',
  'open-settings',
  'open-music',
  'open-write',
  'open-download',
  'toggle-theme',
  'scroll-container-change',
  'markdown-viewer-change'
]);

const appStore = useAppStore();
const articleStore = useArticleStore();
const articleNavStore = useArticleNavStore();
const markdownViewerRef = ref<HTMLElement | null>(null)
const localScrollContainerRef = ref<HTMLElement | null>(null)
const mobilePagerRef = ref<HTMLElement | null>(null)

const isMobile = ref(false)
const isMobileTocPage = ref(false)
const checkMobile = () => {
  const nextIsMobile = window.innerWidth < 768
  if (isMobile.value && !nextIsMobile) {
    isMobileTocPage.value = false
  }
  isMobile.value = nextIsMobile
  if (nextIsMobile) {
    nextTick(() => handleMobilePagerScroll())
  }
}

const handleMobilePagerScroll = () => {
  const el = mobilePagerRef.value
  if (!el) return
  isMobileTocPage.value = el.scrollLeft > el.clientWidth / 2
}

const scrollToArticlePage = (behavior: ScrollBehavior = getScrollBehavior()) => {
  const el = mobilePagerRef.value
  if (!el) return
  el.scrollTo({ left: 0, behavior })
}

const scrollToTocPage = (behavior: ScrollBehavior = getScrollBehavior()) => {
  const el = mobilePagerRef.value
  if (!el) return
  el.scrollTo({ left: el.clientWidth, behavior })
}

const handleMobileTocClick = (id: string) => {
  scrollToArticlePage('auto')
  nextTick(() => {
    setTimeout(() => {
      scrollToHeader(id)
    }, 0)
  })
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const floatingNavRightClass = computed(() => {
  if (isMobile.value && appStore.rightSidebarOpen) return 'right-[calc(1rem+3rem)]'
  return 'right-4'
})

const currentFile = toRef(props, 'file');
const isRawMode = toRef(props, 'isRawMode');

// Navigation Logic
const flatFiles = computed(() => appStore.flatFiles || []); 
const sortedFiles = computed(() => appStore.sortedFiles || []);

const prevFile = computed(() => {
  if (!props.file || props.file.isSource) return null;
  const list = appStore.userSettings.articleSortMode === 'date' ? sortedFiles.value : flatFiles.value;
  if (!list.length) return null;
  const idx = list.findIndex(f => f.path === props.file.path);
  return idx > 0 ? list[idx - 1] : null;
});

const nextFile = computed(() => {
  if (!props.file || props.file.isSource) return null;
  const list = appStore.userSettings.articleSortMode === 'date' ? sortedFiles.value : flatFiles.value;
  if (!list.length) return null;
  const idx = list.findIndex(f => f.path === props.file.path);
  return idx !== -1 && idx < list.length - 1 ? list[idx + 1] : null;
});

const getScrollBehavior = () => {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'
}

const scrollToTop = () => {
  const behavior = getScrollBehavior()
  const container = localScrollContainerRef.value || null
  if (container) {
    container.scrollTo({ top: 0, behavior })
  } else {
    window.scrollTo({ top: 0, behavior })
  }
}

const scrollToBottom = () => {
  const behavior = getScrollBehavior()
  const container = localScrollContainerRef.value || null
  if (container) {
    container.scrollTo({ top: container.scrollHeight, behavior })
  } else {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior })
  }
}

const navigateTo = (file: FileNode) => {
  emit('open-file', file);
  nextTick(() => {
    scrollToTop()
  })
};

// Renderer
const { renderedHtml, toc, activeHeaderId, updateRenderedContent, scrollToHeader, setupMarkedRenderer, generateToc } = useContentRenderer(currentFile, isRawMode, localScrollContainerRef);

watch(
  toc,
  (nextToc) => {
    articleNavStore.setToc(nextToc, props.file?.path || null);
  },
  { deep: true, immediate: true }
);

watch(
  activeHeaderId,
  (id) => {
    articleNavStore.setActiveHeader(id || '');
  },
  { immediate: true }
);

watch(
  () => articleNavStore.pendingScrollToId,
  (id) => {
    if (!id) return;
    const el = document.getElementById(id)
    if (!el) return;
    scrollToHeader(id);
    articleNavStore.consumePendingScrollTo();
  }
);

watch(renderedHtml, () => {
  const id = articleNavStore.pendingScrollToId
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  scrollToHeader(id)
  articleNavStore.consumePendingScrollTo()
})

useSearchJump({
  getTarget: () => String((appStore as any).searchTarget ?? ''),
  clearTarget: () => { (appStore as any).searchTarget = null },
  getFilePath: () => props.file?.path || '',
  renderedHtml,
  getScrollBehavior,
  getScrollContainer: () => localScrollContainerRef.value || null,
  getViewer: () => markdownViewerRef.value || null
})

// Article Meta
const { currentMeta, currentTags, currentAuthorName, currentAuthorUrl, currentWordCount, currentLineCount } = useArticleMeta(currentFile);

const isEditableTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  return !!(el as any).isContentEditable
}

const getCurrentTocIndex = () => {
  const container = localScrollContainerRef.value || null
  if (!container) return toc.value.findIndex((i) => i.id === activeHeaderId.value)

  const scrollPosition = container.scrollTop
  let idx = -1
  for (let i = 0; i < toc.value.length; i++) {
    const item = toc.value[i]
    const el = document.getElementById(item.id)
    if (el && el.offsetTop - container.offsetTop - 150 <= scrollPosition) {
      idx = i
    }
  }
  return idx
}

const jumpToPrevHeading = () => {
  if (toc.value.length === 0) return
  const idx = getCurrentTocIndex()
  if (idx <= 0) {
    scrollToTop()
    return
  }
  scrollToHeader(toc.value[idx - 1].id)
}

const jumpToNextHeading = () => {
  if (toc.value.length === 0) return
  const idx = getCurrentTocIndex()
  if (idx === -1) {
    scrollToHeader(toc.value[0].id)
    return
  }
  const next = toc.value[idx + 1]
  if (!next) {
    scrollToBottom()
    return
  }
  scrollToHeader(next.id)
}

const handleReaderKeydown = (e: KeyboardEvent) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (isEditableTarget(e.target)) return
  if (appStore.showSearch || appStore.showSettings || appStore.showDownloadModal || appStore.showWriteEditor) return
  if (!props.file || props.file.isSource || isRawMode.value) return

  if (e.key === 'ArrowLeft') {
    if (prevFile.value) {
      e.preventDefault()
      navigateTo(prevFile.value)
    }
    return
  }
  if (e.key === 'ArrowRight') {
    if (nextFile.value) {
      e.preventDefault()
      navigateTo(nextFile.value)
    }
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    jumpToPrevHeading()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    jumpToNextHeading()
    return
  }
}

onMounted(() => {
  setupMarkedRenderer();
  document.addEventListener('keydown', handleReaderKeydown)
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleReaderKeydown)
})

watch(localScrollContainerRef, (el) => {
  emit('scroll-container-change', el)
}, { immediate: true })

watch(markdownViewerRef, (el) => {
  emit('markdown-viewer-change', el)
}, { immediate: true })

watch([currentFile, isRawMode], () => {
  updateRenderedContent();
  generateToc();
}, { immediate: true });

// Raw Editor
const showToast = (msg: string) => appStore.showToast(msg);
const rawEditor = useRawEditor(currentFile, isRawMode, updateRenderedContent, showToast, toRef(props, 'lang'));

// Selection Menu
const selectionMenuComposable = useSelectionMenu(markdownViewerRef, showToast);
const { selectionMenu, handleSelection, handleSelectionContextMenu, applyFormat } = selectionMenuComposable;

const handleSelectionEvent = () => handleSelection();
const handleSelectionContextMenuEvent = (e: MouseEvent) => handleSelectionContextMenu(e);
const applyFormatHandler = (format: string) => applyFormat(format, props.lang === 'zh' ? '应用格式失败' : 'Format failed');

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

const articleBackgroundColor = computed({
  get: () => {
    return appStore.isDark
      ? appStore.userSettings.articleBackgroundColorDark
      : appStore.userSettings.articleBackgroundColorLight
  },
  set: (value: string) => {
    if (appStore.isDark) {
      appStore.userSettings.articleBackgroundColorDark = value
    } else {
      appStore.userSettings.articleBackgroundColorLight = value
    }
  }
})

const resetArticleBackgroundColor = () => {
  articleBackgroundColor.value = ''
}

const articleContainerStyle = computed(() => {
  const style: Record<string, string> = {
    borderColor: appStore.isDark ? 'rgba(255,255,255,0.08)' : 'var(--primary-100)'
  };
  if (currentMeta.value.backgroundColor) {
    style.backgroundColor = currentMeta.value.backgroundColor;
  } else if (articleBackgroundColor.value) {
    style.backgroundColor = articleBackgroundColor.value;
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

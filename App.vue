<template>
  <!-- Dynamic Petals Container (Front layer - outside main for highest z-index) -->
  <PetalBackground v-if="appStore.showParticles && appStore.userSettings.petalLayer === 'front'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="front" />

  <!-- Global Audio Player -->
  <GlobalAudio />

  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-white/30 dark:bg-gray-900/60 backdrop-blur-[2px] font-sans transition-colors duration-500 relative" :class="[appStore.userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans', appStore.isDark ? 'dark' : '']">
    
    <!-- Mobile Menu Button (repositioned to avoid overlap) -->
    <button 
      @click="sidebarOpen = !sidebarOpen"
      class="md:hidden fixed z-50 p-2 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-md border border-sakura-100 dark:border-gray-700 transition-all duration-300"
      :class="[
        sidebarOpen ? 'top-4 left-[calc(100%-3.5rem)]' : 'top-2 left-2',
        headerHidden ? 'top-2' : ''
      ]"
    >
      <svg class="w-5 h-5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
    />

    <!-- Left Sidebar: Navigation -->
    <AppSidebar 
      :class="[sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']"
      class="fixed md:relative z-40 transition-transform duration-300 ease-out"
      :lang="lang"
      :t="t"
      v-model:viewMode="viewMode"
      :loading="loading"
      :file-system="fileSystem"
      :filtered-file-system="filteredFileSystem"
      :filtered-flat-files="filteredFlatFiles"
      :current-file="currentFile"
      :expanded-folders="expandedFolders"
      :current-path="currentPath"
      :lab-folder="labFolder"
      :resource-categories="resourceCategories"
      :current-tool="currentTool"
      :lab-tabs="labTabs"
      :active-lab-tab="labDashboardTab"
      @toggle-lang="toggleLang"
      @reset="resetToHome"
      @select-tool="selectTool"
      @toggle-folder="toggleFolder"
      @select-file="handleSidebarFileSelect"
      @select-folder="openFolder"
      @open-search="showSearch = true"
      @update:activeLabTab="handleLabTabChange"
    />

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative isolate">
      <!-- Wallpaper Layer (behind decorations, excluding sidebar) -->
      <WallpaperLayer :is-dark="appStore.isDark" :light-url="wallpaperLightUrl" :dark-url="wallpaperDarkUrl" :bannerMode="appStore.userSettings.bannerMode" />

      <!-- Dynamic Petals Container (Back layer - inside main for proper z-index with isolate) -->
      <PetalBackground v-if="appStore.showParticles && appStore.userSettings.petalLayer === 'back'" :speed="appStore.userSettings.petalSpeed" :isDark="appStore.isDark" layer="back" />

      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-sakura-100/40 to-purple-100/30 dark:from-sakura-900/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
        <div class="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sakura-200/30 to-sakura-50/20 dark:from-sakura-800/10 dark:to-sakura-900/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <!-- Header Component -->
      <AppHeader
        :lang="lang"
        :t="t"
        :breadcrumbs="breadcrumbs"
        :view-mode="viewMode"
        :current-tool="currentTool"
        :current-file="currentFile"
        :show-particles="appStore.showParticles"
        :is-dark="appStore.isDark"
        :petal-speed="appStore.userSettings.petalSpeed"
        :header-hidden="headerHidden"
        :dual-column-mode="dualColumnMode"
        v-model:isRawMode="isRawMode"
        @reset="resetToHome"
        @navigate="navigateToBreadcrumb"
        @copy-link="copyLink"
        @download="downloadSource"
        @open-settings="showSettings = true"
        @open-search="showSearch = true"
        @open-music="musicStore.showMusicPlayer = true"
        @open-write="showWriteEditor = true"
        @open-download="showDownloadModal = true"
        @toggle-theme="toggleTheme(!appStore.isDark)"
        @update:petal-speed="handlePetalSpeedChange"
        @toggle-dual-column="dualColumnMode = !dualColumnMode; if(dualColumnMode && !currentTool) currentTool = 'dashboard'"
      />

      <!-- Content Area -->
      <div class="flex-1 flex overflow-hidden z-10 relative">
        
        <!-- Selection Menu (Floating) -->
        <div 
          v-show="selectionMenu.show" 
          class="fixed z-50 flex bg-gray-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-xl transform -translate-x-1/2 -translate-y-full mb-2 p-1.5 gap-0.5 border border-white/10"
          :style="{ top: selectionMenu.y + 'px', left: selectionMenu.x + 'px' }"
          @mousedown.prevent
        >
          <!-- Highlight Options -->
          <button @click="applyFormatHandler('highlight-yellow')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Yellow Highlight">
            <span class="w-4 h-4 bg-yellow-400 rounded-full inline-block ring-2 ring-yellow-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-green')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Green Highlight">
            <span class="w-4 h-4 bg-green-400 rounded-full inline-block ring-2 ring-green-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-blue')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Blue Highlight">
            <span class="w-4 h-4 bg-blue-400 rounded-full inline-block ring-2 ring-blue-300/50"></span>
          </button>
          <button @click="applyFormatHandler('highlight-pink')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" title="Pink Highlight">
            <span class="w-4 h-4 bg-pink-400 rounded-full inline-block ring-2 ring-pink-300/50"></span>
          </button>
          
          <div class="w-px bg-white/20 mx-0.5"></div>
          
          <!-- Underline Styles -->
          <button @click="applyFormatHandler('underline-wavy')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Wavy Underline">
             <span class="underline decoration-wavy decoration-sakura-400 underline-offset-2">〰</span>
          </button>
          <button @click="applyFormatHandler('underline-double')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Double Underline">
             <span class="underline decoration-double decoration-blue-400 underline-offset-2">≡</span>
          </button>

          <div class="w-px bg-white/20 mx-0.5"></div>

          <!-- Block Highlight -->
          <button @click="applyFormatHandler('highlight-block')" class="p-2 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all" title="Block Highlight">
            <span class="px-2 py-0.5 border border-yellow-300 rounded bg-yellow-200/40">▭</span>
          </button>
        </div>

        <!-- Center Stage -->
        <div 
          v-if="currentFile || (viewMode === 'lab' && currentTool) || currentFolder" 
          id="scroll-container" 
          class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full" 
        >
          
          <!-- Lab Tool View (Unified Dashboard) -->
          <div v-if="viewMode === 'lab' && currentTool === 'dashboard'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabDashboard :lang="lang" v-model="labDashboardTab" @tab-change="handleLabTabChange" @select-lab="selectTool" />
          </div>

          <!-- Lab: Source Code Viewer -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'source-code'" class="w-full h-[calc(100vh-12rem)] animate-fade-in">
             <SourceCodeViewer :lang="lang" />
          </div>

          <!-- Lab: Event Handling -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'event-handling'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabEventHandling :lang="lang" />
          </div>

          <!-- Lab: Slot System -->
          <div v-else-if="viewMode === 'lab' && currentTool === 'slot'" class="w-full max-w-6xl mx-auto animate-fade-in pb-20">
             <LabSlot :lang="lang" />
          </div>

          <!-- Folder View Component -->
          <FolderView 
            v-else-if="currentFolder"
            :current-folder="currentFolder"
            @open-folder="openFolder"
            @open-file="openFile"
          />

          <!-- Note Content View -->
          <div v-else-if="currentFile" 
             class="w-full max-w-4xl xl:max-w-5xl mx-auto bg-white/80 dark:bg-gray-900/80 p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-sakura-200/50 dark:border-gray-700 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-xl transition-all duration-300 relative"
             :class="fontSizeClass"
          >
             <div v-if="contentLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
               <div class="flex flex-col items-center gap-4">
                  <div class="animate-spin text-4xl">🌸</div>
                  <div class="text-sm font-bold text-sakura-500 animate-pulse">Fetching Content...</div>
               </div>
             </div>

             <!-- Header with Like/Favorite buttons -->
             <div class="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                 <div class="flex justify-between items-start gap-4">
                   <div class="flex flex-wrap items-center gap-3 flex-1">
                     <span v-if="currentAuthorName || currentAuthorUrl" class="text-sm text-gray-400 flex items-center gap-1">
                       <span>👤</span>
                       <a
                         v-if="currentAuthorUrl"
                         :href="currentAuthorUrl"
                         target="_blank"
                         rel="noopener"
                         class="text-sakura-600 dark:text-sakura-300 hover:underline"
                       >
                         {{ currentAuthorName || currentAuthorUrl }}
                       </a>
                       <span v-else>{{ currentAuthorName }}</span>
                     </span>
                   </div>
                   <span v-if="currentFile.isSource" class="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded text-xs font-mono">Read Only</span>
                 </div>
                 <!-- Article Actions -->
                 <div class="flex items-center gap-4 mt-4 flex-wrap" v-if="!currentFile.isSource">
                   <button 
                     @click="handleLike"
                     class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                     :class="articleStore.isLiked(currentFile.path) ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-50'"
                   >
                     <span>{{ articleStore.isLiked(currentFile.path) ? '❤️' : '🤍' }}</span>
                     <span class="font-bold">{{ articleStore.getLikes(currentFile.path) }}</span>
                   </button>
                   <button 
                     @click="articleStore.toggleFavorite(currentFile.path)"
                     class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                     :class="articleStore.isFavorite(currentFile.path) ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-amber-50'"
                   >
                     <span>{{ articleStore.isFavorite(currentFile.path) ? '⭐' : '☆' }}</span>
                     <span>{{ t.favorite }}</span>
                   </button>
                   <span class="text-xs text-gray-400 flex items-center gap-1">
                     📖 {{ getArticleViews(currentFile.path) }} {{ lang === 'zh' ? '人阅读' : 'views' }}
                   </span>
                   <span class="text-xs text-gray-400">
                    📝 {{ currentWordCount }} {{ t.words }}
                   </span>
                   <span class="text-xs text-gray-400 flex items-center gap-1">
                     🕐 {{ t.updated }}: {{ formatDate(currentFile.lastModified) }}
                   </span>
                   <span v-if="currentTags.length" class="text-xs text-gray-400 flex items-center gap-1">
                     🏷️
                     <span class="flex flex-wrap gap-1.5">
                       <span
                         v-for="tag in currentTags"
                         :key="tag"
                         class="text-[10px] px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300"
                       >
                         {{ tag }}
                       </span>
                     </span>
                   </span>
                 </div>
             </div>

            <!-- Markdown Content -->
            <div 
              v-if="!currentFile.isSource && !isRawMode"
              id="markdown-viewer"
              v-html="renderedHtml" 
              class="markdown-body dark:text-gray-300 selection:bg-sakura-200 dark:selection:bg-sakura-900"
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
                   <button
                     v-if="!rawEditor.isEditingRaw.value && !currentFile.isSource"
                     @click="rawEditor.startEditingRaw()"
                     class="text-xs px-3 py-1.5 bg-sakura-500 hover:bg-sakura-600 text-white rounded transition-colors"
                   >
                     {{ lang === 'zh' ? '编辑' : 'Edit' }}
                   </button>
                   <template v-if="rawEditor.isEditingRaw.value">
                     <!-- Preview Toggle Button -->
                     <button
                       @click="rawEditor.togglePreviewMode()"
                       class="text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                       :class="rawEditor.isPreviewMode.value ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'"
                     >
                       <svg v-if="!rawEditor.isPreviewMode.value" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                       </svg>
                       <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                       </svg>
                       {{ rawEditor.isPreviewMode.value ? (lang === 'zh' ? '编辑' : 'Edit') : (lang === 'zh' ? '预览' : 'Preview') }}
                     </button>
                     <button
                       @click="rawEditor.cancelEditingRaw()"
                       class="text-xs px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                       :disabled="rawEditor.isSavingRaw.value"
                     >
                       {{ lang === 'zh' ? '取消' : 'Cancel' }}
                     </button>
                     <button
                       @click="rawEditor.saveRawContent()"
                       class="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded transition-colors flex items-center gap-1"
                       :disabled="rawEditor.isSavingRaw.value"
                     >
                       <svg v-if="rawEditor.isSavingRaw.value" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                         <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                         <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       {{ rawEditor.isSavingRaw.value ? (lang === 'zh' ? '提交中...' : 'Publishing...') : (lang === 'zh' ? '提交修改' : 'Submit Changes') }}
                     </button>
                   </template>
                 </div>
               </div>
               <!-- Editable Textarea or Preview -->
               <div v-if="rawEditor.isEditingRaw.value" class="relative">
                 <!-- Editor Mode -->
                 <textarea
                   v-if="!rawEditor.isPreviewMode.value"
                   v-model="rawEditor.editedRawContent.value"
                   class="w-full h-[60vh] font-mono text-sm bg-[#1e1e1e] text-blue-200 p-6 rounded-b-xl border border-gray-700 resize-none outline-none focus:ring-2 focus:ring-sakura-500/50"
                   spellcheck="false"
                 ></textarea>
                 <!-- Preview Mode -->
                 <div
                   v-else
                   class="w-full h-[60vh] overflow-auto bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700"
                 >
                   <div 
                     class="prose dark:prose-invert max-w-none"
                     v-html="previewEditingContent"
                   ></div>
                 </div>
               </div>
               <!-- Read-only Code View -->
               <pre v-else class="whitespace-pre-wrap font-mono text-sm bg-[#1e1e1e] text-blue-200 p-6 rounded-b-xl border border-gray-700 overflow-x-auto select-text shadow-inner"><code :class="currentFile.name.endsWith('.vue') ? 'language-html' : ''">{{ currentFile.content }}</code></pre>
            </div>

            <!-- Contributors Section -->
            <div v-if="currentContributors.length > 0" class="mt-8 pt-6 border-t border-sakura-100 dark:border-gray-700">
              <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <span>👥</span> {{ lang === 'zh' ? '贡献者' : 'Contributors' }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <template v-for="contributor in currentContributors" :key="contributor.name">
                  <a
                    v-if="contributor.url"
                    :href="contributor.url"
                    target="_blank"
                    rel="noopener"
                    class="text-sm px-3 py-1 rounded-full bg-sakura-50 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300 hover:bg-sakura-100 dark:hover:bg-sakura-900/50 transition-colors"
                  >
                    {{ contributor.name }}
                  </a>
                  <span
                    v-else
                    class="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {{ contributor.name }}
                  </span>
                </template>
              </div>
            </div>
            
            <div class="mt-12 pt-8 border-t border-sakura-100 dark:border-gray-700 flex justify-center text-xs text-sakura-300 dark:text-gray-500">
              <span class="italic">Sakura Notes</span>
            </div>

            <!-- Comments Section -->
            <GiscusComments 
              v-if="!currentFile.isSource"
              :path="currentFile.path"
              :lang="lang"
              :is-dark="appStore.isDark"
            />
          </div>
        </div>

        <!-- Empty State / Home -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-sakura-300 dark:text-gray-600 animate-fade-in p-6 text-center">
            <div class="relative group cursor-default">
               <div class="text-[12rem] mb-6 opacity-90 animate-float drop-shadow-2xl filter saturate-150 transform hover:scale-105 transition-transform duration-700">🌸</div>
               <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-sakura-800/20 dark:bg-sakura-900/40 blur-2xl rounded-full group-hover:w-64 transition-all duration-500"></div>
            </div>
            <h2 class="text-5xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 tracking-tight drop-shadow-sm">{{ t.welcome_title }}</h2>
            <p class="text-sakura-400 dark:text-gray-400 max-w-lg mx-auto leading-relaxed text-lg">
              {{ t.welcome_desc }}<br>
              <span class="text-sm opacity-70 bg-white/50 dark:bg-gray-800 px-4 py-1 rounded-full mt-2 inline-block border border-white/50 dark:border-gray-700">{{ t.welcome_tags }}</span>
            </p>
        </div>

        <!-- Right Sidebar (TOC) -->
        <aside v-if="currentFile && !currentTool && !isRawMode && !currentFile.isSource" class="hidden xl:flex w-72 2xl:w-80 flex-col gap-6 p-6 border-l border-white/30 dark:border-gray-700/30 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md overflow-y-auto custom-scrollbar z-20">
          
          <!-- Table of Contents -->
          <div v-if="toc.length > 0">
            <h3 class="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>📑</span> {{ t.on_this_page }}
            </h3>
            <nav class="space-y-1 relative border-l-2 border-sakura-100 dark:border-gray-700 pl-4">
               <!-- Active Indicator -->
              <div 
                class="absolute left-[-2px] w-[2px] bg-sakura-500 transition-all duration-300 shadow-[0_0_8px_rgba(244,63,114,0.6)]"
                :style="{ top: activeIndicatorTop + 'px', height: '24px' }"
                v-if="activeHeaderId"
              ></div>
              <a 
                v-for="item in toc" 
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-sm py-1.5 transition-all duration-200 leading-tight pr-2"
                :class="[
                  item.level === 1 ? 'font-bold mb-2 mt-4 text-sakura-800 dark:text-sakura-200' : 'font-normal',
                  item.level > 1 ? `ml-${(item.level-1)*3} text-xs` : '',
                  activeHeaderId === item.id ? 'text-sakura-600 dark:text-sakura-300 translate-x-1 font-medium scale-105 origin-left' : 'text-gray-500 dark:text-gray-500 hover:text-sakura-400'
                ]"
                @click.prevent="scrollToHeader(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>

          <!-- Decorative / Meta Info -->
          <div class="mt-auto bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/60 dark:border-gray-700 shadow-sm backdrop-blur-sm">
             <div class="text-[10px] uppercase font-bold text-sakura-400 dark:text-gray-500 mb-2">{{ t.note_details }}</div>
             <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
               <div class="flex justify-between"><span>{{ t.words }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentWordCount }}</span></div>
               <div class="flex justify-between"><span>{{ t.lines }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentLineCount }}</span></div>
               <div class="flex justify-between"><span>{{ t.format }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.isSource ? 'Code' : 'Markdown' }}</span></div>
             </div>
          </div>
        </aside>

      </div>
    </main>
    
    <!-- Dual Column Mode - Teleport to body for true fullscreen -->
    <Teleport to="body">
      <DualColumnView 
        v-if="viewMode === 'lab' && dualColumnMode"
        :lang="lang"
        :left-panel="dualColumnLeft"
        :right-panel="dualColumnRight"
        :lab-dashboard-tab="labDashboardTab"
        :lab-folder="labFolder"
        @update:left-panel="dualColumnLeft = $event"
        @update:right-panel="dualColumnRight = $event"
        @tab-change="handleLabTabChange"
        @select-file="openFile"
        @close="dualColumnMode = false"
      />
    </Teleport>
    
    <!-- Lightbox (Images) -->
    <div 
      v-if="lightboxImage" 
      class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out animate-fade-in p-4"
      @click="lightbox.closeLightbox()"
    >
       <img :src="lightboxImage" class="max-w-full max-h-full rounded-lg shadow-2xl scale-100 object-contain transition-transform duration-300" alt="Fullscreen preview" />
       <div class="absolute bottom-10 text-white/50 text-sm bg-black/50 px-4 py-2 rounded-full">Click anywhere to close</div>
    </div>

    <!-- Source Code Modal (Enhanced with Syntax Highlighting) -->
    <div 
      v-if="codeModal.showCodeModal.value" 
      class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4 md:p-10"
      @click.self="codeModal.closeCodeModal()"
    >
       <div class="bg-[#1e1e1e] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden relative transform transition-all duration-300 scale-100">
          <!-- Modal Header -->
          <div class="flex justify-between items-center px-6 py-4 bg-[#252526] border-b border-gray-700 shrink-0">
             <div class="flex items-center gap-2">
                <span class="text-2xl">📝</span>
                <div>
                   <h3 class="text-sm font-bold text-gray-200 font-mono">{{ codeModal.codeModalTitle.value }}</h3>
                   <span class="text-[10px] text-gray-500">{{ codeModal.codeModalPath.value || 'Read Only Preview' }}</span>
                </div>
             </div>
             <div class="flex gap-2">
               <button @click="codeModal.copyCodeContent(showToast, t.toast_copied)" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-600">Copy</button>
               <button @click="codeModal.closeCodeModal()" class="text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
             </div>
          </div>
          <!-- Modal Content with Syntax Highlighting -->
          <div class="flex-1 overflow-auto custom-scrollbar p-0 bg-[#1e1e1e]">
             <pre class="p-6 text-sm font-mono leading-relaxed whitespace-pre-wrap hljs"><code v-html="codeModal.highlightedCodeContent.value"></code></pre>
          </div>
       </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="appStore.toastMessage" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
       <div class="bg-gray-800/90 dark:bg-white/90 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl backdrop-blur font-medium text-sm flex items-center gap-2">
         <span>✅</span> {{ appStore.toastMessage }}
       </div>
    </div>

    <!-- Settings Modal (New Component) -->
    <SettingsModal 
      v-if="showSettings" 
      @close="showSettings = false"
      :t="t"
      :is-dark="appStore.isDark"
      :settings="appStore.userSettings"
      :lang="lang"
      :file-system="fileSystem"
      :lab-folder="labFolder"
    />

    <!-- Download Modal -->
    <DownloadModal
      v-if="showDownloadModal"
      @close="showDownloadModal = false"
      :lang="lang"
      :file-system="fileSystem"
      :lab-folder="labFolder"
    />

    <!-- Search Modal -->
    <SearchModal
      :showSearchModal="showSearch"
      @close="showSearch = false"
      :t="t"
      :lang="lang"
      :searchFn="search"
      :highlightFn="highlightMatches"
      :isLoadingContent="isLoadingContent"
      @select="handleSearchSelect"
    />

    <!-- Music Player Modal -->
    <MusicPlayer
      :lang="lang"
    />

    <!-- Write Editor Modal -->
    <WriteEditor
      :show="showWriteEditor"
      @close="showWriteEditor = false"
      :lang="lang"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { I18N } from './constants';
import { NodeType } from './types';
import type { FileNode, BreadcrumbItem, TocItem } from './types';

// Components
import LabDashboard from './components/lab/LabDashboard.vue';
import SourceCodeViewer from './components/lab/SourceCodeViewer.vue';
import DualColumnView from './components/lab/DualColumnView.vue';
import SettingsModal from './components/SettingsModal.vue';
import DownloadModal from './components/DownloadModal.vue';
import PetalBackground from './components/PetalBackground.vue';
import WallpaperLayer from './components/WallpaperLayer.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import FolderView from './components/FolderView.vue';
import GlobalAudio from './components/GlobalAudio.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import SearchModal from './components/SearchModal.vue';
import WriteEditor from './components/WriteEditor.vue';
import GiscusComments from './components/GiscusComments.vue';

// Pinia Stores
import { useAppStore } from './stores/appStore';
import { useArticleStore } from './stores/articleStore';
import { useMusicStore } from './stores/musicStore';

// Composables
import { useSearch } from './composables/useSearch';
import { useArticleMeta } from './composables/useArticleMeta';
import { useCodeModal } from './composables/useCodeModal';
import { useContentRenderer } from './composables/useContentRenderer';
import { useRawEditor } from './composables/useRawEditor';
import { useLightbox } from './composables/useLightbox';
import { useSelectionMenu } from './composables/useSelectionMenu';
import { useContentClick, useFileVisibility, isSupportedInternalLink } from './composables/useContentClick';
import { marked } from 'marked';

// =====================
// Stores
// =====================
const appStore = useAppStore();
const articleStore = useArticleStore();
const musicStore = useMusicStore();

// =====================
// Search
// =====================
const { initSearchIndex, search, highlightMatches, showSearchModal: searchModalOpen, isLoadingContent, setFetchFunction, updateLanguage } = useSearch();

// =====================
// i18n
// =====================
const lang = computed({
  get: () => appStore.lang,
  set: (val) => appStore.setLang(val)
});
const t = computed(() => I18N[lang.value]);

// =====================
// Core State
// =====================
const fileSystem = ref<FileNode[]>([]);
const currentFile = ref<FileNode | null>(null);
const currentFolder = ref<FileNode | null>(null);
const viewMode = ref<'latest' | 'files' | 'lab'>('latest');
const expandedFolders = ref<string[]>([]);
const loading = ref(true);
const contentLoading = ref(false);
const currentTool = ref<'dashboard' | 'event-handling' | 'slot' | 'source-code' | null>(null);
const isRawMode = ref(false);

// Modal States
const showSettings = ref(false);
const showDownloadModal = ref(false);
const showSearch = searchModalOpen;
const showWriteEditor = ref(false);
const sidebarOpen = ref(false);

// Dual Column Mode
const dualColumnMode = ref(false);
const dualColumnLeft = ref<'notes' | 'lab' | 'source'>('notes');
const dualColumnRight = ref<'notes' | 'lab' | 'source'>('lab');

// Mobile header scroll behavior
const headerHidden = ref(false);
const lastScrollY = ref(0);
const isMobile = ref(false);

// Wallpaper URLs
const wallpaperLightUrl = '/image/wallpaper-light.jpg';
const wallpaperDarkUrl = '/image/wallpaper-dark.jpg';

// =====================
// Composables 初始化
// =====================
const showToast = (msg: string) => appStore.showToast(msg);

// 文章元数据
const { currentMeta, currentTags, currentAuthorName, currentAuthorUrl, currentContributors } = useArticleMeta(currentFile);

// 代码弹窗
const codeModal = useCodeModal();

// 内容渲染
const contentRenderer = useContentRenderer(currentFile, isRawMode);
const { renderedHtml, toc, activeHeaderId, activeIndicatorTop, setupMarkedRenderer, updateRenderedContent, generateToc, scrollToHeader } = contentRenderer;

// Raw 编辑器
const rawEditor = useRawEditor(currentFile, isRawMode, updateRenderedContent, showToast, lang);

// 图片灯箱
const lightbox = useLightbox();
const { lightboxImage, handleImageClick } = lightbox;

// 选择菜单
const selectionMenuComposable = useSelectionMenu(showToast);
const { selectionMenu, handleSelection, handleSelectionContextMenu, handleSelectionChange, applyFormat, hideSelectionMenu } = selectionMenuComposable;

// 文件可见性
const { isFileVisible, collectAllTags } = useFileVisibility(articleStore);

// =====================
// Computed
// =====================
const fontSizeClass = computed(() => {
  switch(appStore.userSettings.fontSize) {
    case 'small': return 'text-sm lg:text-base leading-relaxed';
    case 'large': return 'text-xl lg:text-2xl leading-loose';
    default: return 'text-base lg:text-lg leading-loose';
  }
});

const computeWordCount = (content?: string | null) => {
  if (!content) return 0;
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
};

const currentWordCount = computed(() => {
  if (!currentFile.value) return 0;
  if (typeof currentFile.value.wordCount === 'number') return currentFile.value.wordCount;
  return computeWordCount(currentFile.value.content);
});

const currentLineCount = computed(() => {
  if (!currentFile.value) return 0;
  if (typeof currentFile.value.lineCount === 'number') return currentFile.value.lineCount;
  return currentFile.value.content ? currentFile.value.content.split(/\r?\n/).length : 0;
});

const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '');

// 编辑模式下的预览内容
const previewEditingContent = computed(() => {
  if (!rawEditor.isEditingRaw.value || !rawEditor.editedRawContent.value) return ''
  try {
    return marked.parse(rawEditor.editedRawContent.value) as string
  } catch (e) {
    console.error('Preview render error:', e)
    return '<div class="text-red-500">预览渲染出错</div>'
  }
})

// Root Directory Logic based on Language
const currentLangRoot = computed(() => {
  const root = fileSystem.value.find(node => node.name === lang.value);
  return root ? root.children : [];
});

const filteredFileSystem = computed(() => {
  const filterTree = (nodes: FileNode[]): FileNode[] => {
    return nodes.map((node) => {
      if (node.type === NodeType.FILE) {
        return isFileVisible(node) ? node : null;
      }
      const children = node.children ? filterTree(node.children) : [];
      return { ...node, children } as FileNode;
    }).filter(Boolean) as FileNode[];
  };

  return filterTree(currentLangRoot.value || []);
});

const filteredFlatFiles = computed(() => {
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === NodeType.FILE) files.push(node);
      else if (node.children) files = files.concat(flatten(node.children));
    }
    return files;
  };

  let files = flatten(currentLangRoot.value || []);
  files = files.filter(isFileVisible);

  return files.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
});

const labFolder = computed(() => {
  const targetName = lang.value === 'zh' ? 'VUE学习笔记' : 'VUE Learning';
  const findFolderByName = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === NodeType.DIRECTORY && node.name.toLowerCase() === targetName.toLowerCase()) {
        return node;
      }
      if (node.children) {
        const found = findFolderByName(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findFolderByName(fileSystem.value);
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = currentPath.value;
  if (!path) return [];
  const parts = path.split('/');

  let accumulatedPath = '';
  return parts.map((part) => {
    accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
    return { name: part.replace('.md', ''), path: accumulatedPath };
  });
});

// Resource Categories
const resourceCategories = computed(() => [
  {
    title: t.value.res_cat_platform,
    items: [
      { name: 'Vue Mastery', url: 'https://vuemastery.com', icon: '🎮', desc: lang.value === 'zh' ? '官方推荐的游戏化教程' : 'Gamified learning path' },
      { name: 'Scrimba', url: 'https://scrimba.com/learn/vue', icon: '📺', desc: lang.value === 'zh' ? '交互式视频编码' : 'Interactive video tutorials' },
      { name: 'Frontend Mentor', url: 'https://frontendmentor.io', icon: '🎨', desc: lang.value === 'zh' ? '真实设计稿还原挑战' : 'Real-world design challenges' },
    ]
  },
  {
    title: t.value.res_cat_frontend_games,
    items: [
      { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com', icon: '🐸', desc: lang.value === 'zh' ? '青蛙跳荷叶学布局' : 'Learn Flexbox with frogs' },
      { name: 'Grid Garden', url: 'https://cssgridgarden.com', icon: '🥕', desc: lang.value === 'zh' ? '种胡萝卜学网格' : 'Learn CSS Grid via gardening' },
      { name: 'CSS Diner', url: 'https://flukeout.github.io', icon: '🍽️', desc: lang.value === 'zh' ? '选择器餐厅' : 'Master CSS selectors' },
      { name: 'JavaScript 30', url: 'https://javascript30.com', icon: '🎹', desc: lang.value === 'zh' ? '30天原生JS挑战' : '30 Day Vanilla JS Challenge' },
    ]
  },
  {
    title: t.value.res_cat_vue_projects,
    items: [
      { name: 'Vue Tutorial', url: 'https://vuejs.org/tutorial/', icon: '🟩', desc: lang.value === 'zh' ? 'Vue 官方交互教程' : 'Official Interactive Tutorial' },
      { name: 'Vue Snake', url: 'https://github.com/search?q=vue+snake+game', icon: '🐍', desc: lang.value === 'zh' ? '贪吃蛇源码搜索' : 'Search Snake Game code' },
      { name: 'Vue Memory', url: 'https://codepen.io/search/pens?q=vue+memory+game', icon: '🃏', desc: lang.value === 'zh' ? '记忆卡片游戏' : 'Memory Card Game' },
    ]
  }
]);

// =====================
// File Operations
// =====================
const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  const decodedPath = decodeURIComponent(path);
  if (decodedPath !== path) {
    for (const node of nodes) {
      if (node.path === decodedPath) return node;
      if (node.children) {
        const found = findNodeByPath(node.children, decodedPath);
        if (found) return found;
      }
    }
  }
  return null;
};

const fetchFileContent = async (file: FileNode): Promise<string> => {
  let fetchPath = '';
  if (file.isSource && file.fetchPath) {
    fetchPath = `./${file.fetchPath}`;
  } else {
    const encodedPath = file.path.split('/').map(p => encodeURIComponent(p)).join('/');
    fetchPath = `./notes/${encodedPath}`;
  }

  try {
    let res = await fetch(fetchPath);
    if (!res.ok) {
      console.warn(`Fetch failed for ${fetchPath}, trying fallback...`);
      res = await fetch(`./notes/${file.path}`);
    }

    if (res.ok) return await res.text();
    return `# Error ${res.status}\nCould not load file content.\nPath: ${file.path}`;
  } catch (e: any) {
    return `# Error\n${e.message}\nPath: ${file.path}`;
  }
};

const updateUrl = (path: string | null) => {
  try {
    const url = new URL(window.location.href);
    if (path) {
      url.searchParams.set('path', path);
      url.searchParams.delete('lab');
      url.searchParams.delete('tab');
    } else {
      url.searchParams.delete('path');
    }
    window.history.pushState({}, '', url.toString());
  } catch (e) {
    console.error("Failed to update URL", e);
  }
};

const updateLabUrl = (tab?: string) => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lab', 'dashboard');
    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');
    url.searchParams.delete('path');
    window.history.pushState({}, '', url.toString());
  } catch (e) {
    console.error('Failed to update lab URL', e);
  }
};

const isPdfFile = (file: FileNode) => file.path.toLowerCase().endsWith('.pdf')

const openFile = async (file: FileNode) => {
  currentFile.value = file;
  currentFolder.value = null;
  currentTool.value = null;
  isRawMode.value = !!file.isSource;

  updateUrl(file.path);
  const container = document.getElementById('scroll-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

  hideSelectionMenu();

  if (!file.content && !isPdfFile(file)) {
    contentLoading.value = true;
    file.content = await fetchFileContent(file);
    contentLoading.value = false;
    currentFile.value = { ...file };
  }

  if (!file.isSource) {
    await updateRenderedContent();
    nextTick(() => generateToc());
  }
};

const handleSidebarFileSelect = async (file: FileNode) => {
  await openFile(file);
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
};

const openFolder = (folder: FileNode) => {
  currentFile.value = null;
  currentFolder.value = folder;
  currentTool.value = null;
  updateUrl(folder.path);
  if (viewMode.value === 'latest') viewMode.value = 'files';
  hideSelectionMenu();
};

const selectTool = (tool: string) => {
  currentTool.value = tool as 'dashboard' | 'event-handling' | 'slot' | 'source-code';
  currentFile.value = null;
  currentFolder.value = null;
  dualColumnMode.value = false; // Exit dual column when selecting specific tool
};

const labDashboardTab = ref<string>('note1-html-css');

// Lab tabs for sidebar (synced with LabDashboard)
const labTabs = computed(() => {
  const isZh = lang.value === 'zh'
  return [
    { id: 'note1-html-css', shortLabel: isZh ? 'HTML/CSS' : 'HTML/CSS', icon: '🎨', noteNum: 1 },
    { id: 'note2-javascript', shortLabel: 'JavaScript', icon: '⚡', noteNum: 2 },
    { id: 'note3-vue-basics', shortLabel: isZh ? 'Vue基础' : 'Vue Basics', icon: '🥝', noteNum: 3 },
    { id: 'note4-vue-engineering', shortLabel: isZh ? '工程化' : 'Engineering', icon: '🚀', noteNum: 4 },
    { id: 'challenge', shortLabel: isZh ? '挑战' : 'Challenge', icon: '🏆', noteNum: 0 },
  ]
})

const handleLabTabChange = (tab: string) => {
  labDashboardTab.value = tab;
  if (viewMode.value === 'lab' && currentTool.value === 'dashboard') {
    updateLabUrl(tab);
  }
};

const openLabDashboard = (tab?: string) => {
  viewMode.value = 'lab';
  currentTool.value = 'dashboard';
  currentFile.value = null;
  currentFolder.value = null;
  if (tab) labDashboardTab.value = tab;
  updateLabUrl(tab);
};

const navigateToBreadcrumb = (path: string) => {
  const node = findNodeByPath(fileSystem.value, path);
  if (node) {
    if (node.type === NodeType.DIRECTORY) openFolder(node);
    else openFile(node);
  }
};

const toggleFolder = (path: string) => {
  const idx = expandedFolders.value.indexOf(path);
  if (idx === -1) expandedFolders.value.push(path);
  else expandedFolders.value.splice(idx, 1);
};

const resetToHome = () => {
  currentFile.value = null;
  currentFolder.value = null;
  viewMode.value = 'latest';
  hideSelectionMenu();
  updateUrl(null);
};

// =====================
// Global Code Open Helper
// =====================
const parseRangeToken = (raw?: string) => {
  if (!raw) return { startLine: undefined, endLine: undefined };
  const match = raw.match(/L?(\d+)(?:-L?(\d+))?/i);
  if (!match) return { startLine: undefined, endLine: undefined };
  const startLine = Number(match[1]);
  const endLine = match[2] ? Number(match[2]) : undefined;
  return {
    startLine: Number.isFinite(startLine) ? startLine : undefined,
    endLine: Number.isFinite(endLine || 0) ? endLine : undefined
  };
};

const buildLineSnippet = (content: string, startLine?: number, endLine?: number) => {
  if (!startLine) return content;
  const lines = content.split(/\r?\n/);
  const safeStart = Math.max(1, startLine);
  const safeEnd = Math.min(lines.length, endLine && endLine >= safeStart ? endLine : safeStart);
  const width = String(safeEnd).length;
  const slice = lines.slice(safeStart - 1, safeEnd);
  return slice.map((line, idx) => `${String(safeStart + idx).padStart(width, ' ')} | ${line}`).join('\n');
};

const openCodeByPath = async (path: string, range?: { startLine?: number; endLine?: number }) => {
  const fileName = path.split('/').pop() || path;
  const rangeLabel = range?.startLine
    ? ` (L${range.startLine}${range.endLine && range.endLine !== range.startLine ? `-L${range.endLine}` : ''})`
    : '';

  await codeModal.openCodeModal(`${fileName}${rangeLabel}`, 'Loading...', path);

  let node = findNodeByPath(fileSystem.value, path);
  let content = '';

  if (node && node.type === NodeType.FILE) {
    if (!node.content) {
      node.content = await fetchFileContent(node);
    }
    content = node.content;
  } else {
    content = await codeModal.fetchSourceCodeFile(path);
  }

  const finalContent = range?.startLine ? buildLineSnippet(content, range.startLine, range.endLine) : content;
  codeModal.setCodeModalContent(finalContent);
};

const handleOpenCodeEvent = async (e: Event) => {
  const detail = (e as CustomEvent).detail as {
    path?: string;
    startLine?: number;
    endLine?: number;
    range?: string;
  };
  if (!detail?.path) return;

  let startLine = detail.startLine;
  let endLine = detail.endLine;

  if (!startLine && detail.range) {
    const parsed = parseRangeToken(detail.range);
    startLine = parsed.startLine;
    endLine = parsed.endLine;
  }

  await openCodeByPath(detail.path, { startLine, endLine });
};

// =====================
// Content Click Handler
// =====================
const { handleContentClick } = useContentClick(
  currentFile,
  fileSystem,
  findNodeByPath,
  fetchFileContent,
  openFile,
  codeModal.openCodeModal,
  codeModal.setCodeModalContent,
  codeModal.fetchSourceCodeFile,
  handleImageClick,
  hideSelectionMenu,
  showToast,
  (tab?: string) => openLabDashboard(tab)
);

// 捕获阶段拦截内部链接点击（仅阻止默认跳转，不阻止传播，让冒泡阶段处理弹窗逻辑）
const handleLinkCapture = (e: Event) => {
  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.target as HTMLElement;
  // 确保在 markdown-viewer 内部
  if (!target.closest('#markdown-viewer')) return;
  
  const link = target.closest('a');
  if (link) {
    const internalHref = link.getAttribute('data-internal-href');
    const href = link.getAttribute('href');
    // 如果有 data-internal-href 或者是支持的内部链接，立即阻止默认行为
    // 注意：不调用 stopPropagation()，让事件继续传播到冒泡阶段的 handleContentClickEvent
    if (internalHref || (href && isSupportedInternalLink(href))) {
      mouseEvent.preventDefault();
    }
  }
};

// Event handlers
const handleContentClickEvent = (e: MouseEvent) => {
  if (selectionMenu.value.locked) return;
  
  // 然后异步处理点击逻辑（捕获阶段已阻止默认行为，这里直接处理）
  handleContentClick(e, selectionMenu.value.locked);
};

const handleSelectionEvent = () => {
  if (currentFile.value?.isSource) return;
  handleSelection();
};

const handleSelectionContextMenuEvent = (e: MouseEvent) => {
  if (currentFile.value?.isSource) return;
  handleSelectionContextMenu(e);
};

const applyFormatHandler = (type: string) => {
  applyFormat(type, t.value.selection_error);
};

// =====================
// Actions
// =====================
const toggleLang = async () => {
  const oldLang = lang.value;
  const newLang = oldLang === 'en' ? 'zh' : 'en';
  appStore.setLang(newLang);
  updateLanguage(newLang);

  if (viewMode.value === 'lab' && currentTool.value === 'dashboard') {
    return;
  }

  if (currentFolder.value && !currentFile.value) {
    return;
  }

  if (currentFile.value) {
    const oldPath = currentFile.value.path;
    const pathParts = oldPath.split('/');

    if (pathParts[0] === oldLang) {
      pathParts[0] = newLang;
      const newPath = pathParts.join('/');
      const newNode = findNodeByPath(fileSystem.value, newPath);

      if (newNode && newNode.type === NodeType.FILE) {
        await openFile(newNode);
        return;
      }
    }

    resetToHome();
    return;
  }
};

const toggleTheme = (val: boolean) => {
  appStore.setDark(val);
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

const handlePetalSpeedChange = (speed: 'off' | 'slow' | 'fast') => {
  appStore.userSettings.petalSpeed = speed;
  appStore.showParticles = speed !== 'off';
};

const copyLink = () => navigator.clipboard.writeText(window.location.href).then(() => showToast(t.value.link_copied));

const downloadSource = () => {
  if (currentFile.value) {
    const blob = new Blob([currentFile.value.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.value.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';

const handleSearchSelect = (result: any) => {
  showSearch.value = false;
  sidebarOpen.value = false;

  const node = findNodeByPath(fileSystem.value, result.path);
  if (node && node.type === NodeType.FILE) {
    openFile(node);
  } else {
    showToast(t.value.file_not_found);
  }
};

const handleLike = () => {
  if (currentFile.value) {
    articleStore.toggleLike(currentFile.value.path);
  }
};

const getArticleViews = (path: string): number => {
  const likes = articleStore.getLikes(path);
  const baseViews = likes * (5 + Math.random() * 5);
  return Math.max(1, Math.round(baseViews));
};

// =====================
// Keyboard Shortcuts
// =====================
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    showSearch.value = true;
  }
  if (e.key === 'Escape') {
    showSearch.value = false;
    musicStore.showMusicPlayer = false;
    showWriteEditor.value = false;
    sidebarOpen.value = false;
  }
};

// =====================
// Watchers
// =====================
watch(currentFile, async () => {
  if (!currentFile.value?.isSource) {
    await updateRenderedContent();
    nextTick(() => generateToc());
  }
});

// =====================
// Lifecycle
// =====================
onMounted(async () => {
  // Check mobile
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Mobile scroll behavior for header hide/show
  const scrollContainer = document.getElementById('scroll-container');
  const handleScroll = () => {
    if (!isMobile.value) {
      headerHidden.value = false;
      return;
    }

    const currentScrollY = scrollContainer?.scrollTop || 0;
    const delta = currentScrollY - lastScrollY.value;

    if (Math.abs(delta) > 5) {
      headerHidden.value = delta > 0 && currentScrollY > 50;
    }

    lastScrollY.value = currentScrollY;
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('selectionchange', handleSelectionChange);
  // 捕获阶段拦截内部链接点击
  document.addEventListener('click', handleLinkCapture, { capture: true });
  // 实验室/其他视图触发代码弹窗
  window.addEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);

  if (appStore.isDark) document.documentElement.classList.add('dark');

  // Setup marked renderer
  setupMarkedRenderer();

  // Initialize music store
  musicStore.loadPlaylist();

  // Set fetch function for search
  setFetchFunction(fetchFileContent);

  try {
    const res = await fetch(`./files.json?t=${Date.now()}`);
    if (res.ok) {
      fileSystem.value = await res.json();
      const params = new URLSearchParams(window.location.search);
      const targetPath = params.get('path');
      const sourcePath = params.get('source');
      const lab = params.get('lab');
      const tab = params.get('tab');

      // 处理代码文件弹窗路由
      if (sourcePath) {
        await openCodeByPath(sourcePath);
      }

      if (lab === 'dashboard') {
        openLabDashboard(tab || undefined);
      }

      if (targetPath) {
        const decodedTargetPath = decodeURIComponent(targetPath);
        const node = findNodeByPath(fileSystem.value, decodedTargetPath) || findNodeByPath(fileSystem.value, targetPath);

        if (node) {
          viewMode.value = 'files';

          if (node.type === NodeType.FILE) openFile(node);
          else openFolder(node);
        } else {
          console.warn("Path not found in file system:", targetPath);
        }
      }
    } else {
      console.error("Failed to load files.json, status:", res.status);
    }
  } catch (e) {
    console.error("Failed to load file system", e);
    fileSystem.value = [];
  } finally {
    loading.value = false;

    if (fileSystem.value.length > 0) {
      await initSearchIndex(fileSystem.value, lang.value);
      collectAllTags(currentLangRoot.value || [], articleStore.setAvailableTags);
    }

    nextTick(() => {
      const scrollEl = document.getElementById('scroll-container');
      if (scrollEl) {
        scrollEl.addEventListener('scroll', handleScroll, { passive: true });
      }
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', handleLinkCapture, { capture: true });
  window.removeEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);
  const scrollEl = document.getElementById('scroll-container');
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', () => {});
  }
});
</script>

<style>
body {
  user-select: none;
}

#markdown-viewer,
#markdown-viewer * {
  user-select: text;
}

input,
textarea,
[contenteditable="true"],
pre,
code {
  user-select: text;
}

.sakura-block-highlight {
  background: rgba(252, 211, 77, 0.35);
  border: 1px solid rgba(252, 211, 77, 0.8);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.05em 0.2em;
  border-radius: 0.35rem;
}
</style>

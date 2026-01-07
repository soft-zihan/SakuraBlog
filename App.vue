<template>
  <div class="flex flex-col md:flex-row w-full h-full max-w-[2560px] mx-auto overflow-hidden bg-white/30 dark:bg-gray-900/60 backdrop-blur-[2px] font-sans transition-colors duration-500" :class="[userSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans', isDark ? 'dark' : '']">
    
    <!-- Left Sidebar: Navigation -->
    <aside class="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/60 dark:border-gray-700/50 h-full z-30 transition-all duration-300">
      <!-- Profile Header -->
      <div class="p-8 pb-4 flex flex-col items-center border-b border-sakura-100/50 dark:border-gray-700/50 flex-shrink-0 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-sakura-50/50 to-transparent dark:from-sakura-900/20 pointer-events-none"></div>
        
        <!-- Language Switcher (Top Left of Sidebar) -->
        <div class="absolute top-4 left-4 z-20">
           <button @click="toggleLang" class="text-xs font-bold px-2 py-1 rounded bg-sakura-50 dark:bg-gray-800 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-100 transition-colors">
             {{ lang === 'en' ? '中' : 'EN' }}
           </button>
        </div>

        <div class="relative group cursor-pointer z-10" @click="resetToHome">
          <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-sakura-300 to-sakura-100 dark:from-sakura-700 dark:to-sakura-900 shadow-xl mb-4 group-hover:scale-105 transition-transform duration-300">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Sakura&backgroundColor=ffd7e6" 
              class="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
              alt="Avatar"
            />
          </div>
          <div class="absolute bottom-4 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-sakura-100 dark:border-gray-700 text-xs">🌸</div>
        </div>
        
        <h1 class="text-xl font-bold text-sakura-800 dark:text-sakura-300 tracking-tight z-10 hover:text-sakura-600 transition-colors" @click="resetToHome">Sakura Notes</h1>
        <p class="text-xs text-sakura-500 dark:text-sakura-400 mt-1 font-medium bg-sakura-50 dark:bg-gray-800 px-3 py-1 rounded-full z-10">{{ t.subtitle }}</p>
      </div>

      <!-- View Toggles -->
      <div class="px-6 py-4 flex-shrink-0">
        <div class="flex p-1.5 bg-sakura-50/80 dark:bg-gray-800/50 rounded-2xl border border-sakura-100 dark:border-gray-700 relative">
          <button 
            @click="switchViewMode('latest')"
            class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1 z-10"
            :class="viewMode === 'latest' ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-sm ring-1 ring-sakura-100 dark:ring-gray-600' : 'text-sakura-400 dark:text-gray-500 hover:text-sakura-600 hover:bg-white/50 dark:hover:bg-gray-700/50'"
          >
            ⏰ {{ t.tab_latest }}
          </button>
          <button 
            @click="switchViewMode('files')"
            class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1 z-10"
            :class="viewMode === 'files' ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-sm ring-1 ring-sakura-100 dark:ring-gray-600' : 'text-sakura-400 dark:text-gray-500 hover:text-sakura-600 hover:bg-white/50 dark:hover:bg-gray-700/50'"
          >
            📁 {{ t.tab_files }}
          </button>
          <button 
            @click="switchViewMode('lab')"
            class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1 z-10"
            :class="viewMode === 'lab' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm ring-1 ring-purple-100 dark:ring-purple-900' : 'text-sakura-400 dark:text-gray-500 hover:text-purple-600 hover:bg-white/50 dark:hover:bg-gray-700/50'"
          >
            🧪 {{ t.tab_lab }}
          </button>
        </div>
      </div>

      <!-- File List / Tree -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        <div v-if="loading" class="flex flex-col items-center justify-center py-10 text-sakura-400">
          <div class="animate-bounce text-2xl mb-2">🌸</div>
          <span class="text-xs font-medium">{{ t.reading_notes }}</span>
        </div>

        <!-- LAB MODE SIDEBAR -->
        <div v-else-if="viewMode === 'lab'" class="animate-fade-in pb-20">
           <div class="px-2 mb-4">
             <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{{ t.lab_tools }}</h3>
             <div 
               @click="currentTool = 'reactivity'; currentFile = null; currentFolder = null;"
               class="p-3 rounded-xl border border-purple-100 dark:border-purple-900/30 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all mb-2 flex items-center gap-3 bg-purple-50/50 dark:bg-gray-800/30"
               :class="{'ring-2 ring-purple-300 dark:ring-purple-700 bg-white dark:bg-gray-800': currentTool === 'reactivity'}"
             >
               <span class="text-xl">🧪</span>
               <div class="flex-1">
                 <div class="text-sm font-bold text-purple-900 dark:text-purple-300">{{ t.lab_reactivity }}</div>
                 <div class="text-[10px] text-purple-500 dark:text-purple-400">{{ t.lab_reactivity_desc }}</div>
               </div>
             </div>
             <div 
               @click="currentTool = 'lifecycle'; currentFile = null; currentFolder = null;"
               class="p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all mb-4 flex items-center gap-3 bg-blue-50/50 dark:bg-gray-800/30"
               :class="{'ring-2 ring-blue-300 dark:ring-blue-700 bg-white dark:bg-gray-800': currentTool === 'lifecycle'}"
             >
               <span class="text-xl">🎢</span>
               <div class="flex-1">
                 <div class="text-sm font-bold text-blue-900 dark:text-blue-300">{{ t.lab_lifecycle }}</div>
                 <div class="text-[10px] text-blue-500 dark:text-blue-400">{{ t.lab_lifecycle_desc }}</div>
               </div>
             </div>

             <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{{ t.lab_course }}</h3>
             <FileTree 
                v-if="labFolder && labFolder.children"
                :nodes="labFolder.children" 
                :expanded-paths="expandedFolders"
                :current-path="currentPath"
                @toggle-folder="toggleFolder"
                @select-file="openFile"
                @select-folder="openFolder"
              />
              <div v-else class="text-xs text-gray-400 italic px-2">{{ t.no_vue_notes }}</div>
           </div>
        </div>

        <!-- Latest View -->
        <div v-else-if="viewMode === 'latest'" class="space-y-3 pb-20">
           <div v-if="filteredFlatFiles.length === 0" class="text-center text-gray-400 py-10 text-sm italic">
            {{ t.no_notes }}
          </div>
          <div 
            v-for="file in filteredFlatFiles" 
            :key="file.path"
            @click="openFile(file)"
            class="group p-4 bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-sakura-100/20 dark:hover:shadow-black/20 cursor-pointer transition-all duration-300 animate-fade-in relative overflow-hidden backdrop-blur-sm"
            :class="{'ring-2 ring-sakura-300 dark:ring-sakura-600 bg-white dark:bg-gray-800 shadow-md': currentFile?.path === file.path}"
          >
            <div class="flex justify-between items-start mb-2 relative z-10">
              <span class="font-bold text-gray-700 dark:text-gray-200 group-hover:text-sakura-600 dark:group-hover:text-sakura-400 truncate pr-2 flex-1 text-sm">{{ file.name.replace('.md', '') }}</span>
            </div>
             <div class="flex justify-between items-center relative z-10">
               <span class="text-[10px] bg-sakura-50 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-300 px-2 py-1 rounded-md whitespace-nowrap font-medium">
                  {{ formatDate(file.lastModified) }}
               </span>
               <div class="text-[10px] text-gray-400 dark:text-gray-500 truncate flex items-center gap-1 max-w-[50%]">
                 <span class="opacity-50">📂</span> {{ getCleanParentPath(file.path) }}
               </div>
             </div>
          </div>
        </div>

        <!-- Tree View -->
        <div v-else class="animate-fade-in pb-20 pt-2">
          <FileTree 
            :nodes="filteredFileSystem" 
            :expanded-paths="expandedFolders"
            :current-path="currentPath"
            @toggle-folder="toggleFolder"
            @select-file="openFile"
            @select-folder="openFolder"
          />
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="p-4 border-t border-sakura-100/50 dark:border-gray-700/50 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
         <a href="https://github.com/soft-zihan" target="_blank" class="text-xs text-sakura-400 hover:text-sakura-600 dark:text-gray-500 dark:hover:text-sakura-400 flex items-center gap-1 transition-colors">
            <span>© soft-zihan</span>
         </a>
         <span class="text-[10px] text-sakura-300 dark:text-gray-600 font-mono">v1.0</span>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative isolate">
      <!-- Decorative Background Elements for Widescreen Interest -->
      <div class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <!-- Top Right Blob -->
        <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-sakura-100/40 to-purple-100/30 dark:from-sakura-900/10 dark:to-purple-900/10 blur-3xl animate-float opacity-60"></div>
        <!-- Bottom Left Blob -->
        <div class="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sakura-200/30 to-sakura-50/20 dark:from-sakura-800/10 dark:to-sakura-900/5 blur-3xl animate-pulse-fast opacity-50" style="animation-duration: 8s;"></div>
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(#9f123f 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <!-- Navbar -->
      <header class="h-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/40 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
          <span class="text-sakura-300 dark:text-sakura-500 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="resetToHome">🏠</span>
          <span class="text-sakura-200 dark:text-gray-700 mx-1">/</span>
          <template v-if="viewMode === 'lab' && currentTool">
             <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
             <span class="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">{{ t.tab_lab }}</span>
             <span class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
             <span class="text-gray-500 dark:text-gray-400">{{ currentTool === 'reactivity' ? t.lab_reactivity : t.lab_lifecycle }}</span>
          </template>
          <template v-else v-for="(item, index) in breadcrumbs" :key="item.path">
            <span v-if="index > 0" class="mx-2 text-sakura-300 dark:text-gray-600">›</span>
            <span 
              @click="navigateToBreadcrumb(item.path)"
              class="cursor-pointer transition-colors px-2 py-1 rounded-md"
              :class="index === breadcrumbs.length - 1 ? 'font-bold text-sakura-600 dark:text-sakura-400 bg-sakura-50/50 dark:bg-sakura-900/30' : 'text-gray-500 dark:text-gray-400 hover:text-sakura-500 hover:bg-sakura-50/50 dark:hover:bg-gray-800'"
            >
              {{ item.name }}
            </span>
          </template>
        </div>

        <div class="flex gap-2 shrink-0 items-center">
          <!-- Action Buttons (Only show when file is open) -->
          <template v-if="currentFile">
            <button @click="copyLink" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="t.copy_link">
              <span class="text-lg">🔗</span>
            </button>
            <button @click="downloadSource" class="p-2 text-sakura-400 hover:bg-white dark:hover:bg-gray-700 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" :title="t.download">
              <span>DL</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>
            <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          </template>

          <!-- Settings Trigger -->
          <button @click="showSettings = true" class="p-2 text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 hover:rotate-90 transition-all duration-500" :title="t.settings_title">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 flex overflow-hidden z-10 relative">
        
        <!-- Center Stage: The Note -->
        <div 
          v-if="currentFile || (viewMode === 'lab' && currentTool) || currentFolder" 
          id="scroll-container" 
          class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 lg:p-8 w-full" 
          @mouseup="handleTextSelection"
        >
          
          <!-- Lab Tool View -->
          <div v-if="viewMode === 'lab' && currentTool" class="w-full max-w-5xl mx-auto animate-fade-in">
             <LabReactivity v-if="currentTool === 'reactivity'" />
             <LabLifecycle v-if="currentTool === 'lifecycle'" />
          </div>

          <!-- Folder View -->
          <div v-else-if="currentFolder" class="w-full max-w-6xl mx-auto">
             <div class="flex items-center gap-4 mb-8 p-8 bg-white/60 dark:bg-gray-800/60 rounded-[2rem] border border-white dark:border-gray-700 shadow-sm backdrop-blur-md">
               <span class="text-5xl bg-sakura-100 dark:bg-sakura-900/50 p-4 rounded-2xl shadow-inner text-sakura-500">📁</span>
               <div>
                 <h2 class="text-3xl font-bold text-sakura-900 dark:text-sakura-100">{{ currentFolder.name }}</h2>
                 <p class="text-sakura-500 dark:text-sakura-400 mt-1 font-medium">{{ currentFolder.children?.length || 0 }} items inside</p>
               </div>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
               <div 
                  v-for="child in sortedFolderChildren" 
                  :key="child.path"
                  @click="child.type === 'directory' ? openFolder(child) : openFile(child)"
                  class="folder-card bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-sm border border-white/70 dark:border-gray-700 hover:shadow-xl hover:shadow-sakura-100/30 dark:hover:shadow-black/40 hover:bg-white dark:hover:bg-gray-800 hover:border-sakura-200 dark:hover:border-sakura-800 cursor-pointer transition-all duration-300 flex flex-col h-48 backdrop-blur-sm group relative overflow-hidden"
               >
                 <div class="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-sakura-50 to-transparent dark:from-sakura-900/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                 <div class="flex items-start justify-between mb-4 relative z-10">
                   <span class="text-5xl group-hover:scale-110 transition-transform drop-shadow-sm">{{ child.type === 'directory' ? '📂' : '📝' }}</span>
                   <span v-if="child.type === 'file'" class="text-[10px] text-sakura-500 dark:text-sakura-400 bg-sakura-50 dark:bg-gray-900 px-2 py-1 rounded-full font-bold">{{ formatDate(child.lastModified) }}</span>
                 </div>
                 <div class="mt-auto relative z-10">
                   <h3 class="font-bold text-gray-700 dark:text-gray-200 truncate text-lg group-hover:text-sakura-600 dark:group-hover:text-sakura-400 transition-colors" :title="child.name">{{ child.name.replace('.md', '') }}</h3>
                   <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate font-medium">
                     {{ child.type === 'directory' ? `${child.children?.length || 0} items` : 'Markdown Note' }}
                   </p>
                 </div>
               </div>
             </div>
          </div>

          <!-- Note Content View -->
          <div v-else-if="currentFile" 
             class="w-full max-w-4xl xl:max-w-5xl mx-auto bg-white/70 dark:bg-gray-800/70 p-8 md:p-12 rounded-[2rem] shadow-sm border border-white/60 dark:border-gray-700 min-h-[calc(100%-2rem)] animate-fade-in backdrop-blur-2xl transition-all duration-300 relative"
             :class="fontSizeClass"
          >
             <div v-if="contentLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-20 rounded-[2rem] backdrop-blur-sm">
               <div class="animate-spin text-4xl">🌸</div>
             </div>

             <div class="mb-8 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-6">
                <!-- Removed duplicate Icon as requested -->
                <div>
                  <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-tight">{{ currentFile.name.replace('.md', '') }}</h1>
                  <div class="flex items-center gap-2 text-xs text-gray-400 mt-1">
                     <span>{{ getCleanParentPath(currentFile.path) }}</span>
                     <span>•</span>
                     <span>{{ formatDate(currentFile.lastModified) }}</span>
                  </div>
                </div>
             </div>

            <div v-html="renderedContent" class="markdown-body dark:text-gray-300"></div>
            
            <div class="mt-12 pt-8 border-t border-sakura-100 dark:border-gray-700 flex justify-between text-xs text-sakura-300 dark:text-gray-500">
              <span class="italic">Sakura Notes</span>
              <span>{{ t.updated }}: {{ formatDate(currentFile.lastModified) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State / Home -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-sakura-300 dark:text-gray-600 animate-fade-in p-6 text-center">
            <div class="relative group cursor-default">
               <div class="text-[12rem] mb-6 opacity-90 animate-float drop-shadow-2xl filter saturate-150">🌸</div>
               <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-sakura-800/20 dark:bg-sakura-900/40 blur-2xl rounded-full group-hover:w-64 transition-all duration-500"></div>
            </div>
            <h2 class="text-5xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 tracking-tight drop-shadow-sm">{{ t.welcome_title }}</h2>
            <p class="text-sakura-400 dark:text-gray-400 max-w-lg mx-auto leading-relaxed text-lg">
              {{ t.welcome_desc }}<br>
              <span class="text-sm opacity-70 bg-white/50 dark:bg-gray-800 px-4 py-1 rounded-full mt-2 inline-block">{{ t.welcome_tags }}</span>
            </p>
        </div>

        <!-- Right Sidebar (TOC) - Visible on XL screens -->
        <aside v-if="currentFile && !currentTool" class="hidden xl:flex w-72 2xl:w-80 flex-col gap-6 p-6 border-l border-white/30 dark:border-gray-700/30 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md overflow-y-auto custom-scrollbar z-20">
          
          <!-- Table of Contents -->
          <div v-if="toc.length > 0">
            <h3 class="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>📑</span> {{ t.on_this_page }}
            </h3>
            <nav class="space-y-1 relative border-l-2 border-sakura-100 dark:border-gray-700 pl-4">
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
          <div class="mt-auto bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/60 dark:border-gray-700 shadow-sm">
             <div class="text-[10px] uppercase font-bold text-sakura-400 dark:text-gray-500 mb-2">{{ t.note_details }}</div>
             <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
               <div class="flex justify-between"><span>{{ t.words }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.content?.length || 0 }}</span></div>
               <div class="flex justify-between"><span>{{ t.lines }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">{{ currentFile.content?.split('\n').length || 0 }}</span></div>
               <div class="flex justify-between"><span>{{ t.format }}:</span> <span class="font-mono text-gray-700 dark:text-gray-300">Markdown</span></div>
             </div>
          </div>

        </aside>

        <!-- Selection Tooltip -->
        <div 
          v-if="selectionRect" 
          class="fixed z-50 flex gap-1 p-1 bg-gray-800 dark:bg-white rounded-lg shadow-xl text-white dark:text-gray-900 transform -translate-x-1/2 -translate-y-full animate-fade-in"
          :style="{ top: selectionRect.top + 'px', left: selectionRect.left + 'px' }"
          @mousedown.stop
        >
          <button @click="highlightSelection" class="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded transition-colors" title="Highlight (Temporary)">🖊️</button>
          <button @click="underlineSelection" class="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded transition-colors" title="Underline"><u>U</u></button>
          <button @click="shareSelection" class="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded transition-colors" title="Copy Quote">📋</button>
        </div>

      </div>
    </main>

    <!-- Modals -->
    <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="showSettings = false">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in border border-white/50 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">{{ t.settings_title }}</h3>
        
        <!-- Theme Toggle -->
        <div class="mb-6">
           <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.theme }}</label>
           <div class="flex gap-2">
             <button @click="toggleTheme(false)" class="flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors" :class="!isDark ? 'border-sakura-500 bg-sakura-50 text-sakura-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
               <span>🌞</span> {{ t.theme_light }}
             </button>
             <button @click="toggleTheme(true)" class="flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors" :class="isDark ? 'border-purple-500 bg-gray-700 text-purple-300' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
               <span>🌙</span> {{ t.theme_dark }}
             </button>
           </div>
        </div>

        <!-- Font Family -->
        <div class="mb-6">
           <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_style }}</label>
           <div class="flex gap-2">
             <button @click="userSettings.fontFamily = 'sans'" class="flex-1 py-3 border rounded-xl transition-colors" :class="userSettings.fontFamily === 'sans' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Sans</button>
             <button @click="userSettings.fontFamily = 'serif'" class="flex-1 py-3 border rounded-xl font-serif transition-colors" :class="userSettings.fontFamily === 'serif' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Serif</button>
           </div>
        </div>

        <!-- Font Size -->
        <div class="mb-8">
           <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_size }}</label>
           <div class="flex gap-2">
             <button @click="userSettings.fontSize = 'small'" class="flex-1 py-3 border rounded-xl text-xs transition-colors" :class="userSettings.fontSize === 'small' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A</button>
             <button @click="userSettings.fontSize = 'normal'" class="flex-1 py-3 border rounded-xl text-sm transition-colors" :class="userSettings.fontSize === 'normal' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A+</button>
             <button @click="userSettings.fontSize = 'large'" class="flex-1 py-3 border rounded-xl text-lg transition-colors" :class="userSettings.fontSize === 'large' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A++</button>
           </div>
        </div>
        <button @click="showSettings = false" class="w-full py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold shadow-lg transition-colors">{{ t.done }}</button>
      </div>
    </div>

    <!-- Share Modal (Replaced QR with Copy Quote) -->
    <div v-if="showShareModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="showShareModal = false">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in text-center relative overflow-hidden border border-white/50 dark:border-gray-700">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-sakura-100 dark:bg-sakura-900 rounded-full opacity-50"></div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2 relative z-10">{{ t.share_title }}</h3>
        <div v-if="shareQuote" class="mb-4 text-left bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-600 dark:text-gray-300 italic border-l-4 border-sakura-300 text-sm relative z-10 max-h-40 overflow-y-auto custom-scrollbar">
           "{{ shareQuote }}"
        </div>
        
        <button @click="copyQuoteToClipboard" class="w-full py-3 bg-sakura-50 text-sakura-600 font-bold rounded-xl mb-4 hover:bg-sakura-100 transition-colors flex items-center justify-center gap-2">
           <span>📋</span> {{ t.quote_copied ? t.quote_copied : t.scan_text }}
        </button>

        <button @click="showShareModal = false" class="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 underline">{{ t.close }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, nextTick } from 'vue';
import { MOCK_FILE_SYSTEM, I18N } from './constants';
import { NodeType } from './types';
import type { FileNode, BreadcrumbItem, TocItem } from './types';
import FileTree from './components/FileTree.vue';
import LabReactivity from './components/LabReactivity.vue';
import LabLifecycle from './components/LabLifecycle.vue';

// i18n
const lang = ref<'en' | 'zh'>('zh');
const t = computed(() => I18N[lang.value]);
const toggleLang = () => lang.value = lang.value === 'en' ? 'zh' : 'en';

// Theme
const isDark = ref(localStorage.getItem('sakura_theme') === 'dark');
const toggleTheme = (val: boolean) => {
  isDark.value = val;
  localStorage.setItem('sakura_theme', val ? 'dark' : 'light');
  if (val) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

// Data
const fileSystem = ref<FileNode[]>([]);
const currentFile = ref<FileNode | null>(null);
const currentFolder = ref<FileNode | null>(null); 
const viewMode = ref<'latest' | 'files' | 'lab'>('latest');
const expandedFolders = ref<string[]>([]);
const toc = ref<TocItem[]>([]);
const activeHeaderId = ref<string>('');
const loading = ref(true);
const contentLoading = ref(false);
const currentTool = ref<'reactivity' | 'lifecycle' | null>(null);

const showSettings = ref(false);
const userSettings = reactive({
  fontSize: localStorage.getItem('sakura_fontsize') || 'normal',
  fontFamily: localStorage.getItem('sakura_fontfamily') || 'sans'
});

const selectionRect = ref<{top: number, left: number} | null>(null);
const showShareModal = ref(false);
const shareQuote = ref('');

watch(() => userSettings.fontSize, (v) => localStorage.setItem('sakura_fontsize', v));
watch(() => userSettings.fontFamily, (v) => localStorage.setItem('sakura_fontfamily', v));

// Computed
const fontSizeClass = computed(() => {
  switch(userSettings.fontSize) {
    case 'small': return 'text-sm lg:text-base leading-relaxed';
    case 'large': return 'text-lg lg:text-xl leading-relaxed';
    default: return 'lg:prose-xl leading-loose';
  }
});

const currentPath = computed(() => currentFile.value?.path || currentFolder.value?.path || '');

// Flattened list for "Latest" view
// We filter out "VUE学习笔记" from latest stream to keep it clean, if desired.
// Or we can include it. Let's include everything but maybe prioritize 'notes'.
const filteredFileSystem = computed(() => {
  return fileSystem.value; 
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
  return flatten(fileSystem.value).sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
});

const labFolder = computed(() => {
  // Look for VUE学习笔记 at the root level now
  return fileSystem.value.find(node => node.name === 'VUE学习笔记');
});

const sortedFolderChildren = computed(() => {
  if (!currentFolder.value || !currentFolder.value.children) return [];
  return [...currentFolder.value.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === NodeType.DIRECTORY ? -1 : 1;
  });
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

const renderedContent = computed(() => {
  if (!currentFile.value?.content) return '';
  
  let rawContent = currentFile.value.content;

  // --- IMAGE PATH REWRITING ---
  // Fix relative image paths in Markdown (e.g. ![alt](./assets/img.png))
  // to absolute paths based on the current file's location.
  // Example: File is 'VUE学习笔记/01.md', Image is './assets/img.png'
  // Result should be 'VUE学习笔记/assets/img.png'
  if (currentFile.value.path) {
    const parentDir = currentFile.value.path.substring(0, currentFile.value.path.lastIndexOf('/'));
    
    // Replace ./ with parentDir/
    // Regex matches: ![alt]( ./xxx )
    rawContent = rawContent.replace(/!\[(.*?)\]\(\.\/(.*?)\)/g, (match, alt, relPath) => {
      const newPath = `${parentDir}/${relPath}`;
      return `![${alt}](${newPath})`;
    });

    // Also handle just strict filename references ![alt](image.png) if they are siblings
    // But be careful not to break http links
    rawContent = rawContent.replace(/!\[(.*?)\]\((?!http)(?!\/)(?!\.)(.*?)\)/g, (match, alt, relPath) => {
       const newPath = `${parentDir}/${relPath}`;
       return `![${alt}](${newPath})`;
    });
  }

  // @ts-ignore
  return window.marked ? window.marked.parse(rawContent) : rawContent;
});

const activeIndicatorTop = computed(() => {
  if (!activeHeaderId.value) return 0;
  const idx = toc.value.findIndex(t => t.id === activeHeaderId.value);
  return idx * 28; 
});

const getCleanParentPath = (path: string) => {
  const parent = path.split('/').slice(0, -1).join('/');
  return parent || 'Root';
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '';

const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

const openFile = async (file: FileNode) => {
  currentFile.value = file;
  currentFolder.value = null;
  currentTool.value = null;
  updateUrl(file.path);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!file.content) {
    contentLoading.value = true;
    try {
      const res = await fetch(file.path);
      if (res.ok) {
        file.content = await res.text();
      } else {
        file.content = "# Error\nCould not load file.";
      }
    } catch (e) {
      file.content = "# Error\nFailed to fetch content.";
    } finally {
      contentLoading.value = false;
      currentFile.value = { ...file }; 
    }
  }
};

const openFolder = (folder: FileNode) => {
  currentFile.value = null;
  currentFolder.value = folder;
  currentTool.value = null;
  updateUrl(folder.path);
  if (viewMode.value === 'latest') viewMode.value = 'files';
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

const switchViewMode = (mode: 'latest' | 'files' | 'lab') => {
  viewMode.value = mode;
  if (mode === 'lab' && !currentFile.value) {
    // Keep lab folder navigation if already there, else reset
    if (!currentTool.value) currentTool.value = 'reactivity';
  }
};

const updateUrl = (path: string | null) => {
  const url = new URL(window.location.href);
  path ? url.searchParams.set('path', path) : url.searchParams.delete('path');
  window.history.pushState({}, '', url);
};

const resetToHome = () => {
  currentFile.value = null;
  currentFolder.value = null;
  viewMode.value = 'latest';
  updateUrl(null);
};

const copyLink = () => navigator.clipboard.writeText(window.location.href).then(() => alert(t.value.link_copied));

const downloadSource = () => {
  if (currentFile.value) {
    const blob = new Blob([currentFile.value.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.value.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Selection Handling
const handleTextSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // Offset relative to viewport is enough for fixed position tooltip
    selectionRect.value = { top: rect.top - 10, left: rect.left + rect.width / 2 };
    shareQuote.value = selection.toString();
  } else {
    selectionRect.value = null;
  }
};

const highlightSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount) {
    document.designMode = "on";
    document.execCommand("BackColor", false, "rgba(255, 228, 100, 0.5)");
    document.designMode = "off";
    selectionRect.value = null;
    selection.removeAllRanges();
  }
};

const underlineSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount) {
    document.designMode = "on";
    document.execCommand("Underline", false, "");
    document.designMode = "off";
    selectionRect.value = null;
    selection.removeAllRanges();
  }
};

const shareSelection = () => {
  showShareModal.value = true;
  selectionRect.value = null;
};

const copyQuoteToClipboard = () => {
  navigator.clipboard.writeText(`> ${shareQuote.value}\n\nVia Sakura Notes`).then(() => {
     alert(t.value.quote_copied);
     showShareModal.value = false;
  });
};

const generateToc = () => {
  if (!currentFile.value?.content) { toc.value = []; return; }
  const headers: TocItem[] = [];
  const lines = currentFile.value.content.split('\n');
  let inCodeBlock = false;
  lines.forEach(line => {
    if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) return;
    const match = line.match(/^(#{1,3})\s+(.*)$/);
    if (match) {
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-'); 
      headers.push({ id, text, level: match[1].length });
    }
  });
  toc.value = headers;
};

const updateActiveHeader = () => {
  const container = document.getElementById('scroll-container');
  if (!container) return;
  const scrollPosition = container.scrollTop;
  let active = '';
  for (const item of toc.value) {
    const el = document.getElementById(item.id);
    if (el && el.offsetTop - 150 <= scrollPosition) active = item.id;
  }
  if (active) activeHeaderId.value = active;
};

const scrollToHeader = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

watch(currentFile, () => generateToc());

onMounted(async () => {
  if (isDark.value) document.documentElement.classList.add('dark');
  
  try {
    const res = await fetch(`./files.json?t=${Date.now()}`);
    if (res.ok) {
      fileSystem.value = await res.json();
      const params = new URLSearchParams(window.location.search);
      const targetPath = params.get('path');
      if (targetPath) {
        const node = findNodeByPath(fileSystem.value, targetPath);
        if (node) {
          if (targetPath.includes('VUE学习笔记')) viewMode.value = 'lab';
          node.type === NodeType.FILE ? openFile(node) : openFolder(node);
        }
      }
    }
  } catch (e) {
    fileSystem.value = MOCK_FILE_SYSTEM;
  } finally {
    loading.value = false;
  }

  const container = document.getElementById('scroll-container');
  watch(currentFile, () => {
    setTimeout(() => {
      const el = document.getElementById('scroll-container');
      if (el) el.addEventListener('scroll', updateActiveHeader);
    }, 100);
  });
});
</script>
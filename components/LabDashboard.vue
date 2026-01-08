<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_dashboard }}</h1>
      <p class="text-sakura-500">{{ t.lab_dashboard_desc }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8">
      <div class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex gap-2 shadow-inner">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          <span>{{ tab.icon }}</span>
          <span class="hidden md:inline">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">
      
      <!-- Tab 1: Web Foundation (HTML/JS) -->
      <div v-if="activeTab === 'foundation'" class="space-y-12 animate-fade-in">
        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ t.lab_js_title }}
          </h2>
          <LabJs :lang="lang" />
        </section>
      </div>

      <!-- Tab 2: Vue Core -->
      <div v-else-if="activeTab === 'vue'" class="space-y-12 animate-fade-in">
        <section>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
           </h2>
           <LabReactivity :lang="lang" />
        </section>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">👁️</span> {{ t.lab_directives }}
            </h2>
            <LabDirectives :lang="lang" />
          </section>

          <section>
            <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
            </h2>
            <LabLifecycle :lang="lang" />
          </section>
        </div>
      </div>

      <!-- Tab 3: Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in">
         <section class="max-w-3xl mx-auto">
           <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
           </h2>
           <LabQuizGame :lang="lang" />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../constants';
import LabQuizGame from './LabQuizGame.vue';
import LabReactivity from './LabReactivity.vue';
import LabDirectives from './LabDirectives.vue';
import LabLifecycle from './LabLifecycle.vue';
import LabHtml from './LabHtml.vue';
import LabJs from './LabJs.vue';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const activeTab = ref('vue'); // Default to Vue

const tabs = computed(() => [
  { id: 'foundation', label: t.value.cat_foundation, icon: '🌐' },
  { id: 'vue', label: t.value.cat_vue, icon: '🥝' },
  { id: 'challenge', label: t.value.cat_challenge, icon: '🏆' },
]);
</script>
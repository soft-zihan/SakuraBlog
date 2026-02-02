<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="vue-core" />

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-sakura-400">
          💡 {{ isZh ? '先从宏观角度了解这个博客项目的结构。' : 'First, get a macro view of this blog project structure.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-sakura-600 dark:text-sakura-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧭</span> {{ isZh ? '项目实战导览' : 'Project Tour' }}
      </h2>
      <LabProjectTour :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-400">
          💡 {{ isZh ? 'ref() 和 reactive() 是 Vue 3 响应式的核心。' : 'ref() and reactive() are Vue 3 reactivity core.' }}
        </p>
      </div>
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
        <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
          <span class="text-2xl">💅</span> {{ t.lab_class_title }}
        </h2>
        <LabClassStyle :lang="lang" />
      </section>
    </div>

    <section>
      <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🖱️</span> {{ isZh ? '事件处理' : 'Event Handling' }}
      </h2>
      <LabEventHandling :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
      </h2>
      <LabVueList :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? '组件有「生命周期」：创建→挂载→更新→销毁。' : 'Components have lifecycle: create → mount → update → unmount.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
      </h2>
      <LabLifecycle :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="t.lab_stage_vue_core_next"
      @next="emit('navigate', 'vue-advanced')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabProjectTour from '../LabProjectTour.vue'
import LabReactivity from '../stage6-vue-core/LabReactivity.vue'
import LabDirectives from '../stage6-vue-core/LabDirectives.vue'
import LabClassStyle from '../stage6-vue-core/LabClassStyle.vue'
import LabEventHandling from '../stage6-vue-core/LabEventHandling.vue'
import LabVueList from '../stage6-vue-core/LabVueList.vue'
import LabLifecycle from '../stage6-vue-core/LabLifecycle.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
const t = computed(() => I18N[lang.value])
</script>

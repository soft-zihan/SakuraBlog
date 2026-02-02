<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="vue-advanced" />

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
          💡 {{ isZh ? 'Props 是父→子单向数据流，Emit 是子→父事件通信。' : 'Props are parent→child one-way data flow, Emit is child→parent event communication.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">📡</span> {{ t.lab_props_title }}
      </h2>
      <LabPropsEmit :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🎁</span> {{ isZh ? '插槽系统' : 'Slot System' }}
      </h2>
      <LabSlot :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-400">
          💡 {{ isZh ? 'Composables 是 Vue 3 的逻辑复用方案。' : `Composables are Vue 3's logic reuse pattern.` }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧩</span> {{ isZh ? 'Composables 组合式函数' : 'Composables' }}
      </h2>
      <LabComposables :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-indigo-400">
          💡 {{ isZh ? 'Pinia 是 Vue 官方推荐的状态管理库。' : `Pinia is Vue's official state management library.` }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🍍</span> {{ isZh ? 'Pinia 状态管理' : 'Pinia State Management' }}
      </h2>
      <LabPinia :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">💉</span> {{ isZh ? '依赖注入' : 'Dependency Injection' }}
      </h2>
      <LabProvideInject :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? 'Vue 进阶完成！进入挑战赛。' : 'Vue advanced done! Enter the challenge.'"
      @next="emit('navigate', 'challenge')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import StageLearningGuide from './StageLearningGuide.vue'
import LabPropsEmit from '../stage7-vue-advanced/LabPropsEmit.vue'
import LabSlot from '../stage7-vue-advanced/LabSlot.vue'
import LabComposables from '../stage7-vue-advanced/LabComposables.vue'
import LabPinia from '../stage7-vue-advanced/LabPinia.vue'
import LabProvideInject from '../stage7-vue-advanced/LabProvideInject.vue'

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

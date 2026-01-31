<template>
  <div class="space-y-12">
    <StageLearningGuide :lang="lang" stage-id="challenge" />

    <div class="max-w-3xl mx-auto px-4">
      <div class="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800/30">
        <h3 class="font-bold text-orange-800 dark:text-orange-200 mb-2">🏆 {{ isZh ? '挑战赛' : 'Challenge' }}</h3>
        <p class="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
          {{ isZh ? '恭喜你完成了所有学习内容！现在是检验成果的时刻。' : `Congratulations on completing all learning content! Now it's time to test your skills.` }}
        </p>
      </div>
    </div>

    <section class="max-w-3xl mx-auto">
      <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
        <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
      </h2>
      <LabQuizGame :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🏆</span> {{ isZh ? '迷你项目挑战' : 'Mini Project Challenge' }}
      </h2>
      <LabMiniProject :lang="lang" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'
import StageLearningGuide from './StageLearningGuide.vue'
import LabQuizGame from '../stage8-challenge/LabQuizGame.vue'
import LabMiniProject from '../stage8-challenge/LabMiniProject.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
const t = computed(() => I18N[lang.value])
</script>

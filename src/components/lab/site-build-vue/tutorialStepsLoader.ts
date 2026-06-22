import type { ShellStage } from './shellStore'

export type TutorialLang = 'en' | 'zh'

export type TutorialCodeBlock = {
  labelZh: string
  labelEn: string
  content: string
}

export type TutorialStep = {
  id: string
  titleZh: string
  titleEn: string
  goalZh: string
  goalEn: string
  tasksZh: string[]
  tasksEn: string[]
  checksZh: string[]
  checksEn: string[]
  blocks?: TutorialCodeBlock[]
}

export type TutorialStageMeta = {
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
  previewTitleZh: string
  previewTitleEn: string
}

export type TutorialPreview = { html: string; css: string; js: string }
export type TutorialStageData = { steps: TutorialStep[]; preview: TutorialPreview }

export const TUTORIAL_STAGE_META: Record<ShellStage, TutorialStageMeta> = {
  foundation: {
    titleZh: 'Stage 1：网页基础',
    titleEn: 'Stage 1: Foundation',
    descZh: '把“文件 + HTML”先跑通：结构、路径、上线心智。',
    descEn: 'Get files + HTML working: structure, paths, deploy mindset.',
    previewTitleZh: '真实渲染预览：基础页面',
    previewTitleEn: 'Live preview: foundation'
  },
  css: {
    titleZh: 'Stage 2：CSS 布局',
    titleEn: 'Stage 2: CSS Layout',
    descZh: '先做可读性，再做布局：从单列到两栏，再到响应式。',
    descEn: 'Readability first, layout second: responsive two-column.',
    previewTitleZh: '真实渲染预览：CSS 布局',
    previewTitleEn: 'Live preview: CSS layout'
  },
  js: {
    titleZh: 'Stage 3：JS 基础',
    titleEn: 'Stage 3: JS Basics',
    descZh: '用最小 JS 跑通交互链路：事件、状态、持久化、渲染。',
    descEn: 'Minimal JS interactions: events, state, persistence, render.',
    previewTitleZh: '真实渲染预览：JS 交互',
    previewTitleEn: 'Live preview: JS interactions'
  }
}

const STAGE_CACHE: Partial<Record<ShellStage, TutorialStageData>> = {}

export function getTutorialStageMeta(stage: ShellStage) {
  return TUTORIAL_STAGE_META[stage]
}

export async function loadTutorialStage(stage: ShellStage): Promise<TutorialStageData> {
  const cached = STAGE_CACHE[stage]
  if (cached) return cached

  const mod =
    stage === 'foundation'
      ? await import('./tutorialStage.foundation')
      : stage === 'css'
        ? await import('./tutorialStage.css')
        : await import('./tutorialStage.js')

  const data: TutorialStageData = { steps: mod.STEPS, preview: mod.PREVIEW }
  STAGE_CACHE[stage] = data
  return data
}


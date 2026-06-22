export type MultiVModelChoice = {
  prop: 'first' | 'last'
  event: 'update:first' | 'update:last'
}

export type MultiVModelChallengeResult = {
  correct: boolean
  expected: MultiVModelChoice
  explanationZh: string
  explanationEn: string
}

export function evaluateMultiVModelChoice(choice: MultiVModelChoice): MultiVModelChallengeResult {
  const expected: MultiVModelChoice = { prop: 'first', event: 'update:first' }
  const correct = choice.prop === expected.prop && choice.event === expected.event
  return {
    correct,
    expected,
    explanationZh:
      'v-model:first 会展开为 :first + @update:first。多 v-model 的关键是“字段名”决定 prop 与事件名，子组件通过 emit 请求父组件更新。',
    explanationEn:
      'v-model:first expands to :first + @update:first. With multiple v-model bindings, the field name defines both the prop and the update event.'
  }
}


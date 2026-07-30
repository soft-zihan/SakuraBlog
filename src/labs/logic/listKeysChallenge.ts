export type ListKeysAnswer = 'id' | 'index' | 'random'

export type ListKeysChallengeResult = {
  correct: boolean
  expected: ListKeysAnswer
  explanationZh: string
  explanationEn: string
}

export function evaluateListKeysAnswer(answer: ListKeysAnswer): ListKeysChallengeResult {
  const expected: ListKeysAnswer = 'id'
  const correct = answer === expected
  return {
    correct,
    expected,
    explanationZh:
      '只要列表可能插入/删除/重排，就不要用 index。用稳定唯一的业务 id 才能让组件实例与业务实体一一对应，避免状态错位。',
    explanationEn:
      'If a list can insert/remove/reorder, avoid index keys. Use a stable unique business id so component instances stay bound to the same entity.'
  }
}


import { getRunningStep } from '../ExecutionUtils'

import stageGraph from './stage-graph.json'

describe('ExecutionUtils test', () => {
  describe('getRunningStep tests', () => {
    test('gives current running step from stage graph', () => {
      const result = getRunningStep((stageGraph as unknown) as any)

      expect(result).toBe('WOLUCzOCQDWyjJyOLN_9TQ')
    })
  })
})

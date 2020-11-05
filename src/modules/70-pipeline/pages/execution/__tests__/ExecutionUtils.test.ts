import * as utils from '../ExecutionUtils'

import stageGraph from './stage-graph.json'

describe('ExecutionUtils tests', () => {
  describe('getRunningStep tests', () => {
    test('gives current running step from stage graph', () => {
      const result = utils.getRunningStep((stageGraph as unknown) as any)

      expect(result).toBe('WOLUCzOCQDWyjJyOLN_9TQ')
    })

    test('handles empty objects', () => {
      expect(utils.getRunningStep({})).toBe(null)
      expect(utils.getRunningStep({ nodeMap: {} })).toBe(null)
      expect(utils.getRunningStep({ nodeAdjacencyListMap: {} })).toBe(null)
      expect(utils.getRunningStep({ nodeMap: {}, nodeAdjacencyListMap: {} })).toBe(null)
    })
  })

  describe('getRunningStageForPipeline tests', () => {
    test('gives current running stage', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          { stage: { stageIdentifier: 'stage2', executionStatus: 'Running' } },
          { stage: { stageIdentifier: 'stage3', executionStatus: 'NotStarted' } }
        ],
        'Running'
      )

      expect(stage).toBe('stage2')
    })

    test('gives current running stage - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          {
            parallel: {
              stageExecutions: [
                { stage: { stageIdentifier: 'stage2.1', executionStatus: 'Running' } },
                { stage: { stageIdentifier: 'stage2.2', executionStatus: 'Running' } }
              ]
            }
          },
          { stage: { stageIdentifier: 'stage3', executionStatus: 'NotStarted' } }
        ],
        'Running'
      )

      expect(stage).toBe('stage2.1')
    })

    test('handles empty objects', () => {
      const stage = utils.getRunningStageForPipeline([{}, { parallel: { stageExecutions: [] } }, { stage: {} }])

      expect(stage).toBe(null)
    })

    test('gives correct stage for completed process', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          { stage: { stageIdentifier: 'stage2', executionStatus: 'Success' } },
          { stage: { stageIdentifier: 'stage3', executionStatus: 'Success' } }
        ],
        'Success'
      )

      expect(stage).toBe('stage3')
    })

    test('gives correct stage for completed process - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          {
            parallel: {
              stageExecutions: [
                { stage: { stageIdentifier: 'stage2.1', executionStatus: 'Success' } },
                { stage: { stageIdentifier: 'stage2.2', executionStatus: 'Success' } }
              ]
            }
          }
        ],
        'Success'
      )

      expect(stage).toBe('stage2.1')
    })

    test('gives correct stage for errored process', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          { stage: { stageIdentifier: 'stage2', executionStatus: 'Failed' } },
          { stage: { stageIdentifier: 'stage3', executionStatus: 'NotStarted' } }
        ],
        'Failed'
      )

      expect(stage).toBe('stage2')
    })

    test('gives correct stage for errored process - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        [
          { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
          {
            parallel: {
              stageExecutions: [
                { stage: { stageIdentifier: 'stage2.1', executionStatus: 'Failed' } },
                { stage: { stageIdentifier: 'stage2.2', executionStatus: 'Success' } }
              ]
            }
          },
          { stage: { stageIdentifier: 'stage3', executionStatus: 'NotStarted' } }
        ],
        'Failed'
      )

      expect(stage).toBe('stage2.1')
    })
  })
})

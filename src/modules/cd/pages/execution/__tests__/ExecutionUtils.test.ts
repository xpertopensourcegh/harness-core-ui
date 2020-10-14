import {
  getRunningStep,
  getRunningStageForPipeline,
  isExecutionComplete,
  ExecutionStatus,
  isExecutionInProgress,
  isExecutionPaused,
  isExecutionNotStarted,
  isExecutionRunning
} from '../ExecutionUtils'

import stageGraph from './stage-graph.json'

describe('ExecutionUtils tests', () => {
  describe('getRunningStep tests', () => {
    test('gives current running step from stage graph', () => {
      const result = getRunningStep((stageGraph as unknown) as any)

      expect(result).toBe('WOLUCzOCQDWyjJyOLN_9TQ')
    })

    test('handles empty objects', () => {
      expect(getRunningStep({})).toBe(null)
      expect(getRunningStep({ nodeMap: {} })).toBe(null)
      expect(getRunningStep({ nodeAdjacencyListMap: {} })).toBe(null)
      expect(getRunningStep({ nodeMap: {}, nodeAdjacencyListMap: {} })).toBe(null)
    })
  })

  describe('getRunningStageForPipeline tests', () => {
    test('gives current running stage', () => {
      const stage = getRunningStageForPipeline([
        { stage: { stageIdentifier: 'stage1', executionStatus: 'Success' } },
        { stage: { stageIdentifier: 'stage2', executionStatus: 'Running' } },
        { stage: { stageIdentifier: 'stage3', executionStatus: 'NotStarted' } }
      ])

      expect(stage).toBe('stage2')
    })

    test('gives current running stage - parallel', () => {
      const stage = getRunningStageForPipeline([
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
      ])

      expect(stage).toBe('stage2.1')
    })

    test('handles empty objects', () => {
      const stage = getRunningStageForPipeline([{}, { parallel: { stageExecutions: [] } }, { stage: {} }])

      expect(stage).toBe(null)
    })
  })

  describe('isExecutionComplete tests', () => {
    test.each<[ExecutionStatus]>([['Aborted'], ['Expired'], ['Failed'], ['Success'], ['Suspended'], ['Error']])(
      'Status "%s" marks stage as complete',
      status => {
        expect(isExecutionComplete(status)).toBe(true)
      }
    )
  })

  describe('isExecutionInProgress tests', () => {
    test.each<[ExecutionStatus]>([['Paused'], ['Running'], ['Waiting'], ['Queued']])(
      'Status "%s" marks stage as in-progress',
      status => {
        expect(isExecutionInProgress(status)).toBe(true)
      }
    )
  })

  describe('isExecutionPaused tests', () => {
    test.each<[ExecutionStatus]>([['Paused']])('Status "%s" marks stage as paused', status => {
      expect(isExecutionPaused(status)).toBe(true)
    })
  })

  describe('isExecutionNotStarted tests', () => {
    test.each<[ExecutionStatus]>([['NotStarted']])('Status "%s" marks stage as not started', status => {
      expect(isExecutionNotStarted(status)).toBe(true)
    })
  })

  describe('isExecutionRunning tests', () => {
    test.each<[ExecutionStatus]>([['Running']])('Status "%s" marks stage as running', status => {
      expect(isExecutionRunning(status)).toBe(true)
    })
  })
})

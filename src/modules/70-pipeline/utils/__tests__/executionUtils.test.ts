import * as utils from '../executionUtils'

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
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['stage2']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            stage2: {
              edgeLayoutList: {
                nextIds: ['stage3']
              },
              status: 'Running',
              nodeUuid: 'stage2'
            },
            stage3: {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'NotStarted',
              nodeUuid: 'stage3'
            }
          },
          startingNodeId: 'stage1'
        },
        'Running'
      )

      expect(stage).toBe('stage2')
    })

    test('gives current running stage - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['parallel']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            parallel: {
              nodeType: 'parallel',
              edgeLayoutList: {
                currentNodeChildren: ['stage2.1', 'stage2.2'],
                nextIds: ['stage3']
              }
            },
            'stage2.1': {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'Running',
              nodeUuid: 'stage2.1'
            },
            'stage2.2': {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'Running',
              nodeUuid: 'stage2.2'
            },
            stage3: {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'NotStarted',
              nodeUuid: 'stage3'
            }
          },
          startingNodeId: 'stage1'
        },
        'Running'
      )

      expect(stage).toBe('stage2.1')
    })

    test('handles empty objects', () => {
      const stage = utils.getRunningStageForPipeline({
        layoutNodeMap: {}
      })

      expect(stage).toBe(null)
    })

    test('gives correct stage for completed process', () => {
      const stage = utils.getRunningStageForPipeline(
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['stage2']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            stage2: {
              edgeLayoutList: {
                nextIds: ['stage3']
              },
              status: 'Success',
              nodeUuid: 'stage2'
            },
            stage3: {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'Success',
              nodeUuid: 'stage3'
            }
          },
          startingNodeId: 'stage1'
        },
        'Success'
      )

      expect(stage).toBe('stage3')
    })

    test('gives correct stage for completed process - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['parallel']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            parallel: {
              nodeType: 'parallel',
              edgeLayoutList: {
                currentNodeChildren: ['stage2.1', 'stage2.2'],
                nextIds: ['stage3']
              }
            },
            'stage2.1': {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'Running',
              nodeUuid: 'stage2.1'
            },
            'stage2.2': {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'Running',
              nodeUuid: 'stage2.2'
            }
          },
          startingNodeId: 'stage1'
        },
        'Success'
      )

      expect(stage).toBe('stage2.1')
    })

    test('gives correct stage for errored process', () => {
      const stage = utils.getRunningStageForPipeline(
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['stage2']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            stage2: {
              edgeLayoutList: {
                nextIds: ['stage3']
              },
              status: 'Failed',
              nodeUuid: 'stage2'
            },
            stage3: {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'NotStarted',
              nodeUuid: 'stage3'
            }
          },
          startingNodeId: 'stage1'
        },
        'Failed'
      )

      expect(stage).toBe('stage2')
    })

    test('gives correct stage for errored process - parallel', () => {
      const stage = utils.getRunningStageForPipeline(
        {
          layoutNodeMap: {
            stage1: {
              edgeLayoutList: {
                nextIds: ['parallel']
              },
              status: 'Success',
              nodeUuid: 'stage1'
            },
            parallel: {
              nodeType: 'parallel',
              edgeLayoutList: {
                currentNodeChildren: ['stage2.1', 'stage2.2'],
                nextIds: ['stage3']
              }
            },
            'stage2.1': {
              edgeLayoutList: {
                nextIds: ['stage3']
              },
              status: 'Failed',
              nodeUuid: 'stage2.1'
            },
            'stage2.2': {
              edgeLayoutList: {
                nextIds: ['stage3']
              },
              status: 'Success',
              nodeUuid: 'stage2.2'
            },
            stage3: {
              edgeLayoutList: {
                nextIds: []
              },
              status: 'NotStarted',
              nodeUuid: 'stage3'
            }
          },
          startingNodeId: 'stage1'
        },
        'Failed'
      )

      expect(stage).toBe('stage2.1')
    })
  })
})

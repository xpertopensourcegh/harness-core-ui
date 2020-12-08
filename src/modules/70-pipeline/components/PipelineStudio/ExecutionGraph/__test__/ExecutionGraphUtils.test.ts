import type { DefaultNodeModel } from '@pipeline/components/Diagram'
import {
  addService,
  calculateDepthCount,
  DependenciesWrapper,
  getDependenciesState,
  getDependencyFromNode,
  getStepsState,
  StepState,
  StepStateMap
} from '../ExecutionGraphUtil'

describe('ExecutionGraphUtils', () => {
  test('getDependencyFromNode()', () => {
    const servicesData: DependenciesWrapper[] = [
      {
        identifier: 'id1'
      }
    ]

    const nodeModel: DefaultNodeModel = {
      getIdentifier: () => 'id1'
    } as DefaultNodeModel

    const ret = getDependencyFromNode(servicesData, nodeModel)
    expect(ret.node).toEqual(servicesData[0])
  })

  test('getDependenciesState()', () => {
    const servicesData: DependenciesWrapper[] = [
      {
        identifier: 'id1'
      }
    ]
    const mapState: StepStateMap = new Map<string, StepState>()

    getDependenciesState(servicesData, mapState)

    expect(mapState.has('id1'))
  })

  test('getStepsState()', () => {
    const node = {
      steps: [
        {
          step: {
            identifier: 'id1'
          }
        }
      ],
      rollbackSteps: [
        {
          step: {
            identifier: 'id2'
          }
        }
      ],
      parallel: [
        {
          steps: [
            {
              step: {
                identifier: 'id3'
              }
            }
          ]
        }
      ],
      stepGroup: {
        steps: [
          {
            step: {
              identifier: 'id4'
            }
          }
        ],
        rollbackSteps: [
          {
            step: {
              identifier: 'id5'
            }
          }
        ]
      }
    }
    const mapState: StepStateMap = new Map<string, StepState>()

    getStepsState(node, mapState)

    expect(mapState.has('id1'))
    expect(mapState.has('id2'))
    expect(mapState.has('id3'))
    expect(mapState.has('id4'))
    expect(mapState.has('id5'))
  })

  test('addService()', () => {
    const data: any = []
    const service: any = {}

    addService(data, service)

    expect(data.length).toBe(1)
  })

  test('calculateDepthCount() without stepGroup', () => {
    const dept = calculateDepthCount({}, new Map())
    expect(dept).toBe(0.7)
  })

  test('calculateDepthCount() with collapsed stepGroup', () => {
    const node = {
      stepGroup: {
        identifier: 'collapsed'
      }
    }
    const mapState: StepStateMap = new Map<string, StepState>()
    mapState.set('collapsed', { isStepGroupCollapsed: true } as StepState)

    const dept = calculateDepthCount(node, mapState)
    expect(dept).toBe(0.7)
  })

  test('calculateDepthCount() with expanded stepGroup (one step)', () => {
    const node = {
      stepGroup: {
        identifier: 'expanded',
        steps: [{ step: {} }]
      }
    }
    const mapState: StepStateMap = new Map<string, StepState>()
    mapState.set('expanded', { isStepGroupCollapsed: false } as StepState)

    const dept = calculateDepthCount(node, mapState)

    expect(dept).toBe(1)
  })

  test('calculateDepthCount() with expanded stepGroup (3 step in parallel)', () => {
    const node = {
      stepGroup: {
        identifier: 'expanded',
        steps: [
          {
            parallel: [{ step: {} }, { step: {} }, { step: {} }]
          }
        ]
      }
    }
    const mapState: StepStateMap = new Map<string, StepState>()
    mapState.set('expanded', { isStepGroupCollapsed: false } as StepState)

    const dept = calculateDepthCount(node, mapState)

    expect(dept).toBe(2)
  })
})

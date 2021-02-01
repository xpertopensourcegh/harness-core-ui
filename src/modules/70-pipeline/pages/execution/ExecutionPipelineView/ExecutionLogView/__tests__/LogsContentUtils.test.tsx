import type { ExecutionNode } from 'services/pipeline-ng'
import { createLogSection, getLogsFromBlob, getStageType } from '../LogsContentUtils'

const fetchMock = jest.spyOn(global, 'fetch' as any)
jest.mock('@pipeline/components/PipelineSteps/PipelineStepFactory', () => ({}))

const getLiteEngineStep = () => {
  return {
    uuid: '12345',
    name: 'name',
    identifier: 'stepIdentifier',
    startTs: 1610543218674,
    endTs: 1610543254842,
    stepType: 'liteEngineTask',
    status: 'Running',
    failureInfo: {},
    executableResponses: [
      {
        task: {
          taskId: 'id1',
          logKeys: ['key1', 'key2'],
          units: ['Initialize', 'Wrap Up']
        }
      },
      {
        task: {
          taskId: 'id1'
        }
      }
    ]
  }
}

const getStep = () => {
  return {
    uuid: '12345',
    name: 'name',
    identifier: 'stepIdentifier',
    startTs: 1610543218674,
    endTs: 1610543254842,
    stepType: 'stepType',
    status: 'Running',
    failureInfo: {},
    executableResponses: [
      {
        taskChain: {
          taskId: 'id1',
          logKeys: ['key1', 'key2'],
          units: ['Initialize', 'Wrap Up']
        }
      },
      {
        taskChain: {
          taskId: 'id1'
        }
      }
    ],
    taskIdToProgressDataMap: {
      id1: [
        {
          commandUnitName: 'Initialize',
          commandExecutionStatus: 'SUCCESS'
        },
        {
          commandUnitName: 'Wrap Up',
          commandExecutionStatus: 'SUCCESS'
        },
        {
          commandUnitName: 'Wrap Up',
          commandExecutionStatus: 'RUNNING'
        }
      ]
    }
  } as ExecutionNode
}

describe('LogsContentUtils', () => {
  test('getStageType', () => {
    const ci = getStageType({ moduleInfo: { ci: {} } })
    expect(ci).toBe('ci')
    const cd = getStageType({ moduleInfo: { cd: {} } })
    expect(cd).toBe('cd')
    const unknown = getStageType({ moduleInfo: {} })
    expect(unknown).toBe('unknown')
  })

  test('logBlobPromise', async () => {
    const fetchSpy = fetchMock.mockResolvedValue({
      text: () => new Promise(resolve => resolve('{"out":"message"}')),
      headers: { get: () => 'text/plain' }
    })

    const response = await getLogsFromBlob({ key: '123', accountID: '123', 'X-Harness-Token': '123' })
    expect(response).toStrictEqual([{ out: 'message' }])

    fetchSpy.mockClear()
  })

  test('createLogSection (basic test) - CI', async () => {
    const response = createLogSection(
      'ci',
      'logsToken',
      'accountId',
      'orgIdentifier',
      'projectIdentifier',
      'runSequence',
      'pipelineIdentifier',
      'stageIdentifier',
      'Running',
      getStep(),
      false,
      -1
    )

    const expectedResponse = [
      {
        enableLogLoading: true,
        sectionTitle: 'Logs',
        sectionIdx: 0,
        sourceType: 'stream',
        queryVars: {
          'X-Harness-Token': 'logsToken',
          accountID: 'accountId',
          key: 'accountId/orgIdentifier/projectIdentifier/pipelineIdentifier/runSequence/stageIdentifier/stepIdentifier'
        }
      }
    ]

    expect(response).toStrictEqual(expectedResponse)
  })

  test('createLogSection (basic test) - CD', async () => {
    const response = createLogSection(
      'cd',
      'logsToken',
      'accountId',
      'orgIdentifier',
      'projectIdentifier',
      'runSequence',
      'pipelineIdentifier',
      'stageIdentifier',
      'Running',
      getStep(),
      false,
      -1
    )

    const expectedResponse = [
      {
        enableLogLoading: false,
        queryVars: { 'X-Harness-Token': 'logsToken', accountID: 'accountId', key: 'key1' },
        sectionIdx: 0,
        sectionTitle: expect.any(Function),
        sourceType: 'blob'
      },
      {
        enableLogLoading: true,
        queryVars: { 'X-Harness-Token': 'logsToken', accountID: 'accountId', key: 'key2' },
        sectionIdx: 1,
        sectionTitle: expect.any(Function),
        sourceType: 'stream'
      }
    ]

    expect(response).toStrictEqual(expectedResponse)
  })

  test('createLogSection (liteEngineTask)', async () => {
    const response = createLogSection(
      'ci',
      'logsToken',
      'accountId',
      'orgIdentifier',
      'projectIdentifier',
      'runSequence',
      'pipelineIdentifier',
      'stageIdentifier',
      'Success',
      getLiteEngineStep() as any,
      false,
      -1
    )

    const expectedResponse = [
      {
        enableLogLoading: true,
        sectionIdx: 0,
        sectionTitle: 'Logs',
        sourceType: 'stream',
        queryVars: { 'X-Harness-Token': 'logsToken', accountID: 'accountId', key: 'key1' }
      }
    ]

    expect(response).toStrictEqual(expectedResponse)
  })
})

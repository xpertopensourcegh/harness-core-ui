import type { ExecutionNode } from 'services/pipeline-ng'
import { createLogSection, getLogsFromBlob, getStageType } from '../LogsContentUtils'

const fetchMock = jest.spyOn(global, 'fetch' as any)

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
          taskId: 'id',
          logKeys: ['key1', 'key2'],
          units: ['Initialize', 'Wrap Up']
        }
      },
      {
        taskChain: {
          taskId: 'progressId123'
        }
      }
    ],
    taskIdToProgressDataMap: {
      progressId123: [
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

  test('createLogSection (basic test)', async () => {
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
})

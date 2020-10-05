import type {
  CDStageExecutionSummaryDTO,
  ParallelStageExecutionSummaryDTO,
  ResponsePipelineExecutionDetail
} from 'services/cd-ng'
import mock from './mock.json'

type Status = CDStageExecutionSummaryDTO['executionStatus'] | 'ERROR'

const StatusObj: Status[] = [
  'RUNNING',
  'FAILED',
  'NOT_STARTED',
  'EXPIRED',
  'ABORTED',
  'QUEUED',
  'PAUSED',
  'WAITING',
  'SUCCESS',
  'ERROR',
  'SUSPENDED'
]

const getRandomStatus = (): Status => {
  return StatusObj[Math.floor(Math.random() * 10)] || 'RUNNING'
}

const getStage = (uniqueId: string, status?: Status): CDStageExecutionSummaryDTO => {
  return {
    planExecutionId: `planExecutionIdcdStage${status}`,
    stageIdentifier: `stageIdentifierCdStage${uniqueId}`,
    stageName: `Stage ${uniqueId}`,
    artifactsDeployed: [
      {
        identifier: 'artifactIdentifier',
        artifactStream: null
      }
    ],
    deploymentType: 'Kubernetes',
    executionStatus: status || (getRandomStatus() as any),
    startedAt: 0,
    endedAt: 10,
    serviceIdentifier: `serviceIdentifiercdStage${status}`,
    envIdentifier: `environmentIdentifiercdStage${status}`
  }
}

export const getParallelStages = (uniqueId: string, statusAr: Status[]): ParallelStageExecutionSummaryDTO => {
  return {
    stageExecutions: statusAr.map((status, index) => ({ stage: getStage(uniqueId + index, status) }))
  }
}

const statusAr = [
  'NOT_STARTED',
  'NOT_STARTED',
  ['NOT_STARTED', 'NOT_STARTED'],
  'NOT_STARTED',
  'NOT_STARTED',
  ['NOT_STARTED', 'NOT_STARTED'],
  'NOT_STARTED'
]

let i = 1

export const getPipelineExecutionMock = (): ResponsePipelineExecutionDetail => mock as any
export const getPipelineExecutionDetails = (): ResponsePipelineExecutionDetail => {
  i++
  if (i % 2 == 0) {
    const status = statusAr[i / 2]
    if (Array.isArray(status)) {
      statusAr[i / 2] = status.map(() => 'RUNNING')
    } else if (status) {
      statusAr[i / 2] = 'RUNNING'
    }
    const prevStatus = statusAr[i / 2 - 1]
    if (Array.isArray(prevStatus)) {
      statusAr[i / 2 - 1] = prevStatus.map(() => 'SUCCESS')
    } else if (prevStatus) {
      statusAr[i / 2 - 1] = 'SUCCESS'
    }
  }
  return {
    status: 'SUCCESS',
    data: {
      pipelineExecution: {
        pipelineIdentifier: 'dummyPipelineIdentifier',
        pipelineName: 'dummyPipeline',
        planExecutionId: 'planExecutionId',
        executionStatus: 'RUNNING',
        startedAt: 0,
        endedAt: 10,
        triggeredBy: {
          name: 'admin'
        },
        triggerType: 'MANUAL',
        stageExecutionSummaryElements: statusAr.map((status, index) => {
          if (Array.isArray(status)) {
            return { parallel: getParallelStages(index.toString(), status as Status[]) }
          }

          return {
            stage: getStage(index.toString(), status as Status)
          }
        }),
        stageIdentifiers: ['stageIdentifier'],
        serviceIdentifiers: ['ServiceIdentifier1'],
        envIdentifiers: [],
        serviceDefinitionTypes: ['Kubernetes'],
        successfulStagesCount: 0,
        runningStagesCount: 0,
        failedStagesCount: 0
      },
      stageGraph: mock.data.stageGraph as any
    }
  }
}

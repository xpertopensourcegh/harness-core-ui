import type {
  ResponsePipelineExecutionDetail,
  StageExecutionSummaryDTO,
  PipelineExecutionSummaryDTO
} from 'services/cd-ng'

export type ExecutionStatus = Required<PipelineExecutionSummaryDTO>['executionStatus'] | 'Error'

export function getPipelineStagesMap(res: ResponsePipelineExecutionDetail): Map<string, StageExecutionSummaryDTO> {
  const map = new Map<string, StageExecutionSummaryDTO>()

  function recursiveSetInMap(stages: StageExecutionSummaryDTO[]): void {
    stages.forEach(({ stage, parallel }) => {
      if (parallel && Array.isArray(parallel.stageExecutions)) {
        recursiveSetInMap(parallel.stageExecutions)
        return
      }

      map.set(stage.stageIdentifier, stage)
    })
  }

  recursiveSetInMap(res?.data?.pipelineExecution?.stageExecutionSummaryElements || [])

  return map
}

export function isExecutionComplete(status?: ExecutionStatus): boolean {
  return (
    status === 'Aborted' ||
    status === 'Expired' ||
    status === 'Failed' ||
    status === 'Success' ||
    status === 'Suspended' ||
    status === 'Error'
  )
}

export function isExecutionInProgress(status?: ExecutionStatus): boolean {
  return status === 'Paused' || status === 'Running' || status === 'Waiting' || status === 'Queued'
}

export function isExecutionRunning(status?: ExecutionStatus): boolean {
  return status === 'Running'
}

export function isExecutionPaused(status?: ExecutionStatus): boolean {
  return status === 'Paused'
}

export function isExecutionNotStarted(status?: ExecutionStatus): boolean {
  return status === 'NotStarted'
}

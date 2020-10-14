import type {
  ResponsePipelineExecutionDetail,
  StageExecutionSummaryDTO,
  PipelineExecutionSummaryDTO,
  ExecutionGraph
} from 'services/cd-ng'

export interface ExecutionPathParams {
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string
  executionIdentifier: string
  accountId: string
}

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
  return isExecutionSuccess(status) || isExecutionErrored(status)
}

export function isExecutionErrored(status?: ExecutionStatus): boolean {
  return (
    status === 'Aborted' || status === 'Expired' || status === 'Failed' || status === 'Suspended' || status === 'Error'
  )
}

export function isExecutionInProgress(status?: ExecutionStatus): boolean {
  return (
    isExecutionPaused(status) ||
    isExecutionRunning(status) ||
    isExecutionNotStarted(status) ||
    status === 'Waiting' ||
    status === 'Queued'
  )
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

export function isExecutionSuccess(status?: ExecutionStatus): boolean {
  return status === 'Success'
}

export function getRunningStageForPipeline(
  stages: StageExecutionSummaryDTO[],
  pipelineExecutionStatus?: ExecutionStatus
): string | null {
  const n = stages.length

  // for completed pipeline, select the last completed stage
  if (isExecutionSuccess(pipelineExecutionStatus)) {
    const stage = stages[stages.length - 1]

    if (stage.stage) {
      return stage.stage.stageIdentifier
    } else if (
      stage.parallel &&
      Array.isArray(stage.parallel.stageExecutions) &&
      stage.parallel.stageExecutions[0]?.stage
    ) {
      return stage.parallel.stageExecutions[0].stage.stageIdentifier
    }

    return null
  }

  // for errored pipeline, select the errored stage
  if (isExecutionErrored(pipelineExecutionStatus)) {
    for (let i = stages.length - 1; i >= 0; i--) {
      const stage = stages[i]
      if (stage.stage) {
        if (isExecutionErrored(stage.stage.executionStatus)) {
          return stage.stage.stageIdentifier
        } else {
          continue
        }
      } else if (stage.parallel && Array.isArray(stage.parallel.stageExecutions)) {
        return stage.parallel.stageExecutions[0].stage.stageIdentifier
      }
    }
  }

  // find the current running stage
  for (let i = 0; i < n; i++) {
    const stage = stages[i]

    // for normal stage
    if (stage.stage) {
      if (isExecutionRunning(stage.stage.executionStatus)) {
        return stage.stage.stageIdentifier
      } else {
        continue
      }
      // for parallel stage
    } else if (stage.parallel && Array.isArray(stage.parallel.stageExecutions)) {
      const activeStage = getRunningStageForPipeline(stage.parallel.stageExecutions, pipelineExecutionStatus)

      if (activeStage) {
        return activeStage
      }
    }
  }

  return null
}

export function getRunningStep(graph: ExecutionGraph, nodeId?: string): string | null {
  const { rootNodeId, nodeMap, nodeAdjacencyListMap } = graph

  if (!nodeMap || !nodeAdjacencyListMap) {
    return null
  }

  const currentNodeId = nodeId || rootNodeId

  if (!currentNodeId) return null

  const node = nodeMap[currentNodeId]
  const nodeAdjacencyList = nodeAdjacencyListMap[currentNodeId]

  if (Array.isArray(nodeAdjacencyList.children) && nodeAdjacencyList.children.length > 0) {
    const n = nodeAdjacencyList.children.length

    for (let i = 0; i < n; i++) {
      const childNodeId = nodeAdjacencyList.children[i]
      const step = getRunningStep(graph, childNodeId)

      if (typeof step === 'string') return step
    }
  }

  if (nodeAdjacencyList.nextIds && nodeAdjacencyList.nextIds[0]) {
    const step = getRunningStep(graph, nodeAdjacencyList.nextIds[0])

    if (typeof step === 'string') return step
  }

  if (isExecutionRunning(node.status)) {
    return currentNodeId
  }

  return null
}

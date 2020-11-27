import type { ResponsePipelineExecutionDetail, StageExecutionSummaryDTO, ExecutionGraph } from 'services/cd-ng'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { isExecutionSuccess, isExecutionCompletedWithBadState, isExecutionRunning } from '@pipeline/utils/statusHelpers'

export interface ExecutionPathParams {
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string
  executionIdentifier: string
  accountId: string
}

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
  }

  // for errored pipeline, select the errored stage
  if (isExecutionCompletedWithBadState(pipelineExecutionStatus)) {
    for (let i = stages.length - 1; i >= 0; i--) {
      const stage = stages[i]

      if (stage.stage) {
        if (isExecutionCompletedWithBadState(stage.stage.executionStatus)) {
          return stage.stage.stageIdentifier
        } else {
          continue
        }
      } else if (stage.parallel && Array.isArray(stage.parallel.stageExecutions)) {
        const erorredStage = getRunningStageForPipeline(stage.parallel.stageExecutions, pipelineExecutionStatus)

        /* istanbul ignore else */
        if (erorredStage) {
          return erorredStage
        }
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

      /* istanbul ignore else */
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

  if (!node || !nodeAdjacencyList) {
    return null
  }

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

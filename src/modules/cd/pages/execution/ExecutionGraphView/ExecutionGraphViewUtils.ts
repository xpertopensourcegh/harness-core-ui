import type { StageExecutionSummaryDTO, ExecutionGraph } from 'services/cd-ng'

export function getRunningStage(stages: StageExecutionSummaryDTO[]): string | null {
  const n = stages.length

  for (let i = 0; i < n; i++) {
    const stage = stages[i]

    if (stage.CDStage) {
      if (stage.CDStage.pipelineExecutionStatus === 'RUNNING') {
        return stage.CDStage.stageIdentifier
      } else {
        continue
      }
    } else if (stage.parallel && Array.isArray(stage.parallel.stageExecutions)) {
      const activeStage = getRunningStage(stage.parallel.stageExecutions)

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

  if (node.status === 'RUNNING') {
    return currentNodeId
  }

  return null
}

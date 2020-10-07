import type { IconName } from '@blueprintjs/core'
import { first } from 'lodash-es'
import type { Graph, GraphVertex } from 'modules/ci/services/GraphTypes'
import {
  ExecutionPipeline,
  ExecutionPipelineNode,
  ExecutionPipelineItem,
  ExecutionPipelineItemStatus,
  ExecutionPipelineNodeType
} from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'

// TODO: random icons used; replace them with right one
export enum MapStageTypeIconName {
  INTEGRATION_STAGE_STEP = 'integration',
  PUBLISH = 'publish-step',
  RUN = 'run-step',
  GIT_CLONE = 'git-clone-step',
  SAVE_CACHE = 'save-cache-step',
  RESTORE_CACHE = 'restore-cache-step'
}

export interface StatusCounter {
  success: number
  running: number
  failed: number
}

/**
 * Count success/running/failed stages
 */
export const getStagesStatusesCounter = (nodes: ExecutionPipelineNode<GraphVertex>[]): StatusCounter => {
  let statusCounter = {
    success: 0,
    running: 0,
    failed: 0
  }

  nodes.forEach(node => {
    statusCounter = node.parallel
      ? countStagesStatuses(node.parallel, statusCounter)
      : countStagesStatuses([node], statusCounter)
  })

  return statusCounter
}

const countStagesStatuses = (nodes: ExecutionPipelineNode<GraphVertex>[], counter: StatusCounter): StatusCounter => {
  const retCounter = { ...counter }
  nodes.forEach(node => {
    const statusType = getGeneralStatusType(node.item?.status)
    retCounter.success += statusType === 'SUCCESS' ? 1 : 0
    retCounter.failed += statusType === 'ERROR' ? 1 : 0
    retCounter.running += statusType === 'RUNNING' ? 1 : 0
  })

  return retCounter
}

const getGeneralStatusType = (
  status: ExecutionPipelineItemStatus | undefined
): 'SUCCESS' | 'ERROR' | 'RUNNING' | 'UNDEFINED' => {
  switch (status) {
    case ExecutionPipelineItemStatus.SUCCESS:
    case ExecutionPipelineItemStatus.SUCCEEDED:
      return 'SUCCESS'
    case ExecutionPipelineItemStatus.FAILED:
    case ExecutionPipelineItemStatus.ABORTED:
    case ExecutionPipelineItemStatus.ERROR:
    case ExecutionPipelineItemStatus.REJECTED:
      return 'ERROR'
    case ExecutionPipelineItemStatus.RUNNING:
    case ExecutionPipelineItemStatus.PAUSED:
    case ExecutionPipelineItemStatus.PAUSING:
    case ExecutionPipelineItemStatus.WAITING:
    case ExecutionPipelineItemStatus.ABORTING:
      return 'RUNNING'
  }

  return 'UNDEFINED'
}

/**
 * Get stage icon depend on stage type
 */
export function stageType2IconName(stageType: string): IconName {
  // TODO: random icons used; replace them with right one
  const defaultIconName = 'star'
  const iconName = MapStageTypeIconName[stageType as keyof typeof MapStageTypeIconName]

  return (iconName ? iconName : defaultIconName) as IconName
}

export function getDefaultSelectionFromExecutionPipeline<T>(pipeline: ExecutionPipeline<T>) {
  // TODO: iterate thoughts parallel stages

  return {
    defaultSelectedStageIdentifier: first(pipeline.items)?.item?.identifier || '-1',
    defaultSelectedStepIdentifier: first(first(pipeline.items)?.item?.pipeline?.items)?.item?.identifier || '-1'
  }
}

export function getFirstItemIdFromExecutionPipeline<T>(pipeline: ExecutionPipeline<T>): string {
  if (pipeline.items[0].parallel) {
    return pipeline.items[0].parallel[0].item?.identifier || '-1'
  } else {
    return pipeline.items[0].item?.identifier || '-1'
  }
}

/**
 * Return empty ExecutionPipeline
 */

export function getEmptyExecutionPipeline(): ExecutionPipeline<GraphVertex> {
  return { items: [], identifier: '' }
}

/**
 * Create ExecutionPipeline from Graph model (API2UI model)
 */
export function graph2ExecutionPipeline(graph: Graph): ExecutionPipeline<GraphVertex> {
  const pipeline: ExecutionPipeline<GraphVertex> = {
    items: [],
    identifier: ''
  }

  // TODO: might be case that graph?.rootNodeIds contains ids for parallel stages
  const rootNodeId: string | undefined = first(graph?.rootNodeIds)
  if (!rootNodeId) {
    return pipeline
  }

  pipeline.identifier = rootNodeId

  // first level
  const rootEdgeList = graph.adjacencyList.adjacencyMap[rootNodeId]

  rootEdgeList.edges.forEach((edgeId: string) => {
    // second level
    const stagesRootEdgeList = graph.adjacencyList.adjacencyMap[edgeId]

    stagesRootEdgeList.edges.forEach((stageEdgeId: string) => {
      const vertex = graph.adjacencyList.graphVertexMap[stageEdgeId]

      const stageItem: ExecutionPipelineItem<GraphVertex> = {
        identifier: vertex.uuid,
        name: vertex.name,
        type: ExecutionPipelineNodeType.NORMAL,
        status: ExecutionPipelineItemStatus[vertex.status as keyof typeof ExecutionPipelineItemStatus],
        icon: stageType2IconName(vertex.stepType),
        data: vertex
      }

      // add stage node
      const stageNode: ExecutionPipelineNode<GraphVertex> = { item: stageItem }
      pipeline.items.push(stageNode)

      // add steps pipeline
      const stepsPipeline: ExecutionPipeline<GraphVertex> = {
        items: [],
        identifier: ''
      }

      // get first step
      const stepsRootId = first(graph.adjacencyList.adjacencyMap[stageEdgeId]?.edges) as string
      const nextId = first(graph.adjacencyList.adjacencyMap[stepsRootId]?.edges) as string
      let next = graph.adjacencyList.graphVertexMap[nextId]

      while (next) {
        //TODO: do not add LITE_ENGINE_TASK - solution for demo
        if (next.stepType !== 'LITE_ENGINE_TASK') {
          //parallel steps
          if (next.stepType === 'FORK') {
            const parallelStepsNode: ExecutionPipelineNode<GraphVertex> = {
              parallel: []
            }
            stepsPipeline.items.push(parallelStepsNode)

            // populate parallel steps
            const nextIds = graph.adjacencyList.adjacencyMap[next.uuid]?.edges as string[]
            nextIds.forEach(parallelId => {
              const parallelVertex = graph.adjacencyList.graphVertexMap[parallelId]
              addStepToArray(parallelVertex, parallelStepsNode.parallel as ExecutionPipelineNode<GraphVertex>[])
            })
          } else {
            addStepToArray(next, stepsPipeline.items)
          }
        }

        // set next
        const _nextId = first(graph.adjacencyList.adjacencyMap[next.uuid]?.nextIds) as string
        next = graph.adjacencyList.graphVertexMap[_nextId]
      }

      if (stageNode.item) {
        stageNode.item.pipeline = stepsPipeline
      }
    })
  })

  return pipeline
}

function addStepToArray(vertex: GraphVertex, arr: ExecutionPipelineNode<GraphVertex>[]): void {
  const stepItem: ExecutionPipelineItem<GraphVertex> = {
    identifier: vertex.uuid,
    name: vertex.name,
    type: ExecutionPipelineNodeType.NORMAL,
    status: ExecutionPipelineItemStatus[vertex.status as keyof typeof ExecutionPipelineItemStatus],
    icon: stageType2IconName(vertex.stepType),
    data: vertex
  }
  // add step node
  const stepNode: ExecutionPipelineNode<GraphVertex> = { item: stepItem }
  arr.push(stepNode)
}

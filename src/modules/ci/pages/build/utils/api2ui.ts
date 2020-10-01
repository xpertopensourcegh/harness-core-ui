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
    defaultSelectedStageIdentifier: pipeline.items[0].item?.identifier || '-1',
    defaultSelectedStepIdentifier: pipeline.items[0].item?.pipeline?.items[0].item?.identifier || '-1'
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
 * Create ExecutionPipeline from Graph model (API2UI model)
 */
export function graph2ExecutionPipeline(graph: Graph): ExecutionPipeline<GraphVertex> {
  const pipeline: ExecutionPipeline<GraphVertex> = {
    items: []
  }

  // 1. iterate to populate all stages
  first(graph?.graphVertex.subgraph?.vertices)?.subgraph?.vertices?.forEach(vertex => {
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
      items: []
    }

    let next = first(first(vertex.subgraph?.vertices)?.subgraph?.vertices) as GraphVertex | undefined
    while (next) {
      //TODO: do not add LITE_ENGINE_TASK - solution for demo
      if (next.stepType !== 'LITE_ENGINE_TASK') {
        //parallel
        if (next.stepType === 'FORK') {
          const parallelStepsNode: ExecutionPipelineNode<GraphVertex> = {
            parallel: []
          }
          stepsPipeline.items.push(parallelStepsNode)
          next.subgraph?.vertices?.forEach(parallelVertex => {
            addStepToArray(parallelVertex, parallelStepsNode.parallel as ExecutionPipelineNode<GraphVertex>[])
          })
        } else {
          addStepToArray(next, stepsPipeline.items)
        }
      }

      // set next
      next = next.next
    }
    if (stageNode.item) {
      stageNode.item.pipeline = stepsPipeline
    }
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

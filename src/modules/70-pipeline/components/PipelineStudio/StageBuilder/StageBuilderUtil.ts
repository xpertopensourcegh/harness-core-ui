import { flatMap, findIndex } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import type { NodeModelListener, LinkModelListener, DiagramEngine } from '@projectstorm/react-diagrams-core'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import type { Diagram } from '@pipeline/exports'
import { EmptyStageName } from '../PipelineConstants'
import type { PipelineContextInterface, StagesMap } from '../PipelineContext/PipelineContext'

export interface StageState {
  isConfigured: boolean
  stage: StageElementWrapper
}

export interface PopoverData {
  data?: StageElementWrapper
  isStageView: boolean
  groupStages?: StageElementWrapper[]
  isGroupStage?: boolean
  stagesMap: StagesMap
  groupSelectedStageId?: string
  isParallel?: boolean
  event?: Diagram.DefaultNodeEvent
  addStage?: (newStage: StageElementWrapper, isParallel?: boolean, event?: Diagram.DefaultNodeEvent) => void
  onSubmitPrimaryData?: (values: StageElementWrapper, identifier: string) => void
  onClickGroupStage?: (stageId: string, type: string) => void
  renderPipelineStage: PipelineContextInterface['renderPipelineStage']
}

export const getNewStageFromType = (type: string): StageElementWrapper => {
  // TODO: replace string with type
  if (type === 'ci') {
    return {
      stage: {
        name: EmptyStageName,
        identifier: uuid(),
        description: '',
        type: type,
        spec: {
          execution: {},
          dependencies: []
        }
      }
    }
  }

  return {
    stage: {
      name: EmptyStageName,
      identifier: uuid(),
      description: '',
      type: type,
      spec: {}
    }
  }
}

export interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
}

export const EmptyNodeSeparator = '$node$'

export const getCommonStyles = (isSelected: boolean): React.CSSProperties => ({
  backgroundColor: isSelected ? 'var(--pipeline-selected-node)' : 'var(--white)',
  borderColor: isSelected ? 'var(--diagram-selected)' : 'var(--pipeline-grey-border)',
  borderWidth: isSelected ? '2px' : '1px'
})

export const getStageFromPipeline = (
  data: NgPipeline | StageElementWrapper,
  identifier: string
): { stage: StageElementWrapper | undefined; parent: StageElementWrapper | undefined } => {
  let stage: StageElementWrapper | undefined = undefined
  let parent: StageElementWrapper | undefined = undefined
  data.stages?.forEach((node: StageElementWrapper) => {
    if (!stage) {
      if (node?.stage?.identifier === identifier) {
        stage = node
      } else if (node?.parallel) {
        stage = getStageFromPipeline({ stages: node.parallel }, identifier).stage
        if (stage) {
          parent = node
        }
      }
    }
  })

  return { stage, parent }
}

export const getStageIndexFromPipeline = (data: StageElementWrapper, identifier: string): { index: number } => {
  let _index = 0

  let stages = []
  stages = flatMap(data.stages, (n: StageElementWrapper) => {
    const k = []
    if (n.parallel) {
      k.push(...n['parallel'])
    } else {
      k.push(n)
    }
    return k
  })

  _index = findIndex(stages, o => o.stage.identifier === identifier)
  return { index: _index }
}

export const getPrevoiusStageFromIndex = (
  data: StageElementWrapper
): {
  stages: StageElementWrapper[]
} => {
  let stages = []
  stages = flatMap(data.stages, (n: StageElementWrapper) => {
    const k = []
    if (n.parallel) {
      k.push(...n['parallel'])
    } else {
      k.push(n)
    }
    return k
  })
  return { stages }
}

export const removeNodeFromPipeline = (
  data: NgPipeline | StageElementWrapper,
  stageMap: Map<string, StageState>,
  identifier: string,
  updateStateMap = true
): boolean => {
  const { stage: node, parent } = getStageFromPipeline(data, identifier)
  if (node && data.stages) {
    const index = data.stages.indexOf(node)
    if (index > -1) {
      data?.stages?.splice(index, 1)
      updateStateMap && stageMap.delete(node.stage.identifier)
      return true
    } else if (parent?.parallel) {
      const parallelIndex = parent.parallel?.indexOf(node)
      if (parallelIndex > -1) {
        parent.parallel.splice(parallelIndex, 1)
        if (parent.parallel.length === 0) {
          const emptyParallel = data?.stages?.indexOf(parent)
          if (emptyParallel && emptyParallel > -1) {
            data?.stages?.splice(emptyParallel, 1)
          }
        }
        updateStateMap && stageMap.delete(node.stage.identifier)
        return true
      }
    }
  }
  return false
}

export const resetDiagram = (engine: DiagramEngine): void => {
  engine.getModel().setZoomLevel(100)
  engine.getModel().setOffset(0, 0)
  engine.repaintCanvas()
}

import { v4 as uuid } from 'uuid'
import type { IconName } from '@wings-software/uikit'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import type { StageElement, StageElementWrapper, CDPipeline, DeploymentStage } from 'services/cd-ng'
import type { Diagram } from 'modules/common/exports'
import { EmptyStageName } from '../PipelineConstants'

export enum StageType {
  DEPLOY = 'Deployment',
  APPROVAL = 'Approval',
  PIPELINE = 'Pipeline',
  CUSTOM = 'Custom'
}

export const MapStepTypeToIcon: { [key in StageType]: IconName } = {
  Deployment: 'pipeline-deploy',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

export interface PopoverData {
  data?: StageElementWrapper
  isStageView: boolean
  groupStages?: StageElementWrapper[]
  isGroupStage?: boolean
  groupSelectedStageId?: string
  isParallel?: boolean
  event?: Diagram.DefaultNodeEvent
  addStage?: (type: StageType, isParallel?: boolean, event?: Diagram.DefaultNodeEvent) => void
  onSubmitPrimaryData?: (values: StageElementWrapper, identifier: string) => void
  onClickGroupStage?: (stageId: string) => void
}

export const getNewStageFromType = (type: StageType): StageElement => {
  return {
    name: EmptyStageName,
    identifier: uuid(),
    description: '',
    type: type
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
  data: CDPipeline | StageElementWrapper,
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

export const getTypeOfStage = (stage: StageElement): { type: StageType; stage: DeploymentStage | StageElement } => {
  if (stage.type === StageType.DEPLOY) {
    return { type: StageType.DEPLOY, stage: stage as DeploymentStage }
  } else if (stage.type === StageType.APPROVAL) {
    return { type: StageType.APPROVAL, stage }
  } else if (stage.type === StageType.PIPELINE) {
    return { type: StageType.PIPELINE, stage }
  }
  return { type: StageType.CUSTOM, stage }
}

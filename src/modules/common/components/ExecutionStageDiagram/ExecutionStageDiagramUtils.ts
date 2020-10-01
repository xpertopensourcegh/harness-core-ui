import { Color, IconName } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import type { DefaultNodeModel } from 'modules/common/components/Diagram'
import type { Diagram } from 'modules/common/exports'
import { ExecutionPipelineItemStatus, ExecutionPipeline, ExecutionPipelineItem } from './ExecutionPipelineModel'

export const getNodeStyles = (isSelected: boolean): React.CSSProperties => {
  const style = {} as React.CSSProperties

  style.borderColor = 'var(--pipeline-grey-border)'
  style.borderWidth = '1px'
  style.borderStyle = 'none'

  if (isSelected) {
    style.borderColor = 'var(--diagram-selected)'
    style.background = 'var(--execution-pipeline-selected-node-bg)'
    style.borderWidth = isSelected ? '2px' : '1px'
    style.borderStyle = isSelected ? 'solid' : 'none'
  }

  return style
}

export const getStatusProps = (
  status: ExecutionPipelineItemStatus
): {
  secondaryIcon?: IconName
  secondaryIconProps?: Omit<IconProps, 'name'>
  secondaryIconStyle?: React.CSSProperties
} => {
  const secondaryIconStyle: React.CSSProperties = { top: -7, right: -7 }
  let secondaryIcon: IconName | undefined = undefined
  const secondaryIconProps: Omit<IconProps, 'name'> = { size: 16 }
  if (status) {
    switch (status) {
      case ExecutionPipelineItemStatus.FAILED:
        secondaryIcon = 'main-warning'
        secondaryIconProps.color = Color.RED_450
        break
      case ExecutionPipelineItemStatus.SUCCESS:
      case ExecutionPipelineItemStatus.SUCCEEDED:
        secondaryIcon = 'tick-circle'
        secondaryIconProps.color = Color.GREEN_450
        break
      case ExecutionPipelineItemStatus.RUNNING:
        secondaryIcon = 'spinner'
        break
      case ExecutionPipelineItemStatus.ABORTED:
        secondaryIcon = 'deployment-aborted-new'
        break
      case ExecutionPipelineItemStatus.PAUSED:
      case ExecutionPipelineItemStatus.PAUSING:
        secondaryIcon = 'deployment-paused-legacy'
        break
      default:
        break
    }
  }
  return { secondaryIconStyle, secondaryIcon, secondaryIconProps }
}

export const getStageFromExecutionPipeline = <T>(
  data: ExecutionPipeline<T>,
  identifier = '-1'
): ExecutionPipelineItem<T> | undefined => {
  let stage: ExecutionPipelineItem<T> | undefined = undefined
  data.items?.forEach(node => {
    if (!stage) {
      if (node?.item?.identifier === identifier) {
        stage = node?.item
      } else if (node?.parallel) {
        stage = getStageFromExecutionPipeline({ items: node.parallel }, identifier)
      } else if (node?.group) {
        stage = getStageFromExecutionPipeline({ items: node.group.items }, identifier)
      }
    }
  })

  return stage
}

export const getStageFromDiagramEvent = <T>(
  event: Diagram.DefaultNodeEvent,
  data: ExecutionPipeline<T>
): ExecutionPipelineItem<T> | undefined => {
  const entity = event.entity as DefaultNodeModel
  const id = entity.getOptions().identifier
  const stage = getStageFromExecutionPipeline(data, id)
  return stage
}

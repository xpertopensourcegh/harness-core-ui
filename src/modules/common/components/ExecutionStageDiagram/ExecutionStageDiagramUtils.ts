import type { DefaultNodeModel } from 'modules/common/components/Diagram'
import type { Diagram } from 'modules/common/exports'
import { ExecutionPipelineItemStatus, ExecutionPipeline, ExecutionPipelineItem } from './ExecutionPipelineModel'

export const getNodeStyles = (isSelected: boolean, stageState: ExecutionPipelineItemStatus): React.CSSProperties => {
  const style = {} as React.CSSProperties

  style.borderColor = 'var(--pipeline-grey-border)'
  style.borderWidth = '1px'
  style.borderStyle = 'none'

  switch (stageState) {
    case ExecutionPipelineItemStatus.FAILED:
      style.backgroundColor = 'var(--execution-pipeline-status-failed-bg)'
      break
    case ExecutionPipelineItemStatus.SUCCESS:
    case ExecutionPipelineItemStatus.SUCCEEDED:
      style.backgroundColor = 'var(--execution-pipeline-status-success-bg)'
      break
    case ExecutionPipelineItemStatus.RUNNING:
      style.backgroundColor = 'var(--execution-pipeline-status-running-bg)'
      break
    default:
      break
  }

  if (isSelected) {
    style.borderColor = 'var(--diagram-selected)'
    style.borderWidth = isSelected ? '2px' : '1px'
    style.borderStyle = isSelected ? 'solid' : 'none'
  }

  return style
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

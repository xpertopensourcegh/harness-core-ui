import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { Color, IconName } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import { ExecutionPipelineItemStatus, ExecutionPipeline, ExecutionPipelineItem } from './ExecutionPipelineModel'
import * as Diagram from '../Diagram'
import type { DefaultNodeModel } from '../Diagram'
import css from './ExecutionStageDiagram.module.scss'

export const getNodeStyles = (isSelected: boolean, status: ExecutionPipelineItemStatus): React.CSSProperties => {
  const style = {} as React.CSSProperties

  style.borderColor = 'var(--execution-pipeline-color-grey)'
  style.borderWidth = '2px'
  style.borderStyle = 'solid'

  if (status) {
    switch (status) {
      case ExecutionPipelineItemStatus.SUCCESS:
      case ExecutionPipelineItemStatus.SUCCEEDED:
        style.borderColor = 'var(--execution-pipeline-color-blue)'
        style.backgroundColor = isSelected ? 'var(--execution-pipeline-color-blue)' : 'var(--white)'
        break
      case ExecutionPipelineItemStatus.RUNNING:
        style.borderColor = 'var(--execution-pipeline-color-blue)'
        style.backgroundColor = isSelected ? 'var(--blue-600)' : 'var(--white)'
        break
      case ExecutionPipelineItemStatus.PAUSED:
      case ExecutionPipelineItemStatus.ROLLBACK:
        style.borderColor = 'var(--execution-pipeline-color-orange)'
        style.backgroundColor = isSelected ? 'var(--execution-pipeline-color-orange)' : 'var(--white)'
        break
      case ExecutionPipelineItemStatus.WAITING:
        style.backgroundColor = isSelected ? 'var(--execution-pipeline-color-blue)' : 'var(--white)'
        break
      case ExecutionPipelineItemStatus.NOT_STARTED:
        style.borderColor = 'var(--execution-pipeline-color-dark-grey)'
        style.backgroundColor = 'var(--white)'
        break
      case ExecutionPipelineItemStatus.ABORTED:
        style.borderColor = 'var(--execution-pipeline-color-dark-grey2)'
        style.backgroundColor = isSelected ? 'var(--execution-pipeline-color-dark-grey2)' : 'var(--white)'
        break
      case ExecutionPipelineItemStatus.ERROR:
      case ExecutionPipelineItemStatus.FAILED:
        style.borderColor = 'var(--execution-pipeline-color-dark-red)'
        style.backgroundColor = isSelected ? 'var(--execution-pipeline-color-red)' : 'var(--white)'
        break
      default:
        break
    }
  }

  return style
}

export const getArrowsColor = (status: ExecutionPipelineItemStatus, isParallel = false): string => {
  if (status === ExecutionPipelineItemStatus.NOT_STARTED) {
    return 'var(--execution-pipeline-color-arrow-not-started)'
  } else if (isParallel && status === ExecutionPipelineItemStatus.RUNNING) {
    return 'var(--execution-pipeline-color-arrow-not-started)'
  } else {
    return 'var(--execution-pipeline-color-arrow-complete)'
  }
}

export const getStatusProps = (
  status: ExecutionPipelineItemStatus
): {
  secondaryIcon?: IconName
  secondaryIconProps: Omit<IconProps, 'name'>
  secondaryIconStyle: React.CSSProperties
} => {
  const secondaryIconStyle: React.CSSProperties = { top: -7, right: -7 }
  let secondaryIcon: IconName | undefined = undefined
  const secondaryIconProps: Omit<IconProps, 'name'> = { size: 16 }
  if (status) {
    switch (status) {
      case ExecutionPipelineItemStatus.FAILED:
      case ExecutionPipelineItemStatus.ERROR:
        secondaryIcon = 'execution-warning'
        secondaryIconProps.size = 20
        secondaryIconStyle.color = 'var(--execution-pipeline-color-dark-red)'
        secondaryIconStyle.animation = `${css.fadeIn} 1s`
        break
      case ExecutionPipelineItemStatus.SUCCESS:
      case ExecutionPipelineItemStatus.SUCCEEDED:
        secondaryIcon = 'execution-success'
        secondaryIconProps.color = Color.GREEN_450
        secondaryIconStyle.animation = `${css.fadeIn} 1s`
        break
      case ExecutionPipelineItemStatus.RUNNING:
        secondaryIconProps.color = Color.WHITE
        break
      case ExecutionPipelineItemStatus.ABORTED:
        secondaryIcon = 'execution-abort'
        secondaryIconStyle.animation = `${css.fadeIn} 1s`
        secondaryIconStyle.color = 'var(--execution-pipeline-color-dark-grey2)'
        break
      case ExecutionPipelineItemStatus.PAUSED:
      case ExecutionPipelineItemStatus.PAUSING:
        secondaryIcon = 'execution-input'
        secondaryIconStyle.animation = `${css.fadeIn} 1s`
        secondaryIconStyle.color = 'var(--execution-pipeline-color-orange)'
        break
      case ExecutionPipelineItemStatus.ROLLBACK:
        secondaryIcon = 'execution-rollback'
        secondaryIconProps.size = 20
        secondaryIconStyle.animation = `${css.fadeIn} 1s`
        secondaryIconStyle.color = 'var(--execution-pipeline-color-orange)'
        break
      default:
        break
    }
  }
  return { secondaryIconStyle, secondaryIcon: secondaryIcon, secondaryIconProps }
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
        stage = getStageFromExecutionPipeline({ items: node.parallel, identifier: '' }, identifier)
      } else if (node?.group) {
        stage = getStageFromExecutionPipeline({ items: node.group.items, identifier: '' }, identifier)
      }
    }
  })

  return stage
}

export interface GroupState<T> {
  data?: T
  collapsed: boolean
  name: string
  status: ExecutionPipelineItemStatus
  identifier: string
}

export const getGroupsFromData = <T>(data: ExecutionPipeline<T>): Map<string, GroupState<T>> => {
  const groupState = new Map<string, GroupState<T>>()
  data.items.forEach(node => {
    if (node.group) {
      groupState.set(node.group.identifier, {
        collapsed: false,
        name: node.group.name,
        status: node.group.status,
        identifier: node.group.identifier,
        data: node.group.data
      })
    } else if (node.item?.showInLabel) {
      groupState.set(node.item.identifier, {
        collapsed: false,
        name: node.item.name,
        status: node.item.status,
        identifier: node.item.identifier,
        data: node.item.data
      })
    }
  })
  return groupState
}

export const moveStageToFocus = (engine: DiagramEngine, identifier: string): void => {
  const model = engine.getModel() as Diagram.DiagramModel
  const layer = model.getGroupLayer(identifier) || model.getNodeFromId(identifier)
  const canvas = engine.getCanvas()
  if (layer && canvas) {
    const rect = canvas.getBoundingClientRect()
    let newOffsetX = 100
    if (layer instanceof Diagram.StepGroupNodeLayerModel) {
      newOffsetX = rect.width * 0.2 - layer.startNode.getPosition().x
    } else {
      newOffsetX = rect.width * 0.2 - layer.getPosition().x
    }
    const offsetY = engine.getModel().getOffsetY()
    engine.getModel().setOffset(newOffsetX, offsetY)
    engine.getModel().setZoomLevel(100)
    engine.repaintCanvas()
  }
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

export const getRunningNode = <T>(data: ExecutionPipeline<T>): ExecutionPipelineItem<T> | undefined => {
  let stage: ExecutionPipelineItem<T> | undefined = undefined
  data.items?.forEach(node => {
    if (!stage) {
      if (node?.item?.status === 'Running') {
        stage = node?.item
      } else if (node?.parallel) {
        stage = getRunningNode({ items: node.parallel, identifier: '' })
      } else if (node?.group) {
        stage = getRunningNode({ items: node.group.items, identifier: '' })
      }
    }
  })
  return stage
}

export const focusRunningNode = <T>(engine: DiagramEngine, data: ExecutionPipeline<T>): void => {
  const runningStage = getRunningNode(data)
  if (runningStage) {
    const node = (engine.getModel() as Diagram.DiagramModel).getNodeFromId(runningStage.identifier)
    const canvas = engine.getCanvas()
    if (canvas && node) {
      const rect = canvas.getBoundingClientRect()
      const nodePosition = node.getPosition()
      const nodeWidth = node.width
      if (rect.width < nodePosition.x + nodeWidth + 40) {
        const newOffsetX = (rect.width - node.width) * 0.8 - nodePosition.x
        const offsetY = engine.getModel().getOffsetY()
        engine.getModel().setOffset(newOffsetX, offsetY)
        engine.getModel().setZoomLevel(100)
        engine.repaintCanvas()
      }
    }
  }
}

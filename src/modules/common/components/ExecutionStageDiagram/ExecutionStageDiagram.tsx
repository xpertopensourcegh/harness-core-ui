import React from 'react'
import classNames from 'classnames'
import { noop } from 'lodash-es'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'
import { Diagram } from 'modules/common/exports'
import { CanvasButtons, CanvasButtonsActions } from 'modules/common/components/CanvasButtons/CanvasButtons'
import type { ExecutionPipeline, ExecutionPipelineItem } from './ExecutionPipelineModel'
import { ExecutionStageDiagramModel, GridStyleInterface, NodeStyleInterface } from './ExecutionStageDiagramModel'
import { focusRunningNode, getStageFromDiagramEvent } from './ExecutionStageDiagramUtils'
import css from './ExecutionStageDiagram.module.scss'

abstract class ItemEvent<T> extends Event {
  readonly stage: ExecutionPipelineItem<T>
  readonly stageTarget: HTMLElement

  constructor(eventName: string, stage: ExecutionPipelineItem<T>, target: HTMLElement) {
    super(eventName)
    this.stage = stage
    this.stageTarget = target
  }
}

export class ItemClickEvent<T> extends ItemEvent<T> {
  constructor(stage: ExecutionPipelineItem<T>, target: HTMLElement) {
    super('ItemClickEvent', stage, target)
  }
}

export class ItemMouseEnterEvent<T> extends ItemEvent<T> {
  constructor(stage: ExecutionPipelineItem<T>, target: HTMLElement) {
    super('ItemMouseEnterEvent', stage, target)
  }
}

export class ItemMouseLeaveEvent<T> extends ItemEvent<T> {
  constructor(stage: ExecutionPipelineItem<T>, target: HTMLElement) {
    super('ItemMouseLeaveEvent', stage, target)
  }
}

export interface ExecutionStageDiagramProps<T> {
  /** pipeline definition */
  data?: ExecutionPipeline<T>
  /** selected item id */
  selectedIdentifier: string // TODO: 1. add node style for each type/shape 2. add default value
  /** node style  */
  nodeStyle?: NodeStyleInterface
  /** grid style */
  gridStyle: GridStyleInterface
  showStartEndNode?: boolean // Default: true
  diagramContainerHeight?: number
  itemClickHandler?: (event: ItemClickEvent<T>) => void
  itemMouseEnter?: (event: ItemMouseEnterEvent<T>) => void
  itemMouseLeave?: (event: ItemMouseLeaveEvent<T>) => void
  canvasListener?: (action: CanvasButtonsActions) => void
  isWhiteBackground?: boolean // Default: false
  className?: string
  canvasBtnsClass?: string
}

export default function ExecutionStageDiagram<T>(props: ExecutionStageDiagramProps<T>): React.ReactElement {
  const {
    data = { items: [], identifier: '' },
    className,
    selectedIdentifier,
    nodeStyle = { width: 50, height: 50 },
    gridStyle = {},
    diagramContainerHeight,
    showStartEndNode = true,
    itemClickHandler = noop,
    itemMouseEnter = noop,
    itemMouseLeave = noop,
    canvasListener = noop,
    isWhiteBackground = false,
    canvasBtnsClass = ''
  } = props

  const [autoPosition, setAutoPosition] = React.useState(true)

  const nodeListeners: NodeModelListener = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Diagram.Event.ClickNode]: (event: any) => {
      if (autoPosition) {
        setAutoPosition(false)
      }
      const stage = getStageFromDiagramEvent(event, data)
      if (stage) itemClickHandler(new ItemClickEvent(stage, event.target))
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Diagram.Event.MouseEnterNode]: (event: any) => {
      const stage = getStageFromDiagramEvent(event, data)
      if (stage) itemMouseEnter(new ItemMouseEnterEvent(stage, event.target))
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Diagram.Event.MouseLeaveNode]: (event: any) => {
      const stage = getStageFromDiagramEvent(event, data)
      if (stage) itemMouseLeave(new ItemMouseLeaveEvent(stage, event.target))
    }
  }

  //setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine({}), [])

  //setup the diagram model
  const model = React.useMemo(() => new ExecutionStageDiagramModel(), [])
  model.setDefaultNodeStyle(nodeStyle)
  model.setGridStyle(gridStyle)

  React.useEffect(() => {
    setAutoPosition(true)
  }, [data.identifier])
  //update
  model.addUpdateGraph<T>(
    data,
    { nodeListeners: nodeListeners, linkListeners: {}, layerListeners: {} },
    selectedIdentifier,
    diagramContainerHeight,
    showStartEndNode
  )

  //Load model into engine
  engine.setModel(model)

  autoPosition && focusRunningNode(engine, data)
  return (
    <div className={classNames(css.main, { [css.whiteBackground]: isWhiteBackground }, className)}>
      <Diagram.CanvasWidget engine={engine} className={css.canvas} />
      <CanvasButtons
        engine={engine}
        className={canvasBtnsClass}
        callback={action => {
          canvasListener(action)
        }}
      />
    </div>
  )
}

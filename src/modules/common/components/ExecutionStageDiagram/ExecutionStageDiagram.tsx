import React from 'react'
import classNames from 'classnames'
import { noop } from 'lodash-es'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener } from '@projectstorm/react-canvas-core'
import { Button, Layout } from '@wings-software/uikit'
import { Select } from '@blueprintjs/select'
import { Diagram } from 'modules/common/exports'
import { CanvasButtons, CanvasButtonsActions } from 'modules/common/components/CanvasButtons/CanvasButtons'
import type { ExecutionPipeline, ExecutionPipelineItem, StageOptions } from './ExecutionPipelineModel'
import { ExecutionStageDiagramModel, GridStyleInterface, NodeStyleInterface } from './ExecutionStageDiagramModel'
import {
  focusRunningNode,
  getGroupsFromData,
  getStageFromDiagramEvent,
  GroupState,
  moveStageToFocus
} from './ExecutionStageDiagramUtils'
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

const StageSelection = Select.ofType<StageOptions>()

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
  showStageSelection?: boolean // Default: false
  selectedStage?: StageOptions
  stageSelectionOptions?: StageOptions[]
  onChangeStageSelection?: (value: StageOptions) => void
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
    selectedStage,
    showStageSelection = false,
    stageSelectionOptions,
    onChangeStageSelection,
    isWhiteBackground = false,
    canvasBtnsClass = ''
  } = props

  const [autoPosition, setAutoPosition] = React.useState(true)

  const [groupStage, setGroupState] = React.useState<Map<string, GroupState<T>>>()

  React.useEffect(() => {
    const stageData = getGroupsFromData(data)
    if (stageData.size !== groupStage?.size) {
      setGroupState(stageData)
    }
  }, [data, groupStage?.size])

  const updateGroupStage = (event: Diagram.DefaultNodeEvent): void => {
    const group = groupStage?.get(event.entity.getIdentifier())
    if (group) {
      groupStage?.set(event.entity.getIdentifier(), {
        ...group,
        collapsed: !group.collapsed
      })
      setGroupState(groupStage)
    }
  }

  const nodeListeners: NodeModelListener = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Diagram.Event.ClickNode]: (event: any) => {
      if (autoPosition) {
        setAutoPosition(false)
      }
      const group = groupStage?.get(event.entity.getIdentifier())
      if (group) {
        updateGroupStage(event)
      } else {
        const stage = getStageFromDiagramEvent(event, data)
        if (stage) itemClickHandler(new ItemClickEvent(stage, event.target))
      }
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
  const layerListeners: BaseModelListener = {
    [Diagram.Event.StepGroupCollapsed]: (event: any) => updateGroupStage(event)
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
    { nodeListeners: nodeListeners, linkListeners: {}, layerListeners },
    selectedIdentifier,
    diagramContainerHeight,
    showStartEndNode,
    groupStage
  )

  //Load model into engine
  engine.setModel(model)

  autoPosition && focusRunningNode(engine, data)
  return (
    <div className={classNames(css.main, { [css.whiteBackground]: isWhiteBackground }, className)}>
      <Diagram.CanvasWidget engine={engine} className={css.canvas} />
      {showStageSelection && selectedStage && selectedStage?.value?.length > 0 && (
        <Layout.Horizontal spacing="xxlarge" className={css.stageSelection}>
          <StageSelection
            itemRenderer={(item, { handleClick, modifiers: { disabled } }) => (
              <div>
                <Button
                  icon={item.icon?.name}
                  text={item.label}
                  className={css.stageItem}
                  disabled={disabled}
                  minimal
                  onClick={e => handleClick(e as React.MouseEvent<HTMLElement, MouseEvent>)}
                />
              </div>
            )}
            itemDisabled={item => {
              return item.disabled ?? false
            }}
            itemPredicate={(query, item, _index, exactMatch) => {
              const normalizedValue = item.value.toLowerCase()
              const normalizedQuery = query.toLowerCase()
              if (exactMatch) {
                return normalizedValue === normalizedQuery
              } else {
                return normalizedValue.indexOf(normalizedQuery) > -1 || item.label.indexOf(normalizedQuery) > -1
              }
            }}
            items={stageSelectionOptions || []}
            onItemSelect={item => onChangeStageSelection?.(item)}
          >
            <Button round icon={selectedStage.icon?.name} text={selectedStage.label} rightIcon="caret-down" />
          </StageSelection>
          {groupStage && groupStage.size > 0 && (
            <div className={css.groupLabels}>
              {[...groupStage].map(item => (
                <span
                  onClick={e => {
                    e.currentTarget.classList.add(css.selectedLabel)
                    moveStageToFocus(engine, item[1].identifier)
                  }}
                  onAnimationEnd={e => {
                    e.currentTarget.classList.remove(css.selectedLabel)
                  }}
                  className={css.label}
                  key={item[0]}
                >
                  {item[1].name}
                </span>
              ))}
            </div>
          )}
        </Layout.Horizontal>
      )}
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

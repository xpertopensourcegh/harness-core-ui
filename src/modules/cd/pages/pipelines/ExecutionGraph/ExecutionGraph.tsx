import React, { useEffect } from 'react'
import { get } from 'lodash'
import { Drawer, Position } from '@blueprintjs/core'
// import { cloneDeep } from 'lodash'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener } from '@projectstorm/react-canvas-core'
import { v4 as uuid } from 'uuid'
import { Button } from '@wings-software/uikit'
import { Diagram, useToaster } from 'modules/common/exports'
import type { ExecutionWrapper, ExecutionElement } from 'services/cd-ng'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'
import { DynamicPopover, DynamicPopoverHandlerBinding } from 'modules/common/components/DynamicPopover/DynamicPopover'
import type { StepData } from 'modules/common/components/AbstractSteps/AbstractStepFactory'
import { ExecutionStepModel } from './ExecutionStepModel'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getStageFromPipeline } from '../StageBuilder/StageBuilderUtil'
import { StepPalette } from '../StepPalette/StepPalette'
import { StepCommands } from '../StepCommands/StepCommands'
import i18n from './ExecutionGraph.i18n'
import {
  addStepOrGroup,
  ExecutionGraphState,
  StepStateMap,
  StepState,
  getStepsState,
  removeStepOrGroup,
  isLinkUnderStepGroup,
  getStepFromNode
} from './ExecutionGraphUtil'
import { EmptyStageName } from '../PipelineConstants'
import css from './ExecutionGraph.module.scss'

interface PopoverData {
  event?: Diagram.DefaultNodeEvent
  isParallelNodeClicked?: boolean
  onPopoverSelection?: (isStepGroup: boolean, isParallelNodeClicked: boolean, event?: Diagram.DefaultNodeEvent) => void
}

const renderPopover = ({ onPopoverSelection, isParallelNodeClicked = false, event }: PopoverData): JSX.Element => {
  return (
    <>
      <div>
        <Button
          minimal
          icon="Edit"
          text={i18n.addStep}
          onClick={() => onPopoverSelection?.(false, isParallelNodeClicked, event)}
        />
      </div>
      <div>
        <Button
          minimal
          icon="step-group"
          text={i18n.addStepGroup}
          onClick={() => onPopoverSelection?.(true, isParallelNodeClicked, event)}
        />
      </div>
    </>
  )
}

const renderDrawerContent = (
  data: ExecutionWrapper[],
  entity: Diagram.DefaultNodeModel,
  stepStates: StepStateMap,
  isAddStepOverride: boolean,
  onSelect: (item: StepData) => void,
  onChange: (stepObj: ExecutionElement) => void
): JSX.Element => {
  const node = getStepFromNode(data, entity).node

  if (node && !isAddStepOverride) {
    return (
      <StepCommands
        step={node}
        onChange={onChange}
        isStepGroup={stepStates.get(node.identifier)?.isStepGroup || false}
      />
    )
  }
  return <StepPalette onSelect={onSelect} />
}

const ExecutionGraph = (): JSX.Element => {
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const [state, setState] = React.useState<ExecutionGraphState>({
    isDrawerOpen: false,
    data: [],
    isRollback: false,
    isAddStepOverride: false,
    isParallelNodeClicked: false,
    stepStates: new Map<string, StepState>()
  })

  const [dynamicPopoverHandler, setDynamicPopoverHandler] = React.useState<
    DynamicPopoverHandlerBinding<PopoverData> | undefined
  >()

  const { showError } = useToaster()

  const {
    state: {
      pipeline,
      isInitialized,
      pipelineView: { selectedStageId, isSetupStageOpen }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new ExecutionStepModel(), [])

  const onPopoverSelection = (
    isStepGroup: boolean,
    isParallelNodeClicked: boolean,
    event?: Diagram.DefaultNodeEvent
  ): void => {
    if (!isStepGroup && event) {
      setState(prevState => ({
        ...prevState,
        isDrawerOpen: true,
        entity: event.entity,
        isAddStepOverride: true,
        isParallelNodeClicked
      }))
    } else if (event?.entity) {
      addStepOrGroup(
        event.entity,
        state,
        {
          stepGroup: {
            name: EmptyStageName,
            identifier: uuid(),
            steps: []
          }
        },
        isParallelNodeClicked
      )
      updatePipeline(pipeline)
    }
    dynamicPopoverHandler?.hide()
  }

  const dropNodeListener = (event: any): void => {
    const eventTemp = event as Diagram.DefaultNodeEvent
    eventTemp.stopPropagation()
    if (event.node?.identifier) {
      const dropEntity = model.getNodeFromId(event.node.id)
      if (dropEntity) {
        const dropNode = getStepFromNode(state.data, dropEntity, true).node
        const current = getStepFromNode(state.data, eventTemp.entity, true, true)
        // Check Drop Node and Current node should not be same
        if (event.node.identifier !== eventTemp.entity.getIdentifier() && dropNode) {
          if (dropNode?.stepGroup && eventTemp.entity.getParent() instanceof Diagram.StepGroupNodeLayerModel) {
            showError(i18n.stepGroupInAnotherStepGroup)
          } else {
            const isRemove = removeStepOrGroup(state, dropEntity)
            if (isRemove) {
              if (current.node) {
                if (current.parent && (current.node.step || current.node.stepGroup)) {
                  const index = current.parent?.indexOf(current.node) ?? -1
                  if (index > -1) {
                    // Remove current Stage also and make it parallel
                    current.parent?.splice(index, 1, { parallel: [current.node, dropNode] })
                    updatePipeline(pipeline)
                  }
                } else if (current.node.parallel && current.node.parallel.length > 0) {
                  current.node.parallel.push(dropNode)
                  updatePipeline(pipeline)
                }
              } else {
                addStepOrGroup(eventTemp.entity, state, dropNode, false)
                updatePipeline(pipeline)
              }
            }
          }
        }
      }
    }
  }

  const nodeListeners: NodeModelListener = {
    [Diagram.Event.ClickNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      const stepState = state.stepStates.get(event.entity.getIdentifier())
      dynamicPopoverHandler?.hide()
      const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
      const layer = eventTemp.entity.getParent()
      if (eventTemp.entity.getType() === Diagram.DiagramType.CreateNew && nodeRender) {
        // if Node is in Step Group then directly show Add Steps
        if (layer instanceof Diagram.StepGroupNodeLayerModel) {
          setState(prevState => ({
            ...prevState,
            isDrawerOpen: true,
            entity: eventTemp.entity,
            isAddStepOverride: false,
            isParallelNodeClicked: false
          }))
        } else {
          dynamicPopoverHandler?.show(
            nodeRender,
            {
              event,
              isParallelNodeClicked: false,
              onPopoverSelection
            },
            { useArrows: true, darkMode: true }
          )
        }
      } else if (stepState && stepState.isStepGroupCollapsed) {
        const stepStates = state.stepStates.set(event.entity.getIdentifier(), {
          ...stepState,
          isStepGroupCollapsed: !stepState.isStepGroupCollapsed
        })
        setState(prev => ({ ...prev, stepStates }))
      } else {
        setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: eventTemp.entity }))
      }
    },
    [Diagram.Event.RemoveNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      dynamicPopoverHandler?.hide()
      const isRemoved = removeStepOrGroup(state, eventTemp.entity)
      if (isRemoved) {
        updatePipeline(pipeline)
      }
    },
    [Diagram.Event.AddParallelNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      const layer = eventTemp.entity.getParent()
      if (layer instanceof Diagram.StepGroupNodeLayerModel) {
        setState(prevState => ({
          ...prevState,
          isDrawerOpen: true,
          entity: eventTemp.entity,
          isAddStepOverride: true,
          isParallelNodeClicked: true
        }))
      } else {
        if (eventTemp.target) {
          dynamicPopoverHandler?.show(
            eventTemp.target,
            {
              event,
              isParallelNodeClicked: true,
              onPopoverSelection
            },
            { useArrows: true, darkMode: true },
            eventTemp.callback
          )
        }
      }
    },
    [Diagram.Event.DropLinkEvent]: dropNodeListener
  }

  const linkListeners: LinkModelListener = {
    [Diagram.Event.AddLinkClicked]: (event: any) => {
      const eventTemp = event as Diagram.DefaultLinkEvent
      eventTemp.stopPropagation()
      dynamicPopoverHandler?.hide()
      const linkRender = document.querySelector(`[data-linkid="${eventTemp.entity.getID()}"] circle`)
      const sourceLayer = eventTemp.entity.getSourcePort().getNode().getParent()
      const targetLayer = eventTemp.entity.getTargetPort().getNode().getParent()
      // check if the link is under step group then directly show add Step
      if (
        sourceLayer instanceof Diagram.StepGroupNodeLayerModel &&
        targetLayer instanceof Diagram.StepGroupNodeLayerModel
      ) {
        onPopoverSelection(false, false, event)
      } else if (linkRender) {
        dynamicPopoverHandler?.show(
          linkRender,
          {
            event,
            isParallelNodeClicked: false,
            onPopoverSelection
          },
          { useArrows: true, darkMode: true }
        )
      }
    },
    [Diagram.Event.DropLinkEvent]: (event: any) => {
      const eventTemp = event as Diagram.DefaultLinkEvent
      eventTemp.stopPropagation()
      if (event.node?.identifier && event.node?.id) {
        const dropEntity = model.getNodeFromId(event.node.id)
        if (dropEntity) {
          const dropNode = getStepFromNode(state.data, dropEntity, true).node
          if (dropNode?.stepGroup && isLinkUnderStepGroup(eventTemp.entity)) {
            showError(i18n.stepGroupInAnotherStepGroup)
          } else {
            const isRemove = removeStepOrGroup(state, dropEntity)
            if (isRemove && dropNode) {
              addStepOrGroup(eventTemp.entity, state, dropNode, false)
              updatePipeline(pipeline)
            }
          }
        }
      }
    }
  }

  const layerListeners: BaseModelListener = {
    [Diagram.Event.StepGroupCollapsed]: (event: any) => {
      const stepState = state.stepStates.get(event.entity.getIdentifier())
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      if (stepState) {
        const stepStates = state.stepStates.set(event.entity.getIdentifier(), {
          ...stepState,
          isStepGroupCollapsed: !stepState.isStepGroupCollapsed
        })
        setState(prev => ({ ...prev, stepStates }))
      }
    },
    [Diagram.Event.StepGroupClicked]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: eventTemp.entity }))
    },
    [Diagram.Event.RollbackClicked]: (event: any) => {
      const stepState = state.stepStates.get(event.entity.getIdentifier())
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      if (stepState) {
        const stepStates = state.stepStates.set(event.entity.getIdentifier(), {
          ...stepState,
          isStepGroupRollback: !stepState.isStepGroupRollback
        })
        setState(prev => ({ ...prev, stepStates }))
      }
    },
    [Diagram.Event.AddParallelNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      if (eventTemp.target) {
        dynamicPopoverHandler?.show(
          eventTemp.target,
          {
            event,
            isParallelNodeClicked: true,
            onPopoverSelection
          },
          { useArrows: true, darkMode: true },
          eventTemp.callback
        )
      }
    },
    [Diagram.Event.DropLinkEvent]: dropNodeListener
  }

  useEffect(() => {
    engine.registerListener({
      [Diagram.Event.RollbackClicked]: (event: any): void => {
        const type = event.type as Diagram.StepsType
        setState(prev => ({ ...prev, isRollback: type === Diagram.StepsType.Rollback }))
      }
    })
  }, [engine])

  // renderParallelNodes(model)
  model.addUpdateGraph(state.data, { nodeListeners, linkListeners, layerListeners }, state.stepStates)

  // load model into engine
  engine.setModel(model)

  useEffect(() => {
    if (isInitialized && selectedStageId && isSetupStageOpen) {
      const { stage: data } = getStageFromPipeline(pipeline, selectedStageId)
      if (data?.stage?.spec?.execution) {
        getStepsState(data.stage.spec.execution, state.stepStates)
        setState(prevState => ({
          ...prevState,
          data: get(data.stage.spec.execution, 'steps', []),
          stepStates: state.stepStates
        }))
      } else if (data?.stage) {
        if (!data.stage.spec) {
          data.stage.spec = {}
        }
        data.stage.spec = {
          ...data.stage.spec,
          execution: {
            steps: []
          }
        }
        updatePipeline(pipeline)
      }
    }
  }, [selectedStageId, pipeline, isSetupStageOpen, updatePipeline, isInitialized])

  return (
    <div
      className={css.container}
      onClick={e => {
        const div = e.target as HTMLDivElement
        if (div === canvasRef.current?.children[0]) {
          dynamicPopoverHandler?.hide()
        }
      }}
      // onDragOver={event => {
      //   const position = engine.getRelativeMousePoint(event)
      //   model.highlightNodesAndLink(position)
      //   event.preventDefault()
      // }}
      // onDrop={event => {
      //   const position = engine.getRelativeMousePoint(event)
      //   const nodeLink = model.getNodeLinkAtPosition(position)
      //   const dropData: CommandData = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
      //   if (nodeLink instanceof Diagram.DefaultNodeModel) {
      //     const dataClone: ExecutionWrapper[] = cloneDeep(state.data)
      //     const stepIndex = dataClone.findIndex(item => item.step?.identifier === nodeLink.getIdentifier())
      //     const removed = dataClone.splice(stepIndex, 1)
      //     removed.push({
      //       step: {
      //         type: dropData.value,
      //         name: dropData.text,
      //         identifier: uuid(),
      //         spec: {}
      //       }
      //     })
      //     dataClone.splice(stepIndex, 0, {
      //       parallel: removed
      //     })
      //     setState(prevState => ({
      //       ...prevState,
      //       isDrawerOpen: false,
      //       data: dataClone,
      //       isAddStepOverride: false,
      //       isParallelNodeClicked: false
      //     }))
      //   } else if (nodeLink instanceof Diagram.DefaultLinkModel) {
      //     const dataClone: ExecutionWrapper[] = cloneDeep(state.data)
      //     const stepIndex = dataClone.findIndex(
      //       item =>
      //         item.step?.identifier === (nodeLink.getSourcePort().getNode() as Diagram.DefaultNodeModel).getIdentifier()
      //     )
      //     dataClone.splice(stepIndex + 1, 0, {
      //       step: {
      //         type: dropData.value,
      //         name: dropData.text,
      //         identifier: uuid(),
      //         spec: {}
      //       }
      //     })
      //     setState(prevState => ({
      //       ...prevState,
      //       isDrawerOpen: false,
      //       data: dataClone,
      //       isAddStepOverride: false,
      //       isParallelNodeClicked: false
      //     }))
      //   }
      // }}
    >
      <div className={css.canvas} ref={canvasRef}>
        <Diagram.CanvasWidget
          engine={engine}
          isRollback={true}
          rollBackProps={{
            style: { top: 62 },
            active: state.isRollback ? Diagram.StepsType.Rollback : Diagram.StepsType.Normal
          }}
        />
        <CanvasButtons engine={engine} className={css.canvasBtn} />
        <DynamicPopover
          className={css.addStepPopover}
          darkMode={true}
          render={renderPopover}
          bind={setDynamicPopoverHandler}
        />
      </div>
      <Drawer
        onClose={() => {
          setState(prevState => ({
            ...prevState,
            isDrawerOpen: false,
            isAddStepOverride: false,
            isParallelNodeClicked: false
          }))
          model.clearSelection()
        }}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        hasBackdrop={false}
        size={450}
        isOpen={state.isDrawerOpen}
        position={Position.RIGHT}
      >
        <>
          {state.entity &&
            renderDrawerContent(
              state.data,
              state.entity,
              state.stepStates,
              state.isAddStepOverride,
              (item: StepData) => {
                if (state.entity) {
                  addStepOrGroup(
                    state.entity,
                    state,
                    {
                      step: {
                        type: item.type,
                        name: item.label,
                        identifier: uuid(),
                        spec: {}
                      }
                    },
                    state.isParallelNodeClicked
                  )
                  updatePipeline(pipeline)
                }
                setState(prevState => ({
                  ...prevState,
                  isDrawerOpen: false,
                  data: state.data,
                  isAddStepOverride: false,
                  isParallelNodeClicked: false
                }))
              },
              (item: ExecutionWrapper) => {
                if (state.entity) {
                  const node = getStepFromNode(state.data, state.entity).node
                  if (node) {
                    node.name = item.name
                    node.identifier = item.identifier
                    node.spec = { ...item.spec }
                    updatePipeline(pipeline)
                  }
                  setState(prevState => ({
                    ...prevState,
                    isDrawerOpen: false,
                    data: state.data,
                    isAddStepOverride: false,
                    isParallelNodeClicked: false
                  }))
                }
              }
            )}
        </>
      </Drawer>
    </div>
  )
}

export default ExecutionGraph

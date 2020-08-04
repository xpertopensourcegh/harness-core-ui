import React, { useEffect } from 'react'
import { get } from 'lodash'
import { Drawer, Position } from '@blueprintjs/core'
import { cloneDeep } from 'lodash'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener } from '@projectstorm/react-canvas-core'
import { v4 as uuid } from 'uuid'
import { Button } from '@wings-software/uikit'
import { Diagram } from 'modules/common/exports'
import type { ExecutionWrapper, ExecutionElement } from 'services/cd-ng'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'
import { DynamicPopover, DynamicPopoverHandlerBinding } from 'modules/common/components/DynamicPopover/DynamicPopover'
import { ExecutionStepModel } from './ExecutionStepModel'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getStageFromPipeline, EmptyNodeSeparator } from '../StageBuilder/StageBuilderUtil'
import { StepPalette, CommandData } from '../StepPalette/StepPalette'
import { StepCommands } from '../StepCommands/StepCommands'
import i18n from './ExecutionGraph.i18n'
import { EmptyStageName } from '../PipelineConstants'
import { StepStateMap, StepState, getStepFromId, getStepsState } from './ExecutionGraphUtil'
import css from './ExecutionGraph.module.scss'

interface PopoverData {
  event?: Diagram.DefaultNodeEvent
  addStep?: (isStepGroup: boolean, event?: Diagram.DefaultNodeEvent) => void
}

const renderPopover = ({ addStep, event }: PopoverData): JSX.Element => {
  return (
    <>
      <div>
        <Button minimal icon="Edit" text={i18n.addStep} onClick={() => addStep?.(false, event)} />
      </div>
      <div>
        <Button minimal icon="step-group" text={i18n.addStepGroup} onClick={() => addStep?.(true, event)} />
      </div>
    </>
  )
}

const renderDrawerContent = (
  data: ExecutionWrapper[],
  entity: Diagram.DefaultNodeModel,
  stepStates: StepStateMap,
  onSelect: (item: CommandData) => void,
  onChange: (stepObj: ExecutionElement) => void
): JSX.Element => {
  const node = getStepFromId(data, entity.getIdentifier?.()).node

  if (node) {
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

interface ExecutionGraphState {
  isDrawerOpen: boolean
  isRollback: boolean
  stepStates: StepStateMap
  entity?: Diagram.DefaultNodeModel
  data: ExecutionWrapper[]
}

const ExecutionGraph = (): JSX.Element => {
  const [state, setState] = React.useState<ExecutionGraphState>({
    isDrawerOpen: false,
    data: [],
    isRollback: false,
    stepStates: new Map<string, StepState>()
  })

  const [dynamicPopoverHandler, setDynamicPopoverHandler] = React.useState<
    DynamicPopoverHandlerBinding<PopoverData> | undefined
  >()

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

  const addStep = (isStepGroup: boolean, event?: Diagram.DefaultNodeEvent): void => {
    if (!isStepGroup && event) {
      setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: event.entity }))
    } else if (event?.entity && event.entity instanceof Diagram.DefaultLinkModel) {
      let node = event.entity.getSourcePort().getNode() as Diagram.DefaultNodeModel
      let response = getStepFromId(state.data, node.getIdentifier(), true)
      let next = 1
      if (!response.node) {
        node = event.entity.getTargetPort().getNode() as Diagram.DefaultNodeModel
        response = getStepFromId(state.data, node.getIdentifier(), true)
        next = 0
      }
      if (response.node) {
        const index = response.parent.indexOf(response.node)
        if (index > -1) {
          response.parent.splice(index + next, 0, {
            stepGroup: {
              name: EmptyStageName,
              identifier: uuid(),
              steps: []
            }
          })
        }
        updatePipeline(pipeline)
      }
    } else if (event?.entity && event.entity instanceof Diagram.DefaultNodeModel) {
      state.data.push({
        stepGroup: {
          name: EmptyStageName,
          identifier: uuid(),
          steps: []
        }
      })
      updatePipeline(pipeline)
    }
    dynamicPopoverHandler?.hide()
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
          setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: eventTemp.entity }))
        } else {
          dynamicPopoverHandler?.show(
            nodeRender,
            {
              event,
              addStep
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
      const response = getStepFromId(state.data, eventTemp.entity.getIdentifier(), true)
      if (response.node) {
        const index = response.parent.indexOf(response.node)
        if (index > -1) {
          response.parent.splice(index, 1)
          updatePipeline(pipeline)
        }
      }
    }
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
        addStep(false, event)
      } else if (linkRender) {
        dynamicPopoverHandler?.show(
          linkRender,
          {
            event,
            addStep
          },
          { useArrows: true, darkMode: true }
        )
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
    }
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
        if (div.className?.indexOf?.('CanvasWidget-module_canvas') > -1) {
          dynamicPopoverHandler?.hide()
        }
      }}
      onDragOver={event => {
        const position = engine.getRelativeMousePoint(event)
        model.highlightNodesAndLink(position)
        event.preventDefault()
      }}
      onDrop={event => {
        const position = engine.getRelativeMousePoint(event)
        const nodeLink = model.getNodeLinkAtPosition(position)
        const dropData: CommandData = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
        if (nodeLink instanceof Diagram.DefaultNodeModel) {
          const dataClone: ExecutionWrapper[] = cloneDeep(state.data)
          const stepIndex = dataClone.findIndex(item => item.step?.identifier === nodeLink.getIdentifier())
          const removed = dataClone.splice(stepIndex, 1)
          removed.push({
            step: {
              type: dropData.value,
              name: dropData.text,
              identifier: uuid(),
              spec: {}
            }
          })
          dataClone.splice(stepIndex, 0, {
            parallel: removed
          })
          setState(prevState => ({ ...prevState, isDrawerOpen: false, data: dataClone }))
        } else if (nodeLink instanceof Diagram.DefaultLinkModel) {
          const dataClone: ExecutionWrapper[] = cloneDeep(state.data)
          const stepIndex = dataClone.findIndex(
            item =>
              item.step?.identifier === (nodeLink.getSourcePort().getNode() as Diagram.DefaultNodeModel).getIdentifier()
          )
          dataClone.splice(stepIndex + 1, 0, {
            step: {
              type: dropData.value,
              name: dropData.text,
              identifier: uuid(),
              spec: {}
            }
          })
          setState(prevState => ({ ...prevState, isDrawerOpen: false, data: dataClone }))
        }
      }}
    >
      <div className={css.canvas}>
        <Diagram.CanvasWidget
          engine={engine}
          isRollback={true}
          rollBackProps={{
            style: { top: 62 },
            active: state.isRollback ? Diagram.StepsType.Rollback : Diagram.StepsType.Normal
          }}
        />
        <CanvasButtons engine={engine} />
        <DynamicPopover
          className={css.addStepPopover}
          darkMode={true}
          render={renderPopover}
          bind={setDynamicPopoverHandler}
        />
      </div>
      <Drawer
        onClose={() => {
          setState(prevState => ({ ...prevState, isDrawerOpen: false }))
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
              (item: CommandData) => {
                if (state.entity && state.entity.getType() === Diagram.DiagramType.CreateNew) {
                  // Steps if you are under step group
                  const node = getStepFromId(state.data, state.entity.getIdentifier().split(EmptyNodeSeparator)[1]).node
                  if (node?.steps) {
                    node.steps.push({
                      step: {
                        type: item.value,
                        name: item.text,
                        identifier: uuid(),
                        spec: {}
                      }
                    })
                  } else {
                    state.data.push({
                      step: {
                        type: item.value,
                        name: item.text,
                        identifier: uuid(),
                        spec: {}
                      }
                    })
                  }
                } else {
                  state.data.push({
                    step: {
                      type: item.value,
                      name: item.text,
                      identifier: uuid(),
                      spec: {}
                    }
                  })
                }
                updatePipeline(pipeline)
                setState(prevState => ({ ...prevState, isDrawerOpen: false, data: state.data }))
              },
              (item: ExecutionWrapper) => {
                if (state.entity) {
                  const node = getStepFromId(state.data, state.entity.getIdentifier()).node
                  if (node) {
                    node.name = item.name
                    node.identifier = item.identifier
                    node.spec = { ...item.spec }
                    updatePipeline(pipeline)
                  }
                  setState(prevState => ({ ...prevState, isDrawerOpen: false, data: state.data }))
                }
              }
            )}
        </>
      </Drawer>
    </div>
  )
}

export default ExecutionGraph

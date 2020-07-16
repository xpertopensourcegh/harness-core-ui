import React, { useEffect } from 'react'
import css from './ExecutionGraph.module.scss'
import { get } from 'lodash'
import { Diagram } from 'modules/common/exports'
import { ExecutionStepModel } from './ExecutionStepModel'
import { Drawer, Position } from '@blueprintjs/core'
import { cloneDeep } from 'lodash'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getStageFromPipeline } from '../StageBuilder/StageBuilderModel'
import type { ExecutionSection, StepWrapper } from 'services/ng-temp'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import { StepPalette, CommandData } from '../StepPalette/StepPalette'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'
import { StepCommands } from '../StepCommands/StepCommands'

const getStepFromId = (
  stepData: ExecutionSection[] | undefined,
  id: string,
  isComplete = false
): ExecutionSection | undefined => {
  let stepResp: ExecutionSection | undefined = undefined
  stepData?.every(node => {
    if (node.step && node.step.identifier === id) {
      if (isComplete) {
        stepResp = node
      } else {
        stepResp = node.step
      }
      return false
    } else if (node.parallel || node.graph) {
      const step = getStepFromId(node.parallel || node.graph, id, isComplete)
      if (step) {
        stepResp = step
        return false
      }
    }
    return true
  })
  return stepResp
}

const renderDrawerContent = (
  data: ExecutionSection[],
  entity: Diagram.DefaultNodeModel,
  onSelect: (item: CommandData) => void,
  onChange: (stepObj: StepWrapper) => void
): JSX.Element => {
  const node = getStepFromId(data, entity.getID())

  if (node) {
    return <StepCommands step={node} onChange={onChange} />
  }
  return <StepPalette onSelect={onSelect} />
}

interface ExecutionGraphState {
  isDrawerOpen: boolean
  entity?: Diagram.DefaultNodeModel
  data: ExecutionSection[]
}

const ExecutionGraph = (): JSX.Element => {
  const [state, setState] = React.useState<ExecutionGraphState>({ isDrawerOpen: false, data: [] })

  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId, isSetupStageOpen }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new ExecutionStepModel(), [])

  const nodeListeners: NodeModelListener = {
    [Diagram.Event.SelectionChanged]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      setState(prevState => ({ ...prevState, isDrawerOpen: eventTemp.isSelected, entity: eventTemp.entity }))
    },
    [Diagram.Event.RemoveNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const node = getStepFromId(state.data, eventTemp.entity.getID(), true)
      if (node) {
        const index = state.data.indexOf(node)
        if (index && index > -1) {
          state.data.splice(index, 1)
          updatePipeline(pipeline)
        }
      }
    }
  }

  const linkListeners: LinkModelListener = {
    [Diagram.Event.AddLinkClicked]: (event: any) => {
      setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: event.entity }))
    }
  }

  // renderParallelNodes(model)
  model.addUpdateGraph(state.data, { nodeListeners, linkListeners })

  // load model into engine
  engine.setModel(model)

  useEffect(() => {
    if (selectedStageId && isSetupStageOpen) {
      const { stage: data } = getStageFromPipeline(pipeline, selectedStageId)
      if (data?.stage?.spec?.execution) {
        setState(prevState => ({ ...prevState, data: get(data.stage.spec.execution, 'steps', []) }))
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
  }, [selectedStageId, pipeline, isSetupStageOpen, updatePipeline])

  return (
    <div
      className={css.container}
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
          const dataClone: ExecutionSection[] = cloneDeep(state.data)
          const stepIndex = dataClone.findIndex(item => item.step?.identifier === nodeLink.getID())
          const removed = dataClone.splice(stepIndex, 1)
          removed.push({
            step: {
              type: dropData.value,
              name: dropData.text,
              identifier: `${dropData.value}_${state.data.length}`,
              spec: {}
            }
          })
          dataClone.splice(stepIndex, 0, {
            parallel: removed
          })
          setState(prevState => ({ ...prevState, isDrawerOpen: false, data: dataClone }))
        } else if (nodeLink instanceof Diagram.DefaultLinkModel) {
          const dataClone: ExecutionSection[] = cloneDeep(state.data)
          const stepIndex = dataClone.findIndex(
            item => item.step?.identifier === nodeLink.getSourcePort().getNode().getID()
          )
          dataClone.splice(stepIndex + 1, 0, {
            step: {
              type: dropData.value,
              name: dropData.text,
              identifier: `${dropData.value}_${state.data.length}`,
              spec: {}
            }
          })
          setState(prevState => ({ ...prevState, isDrawerOpen: false, data: dataClone }))
        }
      }}
    >
      <div className={css.canvas}>
        <Diagram.CanvasWidget engine={engine} />
        <CanvasButtons engine={engine} />
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
        size={Drawer.SIZE_SMALL}
        isOpen={state.isDrawerOpen}
        position={Position.RIGHT}
      >
        <div>
          {state.entity &&
            renderDrawerContent(
              state.data,
              state.entity,
              (item: CommandData) => {
                state.data.push({
                  step: {
                    type: item.value,
                    name: item.text,
                    identifier: `${item.value}_${state.data.length}`,
                    spec: {}
                  }
                })
                updatePipeline(pipeline)
                setState(prevState => ({ ...prevState, isDrawerOpen: false, data: state.data }))
              },
              (item: ExecutionSection) => {
                if (state.entity) {
                  const node = getStepFromId(state.data, state.entity.getID())
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
        </div>
      </Drawer>
    </div>
  )
}

export default ExecutionGraph

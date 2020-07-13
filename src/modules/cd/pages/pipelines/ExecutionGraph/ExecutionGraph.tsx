import React, { useEffect } from 'react'
import css from './ExecutionGraph.module.scss'
import { get } from 'lodash'
import { Diagram } from 'modules/common/exports'
import { ExecutionStepModel, StepType } from './ExecutionStepModel'
import { Drawer, Position } from '@blueprintjs/core'
import { cloneDeep } from 'lodash'
import { Layout, Text } from '@wings-software/uikit'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getStageFromPipeline } from '../StageBuilder/StageBuilderModel'
import type { ExecutionSection } from 'services/ng-temp'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import { StepPalette, CommandData } from '../StepPalette/StepPalette'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'

const getStepFromId = (stepData: ExecutionSection[] | undefined, id: string): ExecutionSection | undefined => {
  let stepResp: ExecutionSection | undefined = undefined
  stepData?.every(node => {
    if (node.step && node.step.identifier === id) {
      stepResp = node.step
      return false
    } else if (node.parallel || node.graph) {
      const step = getStepFromId(node.parallel || node.graph, id)
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
  onSelect: (item: CommandData) => void
): JSX.Element => {
  const step = getStepFromId(data, entity.getID())
  const content: JSX.Element[] = []
  if (step) {
    for (const key in step.spec) {
      content.push(
        <Layout.Horizontal key={key}>
          <Text font={{ weight: 'bold' }} style={{ textTransform: 'capitalize' }} width={150} lineClamp={1}>
            {key}
          </Text>
          <Text width={150} lineClamp={1}>
            {step.spec[key]}
          </Text>
        </Layout.Horizontal>
      )
    }
  }
  return (
    <Layout.Vertical padding="large" spacing="medium">
      {step ? content : <StepPalette onSelect={onSelect} />}
    </Layout.Vertical>
  )
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
    }
  } = React.useContext(PipelineContext)

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new ExecutionStepModel(), [])

  const nodeListeners: NodeModelListener = {
    [Diagram.Event.SelectionChanged]: (event: any) => {
      const _event = event as Diagram.DefaultNodeEvent
      setState(prevState => ({ ...prevState, isDrawerOpen: _event.isSelected, entity: _event.entity }))
    },
    [Diagram.Event.RemoveNode]: (_event: any) => {
      // console.log(event)
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
      const data = getStageFromPipeline(pipeline, selectedStageId)
      if (data && data.stage && data.stage.deployment) {
        setState(prevState => ({ ...prevState, data: get(data.stage.deployment, 'execution[0].phase.steps') }))
      } else if (data?.stage) {
        data.stage = {
          execution: {}
        }
      }
    }
  }, [selectedStageId, pipeline, isSetupStageOpen])

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
              type: dropData.icon.split('-')[1] as StepType,
              name: dropData.text,
              identifier: `http-step-${dropData.value}`,
              spec: {
                socketTimeoutMillis: 1000,
                method: 'GET',
                url: 'http://localhost:8080/temp-1.json'
              }
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
              type: dropData.icon.split('-')[1] as StepType,
              name: dropData.text,
              identifier: `http-step-${dropData.value}`,
              spec: {
                socketTimeoutMillis: 1000,
                method: 'GET',
                url: 'http://localhost:8080/temp-1.json'
              }
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
        size={Drawer.SIZE_STANDARD}
        isOpen={state.isDrawerOpen}
        position={Position.RIGHT}
      >
        <div>
          {state.entity &&
            renderDrawerContent(state.data, state.entity, (item: CommandData) => {
              const dataClone: ExecutionSection[] = cloneDeep(state.data)
              dataClone.push({
                step: {
                  type: item.icon.split('-')[1] as StepType,
                  name: item.text,
                  identifier: `http-step-${item.value}`,
                  spec: {
                    socketTimeoutMillis: 1000,
                    method: 'GET',
                    url: 'http://localhost:8080/temp-1.json'
                  }
                }
              })
              setState(prevState => ({ ...prevState, isDrawerOpen: false, data: dataClone }))
            })}
        </div>
      </Drawer>
    </div>
  )
}

export default ExecutionGraph

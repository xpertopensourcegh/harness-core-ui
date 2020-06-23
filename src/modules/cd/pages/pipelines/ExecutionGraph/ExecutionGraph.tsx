import React, { useEffect } from 'react'
import css from './ExecutionGraph.module.scss'
import { Diagram } from 'modules/common/exports'
import { ExecutionStepModel, GraphObj, StepType, StepInterface } from './ExecutionStepModel'
import { Drawer, Position } from '@blueprintjs/core'
import { cloneDeep } from 'lodash'
import { Layout, Text, CardBody, IconName, Card } from '@wings-software/uikit'

const data: GraphObj[] = [
  {
    step: {
      type: StepType.APPROVAL,
      name: 'Jira Approval',
      identifier: 'jira-approval-1',
      spec: {
        approvedBy: 'Maddy',
        ticket: 'TD-123',
        url: 'http://localhost:8080/temp-3.json'
      }
    }
  },
  {
    parallel: [
      {
        step: {
          type: StepType.HTTP,
          name: 'http step 5',
          identifier: 'http-step-5',
          spec: {
            socketTimeoutMillis: 1000,
            method: 'GET',
            url: 'http://localhost:8080/temp-4.json'
          }
        }
      },
      {
        step: {
          type: StepType.HTTP,
          name: 'http step 6',
          identifier: 'http-step-6',
          spec: {
            socketTimeoutMillis: 1000,
            method: 'GET',
            url: 'http://localhost:8080/temp-4.json'
          }
        }
      }
    ]
  },
  {
    step: {
      type: StepType.HTTP,
      name: 'http step 4',
      identifier: 'http-step-4',
      spec: {
        socketTimeoutMillis: 1000,
        method: 'GET',
        url: 'http://localhost:8080/temp-4.json'
      }
    }
  }
]

const getStepFromId = (stepData: GraphObj[] | undefined, id: string): StepInterface | undefined => {
  let stepResp: StepInterface | undefined = undefined
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

interface CommandData {
  text: string
  value: string
  icon: IconName
}

const commandData: CommandData[] = [
  {
    text: 'Kubernetes',
    value: 'service-kubernetes',
    icon: 'service-kubernetes'
  },
  {
    text: 'Github',
    value: 'service-github',
    icon: 'service-github'
  },
  {
    text: 'GCP',
    value: 'service-gcp',
    icon: 'service-gcp'
  },
  {
    text: 'ELK Service',
    value: 'service-elk',
    icon: 'service-elk'
  },
  {
    text: 'Git Labs',
    value: 'service-gotlab',
    icon: 'service-gotlab'
  },
  {
    text: 'Datadog',
    value: 'service-datadog',
    icon: 'service-datadog'
  },
  {
    text: 'Slack',
    value: 'service-slack',
    icon: 'service-slack'
  },
  {
    text: 'Jenkins',
    value: 'service-jenkins',
    icon: 'service-jenkins'
  }
]

export const RenderCommands = ({ onSelect }: { onSelect: (item: CommandData) => void }): JSX.Element => {
  return (
    <div className={css.grid}>
      {commandData.map((item: CommandData) => (
        <Card
          key={item.value}
          interactive={true}
          draggable={true}
          onClick={() => onSelect(item)}
          onDragStart={event => {
            event.dataTransfer.setData('storm-diagram-node', JSON.stringify(item))
          }}
        >
          <CardBody.Icon icon={item.icon} iconSize={25}>
            <Text font="small" style={{ textAlign: 'center', color: 'var(--grey-900)' }}>
              {item.text}
            </Text>
          </CardBody.Icon>
        </Card>
      ))}
    </div>
  )
}

const renderDrawerContent = (entity: Diagram.DefaultNodeModel, onSelect: (item: CommandData) => void): JSX.Element => {
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
      {step ? content : <RenderCommands onSelect={onSelect} />}
    </Layout.Vertical>
  )
}

interface ExecutionGraphState {
  isDrawerOpen: boolean
  entity?: Diagram.DefaultNodeModel
  data: GraphObj[]
}
//1) setup the diagram engine
const engine = Diagram.createEngine()

//2) setup the diagram model
const model = new ExecutionStepModel()

// renderParallelNodes(model)
model.addUpdateGraph(data)

// load model into engine
engine.setModel(model)

const ExecutionGraph = (): JSX.Element => {
  const [state, setState] = React.useState<ExecutionGraphState>({ isDrawerOpen: false, data })
  useEffect(() => {
    // renderParallelNodes(model)
    model.addUpdateGraph(state.data)

    // load model into engine
    engine.setModel(model)
    const nodes = model.getActiveNodeLayer().getNodes()
    for (const key in nodes) {
      const node = nodes[key]
      node.registerListener({
        [Diagram.Event.SelectionChanged]: (event: any) => {
          const _event = event as Diagram.DefaultNodeEvent
          setState(prevState => ({ ...prevState, isDrawerOpen: _event.isSelected, entity: _event.entity }))
        },
        [Diagram.Event.RemoveNode]: (_event: any) => {
          // console.log(event)
        }
      })
    }
    const links = model.getActiveLinkLayer().getLinks()
    for (const key in links) {
      const link = links[key]
      link.registerListener({
        [Diagram.Event.AddLinkClicked]: (event: any) => {
          setState(prevState => ({ ...prevState, isDrawerOpen: true, entity: event.entity }))
        }
      })
    }
  }, [state.data])
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
          const dataClone: GraphObj[] = cloneDeep(state.data)
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
          const dataClone: GraphObj[] = cloneDeep(state.data)
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
      </div>
      <Drawer
        onClose={() => {
          setState(prevState => ({ ...prevState, isDrawerOpen: false }))
          model.clearSelection()
        }}
        title={state.entity?.getOptions().name || 'Create New'}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={state.entity?.getOptions().type !== 'create-new'}
        enforceFocus={true}
        hasBackdrop={false}
        size={Drawer.SIZE_SMALL}
        isOpen={state.isDrawerOpen}
        position={Position.RIGHT}
      >
        <div>
          {state.entity &&
            renderDrawerContent(state.entity, (item: CommandData) => {
              const dataClone: GraphObj[] = cloneDeep(state.data)
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

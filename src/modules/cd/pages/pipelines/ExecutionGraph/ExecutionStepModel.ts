import { isEmpty } from 'lodash'
import type { IconName } from '@wings-software/uikit'
import { Diagram } from 'modules/common/exports'

export enum StepType {
  HTTP = 'http',
  APPROVAL = 'approval',
  KUBERNETES = 'kubernetes',
  GITHUB = 'github',
  GCP = 'gcp',
  ELK = 'elk',
  GOTLAB = 'gotlab',
  DATADOG = 'datadog',
  SLACK = 'slack',
  JENKINS = 'jenkins'
}

const MapStepTypeToIcon: { [key in StepType]: IconName } = {
  http: 'command-http',
  approval: 'tick',
  kubernetes: 'service-kubernetes',
  github: 'service-github',
  gcp: 'service-gcp',
  elk: 'service-elk',
  gotlab: 'service-gotlab',
  datadog: 'service-datadog',
  slack: 'service-slack',
  jenkins: 'service-jenkins'
}

export interface StepInterface {
  type: StepType
  name: string
  identifier: string
  spec: { [key: string]: string | number }
}

export interface GraphObj {
  step?: StepInterface
  nodeRender?: Diagram.DefaultNodeModel
  parallel?: Omit<GraphObj, 'graph'>[]
  graph?: {
    step: StepInterface
    nodeRender?: Diagram.DefaultNodeModel
    identifier: string
    dependencies?: string[]
  }[]
}

export class ExecutionStepModel extends Diagram.DiagramModel {
  constructor() {
    super({
      gridSize: 100,
      startX: -100,
      startY: 100,
      gap: 200
    })
  }

  renderGraphNodes(
    node: GraphObj,
    startX: number,
    startY: number,
    prevNodes?: Diagram.DefaultNodeModel[]
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node.step && node.step.type) {
      startX += this.gap
      const nodeRender =
        node.step.type === StepType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              id: node.step.identifier,
              name: node.step.name,
              icon: MapStepTypeToIcon[node.step.type]
            })
          : new Diagram.DefaultNodeModel({
              id: node.step.identifier,
              name: node.step.name,
              icon: MapStepTypeToIcon[node.step.type]
            })

      this.addNode(nodeRender)
      nodeRender.setPosition(startX, startY)
      if (!isEmpty(prevNodes) && prevNodes) {
        prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(nodeRender, prevNode)
        })
      }
      return { startX, startY, prevNodes: [nodeRender] }
    } else if (node.parallel) {
      const newX = startX
      let newY = startY
      const prevNodesAr: Diagram.DefaultNodeModel[] = []
      node.parallel.forEach(nodeP => {
        const resp = this.renderGraphNodes(nodeP, newX, newY, prevNodes)
        startX = resp.startX
        newY = resp.startY + this.gap / 2
        if (resp.prevNodes) {
          prevNodesAr.push(...resp.prevNodes)
        }
      })
      return { startX, startY, prevNodes: prevNodesAr }
    } else if (node.graph) {
      let maxX = startX
      let newY = startY
      const prevNodesAr: Diagram.DefaultNodeModel[] = []
      node.graph.forEach(nodeG => {
        let newX = startX
        let resp = this.renderGraphNodes(nodeG, newX, newY, prevNodes)
        newX = resp.startX
        const dependentNodes = node.graph?.filter(
          nodeP => nodeP.dependencies && nodeP.dependencies.indexOf(nodeG.identifier) > -1
        )
        dependentNodes?.forEach(nodeD => {
          resp = this.renderGraphNodes(nodeD, newX, newY, prevNodes)
          newX = resp.startX
        })
        newY = resp.startY + this.gap / 2
        if (resp.prevNodes) {
          prevNodesAr.push(...resp.prevNodes)
        }
        if (newX > maxX) {
          maxX = newX
        }
      })
      return { startX: maxX, startY, prevNodes: prevNodesAr }
    }
    return { startX, startY }
  }

  clearAllNodesAndLinks(): void {
    const links = this.getActiveLinkLayer().getLinks()
    for (const key in links) {
      const link = links[key]
      link.remove()
    }
    const nodes = this.getActiveNodeLayer().getNodes()
    for (const key in nodes) {
      const node = nodes[key]
      node.remove()
    }
  }

  addUpdateGraph(data: GraphObj[]): void {
    let { startX, startY } = this
    this.clearAllNodesAndLinks()
    this.setLocked(false)
    const startNode =
      (this.getNode('start-new') as Diagram.DefaultNodeModel) || new Diagram.NodeStartModel({ id: 'start-new' })
    startX += this.gap
    startNode.setPosition(startX, startY)
    startX -= this.gap / 2 // Start Node is very small thats why reduce the margin for next
    const tempStartX = startX
    this.addNode(startNode)
    const createNode =
      (this.getNode('stop') as Diagram.DefaultNodeModel) ||
      new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false })
    let prevNodes: Diagram.DefaultNodeModel[] = [startNode]
    data.forEach((node: GraphObj) => {
      const resp = this.renderGraphNodes(node, startX, startY, prevNodes)
      startX = resp.startX
      startY = resp.startY
      if (resp.prevNodes) {
        prevNodes = resp.prevNodes
      }
    })
    if (tempStartX !== startX) {
      createNode.setPosition(startX + this.gap, startY)
    }
    prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
      this.connectedParentToNode(createNode, prevNode)
    })
    this.addNode(createNode)

    this.setLocked(true)
  }
}

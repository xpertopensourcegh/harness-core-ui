import { Diagram } from 'modules/common/exports'
import type { IconName } from '@wings-software/uikit'
import { isEmpty } from 'lodash'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'

export enum StageType {
  DEPLOY = 'deploy',
  APPROVAL = 'approval',
  PIPELINE = 'pipeline',
  CUSTOM = 'custom'
}

const MapStepTypeToIcon: { [key in StageType]: IconName } = {
  deploy: 'command-http',
  approval: 'tick',
  pipeline: 'service-kubernetes',
  custom: 'service-github'
}

export interface StageInterface {
  type: StageType
  name: string
  identifier: string
  spec?: { [key: string]: string | number }
}

export interface GraphObj {
  stage?: StageInterface
  parallel?: Omit<GraphObj, 'graph'>[]
}

export class StageBuilderModel extends Diagram.DiagramModel {
  constructor() {
    super({
      gridSize: 100,
      startX: 50,
      startY: 30,
      gap: 200
    })
  }

  renderGraphNodes(
    node: GraphObj,
    startX: number,
    startY: number,
    prevNodes?: Diagram.DefaultNodeModel[]
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node.stage && node.stage.type) {
      startX += this.gap
      const nodeRender =
        node.stage.type === StageType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              id: node.stage.identifier,
              name: node.stage.name,
              width: 90,
              height: 40,
              icon: MapStepTypeToIcon[node.stage.type]
            })
          : new Diagram.DefaultNodeModel({
              id: node.stage.identifier,
              name: node.stage.name,
              width: 90,
              height: 40,
              icon: MapStepTypeToIcon[node.stage.type]
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
    }
    return { startX, startY }
  }

  addUpdateGraph(data: GraphObj[], listeners: NodeModelListener): void {
    let { startX, startY } = this
    this.clearAllNodesAndLinks()
    // Unlock Graph
    this.setLocked(false)

    //Start Node
    const startNode = new Diagram.NodeStartModel({ id: 'start-new' })
    startNode.setPosition(startX, startY)
    this.addNode(startNode)

    // Stop Node
    const stopNode = new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false })

    // Create Node
    const createNode = new Diagram.CreateNewModel({ id: 'create-node', width: 90, height: 40, name: 'Add Stage' })

    startX -= this.gap / 2
    let prevNodes: Diagram.DefaultNodeModel[] = [startNode]
    data.forEach((node: GraphObj) => {
      const resp = this.renderGraphNodes(node, startX, startY, prevNodes)
      startX = resp.startX
      startY = resp.startY
      if (resp.prevNodes) {
        prevNodes = resp.prevNodes
      }
    })
    createNode.setPosition(startX + this.gap, startY)
    stopNode.setPosition(startX + 2 * this.gap, startY)
    prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
      this.connectedParentToNode(createNode, prevNode)
    })
    this.connectedParentToNode(createNode, stopNode)
    this.addNode(stopNode)
    this.addNode(createNode)

    const nodes = this.getActiveNodeLayer().getNodes()
    for (const key in nodes) {
      const node = nodes[key]
      node.registerListener(listeners)
    }
    // Lock the graph back
    this.setLocked(true)
  }
}

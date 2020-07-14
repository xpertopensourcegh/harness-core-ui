import { isEmpty } from 'lodash'
import type { IconName } from '@wings-software/uikit'
import { Diagram } from 'modules/common/exports'
import type { ExecutionSection, StepWrapper } from 'services/ng-temp'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'

export enum StepType {
  HTTP = 'Http',
  SHELLSCRIPT = 'ShellScript',
  APPROVAL = 'Approval',
  K8sRolloutDeploy = 'K8sRolloutDeploy'
}

const MapStepTypeToIcon: { [key in StepType]: IconName } = {
  Http: 'command-http',
  ShellScript: 'command-shell-script',
  K8sRolloutDeploy: 'service-kubernetes',
  Approval: 'command-approval'
}

interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
}

const getStepTypeFromStep = (node: ExecutionSection): StepType => {
  if (node.step.type === StepType.HTTP) {
    return StepType.HTTP
  } else if (node.step.type === StepType.SHELLSCRIPT) {
    return StepType.SHELLSCRIPT
  } else if (node.step.type === StepType.K8sRolloutDeploy) {
    return StepType.K8sRolloutDeploy
  }
  return StepType.APPROVAL
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
    node: ExecutionSection,
    startX: number,
    startY: number,
    prevNodes?: Diagram.DefaultNodeModel[]
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node.step) {
      const type = getStepTypeFromStep(node)
      startX += this.gap
      const nodeRender =
        type === StepType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              id: node.step.identifier,
              name: node.step.name,
              icon: MapStepTypeToIcon[type]
            })
          : new Diagram.DefaultNodeModel({
              id: node.step.identifier,
              name: node.step.name,
              icon: MapStepTypeToIcon[type]
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
      node.parallel.forEach((nodeP: StepWrapper) => {
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

  addUpdateGraph(data: ExecutionSection[], { nodeListeners, linkListeners }: Listeners): void {
    let { startX, startY } = this
    this.clearAllNodesAndLinks()
    this.setLocked(false)

    // Start Node
    const startNode =
      (this.getNode('start-new') as Diagram.DefaultNodeModel) || new Diagram.NodeStartModel({ id: 'start-new' })
    startX += this.gap
    startNode.setPosition(startX, startY)
    startX -= this.gap / 2 // Start Node is very small thats why reduce the margin for next
    const tempStartX = startX
    this.addNode(startNode)

    // Stop Node
    const stopNode =
      (this.getNode('stop') as Diagram.DefaultNodeModel) ||
      new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false })

    // Create Node
    const createNode = new Diagram.CreateNewModel({ id: 'create-node' })

    let prevNodes: Diagram.DefaultNodeModel[] = [startNode]
    data.forEach((node: ExecutionSection) => {
      const resp = this.renderGraphNodes(node, startX, startY, prevNodes)
      startX = resp.startX
      startY = resp.startY
      if (resp.prevNodes) {
        prevNodes = resp.prevNodes
      }
    })
    if (tempStartX !== startX || data.length === 0) {
      createNode.setPosition(startX + this.gap, startY)
    }
    prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
      this.connectedParentToNode(createNode, prevNode)
    })
    this.addNode(createNode)

    stopNode.setPosition(startX + 2 * this.gap, startY)
    this.connectedParentToNode(stopNode, createNode)
    this.addNode(stopNode)

    const nodes = this.getActiveNodeLayer().getNodes()
    for (const key in nodes) {
      const node = nodes[key]
      node.registerListener(nodeListeners)
    }
    const links = this.getActiveLinkLayer().getLinks()
    for (const key in links) {
      const link = links[key]
      link.registerListener(linkListeners)
    }

    this.setLocked(true)
  }
}

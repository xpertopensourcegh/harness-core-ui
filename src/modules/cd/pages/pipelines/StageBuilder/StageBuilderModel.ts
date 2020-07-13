import { Diagram } from 'modules/common/exports'
import type { IconName } from '@wings-software/uikit'
import { isEmpty } from 'lodash'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'
import type { CDPipelineDTO, StageWrapper, Stage, DeploymentStage } from 'services/ng-temp'

export enum StageType {
  DEPLOY = 'deployment',
  APPROVAL = 'approval',
  PIPELINE = 'pipeline',
  CUSTOM = 'custom'
}

export const MapStepTypeToIcon: { [key in StageType]: IconName } = {
  deployment: 'pipeline-deploy',
  approval: 'pipeline-approval',
  pipeline: 'pipeline',
  custom: 'pipeline-custom'
}

export const getStageFromPipeline = (data: CDPipelineDTO, identifier: string): StageWrapper | undefined => {
  return data.stages?.filter(stage => stage?.stage?.identifier === identifier)[0]
}

export const getTypeOfStage = (stage: Stage): { type: StageType; stage: DeploymentStage | Stage } => {
  if (stage[StageType.DEPLOY]) {
    return { type: StageType.DEPLOY, stage: stage as DeploymentStage }
  } else if (stage[StageType.APPROVAL]) {
    return { type: StageType.APPROVAL, stage }
  } else if (stage[StageType.PIPELINE]) {
    return { type: StageType.PIPELINE, stage }
  }
  return { type: StageType.CUSTOM, stage }
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
    node: StageWrapper,
    startX: number,
    startY: number,
    selectedStageId?: string,
    prevNodes?: Diagram.DefaultNodeModel[]
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node && node.stage) {
      const { type } = getTypeOfStage(node.stage)
      startX += this.gap
      const nodeRender =
        type === StageType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              id: node.stage.identifier,
              backgroundColor: selectedStageId === node.stage.identifier ? '#436b98' : 'white',
              name: node.stage.displayName,
              width: 90,
              height: 40,
              icon: MapStepTypeToIcon[type]
            })
          : new Diagram.DefaultNodeModel({
              id: node.stage.identifier,
              backgroundColor: selectedStageId === node.stage.identifier ? '#436b98' : 'white',
              name: node.stage.displayName,
              width: 90,
              height: 40,
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
    }
    // else if (node.parallel) {
    //   const newX = startX
    //   let newY = startY
    //   const prevNodesAr: Diagram.DefaultNodeModel[] = []
    //   node.parallel.forEach(nodeP => {
    //     const resp = this.renderGraphNodes(nodeP, newX, newY, prevNodes)
    //     startX = resp.startX
    //     newY = resp.startY + this.gap / 2
    //     if (resp.prevNodes) {
    //       prevNodesAr.push(...resp.prevNodes)
    //     }
    //   })
    //   return { startX, startY, prevNodes: prevNodesAr }
    // }
    return { startX, startY }
  }

  addUpdateGraph(data: CDPipelineDTO, listeners: NodeModelListener, selectedStageId?: string): void {
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
    data.stages?.forEach((node: StageWrapper) => {
      const resp = this.renderGraphNodes(node, startX, startY, selectedStageId, prevNodes)
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

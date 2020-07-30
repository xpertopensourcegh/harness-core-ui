import type { IconName } from '@wings-software/uikit'
import { isEmpty } from 'lodash'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import { Diagram } from 'modules/common/exports'
import type { CDPipelineDTO, StageElementWrapper } from 'services/cd-ng'
import type { Stage, DeploymentStage } from 'services/ng-temp'
import i18n from './StageBuilder.i18n'

export enum StageType {
  DEPLOY = 'Deployment',
  APPROVAL = 'Approval',
  PIPELINE = 'Pipeline',
  CUSTOM = 'Custom'
}

export const MapStepTypeToIcon: { [key in StageType]: IconName } = {
  Deployment: 'pipeline-deploy',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

export interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
}

export const EmptyNodeSeparator = '$node$'

export const getStageFromPipeline = (
  data: CDPipelineDTO,
  identifier: string
): { stage: StageElementWrapper | undefined; parent: StageElementWrapper | undefined } => {
  let stage: StageElementWrapper | undefined = undefined
  let parent: StageElementWrapper | undefined = undefined
  data.stages?.forEach(node => {
    if (!stage) {
      if (node?.stage?.identifier === identifier) {
        stage = node
      } else if (node?.parallel) {
        stage = getStageFromPipeline({ stages: node.parallel }, identifier).stage
        if (stage) {
          parent = node
        }
      }
    }
  })

  return { stage, parent }
}

export const getTypeOfStage = (stage: Stage): { type: StageType; stage: DeploymentStage | Stage } => {
  if (stage.type === StageType.DEPLOY) {
    return { type: StageType.DEPLOY, stage: stage as DeploymentStage }
  } else if (stage.type === StageType.APPROVAL) {
    return { type: StageType.APPROVAL, stage }
  } else if (stage.type === StageType.PIPELINE) {
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
    node: StageElementWrapper,
    startX: number,
    startY: number,
    selectedStageId?: string,
    prevNodes?: Diagram.DefaultNodeModel[],
    allowAdd?: boolean,
    isParallelNodes = false
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node && node.stage) {
      const { type } = getTypeOfStage(node.stage)
      startX += this.gap
      const isSelected = selectedStageId === node.stage.identifier
      const customNodeStyle: React.CSSProperties = {
        backgroundColor: isSelected ? 'var(--pipeline-selected-node)' : 'var(--white)',
        borderColor: isSelected ? 'var(--diagram-selected)' : 'var(--pipeline-grey-border)',
        borderWidth: isSelected ? '2px' : '1px'
      }
      const nodeRender =
        type === StageType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              id: node.stage.identifier,
              customNodeStyle: {
                // Without this doesn't look straight
                marginTop: '2.5px',
                ...customNodeStyle
              },
              name: node.stage.name,
              width: 57,
              height: 57,
              icon: MapStepTypeToIcon[type]
            })
          : new Diagram.DefaultNodeModel({
              id: node.stage.identifier,
              customNodeStyle,
              name: node.stage.name,
              width: 114,
              allowAdd: allowAdd === true,
              height: 50,
              icon: MapStepTypeToIcon[type]
            })

      this.addNode(nodeRender)
      nodeRender.setPosition(startX, startY)
      if (!isEmpty(prevNodes) && prevNodes) {
        prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(nodeRender, prevNode, !isParallelNodes)
        })
      }
      return { startX, startY, prevNodes: [nodeRender] }
    } else if (node.parallel) {
      let newX = startX
      let newY = startY
      if (!isEmpty(prevNodes) && prevNodes) {
        const emptyNodeStart = new Diagram.EmptyNodeModel({
          id: `${EmptyNodeSeparator}-${EmptyNodeSeparator}${node.parallel[0].stage.identifier}${EmptyNodeSeparator}`,
          name: 'Empty'
        })
        this.addNode(emptyNodeStart)
        newX += this.gap
        emptyNodeStart.setPosition(newX, newY)
        prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(emptyNodeStart, prevNode, true)
        })
        prevNodes = [emptyNodeStart]
        newX = newX - this.gap / 2 - 20
      }
      const prevNodesAr: Diagram.DefaultNodeModel[] = []
      node.parallel.forEach((nodeP: StageElementWrapper, index: number) => {
        const isLastNode = node.parallel.length === index + 1
        const resp = this.renderGraphNodes(nodeP, newX, newY, selectedStageId, prevNodes, isLastNode, true)
        startX = resp.startX
        newY = resp.startY + this.gap / 2
        if (resp.prevNodes) {
          prevNodesAr.push(...resp.prevNodes)
        }
      })
      if (!isEmpty(prevNodesAr)) {
        const emptyNodeEnd = new Diagram.EmptyNodeModel({
          id: `${EmptyNodeSeparator}${node.parallel[0].stage.identifier}${EmptyNodeSeparator}`,
          name: 'Empty'
        })
        this.addNode(emptyNodeEnd)
        startX += this.gap
        emptyNodeEnd.setPosition(startX, startY)
        prevNodesAr.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(emptyNodeEnd, prevNode, false)
        })
        prevNodes = [emptyNodeEnd]
        startX = startX - this.gap / 2 - 20
      }

      return { startX, startY, prevNodes }
    }
    return { startX, startY }
  }

  addUpdateGraph(data: CDPipelineDTO, listeners: Listeners, selectedStageId?: string): void {
    let { startX, startY } = this
    this.clearAllNodesAndLinks()
    // Unlock Graph
    this.setLocked(false)

    //Start Node
    const startNode = new Diagram.NodeStartModel({ id: 'start-new' })
    startNode.setPosition(startX, startY)
    this.addNode(startNode)

    // Stop Node
    const stopNode = new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false, color: 'var(--red-800)' })

    // Create Node
    const createNode = new Diagram.CreateNewModel({
      id: 'create-node',
      width: 114,
      height: 50,
      name: i18n.addStage,
      customNodeStyle: { borderColor: 'var(--pipeline-grey-border)' }
    })

    startX -= this.gap / 2
    let prevNodes: Diagram.DefaultNodeModel[] = [startNode]
    data.stages?.forEach((node: StageElementWrapper) => {
      const resp = this.renderGraphNodes(node, startX, startY, selectedStageId, prevNodes, true)
      startX = resp.startX
      startY = resp.startY
      if (resp.prevNodes) {
        prevNodes = resp.prevNodes
      }
    })
    createNode.setPosition(startX + this.gap, startY)
    stopNode.setPosition(startX + 2 * this.gap, startY)
    prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
      this.connectedParentToNode(createNode, prevNode, false)
    })
    this.connectedParentToNode(stopNode, createNode, false)
    this.addNode(stopNode)
    this.addNode(createNode)

    const nodes = this.getActiveNodeLayer().getNodes()
    for (const key in nodes) {
      const node = nodes[key]
      node.registerListener(listeners.nodeListeners)
    }
    const links = this.getActiveLinkLayer().getLinks()
    for (const key in links) {
      const link = links[key]
      link.registerListener(listeners.linkListeners)
    }
    // Lock the graph back
    this.setLocked(true)
  }
}

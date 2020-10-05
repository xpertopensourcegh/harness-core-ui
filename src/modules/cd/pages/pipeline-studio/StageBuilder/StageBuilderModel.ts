import type { IconName } from '@wings-software/uikit'
import { isEmpty } from 'lodash-es'
import { Diagram } from 'modules/common/exports'
import type { NgPipeline, StageElementWrapper } from 'services/cd-ng'
import i18n from './StageBuilder.i18n'
import { EmptyStageName } from '../PipelineConstants'
import {
  StageType,
  MapStepTypeToIcon,
  getTypeOfStage,
  getCommonStyles,
  EmptyNodeSeparator,
  Listeners,
  MapStepTypeToIconColor
} from './StageBuilderUtil'

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
    splitPaneSize?: number,
    prevNodes?: Diagram.DefaultNodeModel[],
    allowAdd?: boolean,
    isParallelNodes = false
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node && node.stage) {
      const { type } = getTypeOfStage(node.stage)
      startX += this.gap
      const isSelected = selectedStageId === node.stage.identifier
      const nodeRender =
        type === StageType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              identifier: node.stage.identifier,
              customNodeStyle: {
                // Without this doesn't look straight
                marginTop: '2.5px',
                ...getCommonStyles(isSelected)
              },
              name: node.stage.name,
              width: 57,
              isInComplete: node.stage.name === EmptyStageName,
              draggable: true,
              height: 57,
              iconStyle: { color: isSelected ? 'var(--white)' : MapStepTypeToIconColor[type] },
              icon: MapStepTypeToIcon[type]
            })
          : new Diagram.DefaultNodeModel({
              identifier: node.stage.identifier,
              customNodeStyle: getCommonStyles(isSelected),
              name: node.stage.name,
              isInComplete: node.stage.name === EmptyStageName,
              width: 114,
              draggable: true,
              allowAdd: allowAdd === true,
              height: 50,
              iconStyle: { color: isSelected ? 'var(--white)' : MapStepTypeToIconColor[type] },
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
    } else if (node.parallel && prevNodes) {
      if (node.parallel.length > 1) {
        if (selectedStageId && (splitPaneSize || 0) < (this.gap * node.parallel.length) / 2 + 40) {
          const parallelStageNames: Array<string> = []
          let isSelected = false
          const icons: Array<IconName> = []
          node.parallel.forEach((nodeP: StageElementWrapper) => {
            if (nodeP.stage.identifier === selectedStageId) {
              parallelStageNames.unshift(nodeP.stage.name)
              icons.unshift(MapStepTypeToIcon[getTypeOfStage(nodeP.stage).type])
              isSelected = true
            } else {
              parallelStageNames.push(nodeP.stage.name)
              icons.push(MapStepTypeToIcon[getTypeOfStage(nodeP.stage).type])
            }
          })
          const groupedNode = new Diagram.GroupNodeModel({
            customNodeStyle: getCommonStyles(isSelected),
            identifier: isSelected ? selectedStageId : node.parallel[0].stage.identifier,
            name:
              parallelStageNames.length > 2
                ? `${parallelStageNames[0]}, ${parallelStageNames[1]}, +${parallelStageNames.length - 2}`
                : parallelStageNames.join(', '),
            width: 114,
            height: 50,
            icons
          })
          startX += this.gap
          this.addNode(groupedNode)
          groupedNode.setPosition(startX, startY)
          if (!isEmpty(prevNodes) && prevNodes) {
            prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
              this.connectedParentToNode(groupedNode, prevNode, !isParallelNodes)
            })
          }
          prevNodes = [groupedNode]
        } else {
          let newX = startX
          let newY = startY
          if (!isEmpty(prevNodes)) {
            const emptyNodeStart = new Diagram.EmptyNodeModel({
              identifier: `${EmptyNodeSeparator}-${EmptyNodeSeparator}${node.parallel[0].stage.identifier}${EmptyNodeSeparator}`,
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
            const resp = this.renderGraphNodes(
              nodeP,
              newX,
              newY,
              selectedStageId,
              splitPaneSize,
              prevNodes,
              isLastNode,
              true
            )
            startX = resp.startX
            newY = resp.startY + this.gap / 2
            if (resp.prevNodes) {
              prevNodesAr.push(...resp.prevNodes)
            }
          })
          if (!isEmpty(prevNodesAr)) {
            const emptyNodeEnd = new Diagram.EmptyNodeModel({
              identifier: `${EmptyNodeSeparator}${node.parallel[0].stage.identifier}${EmptyNodeSeparator}`,
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
        }
      } else {
        return this.renderGraphNodes(
          node.parallel[0],
          startX,
          startY,
          selectedStageId,
          splitPaneSize,
          prevNodes,
          true,
          false
        )
      }
      return { startX, startY, prevNodes }
    }
    return { startX, startY }
  }

  addUpdateGraph(data: NgPipeline, listeners: Listeners, selectedStageId?: string, splitPaneSize?: number): void {
    let { startX, startY } = this
    this.clearAllNodesAndLinks() // TODO: Improve this

    // Unlock Graph
    this.setLocked(false)

    //Start Node
    const startNode = new Diagram.NodeStartModel({ id: 'start-new' })
    startNode.setPosition(startX, startY)
    this.addNode(startNode)

    // Stop Node
    const stopNode = new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false })

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
      const resp = this.renderGraphNodes(node, startX, startY, selectedStageId, splitPaneSize, prevNodes, true)
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

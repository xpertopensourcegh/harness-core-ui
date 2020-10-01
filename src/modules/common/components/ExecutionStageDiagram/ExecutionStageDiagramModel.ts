import type { LinkModelListener, NodeModelListener } from '@projectstorm/react-diagrams-core'
import type { BaseModelListener } from '@projectstorm/react-canvas-core'
import type { IconName } from '@wings-software/uikit'
import { last, isEmpty } from 'lodash-es'
import { Diagram } from 'modules/common/exports'
import { ExecutionPipeline, ExecutionPipelineNode, ExecutionPipelineNodeType } from './ExecutionPipelineModel'
import { getNodeStyles, getStatusProps } from './ExecutionStageDiagramUtils'

export interface NodeStyleInterface {
  width: number
  height: number
}

export interface GridStyleInterface {
  gridSize?: number
  startX?: number
  startY?: number
  gap?: number
}

export interface Listeners {
  nodeListeners: NodeModelListener
  linkListeners: LinkModelListener
  layerListeners: BaseModelListener
}

export const EmptyNodeSeparator = '$node$'

export class ExecutionStageDiagramModel extends Diagram.DiagramModel {
  nodeStyle: NodeStyleInterface = { width: 200, height: 200 }

  constructor() {
    super({
      gridSize: 100,
      startX: 70,
      startY: 50,
      gap: 200
    })
  }

  setGridStyle(style: GridStyleInterface): void {
    Object.assign(this, style)
  }

  setDefaultNodeStyle(style: NodeStyleInterface): void {
    this.nodeStyle = style
  }

  renderGraphNodes<T>(
    node: ExecutionPipelineNode<T>,
    startX: number,
    startY: number,
    selectedStageId?: string,
    diagramContainerHeight?: number,
    prevNodes?: Diagram.DefaultNodeModel[]
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    const { nodeStyle } = this
    if (node.item && !node.parallel) {
      const { item: stage } = node
      const { type } = stage
      startX += this.gap
      const isSelected = selectedStageId === stage.identifier
      const statusProps = getStatusProps(stage.status)
      const nodeRender =
        type === ExecutionPipelineNodeType.DIAMOND
          ? new Diagram.DiamondNodeModel({
              identifier: stage.identifier,
              customNodeStyle: {
                // Without this doesn't look straight
                marginTop: '2.5px',
                ...getNodeStyles(isSelected)
              },
              name: stage.name,
              width: nodeStyle.width,
              height: nodeStyle.height,
              ...statusProps,
              icon: stage.icon // stageTypeToIconNameMapper[type]
            })
          : new Diagram.DefaultNodeModel({
              identifier: stage.identifier,
              customNodeStyle: getNodeStyles(isSelected),
              name: stage.name,
              ...statusProps,
              width: nodeStyle.width,
              height: nodeStyle.height,
              icon: stage.icon //stageTypeToIconNameMapper[type]
            })

      this.addNode(nodeRender)
      nodeRender.setPosition(startX, startY)
      if (!isEmpty(prevNodes) && prevNodes) {
        prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(nodeRender, prevNode, false)
        })
      }
      return { startX, startY, prevNodes: [nodeRender] }
    } else if (node.parallel && prevNodes) {
      const { parallel } = node
      if (parallel.length > 1) {
        if (diagramContainerHeight && diagramContainerHeight < (this.gap * parallel.length) / 2 + 40) {
          const parallelStageNames: Array<string> = []
          let isSelected = false
          const icons: Array<IconName> = []
          parallel.forEach(nodeP => {
            if (nodeP.item?.identifier === selectedStageId && nodeP.item?.icon) {
              parallelStageNames.unshift(nodeP.item?.name || '')
              icons.unshift(nodeP.item?.icon) // stageTypeToIconNameMapper[nodeP.stage.type])
              isSelected = true
            } else {
              parallelStageNames.push(nodeP.item?.name || '')
              icons.push(nodeP.item?.icon || 'edit') // stageTypeToIconNameMapper[nodeP.stage.type])
            }
          })
          const groupedNode = new Diagram.GroupNodeModel({
            // TODO: check this - customNodeStyle: getNodeStyles(isSelected),
            identifier: isSelected ? selectedStageId : parallel[0].item?.identifier,
            name:
              parallelStageNames.length > 2
                ? `${parallelStageNames[0]}, ${parallelStageNames[1]}, +${parallelStageNames.length - 2}`
                : parallelStageNames.join(', '),
            width: nodeStyle.width,
            height: nodeStyle.height,
            icons
          })
          startX += this.gap
          this.addNode(groupedNode)
          groupedNode.setPosition(startX, startY)
          if (!isEmpty(prevNodes) && prevNodes) {
            prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
              this.connectedParentToNode(groupedNode, prevNode, false)
            })
          }
          prevNodes = [groupedNode]
        } else {
          let newX = startX
          let newY = startY
          if (!isEmpty(prevNodes)) {
            const emptyNodeStart = new Diagram.EmptyNodeModel({
              identifier: `${EmptyNodeSeparator}-${EmptyNodeSeparator}${parallel[0].item?.identifier}`,
              name: 'Empty'
            })
            this.addNode(emptyNodeStart)
            newX += this.gap
            emptyNodeStart.setPosition(newX, newY)
            prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
              this.connectedParentToNode(emptyNodeStart, prevNode, false)
            })
            prevNodes = [emptyNodeStart]
            newX = newX - this.gap / 2 - 20
          }
          const prevNodesAr: Diagram.DefaultNodeModel[] = []
          parallel.forEach(nodeP => {
            const resp = this.renderGraphNodes(nodeP, newX, newY, selectedStageId, diagramContainerHeight, prevNodes)
            startX = resp.startX
            newY = resp.startY + this.gap / 2 + (nodeStyle.height - 64)
            if (resp.prevNodes) {
              prevNodesAr.push(...resp.prevNodes)
            }
          })
          if (!isEmpty(prevNodesAr)) {
            const emptyNodeEnd = new Diagram.EmptyNodeModel({
              identifier: `${EmptyNodeSeparator}${parallel[0].item?.identifier}${EmptyNodeSeparator}`,
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
        return this.renderGraphNodes(parallel[0], startX, startY, selectedStageId, diagramContainerHeight, prevNodes)
      }
      return { startX, startY, prevNodes }
    } else if (node.group) {
      if (node.group.isOpen) {
        const stepGroupLayer = new Diagram.StepGroupNodeLayerModel({
          identifier: node.group.identifier,
          label: node.group.name,
          showRollback: false
        })
        if (prevNodes && prevNodes.length > 0) {
          startX += this.gap
          stepGroupLayer.startNode.setPosition(startX, startY)
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(stepGroupLayer.startNode, prevNode, false)
          })
          prevNodes = [stepGroupLayer.startNode]
          startX = startX - this.gap / 2 - 20
        }
        this.useStepGroupLayer(stepGroupLayer)

        // Check if step group has nodes
        if (node.group.items?.length > 0) {
          node.group.items.forEach(step => {
            const resp = this.renderGraphNodes(step, startX, startY, selectedStageId, diagramContainerHeight, prevNodes)
            startX = resp.startX
            startY = resp.startY
            if (resp.prevNodes) {
              prevNodes = resp.prevNodes
            }
          })
        }
        if (prevNodes && prevNodes.length > 0) {
          startX = startX + this.gap
          stepGroupLayer.endNode.setPosition(startX, startY)
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(stepGroupLayer.endNode, prevNode, false)
          })
          prevNodes = [stepGroupLayer.endNode]
          startX = startX - this.gap / 2 - 20
        }
        this.useNormalLayer()
        return { startX, startY, prevNodes: prevNodes }
      } else {
        startX += this.gap
        const nodeRender = new Diagram.DefaultNodeModel({
          identifier: node.group.identifier,
          name: node.group.name,
          icon: node.group.icon,
          secondaryIcon: 'plus',
          customNodeStyle: node.group.cssProps
        })
        this.addNode(nodeRender)
        nodeRender.setPosition(startX, startY)
        if (!isEmpty(prevNodes) && prevNodes) {
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(nodeRender, prevNode, false)
          })
        }
        return { startX, startY, prevNodes: [nodeRender] }
      }
    }
    return { startX, startY }
  }

  addUpdateGraph<T>(
    pipeline: ExecutionPipeline<T>,
    listeners: Listeners,
    selectedStageId?: string,
    diagramContainerHeight?: number,
    showStartEndNode?: boolean
  ): void {
    const { gap } = this
    let { startX, startY } = this
    this.clearAllNodesAndLinks() // TODO: Improve this

    // Unlock Graph
    this.setLocked(false)

    let prevNodes: Diagram.DefaultNodeModel[] = []

    if (showStartEndNode) {
      //Start Node
      const startNode = new Diagram.NodeStartModel({ id: 'start-new' })
      startNode.setPosition(startX, startY)
      this.addNode(startNode)
      startX -= gap / 2
      prevNodes = [startNode]
    } else {
      startX -= gap
    }

    pipeline.items?.forEach(node => {
      const resp = this.renderGraphNodes(node, startX, startY, selectedStageId, diagramContainerHeight, prevNodes)
      startX = resp.startX
      startY = resp.startY
      if (resp.prevNodes) {
        prevNodes = resp.prevNodes
      }
    })

    if (showStartEndNode) {
      // Stop Node
      const stopNode = new Diagram.NodeStartModel({ id: 'stop', icon: 'stop', isStart: false })

      stopNode.setPosition(startX + gap, startY)
      const lastNode = last(prevNodes)
      if (lastNode) {
        this.connectedParentToNode(stopNode, lastNode, false)
      }
      this.addNode(stopNode)
    }

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

    this.stepGroupLayers.forEach(layer => {
      layer.registerListener(listeners.layerListeners)
      const nodesInLayer = layer.getNodes()
      for (const key in nodesInLayer) {
        const node = nodesInLayer[key]
        node.registerListener(listeners.nodeListeners)
      }
    })

    // Lock the graph back
    this.setLocked(true)
  }
}

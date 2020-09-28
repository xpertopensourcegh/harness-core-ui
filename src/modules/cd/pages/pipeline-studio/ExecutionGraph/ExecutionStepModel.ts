import { isEmpty } from 'lodash-es'
import { Diagram } from 'modules/common/exports'
import type { ExecutionWrapper, ExecutionElement } from 'services/cd-ng'
import factory from '../../../components/PipelineSteps/PipelineStepFactory'
import { StepType } from '../../../components/PipelineSteps/PipelineStepInterface'
import { Listeners, calculateDepthCount, StepStateMap, isCustomGeneratedString } from './ExecutionGraphUtil'
import { EmptyNodeSeparator } from '../StageBuilder/StageBuilderUtil'

export class ExecutionStepModel extends Diagram.DiagramModel {
  constructor() {
    super({
      gridSize: 100,
      startX: -100,
      startY: 50,
      gap: 200
    })
  }

  renderGraphNodes(
    node: ExecutionWrapper,
    startX: number,
    startY: number,
    stepStates: StepStateMap,
    isRollback = false,
    prevNodes?: Diagram.DefaultNodeModel[],
    allowAdd?: boolean,
    isParallelNode = false,
    isStepGroupNode = false
  ): { startX: number; startY: number; prevNodes?: Diagram.DefaultNodeModel[] } {
    if (node.step) {
      const type = node?.step?.type || StepType.APPROVAL
      startX += this.gap
      const nodeRender =
        type === StepType.APPROVAL
          ? new Diagram.DiamondNodeModel({
              identifier: node.step.identifier,
              name: node.step.name,
              icon: 'command-approval',
              draggable: true,
              isInComplete: isCustomGeneratedString(node.step.identifier),
              customNodeStyle: { borderColor: 'var(--pipeline-grey-border)' }
            })
          : new Diagram.DefaultNodeModel({
              identifier: node.step.identifier,
              name: node.step.name,
              icon: factory.getStepIcon(type),
              allowAdd: allowAdd === true,
              isInComplete: isCustomGeneratedString(node.step.identifier),
              draggable: true,
              customNodeStyle: { borderColor: 'var(--pipeline-grey-border)' }
            })

      this.addNode(nodeRender)
      nodeRender.setPosition(startX, startY)
      if (!isEmpty(prevNodes) && prevNodes) {
        prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
          this.connectedParentToNode(
            nodeRender,
            prevNode,
            !isParallelNode,
            isStepGroupNode ? 4 : 0,
            isStepGroupNode ? 'var(--pipeline-grey-border)' : 'var(--diagram-link)'
          )
        })
      }
      return { startX, startY, prevNodes: [nodeRender] }
    } else if (node.parallel && prevNodes) {
      if (node.parallel.length > 1) {
        let newX = startX
        let newY = startY
        if (prevNodes && node.parallel.length > 1) {
          const emptyNode = new Diagram.EmptyNodeModel({
            identifier: node.parallel[0].step
              ? `${EmptyNodeSeparator}-${EmptyNodeSeparator}${node.parallel[0].step.identifier}${EmptyNodeSeparator}`
              : `${EmptyNodeSeparator}-${EmptyNodeSeparator}${node.parallel[0].stepGroup.identifier}${EmptyNodeSeparator}`,
            name: 'Empty'
          })
          this.addNode(emptyNode)
          newX += this.gap
          emptyNode.setPosition(newX, newY)
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(
              emptyNode,
              prevNode,
              true,
              isStepGroupNode ? 4 : 0,
              isStepGroupNode ? 'var(--pipeline-grey-border)' : 'var(--diagram-link)'
            )
          })
          prevNodes = [emptyNode]
          newX = newX - this.gap / 2 - 20
        }
        const prevNodesAr: Diagram.DefaultNodeModel[] = []

        node.parallel.forEach((nodeP: ExecutionWrapper, index: number) => {
          const isLastNode = node.parallel.length === index + 1
          const resp = this.renderGraphNodes(
            nodeP,
            newX,
            newY,
            stepStates,
            isRollback,
            prevNodes,
            isLastNode,
            true,
            isStepGroupNode
          )
          if (resp.startX > startX) {
            startX = resp.startX
          }
          newY = resp.startY + this.gap * calculateDepthCount(nodeP, stepStates)
          if (resp.prevNodes) {
            prevNodesAr.push(...resp.prevNodes)
          }
        })
        if (prevNodes && node.parallel.length > 1) {
          const emptyNodeEnd = new Diagram.EmptyNodeModel({
            identifier: node.parallel[0].step
              ? `${EmptyNodeSeparator}${node.parallel[0].step.identifier}${EmptyNodeSeparator}`
              : `${EmptyNodeSeparator}${node.parallel[0].stepGroup.identifier}${EmptyNodeSeparator}`,
            name: 'Empty'
          })
          this.addNode(emptyNodeEnd)
          startX += this.gap
          emptyNodeEnd.setPosition(startX, startY)

          this.connectMultipleParentsToNode(
            emptyNodeEnd,
            prevNodesAr,
            false,
            isStepGroupNode ? 4 : 0,
            isStepGroupNode ? 'var(--pipeline-grey-border)' : 'var(--diagram-link)'
          )
          prevNodes = [emptyNodeEnd]
          startX = startX - this.gap / 2 - 20
        }

        return { startX, startY, prevNodes }
      } else if (node.parallel.length === 1) {
        return this.renderGraphNodes(
          node.parallel[0],
          startX,
          startY,
          stepStates,
          isRollback,
          prevNodes,
          true,
          true,
          isStepGroupNode
        )
      }
    } else if (node.stepGroup) {
      const stepState = stepStates.get(node.stepGroup.identifier)
      if (stepState && stepState.isStepGroupCollapsed) {
        startX += this.gap
        const nodeRender = new Diagram.DefaultNodeModel({
          identifier: node.stepGroup.identifier,
          name: node.stepGroup.name,
          icon: factory.getStepIcon(StepType.StepGroup),
          secondaryIcon: 'plus',
          draggable: true,
          allowAdd: allowAdd === true,
          customNodeStyle: { borderColor: 'var(--pipeline-grey-border)', backgroundColor: '#55b8ec' }
        })

        this.addNode(nodeRender)
        nodeRender.setPosition(startX, startY)
        if (!isEmpty(prevNodes) && prevNodes) {
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(nodeRender, prevNode, !isParallelNode, 0)
          })
        }
        return { startX, startY, prevNodes: [nodeRender] }
      } else {
        const stepGroupLayer = new Diagram.StepGroupNodeLayerModel({
          identifier: node.stepGroup.identifier,
          label: node.stepGroup.name,
          depth: stepState?.inheritedSG || 1,
          allowAdd: allowAdd === true,
          showRollback: !isRollback,
          rollBackProps: {
            active: stepState?.isStepGroupRollback ? Diagram.StepsType.Rollback : Diagram.StepsType.Normal
          }
        })
        if (prevNodes && prevNodes.length > 0) {
          startX += this.gap
          stepGroupLayer.startNode.setPosition(startX, startY)
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(
              stepGroupLayer.startNode,
              prevNode,
              !isParallelNode,
              isStepGroupNode ? 4 : 0,
              isStepGroupNode ? 'var(--pipeline-grey-border)' : 'var(--diagram-link)'
            )
          })
          prevNodes = [stepGroupLayer.startNode]
          startX = startX - this.gap / 2 - 20
        }
        this.useStepGroupLayer(stepGroupLayer)
        let steps = node.stepGroup.steps
        if (stepState?.isStepGroupRollback) {
          if (!node.stepGroup.rollbackSteps) {
            node.stepGroup.rollbackSteps = []
          }
          steps = node.stepGroup.rollbackSteps
        }
        // Check if step group has nodes
        if (steps?.length > 0) {
          steps.forEach((nodeP: ExecutionElement) => {
            const resp = this.renderGraphNodes(
              nodeP,
              startX,
              startY,
              stepStates,
              isRollback,
              prevNodes,
              true,
              false,
              true
            )
            startX = resp.startX
            startY = resp.startY
            if (resp.prevNodes) {
              prevNodes = resp.prevNodes
            }
          })
        } else {
          // Else show Create Node
          const createNode = new Diagram.CreateNewModel({
            identifier: `${EmptyNodeSeparator}${node.stepGroup.identifier}${EmptyNodeSeparator}`,
            customNodeStyle: { borderColor: 'var(--pipeline-grey-border)' }
          })
          this.addNode(createNode)
          startX += this.gap
          createNode.setPosition(startX, startY)
          this.connectedParentToNode(createNode, stepGroupLayer.startNode, false, 4, 'var(--pipeline-grey-border)')
          prevNodes = [createNode]
        }
        if (prevNodes && prevNodes.length > 0) {
          startX = startX + this.gap
          stepGroupLayer.endNode.setPosition(startX, startY)
          prevNodes.forEach((prevNode: Diagram.DefaultNodeModel) => {
            this.connectedParentToNode(
              stepGroupLayer.endNode,
              prevNode,
              node.stepGroup.steps?.length > 0,
              4,
              'var(--pipeline-grey-border)'
            )
          })
          prevNodes = [stepGroupLayer.endNode]
          startX = startX - this.gap / 2 - 20
        }
        this.useNormalLayer()
        return { startX, startY, prevNodes: prevNodes }
      }
    }
    return { startX, startY }
  }

  addUpdateGraph(
    data: ExecutionWrapper[],
    { nodeListeners, linkListeners, layerListeners }: Listeners,
    stepStates: StepStateMap,
    isRollback: boolean
  ): void {
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
    const createNode = new Diagram.CreateNewModel({
      customNodeStyle: { borderColor: 'var(--pipeline-grey-border)' }
    })

    let prevNodes: Diagram.DefaultNodeModel[] = [startNode]
    data.forEach((node: ExecutionWrapper) => {
      const resp = this.renderGraphNodes(node, startX, startY, stepStates, isRollback, prevNodes, true)
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
      this.connectedParentToNode(createNode, prevNode, false)
    })
    this.addNode(createNode)

    stopNode.setPosition(startX + 2 * this.gap, startY)
    this.connectedParentToNode(stopNode, createNode, false)
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

    this.stepGroupLayers.forEach(layer => {
      layer.registerListener(layerListeners)
      const nodesInLayer = layer.getNodes()
      for (const key in nodesInLayer) {
        const node = nodesInLayer[key]
        node.registerListener(nodeListeners)
      }
    })

    this.setLocked(true)
  }
}

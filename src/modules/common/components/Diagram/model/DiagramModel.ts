import type { DiagramModelOptions as DiagramModelCoreOptions, BaseModel } from '@projectstorm/react-canvas-core'
import { isNil } from 'lodash'
import {
  DiagramModel as DiagramModelCore,
  DiagramModelGenerics as DiagramModelGenericsCore
} from '@projectstorm/react-diagrams-core'
import { DefaultLinkModel } from '../link/DefaultLinkModel'
import { DefaultNodeModel } from '../node/DefaultNodeModel'
import type { Point } from '@projectstorm/geometry'
import css from './DiagramModel.module.scss'

export interface DiagramModelOptions extends DiagramModelCoreOptions {
  autoPosition?: boolean
  startX?: number
  startY?: number
  gap?: number
}

export interface DiagramModelGenerics extends DiagramModelGenericsCore {
  OPTIONS: DiagramModelOptions
}

export class DiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends DiagramModelCore<G> {
  autoPosition: boolean
  startX: number
  startY: number
  gap: number

  constructor(options: G['OPTIONS'] = {}) {
    super(options)
    options.gridSize = 100
    this.autoPosition = options.autoPosition || true
    this.startX = options.startX || 100
    this.startY = options.startY || 100
    this.gap = options.gap || 200
  }

  checkNodeNotAdded(node: DefaultNodeModel | undefined): boolean {
    const nodeId = node?.getID()
    const nodeRendered = this.getNode(nodeId || '')
    return isNil(nodeRendered)
  }

  protected connectedParentToNode(node: DefaultNodeModel, parent: DefaultNodeModel, isParallel = false): void {
    const inPort = node.getPort('In') || node.addInPort('In')
    const links = inPort.getLinks()
    let isConnectedToParent = false
    for (const linkId in links) {
      const link = links[linkId]
      const nodeId = link.getSourcePort().getNode().getID()
      if (nodeId === parent.getID()) {
        isConnectedToParent = true
      }
    }
    if (!isConnectedToParent) {
      const parentPort = parent.getPort('Out') || parent.addOutPort('Out')
      if (parentPort && inPort) {
        const link = new DefaultLinkModel({ color: isParallel ? 'orange' : 'gray' })
        link.setSourcePort(parentPort)
        link.setTargetPort(inPort)
        this.addLink(link)
      }
    }
  }
  getNodeLinkAtPosition(position: Point): BaseModel | undefined {
    const nodes = this.getActiveNodeLayer().getNodes()
    const nearByNodes: DefaultNodeModel[] = []
    for (const key in nodes) {
      const node = nodes[key] as DefaultNodeModel
      const dom = document.querySelector(`[data-nodeid="${node.getID()}"]`)
      if (node.getBoundingBox().containsPoint(position)) {
        nearByNodes.push(node)
      }
      dom?.classList.remove(css.selected)
    }

    const links = this.getActiveLinkLayer().getLinks()
    const nearByLinks: DefaultLinkModel[] = []
    for (const key in links) {
      const link = links[key] as DefaultLinkModel
      const dom = document.querySelector(`[data-linkid="${link.getID()}"]`)
      if (link.getBoundingBox().containsPoint(position)) {
        nearByLinks.push(link)
      }
      dom?.classList.remove(css.selectedLink)
    }
    if (nearByNodes.length === 1) {
      return nearByNodes[0]
    } else if (nearByLinks.length === 1) {
      return nearByLinks[0]
    }
    return undefined
  }

  highlightNodesAndLink(position: Point): BaseModel | undefined {
    const nodeLink = this.getNodeLinkAtPosition(position)
    if (nodeLink instanceof DefaultNodeModel) {
      const dom = document.querySelector(`[data-nodeid="${nodeLink.getID()}"]`)
      dom?.classList.add(css.selected)
    } else if (nodeLink instanceof DefaultLinkModel) {
      const dom = document.querySelector(`[data-linkid="${nodeLink.getID()}"]`)
      dom?.classList.add(css.selectedLink)
    }
    return nodeLink
  }
}

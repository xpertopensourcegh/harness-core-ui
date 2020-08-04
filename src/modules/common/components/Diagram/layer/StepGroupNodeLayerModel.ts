import { LayerModel, LayerModelGenerics, LayerModelOptions } from '@projectstorm/react-canvas-core'
import { DiagramEngine, NodeModel, DiagramModel } from '@projectstorm/react-diagrams-core'
import { EmptyNodeModel } from '../node/EmptyNode/EmptyNodeModel'

export interface StepGroupNodeLayerOptions extends LayerModelOptions {
  label?: string
  depth?: number
  identifier?: string
}

export interface StepGroupNodeLayerModelGenerics extends LayerModelGenerics {
  OPTIONS: StepGroupNodeLayerOptions
  CHILDREN: NodeModel
  ENGINE: DiagramEngine
}

export class StepGroupNodeLayerModel<
  G extends StepGroupNodeLayerModelGenerics = StepGroupNodeLayerModelGenerics
> extends LayerModel<G> {
  startNode: EmptyNodeModel
  endNode: EmptyNodeModel

  constructor(options: StepGroupNodeLayerOptions = {}) {
    super({
      type: 'step-group-nodes',
      isSvg: false,
      depth: 1,
      transformed: true,
      ...options
    })
    this.startNode = new EmptyNodeModel({ identifier: options.identifier, name: 'Empty' })
    this.endNode = new EmptyNodeModel({ identifier: options.identifier, name: 'Empty' })
    this.addModel(this.startNode)
    this.addModel(this.endNode)
  }

  addModel(model: G['CHILDREN']): void {
    if (!(model instanceof NodeModel)) {
      throw new Error('Can only add nodes to this layer')
    }
    model.registerListener({
      entityRemoved: () => {
        ;(this.getParent() as DiagramModel).removeNode(model)
      }
    })
    super.addModel(model)
  }

  getIdentifier(): string | undefined {
    return this.options.identifier
  }

  getChildModelFactoryBank(engine: G['ENGINE']) {
    return engine.getNodeFactories()
  }

  getNodes() {
    return this.getModels()
  }
}

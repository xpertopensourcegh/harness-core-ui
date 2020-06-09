import { DefaultNodeModel, DefaultNodeModelOptions } from '../DefaultNodeModel'
import { DiagramType } from '../../Constants'
import { DefaultPortModel } from '../../port/DefaultPortModel'

export interface NodeStartModelOptions extends Omit<DefaultNodeModelOptions, 'name'> {
  color?: string
}

export class NodeStartModel extends DefaultNodeModel {
  color: string

  constructor(options: NodeStartModelOptions = {}) {
    super({
      ...options,
      type: DiagramType.StartNode,
      name: 'Start'
    })
    this.color = options.color || 'var(--diagram-start-node)'
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: 'Out'
      })
    )
  }

  serialize(): any {
    return {
      ...super.serialize(),
      color: this.color
    }
  }

  deserialize(event: any): void {
    super.deserialize(event)
    this.color = event.data.color
  }
}

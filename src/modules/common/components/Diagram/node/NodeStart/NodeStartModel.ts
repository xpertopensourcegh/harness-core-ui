import { DefaultNodeModel, DefaultNodeModelOptions } from '../DefaultNodeModel'
import { DiagramType } from '../../Constants'
import { DefaultPortModel } from '../../port/DefaultPortModel'

export interface NodeStartModelOptions extends Omit<DefaultNodeModelOptions, 'name'> {
  color?: string
  isStart?: boolean
}

export class NodeStartModel extends DefaultNodeModel {
  color: string
  isStart: boolean

  constructor(options: NodeStartModelOptions = {}) {
    const { isStart = true, color } = options
    super({
      ...options,
      type: DiagramType.StartNode,
      icon: isStart ? 'play' : 'stop',
      name: isStart ? 'Start' : 'Stop'
    })
    this.isStart = isStart
    const defaultColor = isStart ? 'var(--diagram-start-node)' : 'var(--diagram-stop-node)'
    this.color = color ? color : defaultColor
    if (this.isStart) {
      this.addPort(
        new DefaultPortModel({
          in: false,
          name: 'Out'
        })
      )
    } else {
      this.addPort(
        new DefaultPortModel({
          in: true,
          name: 'In'
        })
      )
    }
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

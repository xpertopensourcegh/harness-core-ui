import { DefaultNodeModel, DefaultNodeModelOptions } from '../DefaultNodeModel'
import { DefaultPortModel } from '../../port/DefaultPortModel'
import { DiagramType } from '../../Constants'

export class EmptyNodeModel extends DefaultNodeModel {
  constructor(option: DefaultNodeModelOptions = { name: 'Empty' }) {
    super({ type: DiagramType.EmptyNode, ...option })
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: 'Out'
      })
    )
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: 'In'
      })
    )
  }

  serialize(): any {
    return {
      ...super.serialize()
    }
  }

  deserialize(event: any): void {
    super.deserialize(event)
  }
}

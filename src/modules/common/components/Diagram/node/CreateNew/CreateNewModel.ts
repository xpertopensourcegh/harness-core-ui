import { DefaultNodeModel, DefaultNodeModelOptions } from '../DefaultNodeModel'
import i18n from '../../Diagram.i18n'
import { DiagramType } from '../../Constants'
import { DefaultPortModel } from '../../port/DefaultPortModel'

export interface CreateNewModelOptions extends Omit<DefaultNodeModelOptions, 'name'> {
  name?: string
}

export class CreateNewModel extends DefaultNodeModel {
  name: string

  constructor(options: CreateNewModelOptions = {}) {
    const name = options.name || i18n.CreateNew
    super({
      ...options,
      type: DiagramType.CreateNew,
      name
    })
    this.name = name
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: 'In'
      })
    )
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: 'Out'
      })
    )
  }

  serialize(): any {
    return {
      ...super.serialize(),
      text: this.name
    }
  }

  deserialize(event: any): void {
    super.deserialize(event)
    this.name = event.data.text
  }
}

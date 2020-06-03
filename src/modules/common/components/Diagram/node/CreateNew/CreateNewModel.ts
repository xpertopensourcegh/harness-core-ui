import type { BaseModelOptions } from '@projectstorm/react-canvas-core'
import { DefaultNodeModel } from '../DefaultNodeModel'
import i18n from '../../Diagram.i18n'
import { DiagramType } from '../../Constants'
import { DefaultPortModel } from '../../port/DefaultPortModel'

export interface CreateNewModelOptions extends BaseModelOptions {
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
        name: 'in'
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

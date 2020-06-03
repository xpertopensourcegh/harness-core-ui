import { DefaultPortModel } from './DefaultPortModel'
import { AbstractModelFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DiagramType } from '../Constants'

export class DefaultPortFactory extends AbstractModelFactory<DefaultPortModel, DiagramEngine> {
  constructor() {
    super(DiagramType.Default)
  }

  generateModel(): DefaultPortModel {
    return new DefaultPortModel({
      name: ''
    })
  }
}

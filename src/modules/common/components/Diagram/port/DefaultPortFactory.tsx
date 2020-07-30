import { AbstractModelFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DefaultPortModel } from './DefaultPortModel'
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

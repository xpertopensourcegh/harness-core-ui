import * as React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { CreateNewModel } from './CreateNewModel'
import { CreateNewWidget } from './CreateNewWidget'
import { DiagramType } from '../../Constants'

export class CreateNewFactory extends AbstractReactFactory<CreateNewModel, DiagramEngine> {
  constructor() {
    super(DiagramType.CreateNew)
  }

  generateModel(): CreateNewModel {
    return new CreateNewModel()
  }

  generateReactWidget(event: any): JSX.Element {
    return <CreateNewWidget engine={this.engine} node={event.model} />
  }
}

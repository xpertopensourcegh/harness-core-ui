import React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DefaultNodeModel } from './DefaultNodeModel'
import { DefaultNodeWidget } from './DefaultNodeWidget'
import { DiagramType } from '../Constants'

export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel, DiagramEngine> {
  constructor() {
    super(DiagramType.Default)
  }

  generateReactWidget(event: { model: DefaultNodeModel }): JSX.Element {
    return <DefaultNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel(): DefaultNodeModel {
    return new DefaultNodeModel()
  }
}

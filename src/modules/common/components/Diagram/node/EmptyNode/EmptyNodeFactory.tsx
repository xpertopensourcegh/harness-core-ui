import * as React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { EmptyNodeModel } from './EmptyNodeModel'
import { EmptyNodeWidget } from './EmptyNodeWidget'
import { DiagramType } from '../../Constants'

export class EmptyNodeFactory extends AbstractReactFactory<EmptyNodeModel, DiagramEngine> {
  constructor() {
    super(DiagramType.EmptyNode)
  }

  generateModel(): EmptyNodeModel {
    return new EmptyNodeModel()
  }

  generateReactWidget(event: any): JSX.Element {
    return <EmptyNodeWidget engine={this.engine} node={event.model} />
  }
}

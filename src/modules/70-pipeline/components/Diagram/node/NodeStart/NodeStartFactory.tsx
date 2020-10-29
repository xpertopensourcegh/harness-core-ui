import * as React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { NodeStartModel } from './NodeStartModel'
import { NodeStartWidget } from './NodeStartWidget'
import { DiagramType } from '../../Constants'

export class NodeStartFactory extends AbstractReactFactory<NodeStartModel, DiagramEngine> {
  constructor() {
    super(DiagramType.StartNode)
  }

  generateModel(): NodeStartModel {
    return new NodeStartModel()
  }

  generateReactWidget(event: any): JSX.Element {
    return <NodeStartWidget engine={this.engine} node={event.model} />
  }
}

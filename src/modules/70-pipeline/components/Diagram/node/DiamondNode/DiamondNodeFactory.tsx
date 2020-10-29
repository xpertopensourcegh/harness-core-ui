import React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DiamondNodeModel } from './DiamondNodeModel'
import { DiamondNodeWidget } from './DiamondNodeWidget'
import { DiagramType } from '../../Constants'

export class DiamondNodeFactory extends AbstractReactFactory<DiamondNodeModel, DiagramEngine> {
  constructor() {
    super(DiagramType.DiamondNode)
  }

  generateReactWidget(event: { model: DiamondNodeModel }): JSX.Element {
    return <DiamondNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel(): DiamondNodeModel {
    return new DiamondNodeModel()
  }
}

import React from 'react'
import { DefaultLabelModel } from './DefaultLabelModel'
import { DefaultLabelWidget } from './DefaultLabelWidget'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DiagramType } from '../Constants'

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> {
  constructor() {
    super(DiagramType.Default)
  }

  generateReactWidget(event: { model: DefaultLabelModel }): JSX.Element {
    return <DefaultLabelWidget model={event.model} />
  }

  generateModel(): DefaultLabelModel {
    return new DefaultLabelModel()
  }
}

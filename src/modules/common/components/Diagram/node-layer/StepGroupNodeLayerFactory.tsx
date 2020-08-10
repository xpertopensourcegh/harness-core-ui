import * as React from 'react'
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { StepGroupNodeLayerModel } from './StepGroupNodeLayerModel'
import { StepGroupNodeLayerWidget } from './StepGroupNodeLayerWidget'

export class StepGroupNodeLayerFactory extends AbstractReactFactory<StepGroupNodeLayerModel, DiagramEngine> {
  constructor() {
    super('step-group-nodes')
  }

  generateModel(): StepGroupNodeLayerModel {
    return new StepGroupNodeLayerModel()
  }

  generateReactWidget(event: GenerateWidgetEvent<StepGroupNodeLayerModel>): JSX.Element {
    return <StepGroupNodeLayerWidget layer={event.model} engine={this.engine} />
  }
}

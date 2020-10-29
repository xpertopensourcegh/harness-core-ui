import React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { GroupNodeModel } from './GroupNodeModel'
import { GroupNodeWidget } from './GroupNodeWidget'
import { DiagramType } from '../../Constants'

export class GroupNodeFactory extends AbstractReactFactory<GroupNodeModel, DiagramEngine> {
  constructor() {
    super(DiagramType.GroupNode)
  }

  generateReactWidget(event: { model: GroupNodeModel }): JSX.Element {
    return <GroupNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel(): GroupNodeModel {
    return new GroupNodeModel()
  }
}

import React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { DefaultLinkModel } from './DefaultLinkModel'
import { DefaultLinkWidget } from './DefaultLinkWidget'
import { DiagramType } from '../Constants'

export class DefaultLinkFactory<Link extends DefaultLinkModel = DefaultLinkModel> extends AbstractReactFactory<
  Link,
  DiagramEngine
> {
  constructor(type = DiagramType.Default) {
    super(type)
  }

  generateReactWidget(event: { model: DefaultLinkModel }): JSX.Element {
    return <DefaultLinkWidget link={event.model} diagramEngine={this.engine} />
  }

  generateModel(): Link {
    return new DefaultLinkModel() as Link
  }

  generateLinkSegment(model: Link, selected: boolean, path: string): JSX.Element {
    return (
      <path
        stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
        strokeWidth={model.getOptions().width}
        d={path}
        fill="none"
        pointerEvents="all"
      ></path>
    )
  }
}

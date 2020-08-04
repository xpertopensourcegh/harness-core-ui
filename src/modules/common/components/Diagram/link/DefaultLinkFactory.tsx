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
    const options = model.getOptions()
    return (
      <path
        stroke={selected ? options.selectedColor : options.color}
        strokeWidth={options.width}
        strokeDasharray={options.strokeDasharray}
        d={path}
        fill="none"
        pointerEvents="all"
      ></path>
    )
  }
}

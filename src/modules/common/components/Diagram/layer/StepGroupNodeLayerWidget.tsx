import * as React from 'react'
import { map } from 'lodash'
import { DiagramEngine, NodeWidget, NodeModel } from '@projectstorm/react-diagrams-core'
import { Text, Button } from '@wings-software/uikit'
import type { StepGroupNodeLayerModel } from './StepGroupNodeLayerModel'
import { Event } from '../Constants'
import css from './StepGroupNodeLayer.module.scss'
export interface StepGroupNodeLayerWidgetProps {
  layer: StepGroupNodeLayerModel
  engine: DiagramEngine
}

export const StepGroupNodeLayerWidget = (props: StepGroupNodeLayerWidgetProps): JSX.Element => {
  const options = props.layer.getOptions()

  const config = {
    maxX: props.layer.endNode.getPosition().x,
    maxY: 0,
    minX: props.layer.startNode.getPosition().x,
    minY: 0
  }
  const nodes = props.layer.getNodes()
  map(nodes, (node: NodeModel) => {
    const position = node.getPosition()
    if (config.maxY === 0) {
      config.maxY = position.y
      config.minY = position.y
    }
    if (config.maxY < position.y) {
      config.maxY = position.y
    }
    if (config.minY > position.y) {
      config.minY = position.y
    }
  })
  const depth = options.depth || 1
  const width = config.maxX - config.minX
  const height = config.maxY - config.minY + 150 * depth
  return (
    <>
      <div
        className={css.groupLayer}
        style={{
          left: config.minX,
          top: config.minY - 40 * depth,
          width,
          height
        }}
      ></div>
      <div
        className={css.header}
        style={{
          top: config.minY - (40 * depth - 5),
          left: config.minX + 10
        }}
      >
        <Button
          minimal
          icon="minus"
          iconProps={{
            size: 8
          }}
          onClick={e => {
            e.stopPropagation()
            props.layer.fireEvent({}, Event.StepGroupCollapsed)
          }}
        />
        <Text
          onClick={e => {
            e.stopPropagation()
            props.layer.fireEvent({}, Event.StepGroupClicked)
          }}
        >
          {options.label}
        </Text>
      </div>
      <>
        {map(nodes, (node: NodeModel) => {
          return <NodeWidget key={node.getID()} diagramEngine={props.engine} node={node} />
        })}
      </>
    </>
  )
}

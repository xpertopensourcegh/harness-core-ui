import * as React from 'react'
import { map } from 'lodash-es'
import { DiagramEngine, NodeWidget, NodeModel } from '@projectstorm/react-diagrams-core'
import { Text, Button, Icon } from '@wings-software/uikit'
import type { StepGroupNodeLayerModel } from './StepGroupNodeLayerModel'
import { Event, StepsType, DiagramDrag } from '../Constants'
import { RollbackToggleSwitch } from '../canvas/RollbackToggleSwitch/RollbackToggleSwitch'
import i18n from '../Diagram.i18n'
import css from './StepGroupNodeLayer.module.scss'

export interface StepGroupNodeLayerWidgetProps {
  layer: StepGroupNodeLayerModel
  engine: DiagramEngine
}

const onAddNodeClick = (
  e: React.MouseEvent<Element, MouseEvent>,
  node: StepGroupNodeLayerModel,
  setAddClicked: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  e.stopPropagation()
  node.fireEvent(
    {
      callback: () => {
        setAddClicked(false)
      },
      target: e.target
    },
    Event.AddParallelNode
  )
}

export const StepGroupNodeLayerWidget = (props: StepGroupNodeLayerWidgetProps): JSX.Element => {
  const options = props.layer.getOptions()
  const allowAdd = options.allowAdd
  const rollBackProps = options.rollBackProps || {}
  const config = {
    maxX: props.layer.endNode.getPosition().x,
    maxY: 0,
    minX: props.layer.startNode.getPosition().x,
    minY: 0
  }
  const nodes = props.layer.getNodes()
  const layerRef = React.useRef<HTMLDivElement>(null)
  const [showAdd, setVisibilityOfAdd] = React.useState(false)
  const [addClicked, setAddClicked] = React.useState(false)

  React.useEffect(() => {
    const nodeLayer = layerRef.current

    const onMouseOver = (): void => {
      if (!addClicked) {
        setVisibilityOfAdd(true)
      }
    }
    const onMouseLeave = (): void => {
      if (!addClicked) {
        setVisibilityOfAdd(false)
      }
    }

    if (nodeLayer && allowAdd) {
      nodeLayer.addEventListener('mouseenter', onMouseOver)
      nodeLayer.addEventListener('mouseleave', onMouseLeave)
    }
    return () => {
      if (nodeLayer && allowAdd) {
        nodeLayer.removeEventListener('mouseenter', onMouseOver)
        nodeLayer.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [layerRef, allowAdd, addClicked])

  React.useEffect(() => {
    if (!addClicked) {
      setVisibilityOfAdd(false)
    }
  }, [addClicked])

  let nodeWidth = 0
  let nodeHeight = 0
  map(nodes, (node: NodeModel) => {
    const position = node.getPosition()
    if (node.width > nodeWidth) {
      nodeWidth = node.width
      nodeHeight = node.height
    }
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
        ref={layerRef}
        style={{
          left: config.minX,
          cursor: 'pointer',
          top: config.minY - 40 * depth,
          pointerEvents: allowAdd ? 'all' : 'none',
          position: 'absolute',
          height: height + 100
        }}
        onDragOver={event => {
          if (allowAdd) {
            setVisibilityOfAdd(true)
            event.preventDefault()
          }
        }}
        onDragLeave={() => {
          if (allowAdd) {
            setVisibilityOfAdd(false)
          }
        }}
        onDrop={event => {
          event.stopPropagation()
          const dropData: { id: string; identifier: string } = JSON.parse(
            event.dataTransfer.getData(DiagramDrag.NodeDrag)
          )
          props.layer.fireEvent({ node: dropData }, Event.DropLinkEvent)
        }}
      >
        <div
          className={css.groupLayer}
          ref={layerRef}
          style={{
            width,
            height
          }}
        ></div>
        {options.showRollback && (
          <RollbackToggleSwitch
            style={{ left: width - 60, top: 5 }}
            {...rollBackProps}
            onChange={type => props.layer.fireEvent({ type }, Event.RollbackClicked)}
          />
        )}
        {allowAdd && (
          <div
            onClick={e => {
              setAddClicked(true)
              onAddNodeClick(e, props.layer, setAddClicked)
            }}
            className={css.addNode}
            style={{
              left: config.minX + width / 2 - nodeWidth / 2,
              top: config.minY + height - 20,
              width: nodeWidth,
              height: nodeHeight,
              visibility: showAdd ? 'visible' : 'hidden'
            }}
          >
            <Icon name="plus" style={{ color: 'var(--diagram-add-node-color)' }} />
          </div>
        )}
      </div>
      <div
        className={css.header}
        style={{
          top: config.minY - (40 * depth - 5),
          left: config.minX + 10,
          width
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
          {options.label} {options.rollBackProps?.active === StepsType.Rollback && `(${i18n.Rollback})`}
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

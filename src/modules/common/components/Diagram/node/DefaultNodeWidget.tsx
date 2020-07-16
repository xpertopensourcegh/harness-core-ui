import React from 'react'
import css from './DefaultNode.module.scss'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import type { DefaultNodeModel } from './DefaultNodeModel'
import { DefaultPortLabel } from '../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../port/DefaultPortModel'
import { Icon, Text, Button } from '@wings-software/uikit'
import cx from 'classnames'
import { Event } from '../Constants'

export interface DefaultNodeProps {
  node: DefaultNodeModel
  engine: DiagramEngine
}

const generatePort = (port: DefaultPortModel, props: DefaultNodeProps): JSX.Element => {
  return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
}

const onAddNodeClick = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.AddParallelNode)
}

const onClick = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.RemoveNode)
}

const onClickNode = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.ClickNode)
}

export const DefaultNodeWidget = (props: DefaultNodeProps): JSX.Element => {
  const options = props.node.getOptions()
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const allowAdd = options.allowAdd ?? false
  const [showAdd, setVisibilityOfAdd] = React.useState(false)

  React.useEffect(() => {
    const currentNode = nodeRef.current

    const onMouse = (): void => {
      setVisibilityOfAdd(prev => !prev)
    }

    if (currentNode && allowAdd) {
      currentNode.addEventListener('mouseover', onMouse)
      currentNode.addEventListener('mouseout', onMouse)
    }
    return () => {
      if (currentNode && allowAdd) {
        currentNode.removeEventListener('mouseover', onMouse)
        currentNode.removeEventListener('mouseleave', onMouse)
      }
    }
  }, [nodeRef, allowAdd])

  return (
    <div className={css.defaultNode} ref={nodeRef} onClick={e => onClickNode(e, props.node)}>
      <div
        className={cx(css.defaultCard, { [css.selected]: props.node.isSelected() })}
        style={{
          width: options.width,
          height: options.height,
          marginTop: 32 - (options.height || 64) / 2,
          ...options.customNodeStyle
        }}
      >
        {options.icon && <Icon size={28} name={options.icon} {...options.iconProps} />}
        <div>{props.node.getInPorts().map(port => generatePort(port, props))}</div>
        <div>{props.node.getOutPorts().map(port => generatePort(port, props))}</div>
        {options.secondaryIcon && <Icon className={css.secondaryIcon} size={8} name={options.secondaryIcon} />}

        {options.canDelete && (
          <Button
            className={css.closeNode}
            minimal
            icon="cross"
            iconProps={{ size: 10 }}
            onMouseDown={e => onClick(e, props.node)}
          />
        )}
      </div>
      <Text
        font={{ size: 'normal', align: 'center' }}
        style={{ cursor: 'pointer' }}
        padding="xsmall"
        width={125}
        lineClamp={2}
      >
        {options.name}
      </Text>
      {allowAdd && (
        <div
          onClick={e => onAddNodeClick(e, props.node)}
          className={css.addNode}
          style={{
            width: options.width,
            height: options.height,
            visibility: showAdd ? 'visible' : 'hidden',
            marginLeft: (126 - (options.width || 64)) / 2
          }}
        >
          <Icon name="plus" style={{ color: 'var(--white)' }} />
        </div>
      )}
    </div>
  )
}

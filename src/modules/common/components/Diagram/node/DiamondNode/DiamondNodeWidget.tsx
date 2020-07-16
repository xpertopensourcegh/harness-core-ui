import React from 'react'
import cssDefault from '../DefaultNode.module.scss'
import css from './DiamondNode.module.scss'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import type { DiamondNodeModel } from './DiamondNodeModel'
import { DefaultPortLabel } from '../../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../../port/DefaultPortModel'
import { Icon, Text, Button } from '@wings-software/uikit'
import { Event } from '../../Constants'
import cx from 'classnames'
import type { DefaultNodeModel } from '../DefaultNodeModel'

export interface DiamondNodeProps {
  node: DiamondNodeModel
  engine: DiagramEngine
}

const generatePort = (port: DefaultPortModel, props: DiamondNodeProps): JSX.Element => {
  return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
}
const onClick = (e: React.MouseEvent<Element, MouseEvent>, node: DiamondNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.RemoveNode)
}
const onClickNode = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.ClickNode)
}

export const DiamondNodeWidget = (props: DiamondNodeProps): JSX.Element => {
  const options = props.node.getOptions()
  return (
    <div className={cssDefault.defaultNode} onClick={e => onClickNode(e, props.node)}>
      <div
        className={cx(cssDefault.defaultCard, css.diamond, { [cssDefault.selected]: props.node.isSelected() })}
        style={{ width: options.width, height: options.height, ...options.customNodeStyle }}
      >
        {options.icon && <Icon size={28} name={options.icon} />}
        {props.node.getInPorts().map(port => generatePort(port, props))}
        {props.node.getOutPorts().map(port => generatePort(port, props))}
        {options.canDelete && (
          <Button
            className={cx(cssDefault.closeNode, css.diamondClose)}
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
        padding="small"
        width={125}
        lineClamp={1}
      >
        {options.name}
      </Text>
    </div>
  )
}

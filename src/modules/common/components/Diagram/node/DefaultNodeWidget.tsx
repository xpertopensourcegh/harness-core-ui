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

const onClick = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.RemoveNode)
}

export const DefaultNodeWidget = (props: DefaultNodeProps): JSX.Element => {
  const options = props.node.getOptions()
  return (
    <div className={css.defaultNode}>
      <div
        className={cx(css.defaultCard, { [css.selected]: props.node.isSelected() })}
        style={{
          backgroundColor: options.backgroundColor,
          width: options.width,
          height: options.height,
          marginTop: 32 - (options.height || 64) / 2
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
    </div>
  )
}

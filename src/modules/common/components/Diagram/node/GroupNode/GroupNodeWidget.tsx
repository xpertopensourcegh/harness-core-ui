import React from 'react'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { Icon, Text } from '@wings-software/uikit'
import cx from 'classnames'
import type { GroupNodeModel } from './GroupNodeModel'
import { DefaultPortLabel } from '../../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../../port/DefaultPortModel'

import { Event } from '../../Constants'
import css from '../DefaultNode.module.scss'

export interface GroupNodeProps {
  node: GroupNodeModel
  engine: DiagramEngine
}

const generatePort = (port: DefaultPortModel, props: GroupNodeProps): JSX.Element => {
  return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
}

const onClickNode = (e: React.MouseEvent<Element, MouseEvent>, node: GroupNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.ClickNode)
}

export const GroupNodeWidget = (props: GroupNodeProps): JSX.Element => {
  const options = props.node.getOptions()

  return (
    <div className={css.defaultNode} onClick={e => onClickNode(e, props.node)}>
      <div
        className={css.defaultCard}
        style={{
          position: 'absolute',
          width: options.width,
          height: options.height,
          marginTop: 15 - (options.height || 64) / 2,
          marginLeft: 15
        }}
      ></div>
      <div
        className={css.defaultCard}
        style={{
          position: 'absolute',
          width: options.width,
          height: options.height,
          marginTop: 20 - (options.height || 64) / 2,
          marginLeft: 10
        }}
      ></div>
      <div
        className={cx(css.defaultCard, { [css.selected]: props.node.isSelected() })}
        style={{
          width: options.width,
          height: options.height,
          marginTop: 32 - (options.height || 64) / 2,
          ...options.customNodeStyle
        }}
      >
        <div className={css.iconGroup}>
          {options.icons[0] && <Icon size={28} name={options.icons[0]} {...options.iconPropsAr?.[0]} />}
          {options.icons[1] && <Icon size={28} name={options.icons[1]} {...options.iconPropsAr?.[1]} />}
        </div>
        <div>{props.node.getInPorts().map(port => generatePort(port, props))}</div>
        <div>{props.node.getOutPorts().map(port => generatePort(port, props))}</div>
      </div>
      <Text
        font={{ size: 'normal', align: 'center' }}
        style={{ cursor: 'pointer' }}
        padding="xsmall"
        width={125}
        lineClamp={5}
      >
        {options.name}
      </Text>
    </div>
  )
}

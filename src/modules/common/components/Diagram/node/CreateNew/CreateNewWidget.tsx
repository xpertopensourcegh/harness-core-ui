import * as React from 'react'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import type { CreateNewModel } from './CreateNewModel'
import { Icon } from '@blueprintjs/core'
import css from './CreateNew.module.scss'
import cssDefault from '../DefaultNode.module.scss'

import cx from 'classnames'
import { DefaultPortLabel } from '../../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../../port/DefaultPortModel'
import { Text } from '@wings-software/uikit'

export interface CreateNewWidgetProps {
  node: CreateNewModel
  engine: DiagramEngine
}
const generatePort = (port: DefaultPortModel, props: CreateNewWidgetProps): JSX.Element => {
  return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
}

export const CreateNewWidget: React.FC<CreateNewWidgetProps> = (props): JSX.Element => {
  const options = props.node.getOptions()
  return (
    <div className={cssDefault.defaultNode}>
      <div
        className={cx(cssDefault.defaultCard, css.createNew, { [cssDefault.selected]: props.node.isSelected() })}
        style={{ backgroundColor: options.backgroundColor }}
      >
        <div>
          <Icon icon="plus" color={props.node.isSelected() ? 'var(--diagram-selected)' : 'var(--diagram-grey)'} />
          <div>
            <div>{props.node.getInPorts().map(port => generatePort(port, props))}</div>
          </div>
        </div>
      </div>
      <Text
        font={{ size: 'normal', align: 'center' }}
        style={{ cursor: 'pointer' }}
        padding="xsmall"
        width={125}
        lineClamp={1}
      >
        {options.name}
      </Text>
    </div>
  )
}

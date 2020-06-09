import * as React from 'react'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import type { NodeStartModel } from './NodeStartModel'
import { Icon } from '@blueprintjs/core'
import cx from 'classnames'
import css from './NodeStart.module.scss'
import { DefaultPortLabel } from '../../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../../port/DefaultPortModel'

export interface NodeStartWidgetProps {
  node: NodeStartModel
  engine: DiagramEngine
}

export const NodeStartWidget: React.FC<NodeStartWidgetProps> = (props): JSX.Element => {
  const generatePort = (port: DefaultPortModel): JSX.Element => {
    return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
  }
  return (
    <div className={css.defaultNode}>
      <div
        className={cx(css.nodeStart, { ['selected']: props.node.isSelected() })}
        style={{ borderColor: props.node.color }}
      >
        <div>
          <Icon icon="play" color={props.node.color} />
          <div>
            <div>{props.node.getOutPorts().map(generatePort)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

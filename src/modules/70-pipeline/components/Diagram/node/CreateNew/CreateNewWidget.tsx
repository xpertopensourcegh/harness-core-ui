import * as React from 'react'
import type { DiagramEngine } from '@projectstorm/react-diagrams-core'
import { Icon } from '@blueprintjs/core'
import { isEmpty } from 'lodash-es'
import cx from 'classnames'
import { Text } from '@wings-software/uicore'
import { DefaultPortLabel } from '../../port/DefaultPortLabelWidget'
import type { DefaultPortModel } from '../../port/DefaultPortModel'
import type { CreateNewModel } from './CreateNewModel'
import type { DefaultNodeModel } from '../DefaultNodeModel'
import { Event, DiagramDrag } from '../../Constants'
import cssDefault from '../DefaultNode.module.scss'
import css from './CreateNew.module.scss'

export interface CreateNewWidgetProps {
  node: CreateNewModel
  engine: DiagramEngine
}
const generatePort = (port: DefaultPortModel, props: CreateNewWidgetProps): JSX.Element => {
  return <DefaultPortLabel engine={props.engine} port={port} key={port.getID()} />
}

const onClickNode = (e: React.MouseEvent<Element, MouseEvent>, node: DefaultNodeModel): void => {
  e.stopPropagation()
  node.fireEvent({}, Event.ClickNode)
}

export const CreateNewWidget: React.FC<CreateNewWidgetProps> = (props): JSX.Element => {
  const options = props.node.getOptions()
  const [dropable, setDropable] = React.useState(false)
  return (
    <div
      className={cx(cssDefault.defaultNode, css.createNode)}
      onClick={e => onClickNode(e, props.node)}
      onMouseDown={e => {
        e.stopPropagation()
        props.node.setSelected(true)
      }}
      onDragOver={event => {
        setDropable(true)
        event.preventDefault()
      }}
      onDragLeave={() => {
        setDropable(false)
      }}
      onDrop={event => {
        event.stopPropagation()
        setDropable(false)
        const dropData: { id: string; identifier: string } = JSON.parse(
          event.dataTransfer.getData(DiagramDrag.NodeDrag)
        )
        props.node.fireEvent({ node: dropData }, Event.DropLinkEvent)
      }}
    >
      <div
        className={cx(
          cssDefault.defaultCard,
          css.createNew,
          { [cssDefault.selected]: props.node.isSelected() },
          { [cssDefault.selected]: dropable }
        )}
        style={{ width: options.width, height: options.height, ...options.customNodeStyle }}
      >
        <div>
          <Icon icon="plus" iconSize={isEmpty(options.name) ? 20 : 10} color={'var(--diagram-grey)'} />

          <div>
            <div style={{ visibility: options.showPorts ? 'visible' : 'hidden' }}>
              {props.node.getInPorts().map(port => generatePort(port, props))}
            </div>
            <div style={{ visibility: options.showPorts ? 'visible' : 'hidden' }}>
              {props.node.getOutPorts().map(port => generatePort(port, props))}
            </div>
          </div>
        </div>
        {!isEmpty(options.name) && (
          <Text
            font={{ size: 'small', align: 'center' }}
            className={css.label}
            padding="xsmall"
            width={props.node.width - 10}
            lineClamp={1}
          >
            {options.name}
          </Text>
        )}
      </div>
    </div>
  )
}

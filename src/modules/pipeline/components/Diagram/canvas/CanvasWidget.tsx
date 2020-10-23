import React from 'react'
import { CanvasWidget as CanvasWidgetCore, DiagramProps } from '@projectstorm/react-canvas-core'
import cx from 'classnames'
import { Event } from '../Constants'
import { RollbackToggleSwitch, RollbackToggleSwitchProps } from './RollbackToggleSwitch/RollbackToggleSwitch'
import css from './CanvasWidget.module.scss'

interface CanvasWidgetProps extends DiagramProps {
  isRollback?: boolean
  rollBackProps?: Omit<RollbackToggleSwitchProps, 'onChange'>
}

export const CanvasWidget: React.FC<CanvasWidgetProps> = props => {
  const { className = '', isRollback = false, rollBackProps = {}, ...rest } = props
  return (
    <>
      <CanvasWidgetCore className={cx(css.canvas, className)} {...rest} />
      {isRollback && (
        <RollbackToggleSwitch
          {...rollBackProps}
          onChange={type => props.engine.fireEvent({ type } as any, Event.RollbackClicked)}
        />
      )}
    </>
  )
}

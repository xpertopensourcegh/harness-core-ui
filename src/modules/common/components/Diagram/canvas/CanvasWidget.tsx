import React from 'react'
import { CanvasWidget as CanvasWidgetCore, DiagramProps } from '@projectstorm/react-canvas-core'
import css from './CanvasWidget.module.scss'
import cx from 'classnames'

export const CanvasWidget: React.FC<DiagramProps> = props => {
  const { className = '', ...rest } = props
  return <CanvasWidgetCore className={cx(css.canvas, className)} {...rest} />
}

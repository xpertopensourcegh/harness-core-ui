import React from 'react'
import type { DefaultLabelModel } from './DefaultLabelModel'

export interface DefaultLabelWidgetProps {
  model: DefaultLabelModel
}

export const DefaultLabelWidget = (props: DefaultLabelWidgetProps): JSX.Element => {
  return <div>{props.model.getOptions().label}</div>
}

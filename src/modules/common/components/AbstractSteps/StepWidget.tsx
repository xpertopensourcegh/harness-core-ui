import React from 'react'
import { Text } from '@wings-software/uikit'
import type { AbstractStepFactory } from './AbstractStepFactory'
import i18n from './StepWidget.i18n'
import { StepViewType } from './Step'

export interface StepWidgetProps {
  factory: AbstractStepFactory
  type: string
  initialValues: object
  stepViewType?: StepViewType
  onUpdate?: (data: object) => void
}

export function StepWidget({
  factory,
  type,
  initialValues,
  stepViewType = StepViewType.Edit,
  onUpdate
}: StepWidgetProps): JSX.Element {
  const step = factory.getStep(type)

  if (!step) {
    return <Text intent="warning">{i18n.invalidStep}</Text>
  } else {
    const values = { ...step?.getDefaultValues(), ...initialValues }
    return <>{step.renderStep(values, onUpdate, stepViewType)}</>
  }
}

import React from 'react'
import { Text } from '@wings-software/uikit'
import type { AbstractStepFactory } from './AbstractStepFactory'
import i18n from './StepWidget.i18n'

export interface StepWidgetProps {
  factory: AbstractStepFactory
  type: string
  initialValues: object
  templatedFields?: string[]
  onSubmit?: (data: object) => void
}

export function StepWidget({
  factory,
  type,
  initialValues,
  templatedFields = [],
  onSubmit
}: StepWidgetProps): JSX.Element {
  const step = factory.getStep(type)

  if (!step) {
    return <Text intent="warning">{i18n.invalidStep}</Text>
  } else {
    const values = { ...step?.getDefaultValues(), ...initialValues }
    return <>{step.renderStep(values, onSubmit, templatedFields)}</>
  }
}

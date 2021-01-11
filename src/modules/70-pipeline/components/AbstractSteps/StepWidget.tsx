import React from 'react'
import { Text } from '@wings-software/uicore'
import type { AbstractStepFactory } from './AbstractStepFactory'
import i18n from './StepWidget.i18n'
import { StepViewType } from './Step'
import type { StepType } from '../PipelineSteps/PipelineStepInterface'

export interface StepWidgetProps<T extends object = {}, U = unknown> {
  factory: AbstractStepFactory
  type: StepType
  initialValues: T
  allValues?: T
  template?: T
  path?: string
  stepViewType?: StepViewType
  onUpdate?: (data: T) => void
  readonly?: boolean
  customStepProps?: U
}

export function StepWidget<T extends object = {}, U = unknown>({
  factory,
  type,
  initialValues,
  allValues,
  template,
  path = '',
  stepViewType = StepViewType.Edit,
  onUpdate,
  readonly,
  customStepProps
}: StepWidgetProps<T, U>): JSX.Element {
  const step = factory.getStep<T>(type)
  if (!step) {
    return <Text intent="warning">{i18n.invalidStep}</Text>
  } else {
    const values = step?.getDefaultValues(initialValues, stepViewType)

    return (
      <>
        {step.renderStep({
          initialValues: values,
          onUpdate,
          stepViewType,
          inputSetData: { template, allValues, path, readonly },
          factory,
          path,
          customStepProps
        })}
      </>
    )
  }
}

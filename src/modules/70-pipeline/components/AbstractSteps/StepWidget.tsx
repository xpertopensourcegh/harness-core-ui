import React from 'react'
import { Text } from '@wings-software/uicore'
import type { AbstractStepFactory } from './AbstractStepFactory'
import i18n from './StepWidget.i18n'
import { StepViewType } from './Step'
import type { StepProps, StepFormikFowardRef } from './Step'
import type { StepType } from '../PipelineSteps/PipelineStepInterface'

export interface StepWidgetProps<T = unknown, U = unknown> extends Omit<StepProps<T, U>, 'path'> {
  factory: AbstractStepFactory
  type: StepType
  allValues?: T
  template?: T
  path?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: (data: any) => void
  readonly?: boolean
}

export function StepWidget<T = unknown, U = unknown>(
  {
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
  }: StepWidgetProps<T, U>,
  formikRef: StepFormikFowardRef<T>
): JSX.Element {
  const step = factory.getStep<T>(type)
  if (!step) {
    return <Text intent="warning">{i18n.invalidStep}</Text>
  } else {
    const values = step?.getDefaultValues(initialValues, stepViewType)

    return (
      <>
        {step.renderStep({
          initialValues: values,
          formikRef,
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

export const StepWidgetWithFormikRef = React.forwardRef(StepWidget)

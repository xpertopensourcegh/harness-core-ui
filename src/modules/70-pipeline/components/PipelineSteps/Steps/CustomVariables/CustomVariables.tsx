import React from 'react'
import type { IconName } from '@wings-software/uicore'

import { Step } from '@pipeline/exports'

import { CustomVariableEditable, CustomVariableEditableExtraProps } from './CustomVariableEditable'
import type { CustomVariablesData } from './CustomVariableEditable'
import i18n from './CustomVariables.i18n'
import { StepType } from '../../PipelineStepInterface'
import type { StepProps } from '../../PipelineStep'

export class CustomVariables extends Step<CustomVariablesData> {
  renderStep(props: StepProps<CustomVariablesData, CustomVariableEditableExtraProps>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, customStepProps } = props

    return (
      <CustomVariableEditable
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        {...customStepProps}
      />
    )
  }

  validateInputSet(): object {
    return {}
  }

  protected type = StepType.CustomVariable
  protected stepName = i18n.customVariables
  protected stepIcon: IconName = 'variable'
  protected stepPaletteVisible = false

  protected defaultValues: CustomVariablesData = { variables: [] }
}

import React from 'react'
import { IconName, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import isEmpty from 'lodash-es/isEmpty'
import { Step } from '@pipeline/exports'

import type { UseStringsReturn } from 'framework/exports'
import type { NGVariable } from 'services/cd-ng'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { CustomVariableEditable, CustomVariableEditableExtraProps } from './CustomVariableEditable'
import { CustomVariableInputSet, CustomVariableInputSetExtraProps } from './CustomVariableInputSet'
import type { CustomVariablesData } from './CustomVariableEditable'
import type { StepProps } from '../../PipelineStep'
import i18n from './CustomVariables.i18n'

export class CustomVariables extends Step<CustomVariablesData> {
  renderStep(
    props: StepProps<CustomVariablesData, CustomVariableEditableExtraProps | CustomVariableInputSetExtraProps>
  ): JSX.Element {
    const { initialValues, onUpdate, stepViewType, customStepProps } = props

    return stepViewType === StepViewType.InputSet ? (
      <CustomVariableInputSet
        initialValues={initialValues}
        onUpdate={data => onUpdate?.(this.processData(data))}
        stepViewType={stepViewType}
        {...customStepProps}
      />
    ) : (
      <CustomVariableEditable
        initialValues={initialValues}
        onUpdate={data => onUpdate?.(this.processData(data))}
        stepViewType={stepViewType}
        {...customStepProps}
      />
    )
  }

  validateInputSet(
    data: CustomVariablesData,
    template?: CustomVariablesData,
    getString?: UseStringsReturn['getString']
  ): object {
    const errors: CustomVariablesData = { variables: [] }
    data?.variables?.forEach((variable: NGVariable, index) => {
      const currentVariableTemplate = get(template, `variables[${index}].value`, '')

      if (isEmpty(variable.value) && getMultiTypeFromValue(currentVariableTemplate) === MultiTypeInputType.RUNTIME) {
        set(errors, `variables[${index}].value`, getString?.('fieldRequired', { field: 'Value' }))
      }
    })
    if (!errors.variables.length) {
      delete errors.variables
    }
    return errors
  }

  protected type = StepType.CustomVariable
  protected stepName = i18n.customVariables
  protected stepIcon: IconName = 'variable'
  protected stepPaletteVisible = false
  protected _hasStepVariables = true

  protected defaultValues: CustomVariablesData = { variables: [] }

  protected processData(data: CustomVariablesData): CustomVariablesData {
    return {
      ...data,
      variables: data.variables.map(row => ({
        ...row,
        value:
          row.type === 'Number' && getMultiTypeFromValue(row.value) === MultiTypeInputType.FIXED && row.value
            ? parseFloat(row.value)
            : row.value
      })) as NGVariable[]
    }
  }
}

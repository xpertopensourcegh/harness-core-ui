/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { AllowedTypes, DataTooltipInterface, FormInput } from '@harness/uicore'

import type { ServiceSpec } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'framework/strings/StringsContext'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { shouldRenderRunTimeInputViewWithAllowedValues } from '@pipeline/utils/CIUtils'
import { useRenderMultiTypeInputWithAllowedValues } from '../utils/utils'

interface TextFieldInputSetViewProps {
  fieldName: string
  fieldLabel: keyof StringsMap
  fieldPath: string
  template: ServiceSpec
  allowableTypes: AllowedTypes
  disabled?: boolean
  fieldPlaceholder?: keyof StringsMap
  readonly?: boolean
  tooltipProps?: DataTooltipInterface
  onChange?: () => void
}

export function TextFieldInputSetView(props: TextFieldInputSetViewProps): JSX.Element {
  const {
    fieldName,
    fieldLabel,
    fieldPlaceholder,
    disabled,
    allowableTypes,
    template,
    fieldPath,
    readonly,
    tooltipProps,
    onChange
  } = props

  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const { getMultiTypeInputWithAllowedValues } = useRenderMultiTypeInputWithAllowedValues({
    name: fieldName,
    labelKey: fieldLabel,
    placeholderKey: fieldPlaceholder,
    fieldPath: fieldPath,
    allowedTypes: allowableTypes,
    template: template,
    readonly: readonly,
    tooltipProps: tooltipProps
  })

  if (shouldRenderRunTimeInputViewWithAllowedValues(fieldPath, template)) {
    return getMultiTypeInputWithAllowedValues()
  }

  return (
    <FormInput.MultiTextInput
      label={getString(fieldLabel)}
      disabled={disabled}
      multiTextInputProps={{
        expressions,
        allowableTypes
      }}
      name={fieldName}
      onChange={onChange}
    />
  )
}

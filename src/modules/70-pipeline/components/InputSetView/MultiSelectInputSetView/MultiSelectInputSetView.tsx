/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import {
  AllowedTypes,
  DataTooltipInterface,
  FormInput,
  MultiSelectOption,
  MultiTypeInputType,
  MultiTypeInputValue
} from '@harness/uicore'

import type { ServiceSpec } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'framework/strings/StringsContext'
import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import { shouldRenderRunTimeInputViewWithAllowedValues } from '@pipeline/utils/CIUtils'
import { useRenderMultiSelectTypeInputWithAllowedValues } from '../utils/utils'

interface MultiSelectInputSetViewProps {
  fieldName: string
  fieldLabel: keyof StringsMap
  fieldPath: string
  options: SelectOption[]
  template: ServiceSpec
  allowableTypes: AllowedTypes
  fieldPlaceholder?: keyof StringsMap
  disabled?: boolean
  fieldHelperText?: string
  readonly?: boolean
  tooltipProps?: DataTooltipInterface
  onChange?: (
    value: boolean | string | number | SelectOption | string[] | MultiSelectOption[] | undefined,
    valueType: MultiTypeInputValue,
    type: MultiTypeInputType
  ) => void
}

export function MultiSelectInputSetView(props: MultiSelectInputSetViewProps): JSX.Element {
  const {
    options,
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

  const { getMultiSelectTypeInputWithAllowedValues } = useRenderMultiSelectTypeInputWithAllowedValues({
    name: fieldName,
    labelKey: fieldLabel,
    placeholderKey: fieldPlaceholder,
    fieldPath: fieldPath,
    allowedTypes: allowableTypes,
    template: template,
    readonly: readonly,
    tooltipProps: tooltipProps,
    options: options,
    onChange: onChange
  })

  if (shouldRenderRunTimeInputViewWithAllowedValues(fieldPath, template)) {
    return getMultiSelectTypeInputWithAllowedValues()
  }

  return (
    <FormInput.MultiSelectTypeInput
      label={getString(fieldLabel)}
      tooltipProps={tooltipProps}
      name={fieldName}
      disabled={disabled}
      placeholder={fieldPlaceholder}
      multiSelectTypeInputProps={{
        multiSelectProps: {
          usePortal: true,
          items: options,
          placeholder: fieldPlaceholder
        },
        allowableTypes: allowableTypes,
        onChange: onChange
      }}
      selectItems={options}
    />
  )
}

/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { memoize } from 'lodash-es'
import { Menu } from '@blueprintjs/core'
import { AllowedTypes, DataTooltipInterface, FormInput, Layout, Text } from '@harness/uicore'

import type { ServiceSpec } from 'services/cd-ng'
import type { StringsMap } from 'framework/strings/StringsContext'
import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { shouldRenderRunTimeInputViewWithAllowedValues } from '@pipeline/utils/CIUtils'
import { useRenderMultiTypeInputWithAllowedValues } from '../utils/utils'

interface SelectInputSetViewProps {
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
}

export function SelectInputSetView(props: SelectInputSetViewProps): JSX.Element {
  const {
    options,
    fieldName,
    fieldLabel,
    fieldPlaceholder,
    disabled,
    fieldHelperText,
    allowableTypes,
    template,
    fieldPath,
    readonly,
    tooltipProps
  } = props

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

  const itemRenderer = memoize((item: { label: string }, { handleClick }) => (
    <div key={item.label.toString()}>
      <Menu.Item
        text={
          <Layout.Horizontal spacing="small">
            <Text>{item.label}</Text>
          </Layout.Horizontal>
        }
        onClick={handleClick}
      />
    </div>
  ))

  if (shouldRenderRunTimeInputViewWithAllowedValues(fieldPath, template)) {
    return getMultiTypeInputWithAllowedValues()
  }

  return (
    <FormInput.MultiTypeInput
      selectItems={options}
      label={fieldLabel}
      placeholder={fieldPlaceholder}
      name={fieldName}
      disabled={disabled}
      helperText={fieldHelperText}
      useValue
      multiTypeInputProps={{
        expressions,
        allowableTypes,
        selectProps: {
          itemRenderer: itemRenderer,
          items: options,
          allowCreatingNewItems: true
        }
      }}
    />
  )
}

import React from 'react'

import { getMultiTypeFromValue, MultiTypeInputType, FormInput, FormikForm, Text } from '@wings-software/uicore'

import { isEmpty } from 'lodash-es'
import List from '@common/components/List/List'

import { useStrings } from 'framework/strings'

import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import type { TerraformPlanProps } from '../Common/Terraform/TerraformInterfaces'
import ConfigInputs from './InputSteps/TfConfigSection'
import TfVarFiles from './InputSteps/TfPlanVarFiles'

export default function TfPlanInputStep(props: TerraformPlanProps): React.ReactElement {
  const { getString } = useStrings()
  const { inputSetData, readonly } = props
  const { expressions } = useVariablesExpression()

  return (
    <FormikForm>
      {getMultiTypeFromValue(inputSetData?.template?.spec?.provisionerIdentifier) === MultiTypeInputType.RUNTIME && (
        <FormInput.MultiTextInput
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.provisionerIdentifier`}
          label={getString('pipelineSteps.provisionerIdentifier')}
          disabled={readonly}
          multiTextInputProps={{
            expressions,
            allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
          }}
        />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.timeout) === MultiTypeInputType.RUNTIME && (
        <FormMultiTypeDurationField
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}timeout`}
          disabled={readonly}
          multiTypeDurationProps={{
            enableConfigureOptions: false,
            allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION],
            expressions,
            disabled: readonly
          }}
        />
      )}
      <ConfigInputs {...props} />
      {inputSetData?.template?.spec?.configuration?.varFiles?.length && <TfVarFiles {...props} />}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.targets as string) ===
        MultiTypeInputType.RUNTIME && (
        <List
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.targets`}
          label={<Text style={{ display: 'flex', alignItems: 'center' }}>{getString('pipeline.targets.title')}</Text>}
          disabled={readonly}
          style={{ marginBottom: 'var(--spacing-small)' }}
        />
      )}
    </FormikForm>
  )
}

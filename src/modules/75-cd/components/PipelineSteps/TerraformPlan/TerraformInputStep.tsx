import React from 'react'

import { getMultiTypeFromValue, MultiTypeInputType, FormInput, FormikForm, Text } from '@wings-software/uicore'

import { isEmpty } from 'lodash-es'
import List from '@common/components/List/List'

import { useStrings } from 'framework/strings'

import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import { TerraformPlanProps, TerraformStoreTypes } from '../Common/Terraform/TerraformInterfaces'
import ConfigInputs from './InputSteps/TfConfigSection'

export default function TerraformInputStep(props: TerraformPlanProps): React.ReactElement {
  const { getString } = useStrings()
  const { inputSetData, readonly, path } = props
  const { expressions } = useVariablesExpression()

  return (
    <FormikForm>
      {getMultiTypeFromValue(inputSetData?.template?.spec?.provisionerIdentifier) === MultiTypeInputType.RUNTIME && (
        <FormInput.MultiTextInput
          name="spec.provisionerIdentifier"
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
      {inputSetData?.template?.spec?.configuration?.varFiles?.length && (
        <label> {getString('cd.terraformVarFiles')}</label>
      )}
      {inputSetData?.template?.spec?.configuration?.varFiles?.map((varFile: any, index) => {
        if (varFile?.varFile?.type === TerraformStoreTypes.Inline) {
          return (
            <>
              {getMultiTypeFromValue(varFile?.varFile?.identifier) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.varFiles[${index}].varFile.identifier`}
                  label={getString('identifier')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(varFile?.varFile?.spec?.content) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.varFiles[${index}].varFile.spec.content`}
                  label={getString('pipelineSteps.content')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
            </>
          )
        } else if (varFile.varFile?.type === TerraformStoreTypes.Remote) {
          const remoteVarFile = varFile.varFile as any
          return (
            <>
              {getMultiTypeFromValue(varFile?.varFile?.identifier) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.varFiles[${index}].varFile.identifier`}
                  label={getString('identifier')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}

              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.branch) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.varFiles[${index}].varFile.store.spec.branch`}
                  label={getString('pipelineSteps.deploy.inputSet.branch')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.commitId) === MultiTypeInputType.RUNTIME && (
                <FormInput.MultiTextInput
                  name={`${path}.configuration?.varFiles[${index}].varFile.store.spec.commitId`}
                  label={getString('pipeline.manifestType.commitId')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }}
                />
              )}
              {getMultiTypeFromValue(remoteVarFile?.spec?.store?.spec?.paths) === MultiTypeInputType.RUNTIME && (
                <List
                  label={getString('filePaths')}
                  name={`${path}.configuration?.varFiles[${index}].varFile.store.spec.paths`}
                  disabled={readonly}
                  style={{ marginBottom: 'var(--spacing-small)' }}
                  expressions={expressions}
                />
              )}
            </>
          )
        }
      })}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.backendConfig?.spec?.content) ===
        MultiTypeInputType.RUNTIME && (
        <FormInput.TextArea name={`${path}.varFile.spec.content`} label={getString('cd.backEndConfig')} />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.targets as string) ===
        MultiTypeInputType.RUNTIME &&
        expressions.length && (
          <List
            name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.targets`}
            label={<Text style={{ display: 'flex', alignItems: 'center' }}>{getString('pipeline.targets.title')}</Text>}
            disabled={readonly}
            style={{ marginBottom: 'var(--spacing-small)' }}
            expressions={expressions}
          />
        )}
    </FormikForm>
  )
}

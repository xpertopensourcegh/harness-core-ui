import React from 'react'
import cx from 'classnames'

import {
  getMultiTypeFromValue,
  MultiTypeInputType,
  FormInput,
  FormikForm,
  Text,
  Button,
  Container
} from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import Map from '@common/components/Map/Map'
import List from '@common/components/List/List'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { TerraformData, TerraformProps, TerraformStoreTypes } from './TerraformInterfaces'
import ConfigInputs from './InputSteps/ConfigSection'
import TFRemoteSection from './InputSteps/TFRemoteSection'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export default function TerraformInputStep<T extends TerraformData = TerraformData>(
  props: TerraformProps<T>
): React.ReactElement {
  const { getString } = useStrings()
  const { inputSetData, readonly, path } = props
  const { expressions } = useVariablesExpression()

  return (
    <FormikForm>
      {getMultiTypeFromValue((inputSetData?.template as TerraformData)?.spec?.provisionerIdentifier) ===
        MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            name={`${path}.spec.provisionerIdentifier`}
            label={getString('pipelineSteps.provisionerIdentifier')}
            disabled={readonly}
            multiTextInputProps={{
              expressions,
              allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
            }}
          />
        </div>
      )}
      {getMultiTypeFromValue(inputSetData?.template?.timeout) === MultiTypeInputType.RUNTIME && (
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormMultiTypeDurationField
            label={getString('pipelineSteps.timeoutLabel')}
            name={`${path}.timeout`}
            disabled={readonly}
            multiTypeDurationProps={{
              enableConfigureOptions: false,
              allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION],
              expressions,
              disabled: readonly
            }}
          />
        </div>
      )}
      <ConfigInputs {...props} />
      {inputSetData?.template?.spec?.configuration?.spec?.varFiles?.length && (
        <label> {getString('cd.terraformVarFiles')}</label>
      )}
      {inputSetData?.template?.spec?.configuration?.spec?.varFiles?.map((varFile: any, index) => {
        if (varFile?.varFile?.type === TerraformStoreTypes.Inline) {
          return (
            <>
              <Container flex width={120}>
                <Text font={{ weight: 'bold' }}>{getString('cd.varFile')}:</Text>
                {varFile?.varFile?.identifier}
              </Container>

              {getMultiTypeFromValue(varFile?.varFile?.spec?.content) === MultiTypeInputType.RUNTIME && (
                <div className={cx(stepCss.formGroup, stepCss.md)}>
                  <FormInput.MultiTextInput
                    name={`${path}.spec.configuration.spec.varFiles[${index}].varFile.spec.content`}
                    label={getString('pipelineSteps.content')}
                    multiTextInputProps={{
                      expressions,
                      allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                    }}
                  />
                </div>
              )}
            </>
          )
        } else if (varFile.varFile?.type === TerraformStoreTypes.Remote) {
          return <TFRemoteSection remoteVar={varFile} index={index} {...props} />
        }
      })}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.spec?.backendConfig?.spec?.content) ===
        MultiTypeInputType.RUNTIME && (
        <FormInput.TextArea name={`${path}.varFile.spec.content`} label={getString('cd.backEndConfig')} />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.spec?.targets as string) ===
        MultiTypeInputType.RUNTIME && (
        <List
          name={`${path}.spec.targets`}
          label={<Text style={{ display: 'flex', alignItems: 'center' }}>{getString('pipeline.targets.title')}</Text>}
          disabled={readonly}
          style={{ marginBottom: 'var(--spacing-small)' }}
          expressions={expressions}
        />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.configuration?.spec?.environmentVariables as string) ===
        MultiTypeInputType.RUNTIME && (
        <Map
          name={`${path}.spec.environmentVariables`}
          label={
            <Text style={{ display: 'flex', alignItems: 'center' }}>
              {getString('environmentVariables')}
              <Button
                icon="question"
                minimal
                tooltip={getString('environmentVariablesInfo')}
                iconProps={{ size: 14 }}
              />
            </Text>
          }
          disabled={readonly}
          style={{ marginBottom: 'var(--spacing-small)' }}
        />
      )}
    </FormikForm>
  )
}

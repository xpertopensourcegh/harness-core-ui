import React from 'react'
import cx from 'classnames'

import { FormInput, getMultiTypeFromValue, MultiTypeInputType, SelectOption } from '@wings-software/uicore'

import type { FormikProps } from 'formik'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { ConfigurationTypes, TerraformData } from './TerraformInterfaces'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

interface BaseFormProps {
  formik: FormikProps<TerraformData>
  configurationTypes: SelectOption[]
}

export default function GitStore(props: BaseFormProps): React.ReactElement {
  const {
    formik: { values, setFieldValue }
  } = props
  const { getString } = useStrings()
  const configurationTypes: SelectOption[] = [
    { label: getString('inline'), value: ConfigurationTypes.Inline },
    { label: getString('pipelineSteps.configTypes.0.label'), value: ConfigurationTypes.InheritFromPlan },
    { label: getString('pipelineSteps.configTypes.1.label'), value: ConfigurationTypes.InheritFromApply }
  ]
  return (
    <>
      <div className={cx(stepCss.formGroup, stepCss.md)}>
        <FormInput.MultiTextInput
          name="spec.provisionerIdentifier"
          label={getString('pipelineSteps.provisionerIdentifier')}
        />
        {getMultiTypeFromValue(values.spec?.provisionerIdentifier) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={values.spec?.provisionerIdentifier as string}
            type="String"
            variableName="spec.provisionerIdentifier"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => {
              setFieldValue('spec.provisionerIdentifier', value)
            }}
          />
        )}
      </div>

      <div className={cx(stepCss.formGroup, stepCss.md)}>
        <FormInput.Select
          items={configurationTypes}
          name="spec.configuration.type"
          label={getString('pipelineSteps.configurationType')}
          placeholder={getString('pipelineSteps.configurationType')}
        />
      </div>
    </>
  )
}

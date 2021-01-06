import React from 'react'
import { SelectOption, FormInput, getMultiTypeFromValue, MultiTypeInputType, Button } from '@wings-software/uicore'
import { FieldArray } from 'formik'
import type { FormikProps } from 'formik'
import { v4 as uuid } from 'uuid'
import type { HttpStepInfo } from 'services/cd-ng'

import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import type { HttpStepHeader } from './types'
import css from './HttpStep.module.scss'
import stepCss from '../Steps.module.scss'

export const httpStepType: SelectOption[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'HEAD', label: 'HEAD' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

export default function HttpStepBase(props: { formik: FormikProps<HttpStepInfo> }): React.ReactElement {
  const { getString } = useStrings()
  const {
    formik: { values: formValues, setFieldValue }
  } = props

  return (
    <div className={stepCss.stepPanel}>
      <div className={stepCss.formGroup}>
        <FormInput.InputWithIdentifier inputLabel={getString('name')} />
      </div>
      <div className={stepCss.formGroup}>
        <FormInput.MultiTextInput name="spec.url" label={getString('UrlLabel')} />
        {getMultiTypeFromValue(formValues.spec.url) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.url}
            type="String"
            variableName="spec.url"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.url', value)}
          />
        )}
      </div>
      <div className={stepCss.formGroup}>
        <FormInput.MultiTypeInput selectItems={httpStepType} label={getString('methodLabel')} name="spec.method" />
        {getMultiTypeFromValue(formValues.spec.method) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.method}
            type="String"
            variableName="spec.method"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.method', value)}
          />
        )}
      </div>
      <div className={stepCss.formGroup}>
        <MultiTypeFieldSelector
          name="spec.headers"
          label="Header"
          defaultValueToReset={[{ name: '', type: 'String', value: '', id: uuid() }]}
          disableTypeSelection
        >
          <FieldArray
            name="spec.headers"
            render={({ push, remove }) => {
              return (
                <div className={css.panel}>
                  <div className={css.headerRow}>
                    <span className={css.label}>Key</span>
                    <span className={css.label}>Value</span>
                  </div>
                  {formValues.spec.headers.map(({ id }: HttpStepHeader, i: number) => (
                    <div className={css.headerRow} key={id}>
                      <FormInput.Text name={`spec.headers[${i}].key`} />
                      <FormInput.MultiTextInput
                        name={`spec.headers[${i}].value`}
                        multiTextInputProps={{
                          allowableTypes: [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION]
                        }}
                        label=""
                      />
                      <Button minimal icon="trash" data-testid={`remove-header-${i}`} onClick={() => remove(i)} />
                    </div>
                  ))}
                  <Button
                    icon="plus"
                    minimal
                    intent="primary"
                    data-testid="add-header"
                    onClick={() => push({ key: '', value: '', id: uuid() })}
                  >
                    Add
                  </Button>
                </div>
              )
            }}
          />
        </MultiTypeFieldSelector>
      </div>
      <div className={stepCss.formGroup}>
        <FormMultiTypeTextAreaField
          name="spec.requestBody"
          label={getString('requestBodyLabel')}
          multiTypeTextArea={{ enableConfigureOptions: false }}
        />
        {getMultiTypeFromValue(formValues.spec.requestBody) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.requestBody}
            type="String"
            variableName="spec.requestBody"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.requestBody', value)}
          />
        )}
      </div>
      <div className={stepCss.formGroup}>
        <FormMultiTypeDurationField
          name="spec.timeout"
          label={getString('pipelineSteps.timeoutLabel')}
          multiTypeDurationProps={{ enableConfigureOptions: false }}
        />
        {getMultiTypeFromValue(formValues.spec.timeout) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.timeout}
            type="String"
            variableName="spec.timeout"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.timeout', value)}
          />
        )}
      </div>
    </div>
  )
}

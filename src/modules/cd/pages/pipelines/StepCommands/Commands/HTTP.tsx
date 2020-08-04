import React from 'react'
import { FormInput, DurationInput, SelectOption } from '@wings-software/uikit'
import { get } from 'lodash'
import i18n from '../StepCommands.18n'
import css from '../StepCommands.module.scss'

const httpStepType: SelectOption[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'HEAD', label: 'HEAD' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

export const HTTP = (): JSX.Element => (
  <>
    <FormInput.Text name="spec.url" label={i18n.url} />
    <FormInput.Select items={httpStepType} label={i18n.method} name="spec.method" />
    <FormInput.TextArea name="spec.body" label={i18n.body} />
    <FormInput.TextArea name="spec.header" label={i18n.header} />
    <FormInput.CustomRender
      name="spec.socketTimeoutMillis"
      className={css.duration}
      label={i18n.socketTimeoutMillis}
      render={formik => {
        return (
          <DurationInput
            value={get(formik.values, 'spec.socketTimeoutMillis')}
            onChange={time => formik.setFieldValue('spec.socketTimeoutMillis', time)}
          />
        )
      }}
    />
  </>
)

export const initialValues = {
  method: httpStepType[0].value,
  socketTimeoutMillis: 60000
}

import React from 'react'
import { FormInput, DurationInput } from '@wings-software/uikit'
import { get } from 'lodash'
import type {} from 'formik'
import i18n from '../StepCommands.18n'
import css from '../StepCommands.module.scss'

export const K8sRolloutDeploy = (): JSX.Element => (
  <>
    <FormInput.CustomRender
      name="spec.timeout"
      label={i18n.timeout}
      className={css.duration}
      render={formik => {
        return (
          <DurationInput
            value={get(formik.values, 'spec.timeout')}
            onChange={time => formik.setFieldValue('spec.timeout', time)}
          />
        )
      }}
    />
    <FormInput.CheckBox name="spec.skipDryRun" label={i18n.skipDryRun} className={css.checkbox} />
  </>
)

export const initialValues = {
  skipDryRun: false,
  timeout: 60000
}

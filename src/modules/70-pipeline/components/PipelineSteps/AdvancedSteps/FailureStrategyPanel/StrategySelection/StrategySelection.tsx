import React from 'react'
import { FormGroup, Intent } from '@blueprintjs/core'
import { connect, FormikContext } from 'formik'
import { get } from 'lodash-es'

import { errorCheck } from '@common/utils/formikHelpers'

import { allowedStrategiesAsPerStep } from './StrategyConfig'
import { StrategyStepsList, SelectedStep } from './StrategySteps'
// import css from '../FailureStrategyPanel.module.scss'

export interface StrategySelectionProps {
  label: string
  name: string
}

export interface ConnectedStrategySelectionProps extends StrategySelectionProps {
  formik: FormikContext<{}>
}

export function StrategySelection(props: ConnectedStrategySelectionProps): React.ReactElement {
  const { name, label, formik } = props

  const value = get(formik.values, name) || {}
  const hasError = errorCheck(name, formik)
  const intent = hasError ? Intent.DANGER : Intent.NONE
  const helperText = hasError ? get(formik?.errors, name) : null

  return (
    <FormGroup label={label} labelFor={name} helperText={helperText} intent={intent}>
      {value.type ? (
        <SelectedStep strategy={value.type} />
      ) : (
        <StrategyStepsList allowedValues={allowedStrategiesAsPerStep.default} name={`${name}.type`} formik={formik} />
      )}
    </FormGroup>
  )
}

export default connect<StrategySelectionProps>(StrategySelection)

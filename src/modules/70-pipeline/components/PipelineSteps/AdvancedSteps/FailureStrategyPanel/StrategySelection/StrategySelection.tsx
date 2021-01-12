import React from 'react'
import { FormGroup, Intent } from '@blueprintjs/core'
import { connect, FormikContext, FieldArray } from 'formik'
import { get } from 'lodash-es'
import { FormInput, Button } from '@wings-software/uicore'
import { v4 as uuid } from 'uuid'
import cx from 'classnames'

import { errorCheck } from '@common/utils/formikHelpers'
import { useStrings } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'

import { Strategy } from './StrategyConfig'
import { StrategyIcon } from './StrategyIcon'
import css from './StrategySelection.module.scss'

export interface BaseStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikContext<any>
  name: string
  parentStrategy?: Strategy
}

export function ManualInterventionStep(props: BaseStepProps): React.ReactElement {
  const { name, formik, parentStrategy } = props

  function handleChange(): void {
    formik.setFieldValue(name, undefined)
  }

  const { getString } = useStrings()

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.ManualIntervention} checked onChange={handleChange} />
      <FormMultiTypeDurationField
        name={`${name}.spec.timeout`}
        label="Timeout"
        multiTypeDurationProps={{ enableConfigureOptions: false }}
      />
      <StrategySelection
        label={getString('onTimeoutLabel')}
        name={`${name}.spec.onTimeout.action`}
        formik={formik}
        parentStrategy={Strategy.ManualIntervention}
        allowedStrategies={ManualInterventionStep.timeoutStrategies.filter(
          strategy => !parentStrategy || strategy !== parentStrategy
        )}
      />
    </div>
  )
}

ManualInterventionStep.timeoutStrategies = [
  Strategy.Retry,
  Strategy.Ignore,
  Strategy.StageRollback,
  Strategy.StepGroupRollback,
  Strategy.MarkAsSuccess
]

export function RetryStep(props: BaseStepProps): React.ReactElement {
  const { name, formik, parentStrategy } = props
  const { getString } = useStrings()
  const uids = React.useRef<string[]>([])

  function handleChange(): void {
    formik.setFieldValue(name, undefined)
  }

  const intervals: string[] = get(formik.values, `${name}.spec.retryIntervals`) || []

  return (
    <div className={cx(css.step, css.retryStep)}>
      <StrategyIcon strategy={Strategy.Retry} checked onChange={handleChange} />
      <FormInput.MultiTextInput name={`${name}.spec.retryCount`} label="Retry Count" />
      <MultiTypeFieldSelector name={`${name}.spec.retryIntervals`} label="Retry Intervals" defaultValueToReset={['1d']}>
        <FieldArray name={`${name}.spec.retryIntervals`}>
          {({ push, remove }) => {
            function handleAdd(): void {
              uids.current.push(uuid())
              push('')
            }

            return (
              <div className={css.retryStepIntervals}>
                <div>
                  {intervals.map((_, i) => {
                    // generated uuid if they are not present
                    if (!uids.current[i]) {
                      uids.current[i] = uuid()
                    }

                    const key = uids.current[i]

                    function handleRemove(): void {
                      uids.current.splice(i, 1)
                      remove(i)
                    }

                    return (
                      <div className={css.row} key={key}>
                        <FormMultiTypeDurationField
                          name={`${name}.spec.retryIntervals[${i}]`}
                          label=""
                          multiTypeDurationProps={{ enableConfigureOptions: false }}
                        />
                        <Button minimal small icon="trash" onClick={handleRemove} data-testid="remove-retry-interval" />
                      </div>
                    )
                  })}
                </div>
                <Button icon="plus" minimal intent="primary" data-testid="add-retry-interval" onClick={handleAdd}>
                  Add
                </Button>
              </div>
            )
          }}
        </FieldArray>
      </MultiTypeFieldSelector>
      <StrategySelection
        label={getString('onTimeoutLabel')}
        name={`${name}.spec.onRetryFailure.action`}
        formik={formik}
        parentStrategy={Strategy.Retry}
        allowedStrategies={RetryStep.retryFailureStrategies.filter(
          strategy => !parentStrategy || strategy !== parentStrategy
        )}
      />
    </div>
  )
}

RetryStep.retryFailureStrategies = [
  Strategy.ManualIntervention,
  Strategy.Ignore,
  Strategy.StageRollback,
  Strategy.StepGroupRollback,
  Strategy.MarkAsSuccess
]

export function RollbackStageStep(props: BaseStepProps): React.ReactElement {
  function handleChange(): void {
    props.formik.setFieldValue(props.name, undefined)
  }

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.StageRollback} checked onChange={handleChange} />
    </div>
  )
}

export function RollbackStepGroupStep(props: BaseStepProps): React.ReactElement {
  function handleChange(): void {
    props.formik.setFieldValue(props.name, undefined)
  }

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.StepGroupRollback} checked onChange={handleChange} />
    </div>
  )
}

export function IgnoreFailureStep(props: BaseStepProps): React.ReactElement {
  function handleChange(): void {
    props.formik.setFieldValue(props.name, undefined)
  }

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.Ignore} checked onChange={handleChange} />
    </div>
  )
}

export function MarkAsSuccessStep(props: BaseStepProps): React.ReactElement {
  function handleChange(): void {
    props.formik.setFieldValue(props.name, undefined)
  }

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.MarkAsSuccess} checked onChange={handleChange} />
    </div>
  )
}

export function AbortStep(props: BaseStepProps): React.ReactElement {
  function handleChange(): void {
    props.formik.setFieldValue(props.name, undefined)
  }

  return (
    <div className={css.step}>
      <StrategyIcon strategy={Strategy.Abort} checked onChange={handleChange} />
    </div>
  )
}

export interface SelectedStepProps extends BaseStepProps {
  strategy: Strategy
  parentStrategy?: Strategy
}

export function SelectedStep(props: SelectedStepProps): React.ReactElement {
  const { name, formik, strategy, parentStrategy } = props
  switch (strategy) {
    case Strategy.Abort:
      return <AbortStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.ManualIntervention:
      return <ManualInterventionStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.MarkAsSuccess:
      return <MarkAsSuccessStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.Ignore:
      return <IgnoreFailureStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.Retry:
      return <RetryStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.StageRollback:
      return <RollbackStageStep name={name} formik={formik} parentStrategy={parentStrategy} />
    case Strategy.StepGroupRollback:
      return <RollbackStepGroupStep name={name} formik={formik} parentStrategy={parentStrategy} />
    default:
      return <div>&quot;{strategy}&quot; in not supported</div>
  }
}

export interface StrategySelectionProps {
  label: string
  name: string
  allowedStrategies: Strategy[]
  parentStrategy?: Strategy
}

export interface ConnectedStrategySelectionProps extends StrategySelectionProps {
  formik: FormikContext<{}>
}

export function StrategySelection(props: ConnectedStrategySelectionProps): React.ReactElement {
  const { name, label, formik, allowedStrategies, parentStrategy } = props

  const value = get(formik.values, name) || {}
  const hasError = errorCheck(name, formik)
  const intent = hasError ? Intent.DANGER : Intent.NONE
  const helperText = hasError ? get(formik?.errors, name) : null

  return (
    <FormGroup label={label} labelFor={name} helperText={helperText} intent={intent}>
      {value.type ? (
        <SelectedStep strategy={value.type} name={name} formik={formik} parentStrategy={parentStrategy} />
      ) : (
        <StrategyStepsList allowedStrategies={allowedStrategies} name={`${name}.type`} formik={formik} />
      )}
    </FormGroup>
  )
}

export interface StrategyStepsListProps {
  allowedStrategies: Strategy[]
  name: string
  formik: FormikContext<{}>
}

export function StrategyStepsList(props: StrategyStepsListProps): React.ReactElement {
  const { name, formik, allowedStrategies } = props

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    formik.setFieldValue(name, e.target.value as Strategy)
  }

  return (
    <ul className={css.stepsList}>
      {allowedStrategies.map(strategy => {
        return (
          <li key={strategy}>
            <StrategyIcon strategy={strategy} onChange={handleChange} />
          </li>
        )
      })}
    </ul>
  )
}

export default connect<StrategySelectionProps>(StrategySelection)

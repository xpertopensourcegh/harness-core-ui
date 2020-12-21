import React from 'react'
import type { FormikContext } from 'formik'
// import { get } from 'lodash-es'

import { Icon } from '@wings-software/uikit'
import { String } from 'framework/exports'

import { strategyConfigMap, Strategy } from './StrategyConfig'
import css from './StrategySelection.module.scss'

export interface StrategyIconProps {
  strategy: Strategy
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void
  checked?: boolean
}

const getStringID = (strategy: Strategy): string => {
  switch (strategy) {
    case Strategy.Retry:
      return 'retry'
    case Strategy.Abort:
      return 'abort'
    default:
      return `failureStrategies.${strategy}`
  }
}

export function StrategyIcon({ strategy, onChange, checked }: StrategyIconProps): React.ReactElement {
  return (
    <label className={css.strategyIcon}>
      <div className={css.icon}>
        {checked ? <div className={css.checkMark} /> : null}
        <Icon name={strategyConfigMap[strategy].icon} size={22} />
      </div>
      <String stringID={getStringID(strategy)} />
      <input type="checkbox" name={name} value={strategy} onChange={onChange} checked={checked} />
    </label>
  )
}

export interface StrategyStepsListProps {
  allowedValues: Strategy[]
  name: string
  formik: FormikContext<{}>
}

export function StrategyStepsList(props: StrategyStepsListProps): React.ReactElement {
  const { name, formik } = props

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    formik.setFieldValue(name, e.target.value as Strategy)
  }

  //   const value = get(formik.values, name)

  return (
    <ul className={css.stepsList}>
      {props.allowedValues.map(strategy => {
        return (
          <li key={strategy}>
            <StrategyIcon strategy={strategy} onChange={handleChange} />
          </li>
        )
      })}
    </ul>
  )
}

export function IgnoreStep(): React.ReactElement {
  function handleChange(_e: React.ChangeEvent<HTMLInputElement>): void {
    // formik.setFieldValue(name, e.target.value as Strategy)
  }
  return (
    <div>
      <StrategyIcon strategy={Strategy.Ignore} checked onChange={handleChange} />
    </div>
  )
}

export interface SelectedStepProps {
  strategy: Strategy
}

export function SelectedStep(props: SelectedStepProps): React.ReactElement {
  switch (props.strategy) {
    case Strategy.Ignore:
      return <IgnoreStep />
    default:
      return <div>{props.strategy} in not supported yet</div>
  }
}

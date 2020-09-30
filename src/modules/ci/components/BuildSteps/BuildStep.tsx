import React from 'react'
import cx from 'classnames'
import { Icon } from '@wings-software/uikit'
import { formatElapsedTime } from '../common/time'
import css from './BuildStep.module.scss'

export interface StepProps {
  identifier: string
  key: number
  status: string
  label: string
  time?: number
  isSubStep: boolean
  isSelected: boolean
  onStepClick: Function
}

export const BuildStep = (props: StepProps) => {
  const statusChecker = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <Icon color="green500" name="command-artifact-check" size={12} />
      case 'inProgress':
      case 'RUNNING':
        return <Icon color="blue500" name="repeat" size={12} />
      case 'ASYNC_WAITING':
      case 'pending':
        return <Icon color="dark100" name="command-artifact-check" size={12} />
      case 'FAILED':
      case 'ERROR':
        return <Icon color="red500" name="delete" size={12} />
      default:
        return <Icon color="red300" name="command-artifact-check" size={12} />
    }
  }

  return (
    <div
      onClick={() => {
        props.onStepClick(props.identifier)
      }}
      className={cx(css.step, props.isSelected && css.selected, props.isSubStep && css.subStep)}
    >
      {statusChecker(props.status)}
      <div className={css.stepLabel}>{props.label}</div>
      <div className={css.stepDuration}>{(props.time && formatElapsedTime(props.time)) || null}</div>
      {props.isSelected && <Icon name="double-chevron-right" />}
    </div>
  )
}

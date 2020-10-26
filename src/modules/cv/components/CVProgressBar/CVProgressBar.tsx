import React from 'react'
import { Intent } from '@wings-software/uikit'
import { ProgressBar, IProgressBarProps } from '@blueprintjs/core'
import classnames from 'classnames'
import styles from './CVProgressBar.module.scss'

export interface CVProgressBarProps extends IProgressBarProps {
  risk?: number
}

export function mapRiskToIntent(risk?: number): Intent {
  if (risk === undefined) {
    return Intent.NONE
  }
  if (risk > 1) {
    risk = risk / 100
  }
  risk = Math.max(Math.min(risk, 1), 0)
  return (risk < 0.3 && 'success') || (risk < 0.6 && 'warning') || 'danger'
}

export default function CVProgressBar({ risk, className, ...rest }: CVProgressBarProps) {
  const intentOverride: any = {}
  if (risk !== undefined) {
    intentOverride.intent = mapRiskToIntent(risk)
  }
  return (
    <ProgressBar stripes={false} {...rest} {...intentOverride} className={classnames(styles.progressBar, className)} />
  )
}

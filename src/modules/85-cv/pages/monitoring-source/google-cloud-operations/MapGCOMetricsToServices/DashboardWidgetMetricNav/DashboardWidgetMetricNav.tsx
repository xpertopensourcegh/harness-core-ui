import React from 'react'
import { Container } from '@wings-software/uikit'
import cx from 'classnames'
import css from './DashboardWidgetMetricNav.module.scss'

export interface DashboardWidgetMetricNavProps {
  className?: string
}

export function DashboardWidgetMetricNav(props: DashboardWidgetMetricNavProps): JSX.Element {
  const { className } = props
  return <Container width={250} className={cx(css.main, className)}></Container>
}

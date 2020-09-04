import React from 'react'
import { Text, Color, Container } from '@wings-software/uikit'
import cx from 'classnames'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'
import css from './RiskScoreTile.module.scss'

export interface RiskScoreTileProps {
  riskScore: number
  className?: string
  textProps?: TextProps
}

const RiskLevel = {
  HIGH: 'high',
  LOW: 'low',
  NONE: 'none'
}

export function RiskScoreTile(props: RiskScoreTileProps): JSX.Element {
  const { riskScore, className, textProps } = props
  const isRiskScoreDefined = riskScore && riskScore > -1

  let riskLevel = RiskLevel.NONE
  if (isRiskScoreDefined) {
    riskLevel = riskScore > 10 ? RiskLevel.HIGH : RiskLevel.LOW
  }

  return (
    <Container className={cx(css.main, className)} data-risk-level={riskLevel}>
      <Text color={Color.WHITE} className={css.riskScore} {...textProps}>
        {isRiskScoreDefined ? riskScore : ''}
      </Text>
    </Container>
  )
}

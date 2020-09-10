import React from 'react'
import { Text, Color, Container } from '@wings-software/uikit'
import cx from 'classnames'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'
import { isNumber } from 'highcharts'
import { getColorStyle } from 'modules/common/components/HeatMap/ColorUtils'
import css from './RiskScoreTile.module.scss'

export interface RiskScoreTileProps {
  riskScore: number
  className?: string
  textProps?: TextProps
}

export function RiskScoreTile(props: RiskScoreTileProps): JSX.Element {
  const { riskScore, className, textProps } = props
  const isRiskScoreDefined = isNumber(riskScore) && riskScore > -1

  return (
    <Container
      className={cx(css.main, className, isRiskScoreDefined ? getColorStyle(riskScore, 0, 100) : css.noRiskScore)}
    >
      <Text color={Color.WHITE} className={css.riskScore} {...textProps}>
        {isRiskScoreDefined ? riskScore : ''}
      </Text>
    </Container>
  )
}

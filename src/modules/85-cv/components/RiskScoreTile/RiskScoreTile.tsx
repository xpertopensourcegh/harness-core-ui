import React from 'react'
import { Text, Color, Container } from '@wings-software/uicore'
import cx from 'classnames'
import type { TextProps } from '@wings-software/uicore/dist/components/Text/Text'
import { isNumber } from 'highcharts'
import { getColorStyle } from '@common/components/HeatMap/ColorUtils'
import css from './RiskScoreTile.module.scss'

export interface RiskScoreTileProps {
  riskScore: number
  className?: string
  textProps?: TextProps
  isLarge?: boolean
  isSmall?: boolean
}

export function RiskScoreTile(props: RiskScoreTileProps): JSX.Element {
  const { riskScore, className, textProps, isSmall, isLarge } = props
  const isRiskScoreDefined = isNumber(riskScore) && riskScore > -1

  return (
    <Container
      className={cx(
        css.main,
        isSmall ? css.smallTile : undefined,
        isLarge ? css.largeTile : undefined,
        className,
        isRiskScoreDefined ? getColorStyle(riskScore, 0, 100) : css.noRiskScore
      )}
    >
      <Text color={Color.WHITE} className={css.riskScore} {...textProps}>
        {isRiskScoreDefined ? riskScore : ''}
      </Text>
    </Container>
  )
}

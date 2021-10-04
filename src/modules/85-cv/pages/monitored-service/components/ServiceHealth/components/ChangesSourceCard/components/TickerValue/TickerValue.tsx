import { Color, Container, Text } from '@wings-software/uicore'
import React from 'react'
import { numberFormatter } from '@cd/components/Services/common'
import css from './TickerValue.module.scss'

const TickerValue: React.FC<{ value: number; label: string; color: Color }> = props => {
  const percentage = numberFormatter(Math.abs(props.value), {
    truncate: false
  })
  const percentageText = Math.abs(props.value) > 100 ? `100+ %` : `${percentage}%`
  return (
    <Container className={css.tickerValue}>
      <Text className={css.tickerLabel} font={{ size: 'small', weight: 'bold' }}>
        {props.label}
      </Text>
      <Text font={{ size: 'xsmall' }} color={props.color}>
        {percentageText}
      </Text>
    </Container>
  )
}

export default TickerValue

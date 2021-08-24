import React, { useState } from 'react'
import { Color, Container, Layout, Select, SelectOption, Text } from '@wings-software/uicore'
// import Card from '@cv/components/Card/Card'
import { useStrings } from 'framework/strings'
// import { Ticker, TickerVerticalAlignment } from '@common/components/Ticker/Ticker'
// import { ChangeTimeline } from '@cv/components/ChangeTimeline/ChangeTimeline'
import { getRiskColorValue } from '@common/components/HeatMap/ColorUtils'
import { getTimePeriods } from './ServiceHealth.utils'
// import { tickerData } from './ServiceHealth.constants'
// import type { TickerType } from './ServiceHealth.types'
// import TickerValue from './components/TickerValue/TickerValue'
import type { ServiceHealthProps } from './ServiceHealth.types'
import css from './ServiceHealth.module.scss'

export default function ServiceHealth({ currentHealthScore }: ServiceHealthProps): JSX.Element {
  const { getString } = useStrings()
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<SelectOption>({
    value: 'Last 24 hours',
    label: getString('cv.monitoredServices.serviceHealth.last24Hrs')
  })

  const { riskStatus, healthScore = -2 } = currentHealthScore || {}
  const color = getRiskColorValue(riskStatus)

  return (
    <>
      <Container className={css.serviceHealthHeader}>
        <Select
          value={selectedTimePeriod}
          items={getTimePeriods(getString)}
          className={css.timePeriods}
          onChange={setSelectedTimePeriod}
        />
        <Layout.Horizontal className={css.healthScoreCardContainer}>
          <div className={css.healthScoreCard} style={{ background: color }}>
            {healthScore > -1 ? healthScore : ''}
          </div>
          <Text color={Color.BLACK} font={{ size: 'small' }}>
            {getString('cv.monitoredServices.monitoredServiceTabs.serviceHealth')}
          </Text>
        </Layout.Horizontal>
      </Container>
      {/* TODO - Will be added back once the backend api data is available */}
      {/* <Container className={css.serviceHealthCard}>
        <Card>
          <>
            <Container className={css.tickersRow}>
              {tickerData.map((ticker: TickerType) => {
                return (
                  <Container key={ticker.id} className={css.ticker}>
                    <Ticker
                      value={
                        <TickerValue
                          value={ticker.percentage}
                          label={ticker.label}
                          color={ticker.percentage < 0 ? Color.GREEN_600 : Color.RED_500}
                        />
                      }
                      decreaseMode={ticker.percentage < 0}
                      color={ticker.percentage < 0 ? Color.GREEN_600 : Color.RED_500}
                      verticalAlign={TickerVerticalAlignment.TOP}
                    >
                      <Text color={Color.BLACK} font={{ weight: 'bold', size: 'large' }} margin={{ right: 'medium' }}>
                        {ticker.count}
                      </Text>
                    </Ticker>
                  </Container>
                )
              })}
            </Container>
            <ChangeTimeline />
          </>
        </Card>
      </Container> */}
    </>
  )
}

import React from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import gauge from 'highcharts/modules/solid-gauge'
import i18n from './CategoryRiskCards.i18n'
import getRiskGaugeChartOptions from './RiskGauge'
import css from './CategoryRiskCards.module.scss'

interface CategoryRiskCardProps {
  categoryName: string
  riskScore: number
}

highchartsMore(Highcharts)
gauge(Highcharts)

export function CategoryRiskCard(props: CategoryRiskCardProps): JSX.Element {
  const { riskScore = 0, categoryName = '' } = props
  const riskLevel = riskScore > 10 ? 'high' : 'low'
  return (
    <Container className={css.categoryRiskCard}>
      <Container className={css.riskInfoContainer}>
        <Text color={Color.BLACK} className={css.categoryName}>
          {categoryName}
        </Text>
        <Container className={css.riskScoreContainer}>
          <Text color={Color.WHITE} className={css.riskScore} data-risk-level={riskLevel}>
            {riskScore}
          </Text>
          <Text className={css.riskScoreText} color={Color.GREY_300}>
            {i18n.riskScoreText}
          </Text>
        </Container>
      </Container>
      <Container className={css.chartContainer}>
        <HighchartsReact highchart={Highcharts} options={getRiskGaugeChartOptions(riskScore)} />
      </Container>
    </Container>
  )
}

export function CategoryRiskCards(): JSX.Element {
  const categoryCards: CategoryRiskCardProps[] = [
    { categoryName: 'Performance', riskScore: 75 },
    { categoryName: 'Errors', riskScore: 45 },
    { categoryName: 'Quality', riskScore: 8 },
    { categoryName: 'Infrastructure', riskScore: 89 }
  ]
  return (
    <Container className={css.main}>
      <Text className={css.productionRisk}>{i18n.productionRisk}</Text>
      <Container className={css.cardContainer}>
        {categoryCards.map(cardProps => (
          <CategoryRiskCard {...cardProps} key={cardProps.categoryName} />
        ))}
      </Container>
    </Container>
  )
}

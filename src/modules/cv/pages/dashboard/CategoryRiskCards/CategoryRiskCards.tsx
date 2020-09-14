import React, { useState } from 'react'
import { Container, Text, Color, Icon, Layout } from '@wings-software/uikit'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import gauge from 'highcharts/modules/solid-gauge'
import cx from 'classnames'
import { isNumber } from 'lodash-es'
import { RiskScoreTile } from 'modules/cv/components/RiskScoreTile/RiskScoreTile'
import { routeParams } from 'framework/exports'
import { RestResponseMapCVMonitoringCategoryInteger, useGetCategoryRiskMap } from 'services/cv'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import { getColorStyle } from 'modules/common/components/HeatMap/ColorUtils'
import i18n from './CategoryRiskCards.i18n'
import getRiskGaugeChartOptions from './RiskGauge'
import css from './CategoryRiskCards.module.scss'

interface CategoryRiskCardProps {
  categoryName: string
  riskScore: number
  className?: string
}

interface CategoryRiskCardsProps {
  categoryRiskCardClassName?: string
  environmentIdentifier?: string
  serviceIdentifier?: string
  categoryRiskScores?: (riskScores: RestResponseMapCVMonitoringCategoryInteger['resource']) => void
}

interface OverallRiskScoreCard {
  overallRiskScore: number
  className?: string
}

highchartsMore(Highcharts)
gauge(Highcharts)

export function CategoryRiskCard(props: CategoryRiskCardProps): JSX.Element {
  const { riskScore = 0, categoryName = '', className } = props
  return (
    <Container className={cx(css.categoryRiskCard, className)}>
      <Container className={css.riskInfoContainer}>
        <Text color={Color.BLACK} className={css.categoryName}>
          {categoryName}
        </Text>
        <Container className={css.riskScoreContainer}>
          <RiskScoreTile riskScore={riskScore} />
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

export function OverallRiskScoreCard(props: OverallRiskScoreCard): JSX.Element {
  const { className, overallRiskScore } = props
  return (
    <Container className={cx(css.overallRiskScoreCard, className, getColorStyle(overallRiskScore, 0, 100))}>
      <Text color={Color.WHITE} className={css.overallRiskScoreValue}>
        {overallRiskScore}
      </Text>
      <Layout.Vertical>
        <Text font={{ weight: 'bold' }} color={Color.WHITE}>
          {i18n.overallText}
        </Text>
        <Text color={Color.WHITE} font={{ size: 'small' }}>
          {i18n.riskScoreText}
        </Text>
      </Layout.Vertical>
    </Container>
  )
}

export function CategoryRiskCards(props: CategoryRiskCardsProps): JSX.Element {
  const { categoryRiskCardClassName, environmentIdentifier, serviceIdentifier } = props
  const {
    params: { orgIdentifier = '', projectIdentifier = '', accountId }
  } = routeParams()
  const [overallRiskScore, setOverallRiskScore] = useState<number | undefined>()
  const { data, error, loading, refetch } = useGetCategoryRiskMap({
    queryParams: {
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      accountId,
      envIdentifier: environmentIdentifier,
      serviceIdentifier
    },
    resolve: response => {
      const riskValues: number[] = Object.values(response?.resource || {})
      if (riskValues.length) {
        const maxValue = riskValues.reduce((currMax = -1, currVal) => (currVal > currMax ? currVal : currMax))
        setOverallRiskScore(maxValue)
      }
      return response
    }
  })

  if (loading) {
    return (
      <Container className={css.errorOrLoading} height={105}>
        <Icon name="steps-spinner" size={20} color={Color.GREY_250} />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className={css.errorOrLoading} height={105}>
        <Icon name="error" size={20} color={Color.RED_500} />
        <Text intent="danger">{error.message}</Text>
      </Container>
    )
  }

  const categories = Object.keys(data?.resource || {})
  if (!categories?.length) {
    return (
      <NoDataCard
        message={i18n.noDataText}
        icon="warning-sign"
        buttonText={i18n.retryButtonText}
        onClick={() => refetch()}
        className={css.noData}
      />
    )
  }

  return (
    <Container className={css.main}>
      <Text className={css.productionRisk} font={{ size: 'small' }}>
        {i18n.productionRisk}
      </Text>
      <Container className={css.cardContainer}>
        {isNumber(overallRiskScore) && <OverallRiskScoreCard overallRiskScore={overallRiskScore} />}
        {categories.map(categoryName => (
          <CategoryRiskCard
            categoryName={categoryName}
            riskScore={data?.resource?.[categoryName] ?? -1}
            key={categoryName}
            className={categoryRiskCardClassName}
          />
        ))}
      </Container>
    </Container>
  )
}

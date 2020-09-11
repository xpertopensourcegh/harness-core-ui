import React from 'react'
import { Container, Text, Color, Icon } from '@wings-software/uikit'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import gauge from 'highcharts/modules/solid-gauge'
import cx from 'classnames'
import { RiskScoreTile } from 'modules/cv/components/RiskScoreTile/RiskScoreTile'
import { routeParams } from 'framework/exports'
import { useGetCategoryRiskMap } from 'services/cv'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
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

export function CategoryRiskCards(props: CategoryRiskCardsProps): JSX.Element {
  const { categoryRiskCardClassName } = props
  const {
    params: { orgIdentifier = '', projectIdentifier = '', accountId }
  } = routeParams()
  const { data, error, loading, refetch } = useGetCategoryRiskMap({
    queryParams: {
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      accountId
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

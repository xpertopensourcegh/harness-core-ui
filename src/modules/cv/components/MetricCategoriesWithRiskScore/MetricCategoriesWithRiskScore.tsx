import React from 'react'
import { Container, Text } from '@wings-software/uikit'
import type { MetricPackDTO } from 'services/cv'
import { RiskScoreTile, RiskScoreTileProps } from '../RiskScoreTile/RiskScoreTile'
import css from './MetricCategoriesWithRiskScore.module.scss'

interface CategoriesWithRiskScoreProps {
  categoriesWithRiskScores: Array<{
    categoryName: MetricPackDTO['category']
    riskScore: number
  }>
  className?: string
  riskScoreTileProps?: Omit<RiskScoreTileProps, 'riskScore'>
}

export const MetricCategories = {
  PERFORMANCE: 'PERFORMANCE',
  QUALITY: 'QUALITY',
  RESOURCES: 'RESOURCES'
}

const AbbreviatedMetricCategories = {
  [MetricCategories.PERFORMANCE]: 'Perf',
  [MetricCategories.QUALITY]: 'Qual',
  [MetricCategories.RESOURCES]: 'Res'
}

export function MetricCategoriesWithRiskScore(props: CategoriesWithRiskScoreProps): JSX.Element {
  const { categoriesWithRiskScores: categoriesAndRiskScore = [], className, riskScoreTileProps } = props
  return (
    <Container className={className}>
      <Container className={css.main}>
        {categoriesAndRiskScore.map(riskScoreMapping => {
          const { categoryName, riskScore } = riskScoreMapping
          if (!categoryName) {
            return
          }
          return (
            <Container key={categoryName} className={css.infoContainer}>
              <Text font={{ size: 'small' }}>{AbbreviatedMetricCategories[categoryName]}</Text>
              <RiskScoreTile riskScore={riskScore} isSmall {...riskScoreTileProps} />
            </Container>
          )
        })}
      </Container>
    </Container>
  )
}

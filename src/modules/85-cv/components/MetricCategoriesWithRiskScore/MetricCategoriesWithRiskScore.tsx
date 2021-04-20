import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import classnames from 'classnames'
import type { CategoryRisk } from 'services/cv'
import { useStrings } from 'framework/exports'
import type { UseStringsReturn } from 'framework/strings/String'
import { RiskScoreTile, RiskScoreTileProps } from '../RiskScoreTile/RiskScoreTile'
import css from './MetricCategoriesWithRiskScore.module.scss'

export interface CategoriesWithRiskScoreProps {
  categoriesWithRiskScores: CategoryRisk[]
  className?: string
  infoContainerClassName?: string
  riskScoreTileProps?: Omit<RiskScoreTileProps, 'riskScore'>
}

function getAbbreviatedMetricCategories(category: string, getString: UseStringsReturn['getString']): string {
  switch (category) {
    case getString('errors'):
      return getString('cv.abbreviatedCategories.errors')
    case getString('infrastructureText'):
      return getString('cv.abbreviatedCategories.infrastructure')
    case getString('performance'):
      return getString('cv.abbreviatedCategories.performance')
    default:
      return ' '
  }
}

function sortCategories(getString: UseStringsReturn['getString'], categoryRiskScores?: CategoryRisk[]): void {
  if (!categoryRiskScores) {
    return
  }
  categoryRiskScores.sort((a, b) => {
    if (a?.category === getString('performance')) {
      return -1
    }
    if (a?.category === getString('errors')) {
      return b?.category === getString('performance') ? 1 : -1
    }
    return 1
  })
}

export function MetricCategoriesWithRiskScore(props: CategoriesWithRiskScoreProps): JSX.Element {
  const {
    categoriesWithRiskScores: categoriesAndRiskScore = [],
    className,
    infoContainerClassName,
    riskScoreTileProps
  } = props
  const { getString } = useStrings()
  sortCategories(getString, categoriesAndRiskScore)
  return (
    <Container className={className}>
      <Container className={css.main}>
        {categoriesAndRiskScore?.map(riskScoreMapping => {
          const { category, risk = -1 } = riskScoreMapping
          return !category ? undefined : (
            <Container key={category} className={classnames(css.infoContainer, infoContainerClassName)}>
              <Text style={{ fontSize: 12 }}>{getAbbreviatedMetricCategories(category, getString)}</Text>
              <RiskScoreTile riskScore={risk} isSmall {...riskScoreTileProps} />
            </Container>
          )
        })}
      </Container>
    </Container>
  )
}

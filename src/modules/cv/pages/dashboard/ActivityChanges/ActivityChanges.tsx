import React from 'react'
import { Text, Intent, Button, Container } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { routeCVActivityChangesPage } from 'navigation/cv/routes'
import {
  MetricCategoriesWithRiskScore,
  MetricCategories
} from 'modules/cv/components/MetricCategoriesWithRiskScore/MetricCategoriesWithRiskScore'
import type { MetricPackDTO } from 'services/cv'
import { useRouteParams } from 'framework/exports'
import i18n from './ActivityChanges.i18n'
import ActivityType from '../ActivityType/ActivityType'
import ActivityProgressIndicator from '../ActivityProgressIndicator/ActivityProgressIndicator'
import css from './ActivityChanges.module.scss'

const ACTIVITY_COLUMN_NAMES = Object.values(i18n.activityChangesColumnNames).map(columnName => (
  <Text
    width={columnName === i18n.activityChangesColumnNames.otherChanges ? 200 : 300}
    key={columnName}
    font={{ weight: 'bold', size: 'small' }}
    style={{ textTransform: 'uppercase' }}
  >
    {columnName}
  </Text>
))

const MOCK_DATA = [
  {
    activityType: 'KUBERNETES',
    changeEvent: 'Configuration Change',
    service: 'Manager',
    priorRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: 80
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 5
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 5
      }
    ],
    verificationStatus: {
      progress: 43,
      startTime: new Date().getTime(),
      minutesRemaining: 3,
      passedVerifications: '1/4',
      status: 'warning' as Intent
    },
    postRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: -1
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 1
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 30
      }
    ]
  },
  {
    activityType: 'KUBERNETES',
    changeEvent: 'Infrastruture Update',
    service: 'Delegate',
    priorRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: 30
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 0
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 30
      }
    ],
    verificationStatus: {
      progress: -1
    },
    postRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: 30
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 30
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 90
      }
    ]
  },
  {
    activityType: 'DB',
    changeEvent: 'Database Upgrade',
    service: 'MongoDB',
    priorRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: 30
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 25
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 76
      }
    ],
    verificationStatus: {
      progress: 100,
      startTime: new Date().getTime(),
      minutesRemaining: 3,
      passedVerifications: '1/4',
      status: 'success' as Intent
    },
    postRiskScores: [
      {
        categoryName: MetricCategories.PERFORMANCE as MetricPackDTO['category'],
        riskScore: 55
      },
      {
        categoryName: MetricCategories.QUALITY as MetricPackDTO['category'],
        riskScore: 25
      },
      {
        categoryName: MetricCategories.RESOURCES as MetricPackDTO['category'],
        riskScore: 30
      }
    ]
  }
]

export default function ActivityChanges(): JSX.Element {
  const history = useHistory()
  const {
    params: { projectIdentifier, orgIdentifier }
  } = useRouteParams()
  return (
    <ul className={css.activityList}>
      <li className={css.headerRow}>{ACTIVITY_COLUMN_NAMES}</li>
      {MOCK_DATA.map(data => {
        const { changeEvent, service, activityType, verificationStatus, priorRiskScores, postRiskScores } = data || {}
        return (
          <li
            key={`${data.activityType}-${data.changeEvent}-${data.service}`}
            className={css.dataRow}
            onClick={() =>
              history.push(
                routeCVActivityChangesPage.url({
                  projectIdentifier: projectIdentifier as string,
                  orgIdentifier: orgIdentifier as string
                })
              )
            }
          >
            <ActivityType
              serviceName={service}
              buildName={changeEvent}
              iconProps={{ name: activityType === 'KUBERNETES' ? 'service-kubernetes' : 'database', size: 25 }}
            />
            <MetricCategoriesWithRiskScore categoriesWithRiskScores={priorRiskScores} className={css.dataColumn} />
            <Container className={css.columnWrapp}>
              <ActivityProgressIndicator {...verificationStatus} className={css.dataColumn} />
            </Container>
            <MetricCategoriesWithRiskScore categoriesWithRiskScores={postRiskScores} className={css.dataColumn} />
          </li>
        )
      })}
      <Button
        style={{
          margin: '0 auto',
          display: 'block',
          fontSize: 'var(--font-size-small)'
        }}
        minimal
        intent="primary"
      >
        {i18n.viewAllActivities}
      </Button>
    </ul>
  )
}
